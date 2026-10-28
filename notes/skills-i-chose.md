# Skills I chose for the email marketing studio

Research done 28 Oct 2026 by running `npx skills find` for "email marketing",
"email sequence", "campaign plan" and "resend", then checking each publisher on
GitHub and on skills.sh (install counts, star counts, last push date, and whether
skills.sh lists the publisher as Official).

---

## Use these

**1. Writing campaigns — `anthropics/knowledge-work-plugins` (`campaign-plan`, `email-sequence`)**

This is Anthropic's own repo, not a stranger's. The `anthropics` org has existed
since 2020, the repo has **33.5K stars** and was pushed today, and skills.sh lists
Anthropic under **Official**. The `campaign-plan` skill produces a proper brief —
goal, audience, messaging, channel plan, calendar, success metrics — which is
exactly the shape of work a studio sells. Installs are modest (3.3K) because it is
new, not because it is bad. It is the safest source for the *thinking* part of the
job: strategy, sequences, draft outreach.

**2. Sending email — `resend/resend-skills` (`resend`, `send-email`), with `resend/email-best-practices`**

Resend builds the sending infrastructure, so they are the ones who actually know
deliverability. `resend` is a **verified Official publisher** on skills.sh, the org
has been on GitHub since 2022, and the repos are actively maintained (last push
17 Oct 2026). Star counts look small (207 and 146) only because these skills repos
are months old — `resend/react-email`, their older public repo, has **19.9K stars**,
which is the better read on how established they are. `resend` is the highest-install
Resend skill (23.7K) and `email-best-practices` covers the boring-but-critical part:
authentication, list hygiene, compliance. Pair them: one to send, one to not land
in spam.

*Backup worth knowing about:* `coreyhaines31/marketingskills` (`email-sequence`,
`copywriting`, `emails`) has **57K stars**, commits daily, and a real site
(marketing-skills.com). Not official, but the strongest independent option — worth
a look once the two above are in place.

---

## Avoid these

**1. `claude-office-skills/skills` (`email-marketing`) — name looks official, isn't**

This is the one to be careful with. The org is literally called
"claude-office-skills", which reads like Anthropic, but **it is not on skills.sh's
Official list** and is not an Anthropic account. The org was created 29 Jan 2026
and its last push was **31 Jan 2026 — two days later, then abandoned**. 544 stars
and 5K installs on a repo that has not been touched in nine months, with a name
borrowing Anthropic's brand, is a pattern I would not put near client work. The
skill content is generic filler ("Comprehensive email marketing skill covering
campaign creation, automated sequences, A/B testing...") with no owner behind it.

**2. `mbfinotti/sales-skills` (`cold-email-deliverability`, `sales-outbound-sequence`) — install numbers don't match reality**

**27.6K installs against 3 stars and 0 forks.** The repo was created 5 Sep 2026 and
the account publishes across 8 repos at once, with installs accumulating much faster
than any organic adoption would explain. All three security audits pass, so this is
not malware — the content on deliverability is actually thoughtful — but a 9,000:1
install-to-star ratio on a six-week-old repo means the install count is not telling
you what you think it is telling you. Do not treat it as vetted. (Same pattern,
though less extreme: `arnabbagxd/brand-building-skills` has 795 stars but was created
11 Jun 2026 and pushed for only two days before going quiet.)

---

## How I decided

Three checks before installing any skill:

1. **Who actually publishes it, and are they the owner of the thing?** A skill runs
   with my agent's permissions, so the publisher matters more than the content.
   Check whether skills.sh lists them under **Official**, and whether the GitHub org
   is the real company (age, other repos, website) or a lookalike name — "claude-"
   in the owner name proves nothing.
2. **Do the numbers agree with each other?** Installs, stars, forks, account age and
   last-push date should tell one story. Huge installs + near-zero stars, or 500+
   stars on a repo abandoned after 48 hours, means the metric is being inflated or
   inherited from something else. Also: stars on a giant multi-purpose repo do not
   transfer to the one skill inside it.
3. **Read the SKILL.md and the security audits before installing.** skills.sh shows
   Socket, Snyk and Agent Trust Hub results — all of the above passed, which is why
   passing audits alone was not enough to decide. The audits catch known-malicious
   code; they do not catch a skill that quietly sends my data somewhere, so I read
   the instructions myself first.

**Nothing was installed.** These are notes only.
