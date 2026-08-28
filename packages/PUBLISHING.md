# npm 包版本与发布

本仓库使用 pnpm workspace 和 Changesets 管理公共 npm 包。每个公共包独立遵循 SemVer，应用与内部 workspace 不参与 npm 包版本联动。

## 发布边界

满足以下条件的 workspace 才参与公共包发布：

- `private` 不是 `true`；
- 已配置可用的构建产物、`files` 和 `publishConfig`；
- 能独立完成构建与发布前检查。

`apps/`、`docs/`、playground、设计原型、`internal/config`、`internal/tsconfig`、`packages/web/admin` 和尚未完成发布配置的 `@skyroc/logger` 均为私有 workspace。私有 workspace 可以维护自身展示或部署版本，但不会被 Changesets 改版本或发布到 npm。

公共包默认完全独立，不配置 `fixed` 或 `linked` 分组。Changesets 会根据 `workspace:*` 依赖图更新必要的内部依赖和下游包版本。

## 版本级别

- `patch`：修复错误，且不破坏现有公开 API；
- `minor`：增加向后兼容的公开能力；
- `major`：删除、重命名或改变现有公开 API、行为或兼容范围。

尚处于 `0.x` 的包仍按影响选择级别；公开 API 稳定后再单独发布 `1.0.0`，不要为了和其他包对齐而升级。

## 日常变更

修改公共包后执行：

```bash
pnpm changeset
```

只选择实际影响使用者的公共包。纯文档、测试、内部重构或私有 workspace 变更不需要 changeset。一次跨包功能可以写一个 changeset，并在其中列出所有直接受影响的公共包。

提交前可检查待发布计划：

```bash
pnpm release:status
```

## 准备版本

合并准备发布的变更后执行：

```bash
pnpm release:version
pnpm install
pnpm release:status
```

`release:version` 会消费 `.changeset/*.md`，更新受影响包的 `version`、内部依赖范围和各包 `CHANGELOG.md`。版本文件和 lockfile 应作为一次独立的 release 提交接受审查。

## 验证与发布

根据待发布包运行针对性的 typecheck、test、build 和 tarball 检查。涉及 `create-skyroc` 时必须验证打包后的脚手架与仓库外生成结果；涉及 Expo 原生模块时必须执行其 `prepublishOnly`、tarball 内容和原生 autolinking 检查。

确认 npm 身份、目标 registry、工作区状态和所有产物无误后，由发布者手动执行：

```bash
pnpm release:publish
```

该命令只发布本地版本高于 npm registry 当前版本的非私有包。真实发布前不要跳过 `pnpm release:status` 和对应包的构建检查。

## 应用版本

`apps/admin`、`apps/admin-example` 和 `apps/ruoyi-plus-fast` 的 `pnpm release` 调用 `sa release`，只用于应用自身版本、changelog 和 Git tag，不用于发布 workspace 公共包。禁止在 monorepo 根目录直接执行 `pnpm sa release`。
