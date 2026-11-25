# Note: Track the upstream instruction system deliberately

*[中文](2026-11-25-track-upstream-dsh_zh.md)*

Status: implemented

## Problem

This template distils the instruction system of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). That repository keeps moving: its head on 2026-11-22 (`4b399c3`) is newer than the copy this template was written against in early November 2026, and it had added a `docs/core-guidelines/` layer of numbered design rules, changed its PR branch refresh policy to rebase with `rerere.enabled`, raised one documentation ceiling to 1,100, and raised its own Node floor to 24.22.3. Nothing here recorded which upstream snapshot this template follows or which upstream parts were dropped on purpose, so a later reader could not tell a deliberate omission from an un-synced copy, and every sync re-argued the same choices.

## Decision

A sync is a bounded comparison, not a merge. Diff the documents that distil upstream — root `AGENTS.md`, `docs/AGENTS.md`, `docs/development.md`, `.agents/notes/README.md`, the [pre-push skill](../../skills/pre-push-checks/SKILL.md), and [`scripts/check-docs.mjs`](../../../scripts/check-docs.mjs) — against their upstream owners on `master`, adopt rules that hold for a repository this small, and record each deferral here with its reason.

The 2026-11-25 sync adopted upstream's budget-ceiling mechanics: relocate before condensing before raising; a too-low ceiling is a budget bug; a ceiling keeps at least 5% headroom above the count it governs. The manifest was recalibrated in the same change because [`docs/AGENTS.md`](../../../docs/AGENTS.md) and [`docs/adopting.md`](../../../docs/adopting.md) sat within 2% of their ceilings, the exact-size failure the rule names. `node scripts/check-docs.mjs --list` reports each ceiling beside its current count, so the headroom is visible before an edit runs into it.

Deferred, with reasons: the `core-guidelines/` and `defensive-patterns/` tiers need code to govern; rebase-with-rerere assumes a stacked-PR workflow this repository does not have; the Node floor follows DSH's runtime while this gate uses only the standard library; and DSH's note classes, frozen archive, generated references, and `.i18n.yaml` pairing records cost more here than they return (see [the layered-instructions note](2026-11-02-layered-agent-instructions.md)).

## Alternatives considered

**Vendor upstream's documents wholesale.** A copy would always be current, but it documents DSH's packages, gates, and hosts, not this template; a reader would follow links into a tree that does not exist here.

**Follow every upstream change as it lands.** Closest to the source, but most upstream commits belong to DSH's product surface rather than its instruction system, so the maintenance would have no reader.

**Stay at the first snapshot.** No drift risk and no decision, but the exact-size ceilings would have stayed invisible until a contributor hit one, and "modelled on DeepSeek Harness" would quietly become a claim about a system that no longer exists.

## Consequences

Each sync is one comparison against a pinned upstream commit and a one-line deferral entry, so the next reader inherits the judgment instead of repeating it. The template stays a distillation rather than a fork: when DSH changes structure rather than wording, this note needs a new decision instead of a copied diff.
