# A minimal AGENTS.md system

*[中文](README_zh.md)*

A short instruction system modelled on the DeepSeek Harness team's setup: standing orders in the root, standards one level down, conditional procedures in skills, decisions in a lifecycle tree.

| File | Words | Role |
| --- | --- | --- |
| [`AGENTS.md`](AGENTS.md) | ~780 | Standing orders. Loaded every session, kept short enough to stay read. |
| [`docs/AGENTS.md`](docs/AGENTS.md) | ~1,300 | Tiers, loading mechanics, rule-writing, budgets, maintenance checklist. |
| [`docs/development.md`](docs/development.md) | ~740 | Change discipline, error handling, verification ladder, review checklist. |
| [`.agents/notes/README.md`](.agents/notes/README.md) | ~690 | Decision notes: status, format, supersession, deletion. |
| [`.agents/skills/pre-push-checks/SKILL.md`](.agents/skills/pre-push-checks/SKILL.md) | ~335 | Conditional procedure: which checks to run before pushing. |

[`scripts/check-docs.mjs`](scripts/check-docs.mjs) enforces the word budgets, local links, heading anchors, and trailing newlines. `npm run check` runs it; it needs Node 20 or newer and installs nothing.

## Adopt it

A new repository can be seeded from this tree; an existing one is adopted in stages, because its rules must describe what is already there. Both procedures, including a copy-paste brief for an agent, are in [docs/adopting.md](docs/adopting.md).

## Extend it in one direction

Add detail by moving it down, never by growing the root file:

- Rules for one directory go in `<that directory>/AGENTS.md`.
- Standards and step-by-step procedures go in `docs/`.
- "Why we chose this, and what we rejected" goes in `.agents/notes/`, whose folder is its status.
- A procedure that matters only at one moment goes in `.agents/skills/<name>/SKILL.md`; its YAML description decides when it loads.

The root file keeps one line and a link. This is the whole trick: the root file stays short enough that an agent reads all of it, and the detail sits where it is loaded only when relevant.

## Why it works

- **Context is a budget.** Everything in the root file is paid for on every request. Moving a paragraph one level down means most sessions never pay for it.
- **One fact, one place.** Duplicated rules drift; when they disagree, the agent follows the one it read last. Linking instead of copying removes the failure mode.
- **Rule, reason, and check are three jobs.** A rule without a reason gets over-applied; a rule without a check gets skipped. Reasons live in notes, checks live in `npm run check` or in a test.
- **Reasoning is separate from reality.** Code and docs describe what is true now; notes record why and what lost. Merging them makes every documentation edit a re-litigation.
- **No catch-all standards file.** Each standard lives in the document that owns its subject. A single "guidelines" file starts as a summary and ends as a second copy of everything.
- **Short files get maintained.** A 1,200-word ceiling makes every addition a decision, which is what keeps the file true a year later.

## Keep it honest

`npm run check` catches the mechanical drift: broken links, missing headings, files over budget, and — if you write for a Chinese-speaking team — a document whose `_zh.md` twin is missing or no longer links back. Review the rest after any incident where the agent did the wrong thing. Most such incidents are a missing rule, a vague rule, or two rules that contradict. Fix the writing before adding another layer.

## Two languages, one document

English is the source. Each document carries a twin beside it whose name ends in `_zh.md`, and the pair links to each other; the gate fails if a twin is missing, so a half-translated tree cannot pass. Rules for writing the Chinese half are in [docs/AGENTS.md](docs/AGENTS.md#bilingual-documents).

## License

MIT, the same license as [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), the repository this template was extracted from. See [LICENSE](LICENSE).
