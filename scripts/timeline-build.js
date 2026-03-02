#!/usr/bin/env node
// scripts/timeline-build.js
// Merges data/timeline-pending.json into data/timeline-entries.json.
// Run this after reviewing and trimming pending.json.
// Existing entries always win on URL collision. Sorts newest first.

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
const pending  = readJSON('timeline-pending.json');

console.log(`timeline-entries.json: ${existing.length} existing entries`);
console.log(`timeline-pending.json: ${pending.length} pending entries`);

const byKey = new Map();

for (const entry of pending) {
  const key = entry.url || entry.id;
  byKey.set(key, entry);
}

// Existing always wins on collision
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
console.log(`\nBuilt data/timeline-entries.json: ${merged.length} total (+${newCount} new)`);
