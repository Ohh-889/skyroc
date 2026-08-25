# @skyroc/scripts

Skyroc Admin CLI 工具集 — 通过统一入口 `sa` 命令，封装 changelog 生成、版本发布、规范化 Git 提交、依赖更新、清理构建产物等项目自动化脚本。

## 解决什么问题

```
❌ 每次发版：手动改版本号 → 手动写 CHANGELOG → 手动打 tag → 手动 push
❌ git commit：在脑中查规范 → 手写类型/范围 → 不确定格式对不对
❌ 项目清理：一个个目录找 node_modules / dist → 逐一删除
❌ 依赖更新：不知道哪些包有新版本 → 逐一核对
```

`@skyroc/scripts` 的答案：**一条命令 + 交互式引导 + 配置文件驱动**。

## 安装

```bash
# 在 monorepo 根目录已通过 workspace 引用，无需额外安装
# 若需独立使用：
pnpm add -D @skyroc/scripts
```

## 快速上手

```bash
# 查看帮助与所有可用命令（不带子命令直接跑 sa 也会输出帮助）
pnpm sa --help

# 查看版本
pnpm sa --version
```

典型工作流：

```bash
# 日常提交
pnpm sa git-commit

# 发版
pnpm sa release

# 清理构建产物
pnpm sa cleanup

# 生成一个可独立运行的 admin app
pnpm sa create-admin my-admin --target ~/projects/my-admin

# 在本仓库内新增一个 app（保留 workspace: / catalog: 协议）
pnpm sa create-admin my-admin --workspace

# 从 apps/admin 同步内置 admin 模板
pnpm sa sync-admin-template
```

## 命令一览

| 命令 | 说明 |
| --- | --- |
| `sa changelog` | 生成 / 更新 CHANGELOG.md |
| `sa cleanup` | 删除 dist、node_modules 等构建产物 |
| `sa create-admin <name>` | 基于内置模板生成新的 admin app（默认物化成可独立安装的工程，`--workspace` 保留 monorepo 协议） |
| `sa git-commit` | 交互式生成符合 Conventional Commits 规范的提交信息 |
| `sa git-commit-verify` | 校验当前 git 提交信息是否符合规范（用于 git hook） |
| `sa release` | 版本发布：升级版本号 → 生成 changelog → commit + tag + push |
| `sa sync-admin-template` | 从 `apps/admin` 生成内置 admin 模板与物化元数据（仅限仓库内） |
| `sa update-pkg` | 检测并升级 package.json 中的依赖版本 |

## 全局选项

所有命令共享以下选项：

| 选项 | 简写 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `--lang <lang>` | `-l` | CLI 交互语言，支持 `en-us` / `zh-cn` | `en-us` |
| `--execute <cmd>` | `-e` | release 版本号升级后、git commit 前执行的额外命令 | `pnpm sa changelog` |
| `--push` | `-p` | release 完成后是否自动 push | `true` |
| `--total` | `-t` | changelog 命令：基于所有历史 tag 生成完整 changelog | `false` |
| `--cleanupDir <dir>` | `-c` | cleanup 命令：自定义清理目录的 glob 匹配模式，多个用 `,` 分隔 | 见配置默认值 |

## 命令详情

### `sa create-admin`

基于内置 admin 模板生成一个新的 Vite + React admin app。默认输出到 `apps/<name>`，并自动写入 `package.json`、`.env` 中的应用名称、描述和 storage prefix。模板只保留最小登录、错误兜底和一个 Home 页面，业务页面由新项目自己添加。

#### 两种模式

模板是 `apps/admin` 的逐字节快照，里面满是只有本 monorepo 才能解析的写法：`workspace:*`、`catalog:dev`、指向 `internal/` 的 tsconfig / oxlint extends 链。这些写法在仓库外一律无解，因此生成时有两种模式：

| 模式 | 触发方式 | 依赖协议 | 适用场景 |
| --- | --- | --- | --- |
| **standalone**（默认） | 不加参数 | 物化成具体版本号 | 在本仓库之外生成一个独立工程 |
| **workspace** | `--workspace` | 原样保留 | 在本仓库内新增一个 app |

