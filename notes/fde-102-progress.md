# FDE-102 Email Studio Lab — where we got to

The assignment itself is saved at the repo root, in
[`ASSIGNMENT.md`](../ASSIGNMENT.md). It is a byte-for-byte copy of the original
handout — nothing edited, so it can be read again later exactly as written.

- Saved: 30 October 2026
- Part 1 (steps 1–8): done
- Part 2 (steps 9–11): not started
- Part 3 (steps 12–14): not started
- Stretch (step 15): not started

---

## Part 1 — Plan and write

| # | Step | Status | What is in the repo |
|---|---|---|---|
| 1 | Look before you build | Done | `notes/skills-i-chose.md` — the four searches, the publishers checked, the two recommendations, the two to avoid, and the three questions to ask before installing anything. |
| 2 | Set up your studio | Done, with a caveat | `CLAUDE.md`, `.gitignore`, the four folders, and Anthropic's `marketing` plugin installed at **project** scope (`marketing@knowledge-work-plugins` 1.2.0, recorded in `.claude/settings.json`). |
| 3 | Your brand voice | Done | `brand/voice.md` — how Kettlebird Tea sounds, the words it never uses, the claims it will not make. Imported by `CLAUDE.md` so it loads every session. |
| 4 | Plan the campaign | Done | `campaigns/steep-club-launch/plan.md` — goal, audience, message, the four emails, the calendar, what success looks like. |
| 5 | Practice leads | Done | `leads/leads.csv` — 24 made-up customers at `@example.com`, 8 in each of 3 groups — plus `leads/CLAUDE.md` with the rules for that folder. |
| 6 | Email rule and sequence | Done | `.claude/rules/emails.md` and four emails in `campaigns/steep-club-launch/emails/`. |
| 7 | Fresh-eyes review | Done | Three rounds of fixes: `5d94da1`, `30dfe6b`, `803c122`. Rule files were changed where the review showed they were wrong. |
| 8 | Your own skill: personalize | Done | `.claude/skills/personalize/SKILL.md`, and 12 group versions under `campaigns/steep-club-launch/groups/` (4 emails × 3 groups). |

### The caveat on step 2

The plugin is installed and turned on for this project, which is what the step
asks for. But `/marketing:campaign-plan`, `/marketing:email-sequence` and
`/marketing:brand-review` are **Claude Code** slash commands. This studio has
also been worked on in OpenCode, which does not run plugin slash commands, so
the marketing skills were applied by reading their `SKILL.md` files and
following the instructions by hand. The output is the same; the typing is not.

If the step is repeated in Claude Code, `/marketing:` should list all three
commands. That has not been re-tested since the Claude Code login expired on
28 October 2026.

---

## Extras that are not in the assignment

Two things were added on top of Part 1, both committed:

- **A rule checker.** `scripts/check-emails.mjs` enforces
  `.claude/rules/emails.md` and the `brand/voice.md` avoid-list — subject and
  preview length, the greeting, one descriptive link, the exact sign-off and
  footer, no banned words, exclamation marks, ALL CAPS, emoji or unknown
  placeholders. `69293b1`.
- **A workflow that runs it.** `.github/workflows/email-rules.yml` runs the
  checker on push and pull request whenever an email, the checker or the
  workflow changes. `fcc262f`.

The `github-actions-templates` skill was also added (`6deb7ed`), but its
templates assume an application to build. This repo is copy and configuration,
so the workflow above was written by hand instead.

---

## Part 2 — Send safely (steps 9–11)

Not started. Nothing has been sent anywhere, and no Resend account exists.

| # | Step | What is missing |
|---|---|---|
| 9 | Connect Resend in practice mode | `.mcp.json` — the project-level connection to Resend's practice server. |
| 10 | The safety guard | `.claude/hooks/send-guard.mjs`, and the hook entry in `.claude/settings.json` that runs it. |
| 11 | Practice launch | The launch itself, plus the send log. |

The guard is the point of this part: it should refuse any send whose recipients
are not at `@example.com`, and refuse anything outside the practice server. That
rule is already written down in `CLAUDE.md` — the hook is what makes it
mechanical rather than a promise.

## Part 3 — Work like a team (steps 12–14)

Not started.

| # | Step | What is missing |
|---|---|---|
| 12 | Resume and fork | Nothing to build; it is a session exercise. Worth doing once Part 2 exists so there is something to resume. |
| 13 | Automatic review | `scripts/review.mjs` and `review/findings.schema.json`. |
| 14 | Package your studio kit | A plugin wrapping this studio's rules, skills and hooks so another project can install it. |

## Stretch — step 15

Not started. "What customers love" — reading the practice replies and turning
them into the next campaign.

---

## Facts still needed from you

The emails are complete but carry visible sample values, marked `(sample)`, so
they can be tested without inventing facts about a real business. Before
anything goes to a real person, these need real answers:

1. The price of a box, and what the commitment is.
2. When the first box ships.
3. The company's postal address, for the footer.
4. The unsubscribe link.
5. The real checkout URL, replacing `https://kettlebird.example/steep-club`.
6. The closing line — the one line that ends each email.
7. The tea's name and what is in the first box.
8. The launch page copy, if the emails are meant to point at one.

---

## Known gaps

- **The checker is tied to this campaign.** The CTA URL and footer text are
  hardcoded, so a second campaign with a different link will fail the check
  until `scripts/check-emails.mjs` is updated.
- **The checker is stricter than the voice guide on one word.** `organic` is
  banned outright, while `brand/voice.md` allows it if the tea is certified and
  the certifier is named. Relax the check if that ever becomes true.
- **The checker does not test the personalize rule.** It does not compare a
  group file against its source email, so a group file with the wrong two
  paragraphs changed would still pass.
- **`README.md` is still the scaffolding default.** It does not describe the
  studio yet.
