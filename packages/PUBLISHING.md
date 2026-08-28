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

## 自动发布

`master` 收到包含 changeset 的提交后，[Release workflow](../.github/workflows/release.yml) 会自动创建或更新 Release PR。该 PR 包含版本号、内部依赖、changelog 和 lockfile 变更。

合并 Release PR 后，同一个 workflow 会：

1. 安装冻结的 lockfile；
2. 构建全部公共包及其内部依赖；
3. 发布 registry 中尚不存在的非私有包版本；
4. 推送包级 Git tag 并创建 GitHub Release。

日常开发只需要提交功能代码和 `pnpm changeset` 生成的文件，不要手动修改版本号，也不需要在本地执行 `release:version` 或 `release:publish`。

### 仓库一次性配置

1. 在 GitHub 仓库的 `Settings → Actions → General` 中允许 GitHub Actions 创建 Pull Request；
2. 在 npm 创建能够发布本仓库公共包的 granular access token；
3. 在 GitHub 仓库的 `Settings → Secrets and variables → Actions` 中新增名为 `NPM_TOKEN` 的 secret；
4. token 必须拥有目标包的读写权限，并允许自动化发布使用；不要把 token 写入仓库文件。

workflow 同时请求 GitHub OIDC 身份并启用 npm provenance，使发布产物能够关联到对应的 GitHub Actions 构建。

## 手动回退流程

只有 GitHub Actions 不可用且必须人工发布时才执行：

```bash
pnpm release:version
pnpm install
pnpm release:publish
```

`release:version` 会消费 changeset 并同步 lockfile；`release:publish` 会先构建全部公共包及其内部依赖，再发布 registry 中不存在的版本。测试和类型检查应在功能提交阶段针对受影响包完成；涉及 `create-skyroc` 或 Expo 原生模块时，仍需检查 tarball、仓库外脚手架或原生 autolinking 等专属发布门禁。

## 应用版本

`apps/admin`、`apps/admin-example` 和 `apps/ruoyi-plus-fast` 的 `pnpm release` 调用 `sa release`，只用于应用自身版本、changelog 和 Git tag，不用于发布 workspace 公共包。禁止在 monorepo 根目录直接执行 `pnpm sa release`。
