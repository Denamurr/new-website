#!/usr/bin/env node
// scripts/timeline-fetch.js
// Fetches significant AI entries from Papers With Code + official lab RSS feeds.
// Writes data/timeline-pending.json for human review before merging into the timeline.
//
// Node 18+ required (uses built-in fetch).
// Dependencies: fast-xml-parser

const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DAYS_BACK = 7;

// ── Official lab RSS feeds (announcements only) ───────────────────────────────
const RSS_FEEDS = [
  { url: 'https://openai.com/blog/rss.xml',           source: 'OpenAI' },
  { url: 'https://deepmind.google/blog/rss.xml',      source: 'Google DeepMind' },
  { url: 'https://blog.google/technology/ai/rss/',    source: 'Google AI' },
];

// Known AI model families
const MODEL_NAMES = [
  'gpt', 'claude', 'gemini', 'llama', 'mistral', 'deepseek', 'grok', 'qwen',
  'falcon', 'phi', 'command r', 'o1', 'o3', 'o4', 'mixtral', 'dall-e',
  'sora', 'whisper', 'stable diffusion', 'midjourney', 'nemotron', 'nova',
];

// Known AI labs
const LAB_NAMES = [
  'openai', 'anthropic', 'deepmind', 'google deepmind', 'meta ai',
  'mistral ai', 'deepseek', 'xai', 'x.ai', 'cohere', 'hugging face',
  'stability ai', 'inflection', 'perplexity',
];

