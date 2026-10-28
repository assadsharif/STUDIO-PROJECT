---
paths:
  - "campaigns/**/emails/*.md"
---

# Rules for email files

These rules apply to every email file in every campaign, and only to email files:
anything at `campaigns/<campaign>/emails/<email>.md`. Only files named
`NN-short-name.md` are email files. Do not put READMEs, notes or briefs in this
folder; they belong elsewhere in the campaign folder.

An email file is customer-facing copy that will be sent. Treat every rule below as
a hard requirement, not a style suggestion.

## 1. Subject and preview come first

The first line of the file is the subject:

    Subject: ...

It must be 50 characters or fewer, counting every character including spaces. The
limit applies to the subject text only; the `Subject: ` prefix does not count.

The second line is the preview text:

    Preview: ...

It must be 90 characters or fewer, again counting spaces. The limit applies to the
preview text only; the `Preview: ` prefix does not count.

Nothing goes above these two lines — no title, no heading, no comment. If the
subject or preview is too long, shorten the words. Do not move the overflow into
the other line.

## 2. Greet the reader by name

The email greets the reader using the `{{first_name}}` placeholder, for example:

    Hi {{first_name}},

Use the placeholder exactly as written, with double braces. Do not replace it with
a sample name, do not use a fallback like "there", and do not put it anywhere other
than the greeting. A reader whose name is missing is a data problem to fix, not
something to paper over in the copy.

## 3. Exactly one main link

The email has exactly one main link. It is written as a Markdown link with a short,
descriptive label, for example:

    [Join The Steep Club](https://kettlebird.example/steep-club)

The label names the action. Do not use `Button text`, `Click here` or a bare URL.
Keep the URL exactly as shown: do not shorten it, add tracking parameters, or add
a second link to the same place. One email, one action.

The unsubscribe link in the footer is not a main link and does not count toward
this limit.

## 4. Sign off, then the footer

The email ends with the sign-off from `brand/voice.md` for marketing and newsletter
mail — the closing line, then the signature:

    Talk soon,
    — Kettlebird

Immediately after the signature come these two footer lines, exactly as written:

You're getting this because you joined the Kettlebird Tea waitlist.
Kettlebird Tea, {{company_address}} · Unsubscribe: {{unsubscribe_url}}

The footer is plain text in the file. Do not wrap it in a code block, do not turn
it into a quote, and do not bold it. Keep the middle dot and the spacing as shown.
The email platform must replace `{{unsubscribe_url}}` with a working unsubscribe
link; that link is exempt from the one-main-link rule.

Nothing comes after the footer. No postscript, no second signature, no trailing
note.

## 5. Check before saving

Before an email file is considered finished, confirm all of the following:

- Line 1 starts with `Subject: ` and the subject is 50 characters or fewer.
- Line 2 starts with `Preview: ` and the preview is 90 characters or fewer.
- The greeting contains `{{first_name}}`.
- There is exactly one main link in the body, with a descriptive label and the
  exact URL above. The unsubscribe link is exempt.
- The file ends with `Talk soon,`, `— Kettlebird`, then the two footer lines.
- The footer is plain text, and nothing follows it.
- The copy also passes `brand/voice.md`: no banned words, no health claims, no
  invented social proof, no false urgency, no exclamation marks.
