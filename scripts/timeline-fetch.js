#!/usr/bin/env node
// scripts/timeline-fetch.js
// Fetches AI news from ArXiv and official lab/news RSS feeds.
// Writes data/timeline-fetched.json — run `node scripts/timeline-build.js` afterward to merge.
//
// Node 18+ required (uses built-in fetch).
// Dependencies: fast-xml-parser (npm install)

const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DAYS_BACK = 7;

// ── Official lab and AI news RSS feeds ───────────────────────────────────────
const RSS_FEEDS = [
  { url: 'https://openai.com/blog/rss.xml',               source: 'OpenAI' },
  { url: 'https://huggingface.co/blog/feed.xml',          source: 'Hugging Face' },
  { url: 'https://deepmind.google/blog/rss.xml',          source: 'Google DeepMind' },
  { url: 'https://blog.google/technology/ai/rss/',        source: 'Google AI' },
  { url: 'https://venturebeat.com/category/ai/feed/',     source: 'VentureBeat' },
];

// ── Category detection by title keywords ─────────────────────────────────────
function categorize(title) {
  const t = title.toLowerCase();
  if (/\b(arxiv|paper|research|study|benchmark|survey|we present|we propose)\b/.test(t)) return 'research_paper';
  if (
    /\b(released?|launches?|launched|introduces?|introduced|announc(es|ed)|new model|v\d+\.\d+)\b/.test(t) &&
    /\b(gpt|claude|gemini|llama|mistral|deepseek|grok|qwen|ernie|yi|kimi|chatglm|falcon|cohere|model|llm|ai)\b/.test(t)
  ) return 'model_release';
  if (/\b(fund(ing|ed|s)|rais(es|ed|ing)|acqui(res|red|sition)|\$\d+[bm]illion|series [a-e]|ipo|valuation)\b/.test(t)) return 'announcement';
  if (/\b(api|app|product|tool|service|available|plugin|feature|integrat|launch(es|ed)?)\b/.test(t)) return 'product_launch';
  return 'announcement';
}

function extractTags(title) {
  const checks = {
    openai:          /openai/i,
    anthropic:       /anthropic/i,
    google:          /google|deepmind|gemini/i,
    meta:            /\bmeta\b|\bllama\b/i,
    xai:             /\bxai\b|\bgrok\b/i,
    mistral:         /mistral/i,
    cohere:          /cohere/i,
    deepseek:        /deepseek/i,
    gpt:             /\bgpt[-\s]?\d/i,
    claude:          /\bclaude\b/i,
    'open-source':   /open[\s-]source|open[\s-]weights/i,
    reasoning:       /reasoning|chain[\s-]of[\s-]thought/i,
    multimodal:      /multimodal|vision|\bvlm\b/i,
    'text-to-image': /text[\s-]to[\s-]image|image gen/i,
    'text-to-video': /text[\s-]to[\s-]video|video gen/i,
    agentic:         /agent(ic)?|tool use|function call/i,
  };
  return Object.entries(checks)
    .filter(([, re]) => re.test(title))
    .map(([tag]) => tag);
}

// ── ArXiv RSS feeds ───────────────────────────────────────────────────────────
async function fetchArxiv(category) {
  const url = `https://rss.arxiv.org/rss/${category}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const feed = parser.parse(xml);
  const items = [].concat(feed?.rss?.channel?.item || []);

  return items.slice(0, 5).map(item => {
    const rawTitle = typeof item.title === 'string' ? item.title : String(item.title ?? '');
    const rawDesc  = typeof item.description === 'string' ? item.description : String(item.description ?? '');
    const link     = typeof item.link === 'string' ? item.link.trim() : '';
    const pubDate  = item.pubDate ? new Date(item.pubDate) : new Date();

    const cleanTitle = rawTitle.replace(/\n/g, ' ').trim();
    const cleanDesc  = rawDesc.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 250);
    const arxivId    = link.split('/').pop();

    return {
      id: `arxiv-${arxivId}`,
      date: pubDate.toISOString().split('T')[0],
      category: 'research_paper',
      title: cleanTitle,
      description: cleanDesc,
      source: `ArXiv (${category})`,
      url: link,
      tags: [category.toLowerCase(), 'research'],
      manual: false,
    };
  });
}

// ── Generic RSS blog feed fetcher ─────────────────────────────────────────────
async function fetchRSS({ url, source }) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ai-timeline-bot/1.0 (RSS reader)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const feed = parser.parse(xml);

  const channel = feed?.rss?.channel || feed?.feed;
  const rawItems = channel?.item || channel?.entry || [];
  const items = [].concat(rawItems).slice(0, 20);

  const cutoff = new Date(Date.now() - DAYS_BACK * 86400 * 1000);

  return items
    .map(item => {
      const rawTitle = String(item.title?.['#text'] ?? item.title ?? '').replace(/\n/g, ' ').trim();
      const rawDesc  = String(item.description?.['#text'] ?? item.description ?? item.summary ?? '');
      const link     = String(item.link?.['@_href'] ?? item.link ?? item.id ?? '').trim();
      const pubDate  = new Date(item.pubDate ?? item.published ?? item.updated ?? 0);

      if (!rawTitle || pubDate < cutoff) return null;

      return {
        id: `rss-${source.toLowerCase().replace(/\s+/g, '-')}-${link.split('/').pop() || Date.now()}`,
        date: pubDate.toISOString().split('T')[0],
        category: categorize(rawTitle),
        title: rawTitle,
        description: rawDesc.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 250),
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

  for (const cat of ['cs.AI', 'cs.LG', 'cs.CL']) {
    console.log(`Fetching ArXiv ${cat}…`);
    try {
      const entries = await fetchArxiv(cat);
      all.push(...entries);
      console.log(`  → ${entries.length} entries`);
    } catch (e) {
      console.error(`  ArXiv ${cat} failed:`, e.message);
    }
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
  const out = path.join(DATA_DIR, 'timeline-fetched.json');
  fs.writeFileSync(out, JSON.stringify(all, null, 2));
  console.log(`\nWrote ${all.length} entries to data/timeline-fetched.json`);
  console.log('Run `node scripts/timeline-build.js` to merge into data/timeline-entries.json');
}

main().catch(err => { console.error(err); process.exit(1); });
