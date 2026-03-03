#!/usr/bin/env node
// scripts/timeline-fetch.js
// Fetches model releases from official AI lab RSS feeds.
// Writes data/timeline-pending.json for human review before merging.
//
// Node 18+ required (uses built-in fetch). No external dependencies.

const fs   = require('fs');
const path = require('path');

const DATA_DIR  = path.join(__dirname, '..', 'data');
const DAYS_BACK = 14;

const FEEDS = [
  { url: 'https://openai.com/news/rss.xml',          source: 'OpenAI'          },
  { url: 'https://deepmind.google/blog/rss.xml',     source: 'Google DeepMind' },
  { url: 'https://blog.google/technology/ai/rss/',   source: 'Google AI'       },
  { url: 'https://huggingface.co/blog/feed.xml',     source: 'Hugging Face'    },
];

// ── Model-release-only filter ─────────────────────────────────────────────────
const MODEL_NAMES = [
  'gpt', 'claude', 'gemini', 'llama', 'mistral', 'deepseek', 'grok', 'qwen',
  'phi', 'command r', 'o1', 'o3', 'o4', 'mixtral', 'dall-e', 'sora',
  'whisper', 'stable diffusion', 'midjourney', 'nemotron', 'falcon', 'nova',
  'copilot', 'codex',
];

const LAB_NAMES = [
  'openai', 'anthropic', 'google deepmind', 'deepmind', 'meta ai',
  'mistral', 'deepseek', 'xai', 'x.ai', 'cohere', 'stability ai',
];

// Hard-reject patterns — anything matching is dropped immediately
const NOISE = [
  /\bhow (to|i|we)\b/,
  /\b(tutorial|guide|tips?|tricks?|recap|wrap.?up)\b/,
  /\b(podcast|webinar|newsletter|digest)\b/,
  /\bpartner(ship|ing| with)\b/,
  /\b(appoint(ed|ment)|joins as|named (ceo|cto|cpo|vp|head of))\b/,
  /\b(policy|safety report|usage policy|terms of service|responsible ai)\b/,
  /\b(case stud|customer stor|success stor)\b/,
  /\b(amazon bedrock|azure openai|aws|google cloud|salesforce|slack|figma|notion|zapier)\b/,
  /\bseamless\b/,
  /\bruntime environment\b/,
  /\bsystem card\b/,
  /\b(my|our) (experience|journey|thoughts|take|approach)\b/,
  /\b(india|latam|europe|africa|southeast asia).*(launch|expand|availab)\b/,
  /\b(mental health|climate|education|enterprise|workforce)\b/,
  /\b(department of|government|federal|white house)\b/,
  /\bscaling (social|research program)\b/,
];

function isModelRelease(title, description = '') {
  const text = (title + ' ' + (description || '')).toLowerCase();
  const t    = title.toLowerCase();

  if (NOISE.some(re => re.test(text))) return false;

  const hasModel   = MODEL_NAMES.some(m => t.includes(m));
  const hasLab     = LAB_NAMES.some(l => text.includes(l));
  const hasVersion = /\b\d+[\.\d]*\b/.test(t);
  const hasRelease = /\b(releases?|launch(es|ed)?|introduc(es|ed|ing)|unveil(s|ed)?|announc(es|ed)|now available|available (today|now)|open.sourc(ed?|ing))\b/.test(text);
  const hasWeights = /\b(weights|checkpoint|open.source).*(model|llm|ai)\b/.test(text);

  // Model name + version = almost certainly a release
  if (hasModel && hasVersion) return true;

  // Lab + release verb + model keyword
  if (hasLab && hasRelease && /\b(model|llm|ai system|foundation model)\b/.test(text)) return true;

  // Model name + release verb
  if (hasModel && hasRelease) return true;

  // Open-source model weights release
  if ((hasModel || hasLab) && hasWeights) return true;

  return false;
}

function extractTags(title) {
  const checks = {
    openai:        /openai/i,
    anthropic:     /anthropic/i,
    google:        /google|deepmind|gemini/i,
    meta:          /\bmeta\b|\bllama\b/i,
    xai:           /\bxai\b|\bgrok\b/i,
    mistral:       /mistral/i,
    deepseek:      /deepseek/i,
    'open-source': /open[\s-]source|open[\s-]weights/i,
    reasoning:     /reasoning|chain[\s-]of[\s-]thought/i,
    multimodal:    /multimodal|vision|\bvlm\b/i,
    agentic:       /agent(ic)?|tool use/i,
  };
  return Object.entries(checks)
    .filter(([, re]) => re.test(title))
    .map(([tag]) => tag);
}