// ── Significance filter ───────────────────────────────────────────────────────
function isSignificant(title, description = '') {
  const text = (title + ' ' + description).toLowerCase();
  const t = title.toLowerCase();

  // Reject noise
  const NOISE = [
    /\bhow (to|i|we)\b/, /\b(tutorial|guide|tips?|tricks?)\b/,
    /\bcase stud/, /\bcustomer stor/, /\bwe('re| are) hir/,
    /\b(podcast|webinar|newsletter|recap|wrap.?up)\b/,
    /\b(my|our) (experience|journey|thoughts|take)\b/,
    /\bpartner(ship|ing| with)\b/, /\bwelcome to\b/,
    /\bai (hub|training initiative|impact summit)\b/,
    /\b(circle to search|translate|android on|samsung)\b/,
    /\b(accelerat|empower|transform).*(business|enterprise|india|student)/,
    /\b(amazon bedrock|azure|aws|google cloud|salesforce|slack|figma|notion|zapier)\b/,
    /\bintegrat(e|es|ed|ion)\b.*(platform|app|tool|service|workflow)/,
    /\bseamless\b/, /\bruntime environment\b/,
  ];
  if (NOISE.some(re => re.test(text))) return false;

  const hasModelName = MODEL_NAMES.some(m => t.includes(m));
  const hasLabName   = LAB_NAMES.some(l => text.includes(l));
  const hasRelease   = /\b(release[sd]?|launch(es|ed)?|introduc(es|ed|ing)|unveil(s|ed)?|announc(es|ed)|now available|available today|open.sourc)\b/.test(text);

  // Model name + version number = release
  if (hasModelName && /\d+[\.\d]*/.test(t)) return true;
  // Lab + release verb
  if (hasLabName && hasRelease) return true;
  // Model name + release verb
  if (hasModelName && hasRelease) return true;

  // Capability milestones
  const MILESTONE = [
    /\b(state.of.the.art|sota)\b/,
    /\b(surpass|outperform|beat).*(gpt|claude|gemini|human|o1|previous model)/,
    /\b\d+[bm]\s*(param|token)/, /\b(million|billion).token context/,
    /\bcontext window\b/, /\bextended thinking\b/,
    /\bopen.source.*(model|weights|llm)\b/,
  ];
  if (MILESTONE.some(re => re.test(text))) return true;

  // Major business events at AI labs only
  if (hasLabName) {
    const BUSINESS = [
      /\$\d+(\.\d+)?\s?(billion|million|[bm])\b/,
      /\b(acqui(res?|red|sition)|merger|ipo)\b/,
    ];
    if (BUSINESS.some(re => re.test(text))) return true;
  }

  return false;
}

// ── Category detection ────────────────────────────────────────────────────────
function categorize(title) {
  const t = title.toLowerCase();
  if (/\b(arxiv|paper|research|study|benchmark|survey|we present|we propose|we introduce)\b/.test(t)) return 'research_paper';
  if (
    /\b(released?|launches?|launched|introduces?|introduced|announc(es|ed)|new model|v\d+\.\d+)\b/.test(t) &&
    /\b(gpt|claude|gemini|llama|mistral|deepseek|grok|qwen|falcon|phi|command|model|llm|ai)\b/.test(t)
  ) return 'model_release';
  if (/\b(fund(ing|ed|s)|rais(es|ed|ing)|acqui(res?|red|sition)|\$\d+[bm]illion|series [a-e]|ipo|valuation)\b/.test(t)) return 'announcement';
  if (/\b(api|app|product|tool|service|available|plugin|feature|launch(es|ed)?)\b/.test(t)) return 'product_launch';
  return 'announcement';
}

function extractTags(title) {
  const checks = {
    openai: /openai/i, anthropic: /anthropic/i, google: /google|deepmind|gemini/i,
    meta: /\bmeta\b|\bllama\b/i, xai: /\bxai\b|\bgrok\b/i, mistral: /mistral/i,
    deepseek: /deepseek/i, gpt: /\bgpt[-\s]?\d/i, claude: /\bclaude\b/i,
    'open-source': /open[\s-]source|open[\s-]weights/i,
    reasoning: /reasoning|chain[\s-]of[\s-]thought/i,
    multimodal: /multimodal|vision|\bvlm\b/i,
    agentic: /agent(ic)?|tool use/i,
  };
  return Object.entries(checks).filter(([, re]) => re.test(title)).map(([tag]) => tag);
}

// ── Papers With Code ──────────────────────────────────────────────────────────
async function fetchPapersWithCode() {
  const cutoff = new Date(Date.now() - DAYS_BACK * 86400 * 1000).toISOString().split('T')[0];

  const url = `https://paperswithcode.com/api/v1/papers/?ordering=-published&items_per_page=50`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ai-timeline-bot/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  return (data.results || [])
    .filter(p => p.published >= cutoff)
    .filter(p => isSignificant(p.title, p.abstract || ''))
    .map(p => ({
      id: `pwc-${p.arxiv_id || p.id}`,
      date: p.published,
      category: 'research_paper',
      title: p.title,
      description: (p.abstract || '').slice(0, 250),
      source: 'Papers With Code',
      url: p.url_abs || `https://paperswithcode.com/paper/${p.id}`,
      tags: extractTags(p.title),
      manual: false,
    }));
}

// ── RSS blog feed fetcher ─────────────────────────────────────────────────────
async function fetchRSS({ url, source }) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ai-timeline-bot/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const feed = parser.parse(xml);
  const channel = feed?.rss?.channel || feed?.feed;
  const rawItems = [].concat(channel?.item || channel?.entry || []).slice(0, 30);

  const cutoff = new Date(Date.now() - DAYS_BACK * 86400 * 1000);

  return rawItems
    .map(item => {
      const rawTitle = String(item.title?.['#text'] ?? item.title ?? '').replace(/\n/g, ' ').trim();
      const rawDesc  = String(item.description?.['#text'] ?? item.description ?? item.summary ?? '');
      const link     = String(item.link?.['@_href'] ?? item.link ?? item.id ?? '').trim();
      const pubDate  = new Date(item.pubDate ?? item.published ?? item.updated ?? 0);
      const cleanDesc = rawDesc.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 250);

      if (!rawTitle || pubDate < cutoff) return null;
      if (!isSignificant(rawTitle, cleanDesc)) return null;

      return {
        id: `rss-${source.toLowerCase().replace(/\s+/g, '-')}-${link.split('/').pop() || Date.now()}`,
        date: pubDate.toISOString().split('T')[0],
        category: categorize(rawTitle),
        title: rawTitle,
        description: cleanDesc,
        source,
        url: link,
        tags: extractTags(rawTitle),
        manual: false,
      };
    })
    .filter(Boolean);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const all = [];

  console.log('Fetching Papers With Code…');
  try {
    const papers = await fetchPapersWithCode();
    all.push(...papers);
    console.log(`  → ${papers.length} significant papers`);
  } catch (e) {
    console.error('  Papers With Code failed:', e.message);
  }

  for (const feed of RSS_FEEDS) {
    console.log(`Fetching ${feed.source}…`);
    try {
      const entries = await fetchRSS(feed);
      all.push(...entries);
      console.log(`  → ${entries.length} entries`);
    } catch (e) {
      console.error(`  ${feed.source} failed:`, e.message);
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const out = path.join(DATA_DIR, 'timeline-pending.json');
  fs.writeFileSync(out, JSON.stringify(all, null, 2));
  console.log(`\nWrote ${all.length} entries to data/timeline-pending.json`);
  console.log('Open a PR with this file to review before merging into the timeline.');
}

main().catch(err => { console.error(err); process.exit(1); });
