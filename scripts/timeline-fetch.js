#!/usr/bin/env node
// scripts/timeline-fetch.js
// Auto-fetches AI news from Hacker News, ArXiv, and blog RSS feeds.
// Writes data/timeline-fetched.json — run `node scripts/timeline-build.js` afterward to merge.
//
// Node 18+ required (uses built-in fetch).
// Dependencies: fast-xml-parser (npm install)

const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DAYS_BACK = 7;

// ── Blog RSS feeds ────────────────────────────────────────────────────────────
const RSS_FEEDS = [
  { url: 'https://huggingface.co/blog/feed.xml',          source: 'Hugging Face' },
  { url: 'https://openai.com/blog/rss.xml',               source: 'OpenAI' },
  { url: 'https://www.anthropic.com/rss.xml',             source: 'Anthropic' },
  { url: 'https://blog.research.google/feeds/posts/default?alt=rss', source: 'Google Research' },
  { url: 'https://ai.meta.com/blog/rss/',                 source: 'Meta AI' },
  { url: 'https://mistral.ai/news/rss/',                  source: 'Mistral AI' },
];

// ── Keywords used to filter HN stories ───────────────────────────────────────
const AI_KEYWORDS = [
  'OpenAI', 'Anthropic', 'DeepMind', 'Google AI', 'Meta AI', 'xAI',
  'GPT', 'Claude', 'Gemini', 'Llama', 'Grok',
  'Mistral', 'Aleph Alpha', 'Cohere',
  'DeepSeek', 'Qwen', 'ERNIE', 'Baidu AI', 'Alibaba AI',
  'Kimi', 'Moonshot AI', 'ChatGLM', 'Zhipu', 'MiniMax',
  'Yi model', '01.AI', 'Doubao', 'ByteDance AI', 'Baichuan',
  'Falcon', 'TII', 'Technology Innovation Institute',
  'HyperCLOVA', 'Naver AI', 'Kakao AI',
  'AI21', 'AI21 Labs',
  'Reka', 'Inflection', 'Adept',
  'LLM', 'language model', 'large language', 'AI model', 'foundation model',
  'diffusion model', 'image generation', 'text-to-image', 'text-to-video',
  'fine-tuning', 'RLHF', 'reinforcement learning from human feedback',
  'transformer', 'attention mechanism', 'neural network', 'deep learning',
  'machine learning', 'artificial intelligence',
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
    openai:     /openai/i,
    anthropic:  /anthropic/i,
    google:     /google|deepmind|gemini/i,
    meta:       /\bmeta\b|\bllama\b/i,
    xai:        /\bxai\b|\bgrok\b/i,
    mistral:    /mistral/i,
    cohere:     /cohere/i,
    deepseek:   /deepseek/i,
    alibaba:    /alibaba|qwen|tongyi/i,
    baidu:      /baidu|ernie/i,
    moonshot:   /moonshot|kimi/i,
    falcon:     /\bfalcon\b|tii\b/i,
    gpt:            /\bgpt[-\s]?\d/i,
    claude:         /\bclaude\b/i,
    llm:            /\bllm\b|language model/i,
    'open-source':  /open[\s-]source|open[\s-]weights/i,
    reasoning:      /reasoning|chain[\s-]of[\s-]thought|\bcot\b/i,
    multimodal:     /multimodal|vision|\bvlm\b/i,
    'text-to-image': /text[\s-]to[\s-]image|image gen/i,
    'text-to-video': /text[\s-]to[\s-]video|video gen/i,
    agentic:        /agent(ic)?|tool use|function call/i,
  };
  return Object.entries(checks)
    .filter(([, re]) => re.test(title))
    .map(([tag]) => tag);
}

function isAIRelated(title, url = '') {
  const text = (title + ' ' + url).toLowerCase();
  return AI_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
}

// ── Hacker News via Algolia search API ───────────────────────────────────────
async function fetchHackerNews() {
  const cutoff = Math.floor(Date.now() / 1000) - DAYS_BACK * 86400;
  const queries = [
    'AI model release',
    'LLM OpenAI Anthropic Mistral',
    'machine learning research benchmark',
    'DeepSeek Qwen Kimi AI model',
    'ERNIE Baidu Alibaba AI',
    'Falcon Cohere AI model',
  ];
  const seen = new Set();
  const results = [];

  for (const q of queries) {
    const url =
      `https://hn.algolia.com/api/v1/search_by_date` +
      `?query=${encodeURIComponent(q)}&tags=story` +
      `&numericFilters=created_at_i>${cutoff},points>30&hitsPerPage=50`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      for (const hit of data.hits) {
        if (seen.has(hit.objectID)) continue;
        if (!isAIRelated(hit.title, hit.url || '')) continue;
        seen.add(hit.objectID);

        results.push({
          id: `hn-${hit.objectID}`,
          date: hit.created_at.split('T')[0],
          category: categorize(hit.title),
          title: hit.title,
          description: '',
          source: 'Hacker News',
          url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          tags: extractTags(hit.title),
          manual: false,
        });
      }
    } catch (e) {
      console.error(`  HN query "${q}" failed:`, e.message);
    }
  }

  return results;
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

  return items.slice(0, 30).map(item => {
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

  console.log('Fetching Hacker News…');
  try {
    const hn = await fetchHackerNews();
    all.push(...hn);
    console.log(`  → ${hn.length} entries`);
  } catch (e) {
    console.error('  HN failed:', e.message);
  }

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
