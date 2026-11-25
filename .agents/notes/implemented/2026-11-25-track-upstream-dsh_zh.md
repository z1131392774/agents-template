# 决策记录：有意识地跟踪上游指令体系

*[English](2026-11-25-track-upstream-dsh.md)*

Status: implemented

## Problem

这套模板是从 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的指令体系里提炼出来的。上游一直在动：它 2026-11-22 的 head（`4b399c3`）比本模板 2026 年 11 月初写就时所依据的那份拷贝更新，期间新增了 `docs/core-guidelines/` 这一层带编号的编码设计规则，把 PR 分支刷新策略改成用 `rerere.enabled` 的 rebase，把一处文档上限提到 1,100，还把自己 的 Node 下限提到 24.22.3。这里原先没有任何地方记下模板跟的是哪个上游快照、又故意省掉了哪些部分，于是后来的读者分不清「有意省略」和「没跟上」，每次同步都要把同样的判断重吵一遍。

## Decision

同步是一次有边界的比对，不是一次合并。把提炼自上游的那几份文件——根 `AGENTS.md`、`docs/AGENTS.md`、`docs/development.md`、`.agents/notes/README.md`、[pre-push 技能](../../skills/pre-push-checks/SKILL.md) 和 [`scripts/check-docs.mjs`](../../../scripts/check-docs.mjs)——同上游 `master` 上各自的母本逐份比对，只采纳在这么小的仓库里成立的规则，并把每一项推迟连同理由记在这里。

2026-11-25 这次同步采纳了上游的预算上限机制：先挪位、再精简、最后才提上限；上限设得过低本身就是预算 bug；任何上限都要在它管的当前用量之上留出至少 5% 的余量。清单在同一次改动里重新校准，因为 [`docs/AGENTS.md`](../../../docs/AGENTS.md) 和 [`docs/adopting.md`](../../../docs/adopting.md) 都贴在各自上限的 2% 以内，正是这条规则点名的「掐着尺码设上限」的毛病。`node scripts/check-docs.mjs --list` 会把每个上限和当前用量并排打出来，改动撞上上限之前就能看见余量。

推迟的项与理由：`core-guidelines/` 和 `defensive-patterns/` 两层要有代码可管才成立；rebase-with-rerere 假设的是一套本仓库没有的 stacked-PR 流程；Node 下限跟着 DSH 自己的运行时走，而这里的门禁只用到标准库；DSH 的决策记录分类、冻结归档、生成式参考资料和 `.i18n.yaml` 配对记录，在这个体量上花掉的维护成本高于它们带回来的东西（见[分层指令那份决策记录](2026-11-02-layered-agent-instructions.md)）。

## Alternatives considered

**整棵搬上游的文档。** 拷贝永远是最新的，但它写的是 DSH 的包、门禁和宿主，不是这套模板；读者会顺着链接走进一棵这里并不存在的树。

**上游每落一次改动就跟一次。** 离源最近，但上游多数提交属于 DSH 的产品面而不是它的指令体系，这种维护没有读者。

**停在第一个快照上。** 没有漂移风险，也不用做决定，但掐尺码的上限会一直隐身到某个贡献者撞上它，而「仿照 DeepSeek Harness」会悄悄变成一句关于一个已不存在系统的声明。

## Consequences

每次同步是一次对着固定上游提交的比对，外加一行推迟记录，于是下一个读者继承的是判断，而不是重新做一遍。模板保持为提炼品而非分叉：当 DSH 改的是结构而不是措辞时，这份记录需要一次新的决定，而不是照抄一份 diff。
