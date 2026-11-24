# Note: License the template under MIT

*[中文](2026-11-24-mit-license_zh.md)*

Status: implemented

## Problem

The template is public now but carries no license. Under default copyright a reader may clone it and nothing more, so the "Adopt it" instructions ask for something the law does not permit. The tree was extracted from DeepSeek Harness, which ships under MIT, so choosing any other license would make the provenance of the copied text contradictory.

## Decision

The repository ships MIT, copied from DeepSeek Harness's `LICENSE` and keeping its `Copyright (c) 2026 DeepSeek` notice. MIT is the most permissive common license that still keeps attribution, and it is the license the source already grants.

The README states the license in one line and names DeepSeek Harness as the source repository, in both language halves. A reader learns where the text came from without opening a second file.

## Alternatives considered

- **No license.** A public repository without a license still reserves every right; an adopter could read the template but not legally reuse it, which defeats publishing it.
- **Apache-2.0.** Compatible with the source and adds an explicit patent grant, but also a `NOTICE` file and a per-file change statement — more machinery than a five-file template earns.
- **CC0 or Unlicense.** Waives attribution, which is more permissive than the source allows to pass on; MIT requires the copyright notice to travel with copies of text that came from DeepSeek.
- **BSD-2-Clause.** Nearly the same permission as MIT but different attribution wording; there is no reason to diverge from the source's chosen text.
- **A license of this repository's own.** Puts a second set of terms on a tree whose text came from one MIT source, with nothing to gain.

## Consequences

Copies and forks must keep the MIT notice. The documentation gate is unaffected, because `LICENSE` is not a Markdown document and needs no translation. GitHub now detects and displays the license in the repository header.
