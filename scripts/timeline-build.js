#!/usr/bin/env node
// scripts/timeline-build.js
// Merges data/timeline-fetched.json into data/timeline-entries.json.
// Existing entries always win on URL collision (preserves accumulated history).
// Sorts by date descending (newest first).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function readJSON(filename) {
  const p = path.join(DATA_DIR, filename);
  if (!fs.existsSync(p)) {
    console.warn(`  Warning: ${filename} not found, skipping.`);
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error(`  Error parsing ${filename}:`, e.message);
    return [];
  }
}

const existing = readJSON('timeline-entries.json');
const fetched  = readJSON('timeline-fetched.json');

console.log(`timeline-entries.json: ${existing.length} existing entries`);
console.log(`timeline-fetched.json: ${fetched.length} fetched entries`);

// Add fetched first, then overwrite with existing (existing always wins)
const byKey = new Map();

for (const entry of fetched) {
  const key = entry.url || entry.id;
  byKey.set(key, entry);
}

for (const entry of existing) {
  const key = entry.url || entry.id;
  byKey.set(key, entry);
}

const merged = Array.from(byKey.values())
  .filter(e => e.date && e.title)
  .sort((a, b) => b.date.localeCompare(a.date));

const newCount = merged.length - existing.length;

const out = path.join(DATA_DIR, 'timeline-entries.json');
fs.writeFileSync(out, JSON.stringify(merged, null, 2));
console.log(`\nBuilt data/timeline-entries.json: ${merged.length} total entries (+${newCount} new)`);
