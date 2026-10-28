# leads/ — rules for this folder

These rules apply to everything inside `leads/`, on top of the studio-wide rules
in the root `CLAUDE.md`.

**These are made-up practice people.** Every row in `leads.csv` is invented. They
are not customers, not prospects, and not anyone's data. Treat them as rehearsal
material: realistic enough to write to, real enough to never contact.

**Never add real people or real email addresses.** No importing a customer list, no
exporting from a CRM, no pasting an address you found somewhere. If a name or
address came from anywhere outside this file, it does not belong here. New practice
leads get invented, not collected.

**Every row needs a consent value.** The `consent` column must always be filled in —
today it says `waitlist form` for everyone. A row with a blank consent field is a
row we have no right to mail, so it gets fixed before the file is used, not after.

**Never change the `@example.com` addresses.** Every address ends in
`@example.com` on purpose. That domain is reserved by the standards and can never
receive mail, which is what makes this file safe to test with. Do not swap in a
real domain, do not "fix" an address to look more realistic, and do not let a tool
rewrite them. If a test needs a working inbox, that is a separate decision and it
does not happen by editing this file.
