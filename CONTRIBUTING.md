# 贡献指南

感谢你愿意为 Skyroc 出一份力。这份文档只讲流程，代码规范请看 [`AGENTS.md`](./AGENTS.md)。

## 准备环境

```bash
corepack enable
pnpm install
```

要求 Node.js ≥ 20、pnpm 10.4.1。开发 Native 相关内容另需满足 Expo / iOS / Android 的本地环境。

## 开发流程

1. 从 `master` 切出分支，命名建议 `feat/xxx`、`fix/xxx`、`docs/xxx`。
2. 改动前先确认落点：应用层的业务改 `apps/`，可复用能力沉淀到 `packages/`。新增包或调整依赖方向前，务必先读 [`packages/ARCHITECTURE.md`](./packages/ARCHITECTURE.md)。
3. 改动共享包时，检查它的直接消费方，对受影响的 workspace 做定向验证。

## 提交前自检

只跑受影响范围，不必全量：

```bash
pnpm --filter <workspace-name> typecheck
pnpm --filter <workspace-name> lint
pnpm --filter <workspace-name> test
pnpm format:check
```

改动跨越多个包时再跑全量的 `pnpm typecheck`、`pnpm lint`、`pnpm test`。

## 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/)，一次提交只做一件事。仓库提供了交互式提交命令：

```bash
pnpm --filter skyroc-admin commit      # 英文
pnpm --filter skyroc-admin commit:zh   # 中文
```

常用类型：`feat` 新功能、`fix` 修复、`refactor` 重构、`docs` 文档、`chore` 杂项、`test` 测试、`perf` 性能。

## 提 PR

- 标题同样遵循 Conventional Commits。
- 描述里说明**改了什么**和**为什么改**；涉及 UI 的请附上截图或录屏。
- 有破坏性变更时在描述中明确标出，并说明迁移方式。