**standalone 模式**会额外做这些改写，让生成的工程 `pnpm install` 就能装上：

- `workspace:*` / `catalog:xxx` → 具体 semver（`workspace:*` 取 `^<version>`，让新项目还能跟着上游收补丁）
- `tsconfig.json`、`.oxlintrc.json` 的 extends 链就地展平，不再依赖 `@skyroc/tsconfig` 和 `internal/config/`
- 从 `pnpm-workspace.yaml` 继承的 `overrides` 写进 `pnpm.overrides`
- 重置 `version` 为 `0.0.0`、`private` 为 `true`，并移除 skyroc-admin 的 `homepage` / `repository` / `author` / `website` 等身份字段
- 移除靠 `pnpm --filter` 构建同仓库包的 `build:admin-vite` 与 `pre*` 钩子
- `uno.config.ts` 的 `filesystem` 扫描路径改指向 `node_modules`
- 补上 `.gitignore` 与 `README.md`（模板本身没有）

**workspace 模式**只改 `package.json` 的 `name` / `description` 和 `.env`，其余原样保留——留在仓库内的 app 本来就该复用 workspace 协议。

```bash
# 独立工程（默认）
pnpm sa create-admin my-admin --target ~/projects/my-admin

# 仓库内新增 app，保留 workspace:/catalog: 协议
pnpm sa create-admin my-admin --workspace

# 指定目录
pnpm sa create-admin my-admin --target apps/admin-template

# 覆盖已存在目录
pnpm sa create-admin my-admin --force

# 自定义应用标题和描述
pnpm sa create-admin my-admin --title "My Admin" --description "Internal admin console"

# 生成后立即安装
pnpm sa create-admin my-admin --install
```

> **注意**：物化只负责把协议翻译成 registry 能识别的版本号，不保证这些包真的发布过。生成时若发现依赖里有
> `private: true` 的 workspace 包，命令会显式告警。admin shell（`@skyroc/web-admin-shell`）不受此限——它不进
> 依赖列表，源码会被直接复制进生成项目的 `src/framework`。

#### 选项

| 选项 | 说明 |
| --- | --- |
| `--target <dir>` | 目标目录，默认 `apps/<name>` |
| `--title <title>` | 应用标题，写入 `VITE_APP_TITLE`，默认由包名推导 |
| `--description <desc>` | 应用描述，写入 `package.json` 与 `VITE_APP_DESC` |
| `--force` | 目标目录非空时先删除再生成 |
| `--install` | 生成后执行 `pnpm install` |
| `--workspace` | 保留 monorepo 协议，供仓库内使用 |

### `sa sync-admin-template`

从 `apps/admin` 生成 `packages/@core/scripts/templates/admin`。`apps/admin` 是唯一源码，模板目录是发布快照，不手工维护。

同步产出三样东西：

1. `templates/admin-root/` + `templates/admin-root.manifest.json` —— 仓库根级工程文件快照。包含 Git 已跟踪的根级点文件/点目录，以及 `AGENTS.md`、`CLAUDE.md`、`skills-lock.json`；排除 `.git`、缓存、构建产物、本机文件，以及 admin 模板已经自带的 `.oxlintrc.json`。manifest 用于还原 npm 固定忽略的 `.npmignore`、`.npmrc` 等点文件及符号链接。
2. `templates/admin/` —— `apps/admin` 的逐字节镜像。跳过 `node_modules`、`dist`、`.turbo`、`.tanstack`、`coverage`、`.DS_Store`、本地 `.env.*.local` 和 `src/features/router/routeTree.gen.ts`，再根据模板自身的 `src/pages` 重新生成 `routeTree.gen.ts`。
3. `templates/admin.meta.json` —— 物化元数据。**只有在 monorepo 内才解析得出**，所以必须在同步期算好：解析后的依赖版本、展平后的 tsconfig 与 oxlint 配置、根级 `overrides`、以及未发布的 workspace 包清单。`create-admin` 的 standalone 模式只读这份文件做替换，不需要 monorepo 在场。

