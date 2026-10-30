#!/usr/bin/env node
/**
 * Checks every campaign email against .claude/rules/emails.md and brand/voice.md.
 *
 * Usage:
 *   node scripts/check-emails.mjs              # every file under campaigns/.../emails/
 *   node scripts/check-emails.mjs a.md b.md    # just these files
 *
 * Exits 1 if any file breaks a rule.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';

const ROOT = process.cwd();
const CAMPAIGNS = join(ROOT, 'campaigns');

const SUBJECT_MAX = 50;
const PREVIEW_MAX = 90;
const MAIN_URL = 'https://kettlebird.example/steep-club';
const GREETING = 'Hi {{first_name}},';
const SIGN_OFF = ['Talk soon,', '— Kettlebird'];
const FOOTER_1 = "You're getting this because you joined the Kettlebird Tea waitlist.";
const FOOTER_2 = /^Kettlebird Tea, .+ · Unsubscribe: (https?:\/\/\S+|\{\{unsubscribe_url\}\})$/;
const EMAIL_FILE = /^\d{2}-[a-z0-9-]+\.md$/;

const ALLOWED_PLACEHOLDERS = new Set([
  'first_name',
  'price',
  'commitment_terms',
  'first_box_date',
  'company_address',
  'unsubscribe_url',
]);

// brand/voice.md §3 and §4.
const BANNED = [
  // Hype
  'game-changing', 'revolutionary', 'elevate', 'unlock', 'seamless', 'next-level',
  'premium experience', 'must-have',
  // Startup filler
  'journey', 'curated', 'obsessed', 'passionate', 'disrupt', 'ecosystem', 'leverage', 'space',
  // Hustle talk
  'grind', '10x', 'level up', 'crush it', 'no days off', 'productivity hack',
  // Fake friendliness
  'guys', 'bestie', 'tea lovers', 'superfans',
  // False urgency
  'only 3 left', 'last chance', 'hurry', "don't miss out",
  // Health-adjacent
  'detox', 'cleanse', 'superfood', 'wellness', 'immunity', 'focus-boosting',
  // Claims
  'clinically proven', 'scientifically formulated', 'carbon neutral', 'plastic free',
  'compostable', 'organic', 'fairtrade', 'vegan', 'gluten-free', 'most popular',
  'hundreds of', 'testimonial', 'guarantee', 'boosts immunity', 'improves focus',
  'aids sleep', 'helps you concentrate', 'weight loss', 'reduces stress',
];

const BANNED_RE = BANNED.map((term) => ({
  term,
  re: new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
}));

function findEmailFiles(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      findEmailFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.md') && dir.split(/[\\/]/).pop() === 'emails') {
      out.push(full);
    }
  }
  return out;
}

function checkFile(path) {
  const problems = [];
  const add = (line, message) => problems.push({ line, message });

  const raw = readFileSync(path, 'utf8');
  const lines = raw.split(/\r?\n/);
  const nonEmpty = lines
    .map((text, index) => ({ text, line: index + 1 }))
    .filter((entry) => entry.text.trim() !== '');

  if (nonEmpty.length === 0) {
    add(1, 'file is empty');
    return problems;
  }

  if (!EMAIL_FILE.test(path.split(/[\\/]/).pop())) {
    add(1, 'file name is not NN-short-name.md');
  }

  // 1. Subject and preview.
  if (!nonEmpty[0].text.startsWith('Subject: ')) {
    add(nonEmpty[0].line, 'line 1 does not start with "Subject: "');
  } else {
    const subject = nonEmpty[0].text.slice('Subject: '.length);
    if (subject.length > SUBJECT_MAX) {
      add(nonEmpty[0].line, `subject is ${subject.length} characters, limit ${SUBJECT_MAX}`);
    }
    if (subject.trim() === '') add(nonEmpty[0].line, 'subject is empty');
  }

  if (!nonEmpty[1] || !nonEmpty[1].text.startsWith('Preview: ')) {
    add(nonEmpty[1]?.line ?? 2, 'line 2 does not start with "Preview: "');
  } else {
    const preview = nonEmpty[1].text.slice('Preview: '.length);
    if (preview.length > PREVIEW_MAX) {
      add(nonEmpty[1].line, `preview is ${preview.length} characters, limit ${PREVIEW_MAX}`);
    }
    if (preview.trim() === '') add(nonEmpty[1].line, 'preview is empty');
  }

  // 2. Greeting.
  const greetingLines = lines
    .map((text, index) => ({ text, line: index + 1 }))
    .filter((entry) => entry.text.includes('{{first_name}}'));
  if (greetingLines.length !== 1) {
    add(1, `{{first_name}} appears on ${greetingLines.length} lines, expected 1`);
  } else if (greetingLines[0].text !== GREETING) {
    add(greetingLines[0].line, `greeting is not exactly "${GREETING}"`);
  }

  // 4. Sign-off and footer.
  if (nonEmpty.length < 5) {
    add(1, 'file is too short to carry a sign-off and footer');
    return problems;
  }

  const tail = nonEmpty.slice(-4);
  if (tail[0].text !== SIGN_OFF[0]) add(tail[0].line, `expected "${SIGN_OFF[0]}"`);
  if (tail[1].text !== SIGN_OFF[1]) add(tail[1].line, `expected "${SIGN_OFF[1]}"`);
  if (tail[2].text !== FOOTER_1) add(tail[2].line, 'footer line 1 is not the required text');
  if (!FOOTER_2.test(tail[3].text)) {
    add(tail[3].line, 'footer line 2 is not "Kettlebird Tea, <address> · Unsubscribe: <link>"');
  }

  for (const entry of tail.slice(2)) {
    if (/^\s/.test(entry.text)) add(entry.line, 'footer line starts with whitespace');
    if (entry.text.startsWith('>')) add(entry.line, 'footer line is a blockquote');
    if (entry.text.includes('**') || entry.text.includes('`')) {
      add(entry.line, 'footer line contains formatting');
    }
  }

  // 3. Exactly one main link, in the body.
  const body = nonEmpty.slice(0, nonEmpty.length - 4);
  const bodyText = body.map((entry) => entry.text).join('\n');
  const links = [...bodyText.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)];

  if (links.length !== 1) {
    add(body[0]?.line ?? 1, `body has ${links.length} Markdown links, expected 1`);
  } else if (links[0][2] !== MAIN_URL) {
    add(body[0].line, `main link points at ${links[0][2]}, expected ${MAIN_URL}`);
  }

  for (const [, label] of links) {
    if (/^(button text|click here)$/i.test(label.trim())) {
      add(body[0]?.line ?? 1, `link label is "${label}", which the rule forbids`);
    }
  }

  const withoutLinks = bodyText.replace(/\[[^\]]+\]\([^)\s]+\)/g, '');
  if (/https?:\/\//.test(withoutLinks)) {
    add(body[0]?.line ?? 1, 'body contains a bare URL outside a Markdown link');
  }

  // Formatting and copy rules.
  if (raw.includes('```')) add(1, 'file contains a code fence');

  for (const entry of lines.map((text, index) => ({ text, line: index + 1 }))) {
    for (const { term, re } of BANNED_RE) {
      if (re.test(entry.text)) add(entry.line, `banned word or claim: "${term}"`);
    }
    if (entry.text.includes('!')) add(entry.line, 'exclamation mark');
    if (/\b[A-Z]{4,}\b/.test(entry.text)) add(entry.line, 'ALL CAPS word');
    if (/\p{Extended_Pictographic}/u.test(entry.text)) add(entry.line, 'emoji');
    for (const match of entry.text.matchAll(/\{\{([a-z_]+)\}\}/g)) {
      if (!ALLOWED_PLACEHOLDERS.has(match[1])) {
        add(entry.line, `unknown placeholder {{${match[1]}}}`);
      }
    }
  }

  return problems;
}

const args = process.argv.slice(2);
const files = (args.length > 0 ? args : findEmailFiles(CAMPAIGNS))
  .map((file) => (isAbsolute(file) ? file : join(ROOT, file)))
  .sort();

if (files.length === 0) {
  console.error('No email files found under campaigns/**/emails/.');
  process.exit(1);
}

let total = 0;
for (const file of files) {
  const problems = checkFile(file);
  if (problems.length === 0) continue;
  total += problems.length;
  console.log(`\n${relative(ROOT, file)}`);
  for (const { line, message } of problems) {
    console.log(`  line ${line}: ${message}`);
  }
}

if (total > 0) {
  console.error(`\n${total} problem${total === 1 ? '' : 's'} in ${files.length} file${files.length === 1 ? '' : 's'}.`);
  process.exit(1);
}

console.log(`${files.length} file${files.length === 1 ? '' : 's'} checked, no problems.`);
