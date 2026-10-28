---
name: personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
argument-hint: "[campaign folder]"
context: fork
allowed-tools: Read, Glob, Grep, Write
---

# Personalize

Take one campaign's finished emails and write one version per lead group.

## Input

The argument is a campaign folder, for example `campaigns/steep-club-launch`.

If no folder is given, stop. Do not write anything. List the campaign folders
that exist, one per line:

    Campaign folders:
    - campaigns/steep-club-launch
    - ...

Find them with Glob on `campaigns/*/emails/*.md` and take the campaign directory
(the part before `/emails/`). `campaigns/*/plan.md` catches campaigns that have a
plan but no emails yet.

If the folder given does not exist, or has no `emails/*.md`, stop and say so. Do
not create anything.

## Read first

1. `leads/leads.csv` — collect the distinct values in the `group` column. The
   expected values are `tea-curious`, `gift-buyers` and `daily-drinkers`. If the
   column is missing, stop.
2. `brand/voice.md` — the voice rules.
3. `.claude/rules/emails.md` — the email file rules. The new files sit under
   `campaigns/`, so this rule applies to them too.
4. `<campaign folder>/plan.md`, if it exists — the audience notes for each group.
5. Every `<campaign folder>/emails/*.md` — the source emails.

## What to write

For each group and each source email, write one file to:

    <campaign folder>/groups/<group>/emails/<same file name>

Keep everything the same except two things:

1. **The opening line** — the first body line after `Hi {{first_name}},`.
2. **One example** — the single most concrete sentence in the body, chosen
   because it can be angled to the group. A brewing detail, a shipping date, a
   cupboard, a gift. Rewrite that sentence for the group.

Change only those two. Keep the subject, preview, greeting, structure,
placeholders, link, sign-off and footer identical. Do not add or remove
paragraphs. Do not add facts, claims, prices, dates or social proof. Do not change
`{{price}}`, `{{first_box_date}}`, `{{commitment_terms}}`, `{{company_address}}` or
`{{unsubscribe_url}}`.

### Group angles

Use the campaign plan's audience notes. For this project they are:

- **tea-curious** — new to loose leaf and unsure what to do. Reassure with the
  instructions. Do not claim "no gear" or "everything you need"; those are
  unverified.
- **gift-buyers** — buying for someone else. The box arrives every month without
  them having to remember. The gift is the absence of admin.
- **daily-drinkers** — already drinks tea every day and is tired of the
  supermarket shelf. One tea a month, chosen for the month, not a cupboard of
  half-finished boxes.

These are angles, not new facts. If the source email does not support the angle,
use a lighter touch.

## Check before saving

For each output file:

- Subject and preview are identical to the source.
- `Hi {{first_name}},` is identical.
- Exactly one link, identical to the source.
- Sign-off and footer are identical, and the footer is still plain text.
- Only the opening line and one example differ.
- No banned words, health claims, invented social proof, false urgency,
  exclamation marks, ALL CAPS or emoji.
- The file still passes `.claude/rules/emails.md`.

If a target file already exists, do not overwrite it silently. Stop and list the
conflicts.

## Reply

When every file is written, reply with only:

    Wrote <N> files.

    tea-curious: "<opening line>"
    gift-buyers: "<opening line>"
    daily-drinkers: "<opening line>"

One example opening line per group, in the order the groups appear in
`leads/leads.csv`. No commentary, no file list, no explanation.

This skill has no shell tool, so it cannot commit. Write the files, return the
summary, and leave committing to the caller.