`create-admin` 会先复制 `admin-root`，再覆盖 `admin`。因此协作说明、编辑器配置、skills 和格式化配置会进入新项目；`package.json`、`README.md`、`.oxlintrc.json` 等应用已有文件只取 admin 模板版本。

元数据放在 `templates/admin/` **外层**，这样快照目录仍是纯镜像，逐字节比对不需要为 sidecar 开特例。

```bash
# 同步模板 + 元数据
pnpm sa sync-admin-template

# 只检查是否落后（模板与元数据都会比对），适合 CI
pnpm sa sync-admin-template --check
```

> 本命令依赖 `@tanstack/router-generator` 生成路由树，该包是 devDependency 且按需加载——它只服务于仓库内的同步流程，
> 不该让所有安装了 `@skyroc/scripts` 的用户都背上这个重依赖。在仓库外执行会得到一条明确的报错。

### `sa git-commit`

交互式引导完成一次符合 [Conventional Commits](https://conventionalcommits.org) 规范的 git 提交。

**交互流程：**

1. 选择提交类型（type）
2. 选择提交范围（scope）
3. 输入描述（description）
   - 描述以 `!` 开头时，自动标记为破坏性变更（`breaking change`）

**生成格式：**

```
<type>(<scope>): <description>
# 例：feat(components): add new Button component
# 破坏性变更：feat(api)!: remove deprecated endpoints
```

**支持的提交类型：**

| 类型 | 说明 |
| --- | --- |
| `feat` | 新功能 |
| `feat-wip` | 开发中的功能（partial commit） |
| `fix` | Bug 修复 |
| `docs` | 仅文档变更 |
| `typo` | 代码或文档中的拼写/笔误修正 |
| `style` | 不影响代码含义的格式调整 |
| `refactor` | 既不修复 bug 也不添加功能的代码重构 |
| `perf` | 性能优化 |
| `optimize` | 代码质量优化 |
| `test` | 测试相关 |
| `build` | 构建系统或外部依赖变更 |
| `ci` | CI 配置变更 |
| `chore` | 其他杂项变更 |
| `revert` | 回退先前提交 |

**支持的提交范围：**

| 范围 | 说明 |
| --- | --- |
| `projects` | 整体项目 |
| `packages` | 子包 |
| `components` | 组件 |
| `hooks` | Hook 函数 |
| `utils` | 工具函数 |
| `types` | TypeScript 类型声明 |
| `styles` | 样式 |
| `deps` | 项目依赖 |
| `release` | 版本发布 |
| `other` | 其他 |

---

### `sa git-commit-verify`

读取本次提交的信息，校验其是否符合 Conventional Commits 规范：

```
<type>(<scope>)?(!)?: <description>
```

校验规则：

- **首尾锚定**——只校验提交信息的第一行，且必须整行匹配。`随便写点什么 xx: yy` 不放行。
- **type 走白名单**——只接受上表列出的 14 个类型，`banana: x` 不放行；大小写敏感，`FEAT:` 不放行。
- **描述不能为空**——`feat(x): ` 不放行。

提交信息文件通过 `git rev-parse --git-path COMMIT_EDITMSG` 定位，因此在 git worktree 下同样可用（worktree 里的 `.git` 是文件而不是目录，手工拼 `<toplevel>/.git/...` 会拿到一个不存在的路径）。

不符合则抛出错误并终止提交。

**在 git hook 中使用：**

```bash
# .husky/commit-msg
pnpm sa git-commit-verify
```

以下格式的提交信息会被自动放行（不校验）：

- Merge Pull Request
- Merge branch / tag / remote-tracking branch
- Revert 提交
- amend / fixup / squash 操作
- 自动合并提交

---

### `sa changelog`

基于 git tag 差异，调用 `@soybeanjs/changelog` 生成或追加 `CHANGELOG.md`。

```bash
# 生成最新 tag 以来的变更
pnpm sa changelog

# 基于所有历史 tag 重新生成完整 changelog
pnpm sa changelog --total
```

---

### `sa release`

一键完成完整发版流程：

```
1. 交互式选择新版本号（bumpp）
2. 更新所有 package.json 中的 version 字段（包含子包，排除 node_modules）
3. 执行 --execute 指定的命令（默认：pnpm sa changelog）
4. 创建 git commit：chore(projects): release v<version>
5. 打 git tag：v<version>
6. push commit + tag（可通过 --push false 跳过）
```

```bash
# 标准发版（自动 push）
pnpm sa release

# 发版但不 push（本地验证后手动 push）
pnpm sa release --push false

# 发版后执行自定义命令（替换默认的 changelog 生成）
pnpm sa release --execute "pnpm build && pnpm sa changelog"
```

---

### `sa cleanup`

批量删除项目中匹配 glob 模式的目录或文件，适合在切换分支或提交 PR 前彻底清理构建产物。

```bash
# 使用默认清理规则
pnpm sa cleanup

# 仅清理指定目录（覆盖默认规则）
pnpm sa cleanup --cleanupDir "**/dist,**/node_modules"
```

**默认清理规则：**

```
**/dist
**/package-lock.json
**/yarn.lock
**/pnpm-lock.yaml
**/node_modules
```

---

### `sa update-pkg`

调用 `npm-check-updates` 检测并升级 `package.json` 依赖版本。

```bash
# 使用默认参数（--deep -u，递归更新所有子包并写入 package.json）
pnpm sa update-pkg
```

更新完成后需重新执行 `pnpm install` 使变更生效：

```bash
pnpm sa update-pkg && pnpm install
```

## 配置

`@skyroc/scripts` 通过 [c12](https://github.com/unjs/c12) 加载配置，支持以下配置文件（位于项目根目录）：

```
skyroc.config.ts
skyroc.config.js
skyroc.config.mjs
package.json 中的 "skyroc" 字段
```

历史遗留的 `soybean.config.*` / `package.json` 的 `"soybean"` 字段仍然会被读取，`skyroc.*` 覆盖在它之上。新项目请直接用 `skyroc.*`。

### 配置项

```ts
interface CliOption {
  /**
   * 项目根目录
   * @default process.cwd()
   */
  cwd: string;

  /**
   * cleanup 命令的清理目录 glob 模式列表
   * 语法参考：https://github.com/isaacs/minimatch
   * @default ["**/dist", "**/package-lock.json", "**/yarn.lock", "**/pnpm-lock.yaml", "**/node_modules"]
   */
  cleanupDirs: string[];

  /**
   * update-pkg 命令传给 npm-check-updates 的参数
   * @default ['--deep', '-u']
   */
  ncuCommandArgs: string[];

  /**
   * changelog 命令的配置项
   * 参考：https://github.com/soybeanjs/changelog
   */
  changelogOptions: Partial<ChangelogOption>;

  /**
   * git-commit-verify 放行的提交信息正则列表
   * 匹配任意一项则跳过校验
   */
  gitCommitVerifyIgnores: RegExp[];
}
```

### 配置示例

```ts
// skyroc.config.ts
import { defineConfig } from '@skyroc/scripts';

export default defineConfig({
  cleanupDirs: ['**/dist', '**/node_modules'],
  ncuCommandArgs: ['--deep', '-u', '--reject', 'react'],
  changelogOptions: {
    // 参考 @soybeanjs/changelog 文档
  },
  gitCommitVerifyIgnores: [
    /^WIP:/
  ]
});
```

## 在 Git Hooks 中集成

推荐搭配 [husky](https://github.com/typicode/husky) 使用：

```bash
# .husky/commit-msg
pnpm sa git-commit-verify
```

```json
// package.json
{
  "scripts": {
    "commit": "sa git-commit",
    "prepare": "husky install"
  }
}
```

## 语言支持

`--lang` 选项控制交互界面语言，目前支持：

| 值 | 说明 |
| --- | --- |
| `en-us` | 英文（默认） |
| `zh-cn` | 简体中文 |

```bash
pnpm sa git-commit --lang zh-cn
```

## 测试

纯函数（依赖协议解析、配置展平、glob 匹配、包名与 env 改写、提交信息正则）都有单测覆盖：

```bash
pnpm --filter @skyroc/scripts test
pnpm --filter @skyroc/scripts test:coverage
```

## 架构

```
packages/@core/scripts/
├── bin.ts                    # CLI 入口（开发时通过 tsx 执行）
├── src/
│   ├── cli.ts                # setupCli()：注册命令、解析 argv、统一收口错误
│   ├── index.ts              # 库入口：defineConfig() 与各命令的具名导出
│   ├── commands/
│   │   ├── changelog.ts      # genChangelog()
│   │   ├── cleanup.ts        # cleanup()
│   │   ├── create-admin.ts   # createAdminTemplate()
│   │   ├── git-commit.ts     # gitCommit() / gitCommitVerify()
│   │   ├── release.ts        # release()
│   │   ├── sync-admin-template.ts # syncAdminTemplate()
│   │   └── update-pkg.ts     # updatePkg()
│   ├── template/
│   │   ├── meta.ts           # TemplateMeta 类型 + sidecar 读写（两端共享）
│   │   ├── resolve.ts        # monorepo 侧：解析 workspace:/catalog:/extends 链
│   │   └── materialize.ts    # 消费侧：把 meta 套用到生成目录
│   ├── config/
│   │   └── index.ts          # loadCliOptions()：c12 加载配置 + 默认值合并
│   ├── locales/
│   │   └── index.ts          # 多语言文本（en-us / zh-cn）
│   ├── shared/
│   │   └── index.ts          # execCommand() / getPackageRoot() / getWorkspaceRoot()
│   └── types/
│       └── index.ts          # CliOption 类型定义
├── __tests__/                # vitest 单测（纯函数）
├── templates/
│   ├── admin/                # admin app 模板（apps/admin 的逐字节快照）
│   └── admin.meta.json       # 物化元数据（同步期生成）
└── dist/
    ├── cli.mjs               # CLI 构建产物（bin 指向它）
    └── index.mjs             # 库构建产物
```

**入口拆分**：`src/index.ts` 是纯库入口，不会有副作用；CLI 的自启动逻辑独立在 `src/cli.ts`。这样 `import { defineConfig } from '@skyroc/scripts'` 不会顺带把 CLI 跑起来。

**依赖说明：**

| 依赖 | 用途 |
| --- | --- |
| `cac` | CLI 框架，命令/选项注册与解析 |
| `bumpp` | 交互式版本号升级 |
| `@soybeanjs/changelog` | Changelog 生成 |
| `enquirer` | 终端交互式 prompt |
| `c12` | 配置文件加载（支持多种格式） |
| `confbox` | 解析 `pnpm-workspace.yaml`，读取 catalogs 与 overrides |
| `execa` | 跨平台子进程执行 |
| `npm-check-updates` | 依赖版本检测与更新 |
| `kolorist` | 终端颜色输出 |
| `rimraf` | 跨平台递归删除（`sa cleanup`） |

| devDependency | 用途 |
| --- | --- |
| `@tanstack/router-generator` | 仅 `sync-admin-template` 生成路由树时按需加载，不进 dependencies |

## 设计原则

- **零侵入** — 配置文件可选，合理的默认值覆盖大多数场景
- **交互式优先** — 复杂操作（发版、提交）引导式完成，不靠记忆
- **可扩展** — 通过 `skyroc.config.ts` 覆盖任意默认行为
- **跨平台** — execa + rimraf，Windows / macOS / Linux 均可使用
- **解析与生成分离** — 只有 monorepo 内才解析得出的东西（依赖协议、extends 链），一律在同步期算好落成元数据；生成期只做替换，不假设 monorepo 在场
- **不静默降级** — 依赖解析不出来就报错而不是产出半成品；模板漂移、私有包装不上都会显式告警