function slugId(source, title) {
  return (source + '-' + title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// ── RSS parsing (no external dependencies) ───────────────────────────────────
function extractTag(xml, tag) {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = cdata.exec(xml) || plain.exec(xml);
  return m ? m[1].trim() : '';
}

function extractLink(xml) {
  // Atom-style: <link href="..."/>
  const m1 = /<link[^>]+href="([^"]+)"/i.exec(xml);
  if (m1) return m1[1];
  // RSS-style: <link>URL</link>
  const m2 = /<link[^>]*>\s*(https?[^\s<]+)/i.exec(xml);
  if (m2) return m2[1];
  return '';
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

function toDateStr(pubDate) {
  if (!pubDate) return null;
  const d = new Date(pubDate);
  if (isNaN(d)) return null;
  return d.toISOString().split('T')[0];
}

function parseItems(xml) {
  const items = [];
  // Try <item> (RSS 2.0) then <entry> (Atom)
  const tagName = xml.includes('<item>') || xml.includes('<item ') ? 'item' : 'entry';
  const re = new RegExp(`<${tagName}[\\s>]([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  let m;
  while ((m = re.exec(xml)) !== null) {
    const raw = m[1];
    items.push({
      title:       decodeEntities(stripHtml(extractTag(raw, 'title'))),
      link:        extractLink(raw) || decodeEntities(extractTag(raw, 'link')),
      pubDate:     extractTag(raw, 'pubDate') || extractTag(raw, 'published') || extractTag(raw, 'updated'),
      description: decodeEntities(stripHtml(
        extractTag(raw, 'description') ||
        extractTag(raw, 'summary') ||
        extractTag(raw, 'content')
      )).slice(0, 300),
    });
  }
  return items;
}

// ── Fetch one feed ────────────────────────────────────────────────────────────
async function fetchFeed({ url, source }) {
  const cutoff = new Date(Date.now() - DAYS_BACK * 86400 * 1000);

  const res = await fetch(url, {
    headers: { 'User-Agent': 'ai-timeline-bot/1.0' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const xml   = await res.text();
  const items = parseItems(xml);

  const results = [];
  for (const item of items) {
    if (!item.title || !item.link) continue;

    const dateStr = toDateStr(item.pubDate);
    if (!dateStr) continue;
    if (new Date(dateStr) < cutoff) continue;

    if (!isModelRelease(item.title, item.description)) continue;

    results.push({
      id:          slugId(source, item.title),
      date:        dateStr,
      category:    'model_release',
      title:       item.title,
      source,
      url:         item.link,
      tags:        extractTags(item.title),
      manual:      false,
    });
  }

  return results;
}

// ── Wikipedia LLM list verification ──────────────────────────────────────────
// Normalise a string for fuzzy matching: lowercase, strip non-alphanumeric
function norm(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function fetchWikipediaModels() {
  const url = 'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_large_language_models&prop=wikitext&format=json';
  const res  = await fetch(url, { headers: { 'User-Agent': 'ai-timeline-bot/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia HTTP ${res.status}`);
  const data = await res.json();
  const wikitext = data.parse.wikitext['*'];

  const names = new Set();
  for (const line of wikitext.split('\n')) {
    // First cell of a table row: | [[ModelName]] or | [[Link|DisplayName]]
    const m = line.match(/^\|\s*\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/);
    if (!m) continue;
    const name = (m[2] || m[1]).trim();
    if (name.length < 2) continue;
    names.add(name);
    // Also add progressively shorter hyphen-prefixes so "gpt-5.3-codex"
    // also registers "gpt-5.3", enabling "GPT-5.3 Instant" to match.
    const parts = name.split('-');
    for (let i = 1; i < parts.length; i++) {
      names.add(parts.slice(0, i + 1).join('-'));
    }
  }
  return names;
}

// Return true if the entry title contains a Wikipedia model name
// Uses normalised substring matching so "GPT-5.3 Instant" matches "GPT-5.3"
function isOnWikipedia(title, wikiModels) {
  const normTitle = norm(title);
  for (const model of wikiModels) {
    const normModel = norm(model);
    // Only check versioned / multi-word entries to avoid "gemini" matching "gemini can now create music"
    if (normModel.length < 5) continue;
    if (normTitle.includes(normModel)) return true;
  }
  return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // Fetch Wikipedia model list upfront
  let wikiModels = new Set();
  console.log('Fetching Wikipedia LLM list…');
  try {
    wikiModels = await fetchWikipediaModels();
    console.log(`  → ${wikiModels.size} known models`);
  } catch (e) {
    console.error('  Wikipedia fetch failed (skipping check):', e.message);
  }

  const all = [];

  for (const feed of FEEDS) {
    console.log(`Fetching ${feed.source}…`);
    try {
      const items = await fetchFeed(feed);
      // Filter by Wikipedia list if we got it
      const verified = wikiModels.size > 0
        ? items.filter(e => isOnWikipedia(e.title, wikiModels))
        : items;
      all.push(...verified);
      console.log(`  → ${verified.length} verified model releases (${items.length - verified.length} filtered by Wikipedia check)`);
    } catch (e) {
      console.error(`  ${feed.source} failed: ${e.message}`);
    }
  }

  // Deduplicate by URL and by normalised title (same post on deepmind.google + blog.google)
  const normUrl   = u => (u || '').replace(/\?.*$/, '').replace(/\/$/, '').toLowerCase();
  const normTitle = t => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const seenUrls  = new Set();
  const seenTitles = new Set();
  const seenIds   = new Set();
  const deduped   = all.filter(e => {
    const nu = normUrl(e.url);
    const nt = normTitle(e.title);
    if (nu && seenUrls.has(nu)) return false;
    if (nt && seenTitles.has(nt)) return false;
    if (seenIds.has(e.id)) return false;
    if (nu) seenUrls.add(nu);
    if (nt) seenTitles.add(nt);
    seenIds.add(e.id);
    return true;
  });

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const out = path.join(DATA_DIR, 'timeline-pending.json');
  fs.writeFileSync(out, JSON.stringify(deduped, null, 2));
  console.log(`\nWrote ${deduped.length} entries to data/timeline-pending.json`);
  console.log('Review the PR, remove anything that isn\'t a genuine model release, then merge.');
}

main().catch(err => { console.error(err); process.exit(1); });
