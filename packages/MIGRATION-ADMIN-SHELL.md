# 迁移方案：底座发 npm + shell 零包化

状态：**仓库侧已执行**（2026-08-26），执行记录见文末；唯一未做的是 §3.2 的 npm 发布——
那需要 npm 账号权限，由维护者手动执行。撰写 2026-08-26，第二版（第一版是「8→3 个包」，已被本版取代）。

相关：[`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`PUBLISHING.md`](./PUBLISHING.md)

## 1. 目标

让 `sa create-admin` 生成的项目满足：

- `pnpm install && pnpm dev` 直接能跑，消费者不需要读任何 `@skyroc` 包的文档
- 后台 shell 的代码在项目里、可随意改
- 仓库内仍只维护一份 shell 源码，三个 app 共用

## 2. 为什么分成两层

`packages/web` 下的东西不是一种性质，混在一起谈才会觉得「拆不拆都没区别」：

| | admin shell | UI / 工具底座 |
| --- | --- | --- |
| 内容 | `admin-layouts` `admin-theme` `admin-i18n` `admin-notification` `admin-runtime` `admin-styles` | `web-ui` `web-ui-antd` `web-ui-compose` `utils` `hooks` `color` `form` `core-state`，以及 app 直接用的 `axios` `service` `logger` `types` `uno-config` |
| 行数 | 11,648 | 42,634（前 8 个）|
| 通用性 | 绑死 admin 形态 | 与 admin 无关 |
| 消费者会改吗 | **会**，这就是他要的东西 | 不会，当黑盒用 |
| npm 现状 | 一个都没发过 | `web-ui` / `form` 已发布 |
| 结论 | **内联进生成项目** | **发 npm** |

这就是 shadcn 的模型：组件复制进你的项目（你要改），radix-ui / tailwind 仍是 npm
依赖（你不改）。

**为什么不能只把 shell 写回 `apps/admin`**：shell 的传递依赖闭包里还有 8 个包、
42,634 行，其中 `core-state` / `web-ui-antd` / `web-ui-compose` 从未发布。写回去之后
生成的项目照样装不上，同时还给 `admin-example` 和 `ruoyi-plus-fast` 各造了一份
11,648 行的副本——而 `ruoyi-plus-fast` 的 `src/bootstrap.tsx` 与 `apps/admin` 的
**逐字节相同**，它 33k 行、重度定制了 `features/`，却从没动过 shell。

## 3. 第一层：底座补发 npm

### 3.1 先修一个已经存在的问题

`@skyroc/web-ui@0.1.3` 和 `@skyroc/form@0.0.2` 已在 npm 上，**但发布内容和当前源码
不是一回事**：

```text
npm 上的 web-ui@0.1.3 依赖：@skyroc/ui-types@0.1.0  @skyroc/color@2.5.0
                            @skyroc/utils@2.0.2     @skyroc/form@0.0.2
本地的 web-ui@0.1.3 依赖：  @skyroc/color  @skyroc/form  @skyroc/utils（workspace:*）
```

`@skyroc/ui-types` 和 `@skyroc/type-utils` 是提交 `a1b551b`（合并两个纯类型包）里
删掉的包。npm 上那两个包还在，所以旧版本仍能装，但**版本号已被占用且内容不同**。

因此这两个包必须**升版本号**再发，不能原地重发。

### 3.2 要发的是 14 个，不是 8 个

生成的项目除了 shell 的依赖闭包，还**直接**用 `axios` / `service` / `logger` /
`types` 这几个跨端内核包，以及 `@skyroc/uno-config` 和 CLI 自己（`@skyroc/scripts`）。
以 `admin.meta.json` 的实际依赖列表为准（扣掉会被内联的 admin-*）：

| 层 | 包 | 本地版本 | 行数 | 动作 |
| --- | --- | --- | --- | --- |
| 0 | `@skyroc/utils` | 4.0.0 | 3,540 | 补发（npm 停在 2.0.2）|
| 0 | `@skyroc/color` | 2.6.0 | 3,392 | 补发（npm 停在 2.5.0）|
| 0 | `@skyroc/hooks` | 1.0.0 | 606 | 补发（npm 停在 0.2.0）|
| 0 | `@skyroc/core-state` | 1.0.0 | 430 | **首发** |
| 0 | `@skyroc/types` | 1.0.0 | 1,207 | **首发** |
| 0 | `@skyroc/logger` | 1.0.0 | 1,318 | **首发** |
| 0 | `@skyroc/uno-config` | 1.0.0 | 522 | **首发** |
| 0 | `@skyroc/scripts` | 2.5.0 | 1,596 | **首发**（CLI 自己）|
| 1 | `@skyroc/axios` | 2.2.0 | 534 | **首发** |
| 1 | `@skyroc/form` | → **0.0.3** | 4,966 | 升版本（0.0.2 已被占用，见 3.1）|
| 1 | `@skyroc/web-ui-compose` | 0.1.0 | 1,934 | **首发** |
| 2 | `@skyroc/service` | 1.0.0 | 721 | **首发**（依赖 axios）|
| 2 | `@skyroc/web-ui` | → **0.1.4** | 27,293 | 升版本（0.1.3 已被占用，见 3.1）|
| 2 | `@skyroc/web-ui-antd` | 0.1.0 | 473 | **首发**（依赖 web-ui-compose）|

**共 14 次发布**：9 个首发、3 个补发、2 个升版本。
`@skyroc/tailwind-plugin@0.0.1` 已是最新，不用动。

> 本节第一版写的是「8 次」——那只追了 shell 的依赖闭包，漏了 app 直接引用的
> `axios` / `service` / `logger` / `types` / `uno-config` / `scripts`。以本表为准。

### 3.3 还有两个包要单独定

`@skyroc/web-admin-vite`（1,150 行，21 个构建期依赖）和
`@skyroc/web-admin-devtools`（262 行，4 个 dev-only 依赖）不属于 shell，
但生成的项目要用它们。两种处置：

- **也发 npm**：总数变成 16 次发布。生成项目的 `vite.config.ts` 保持现在这样十几行
- **也内联**：总数仍是 14 次。用户能直接改构建配置，但 21 个构建期依赖要写进生成
  项目的 `devDependencies`，`vite.config.ts` 会展开成一大坨

我的倾向是**发 npm**：构建预设属于「消费者不改」的那一类，和 `@vitejs/plugin-react`
是一个性质；真要改的人可以自己 eject。这与第 2 节的分层标准一致。

### 3.4 这一层不动结构

底座这些包保持现在的形态（`package.json` / `tsdown` / `publishConfig` 都留着），
本方案不碰它们的目录结构，只补版本和发布。

## 4. 第二层：shell 零包化

### 4.1 形态

`packages/web/admin/` 变成一个**普通源码目录，没有 `package.json`**：

```text
packages/web/admin/          # 无 package.json / tsconfig / tsdown / vitest
├── layouts/       ← admin-layouts        6,985 行
├── theme/         ← admin-theme          2,889 行
├── i18n/          ← admin-i18n             454 行
├── notification/  ← admin-notification   1,030 行
├── runtime/       ← admin-runtime          290 行
├── styles/        ← admin-styles          3 个 CSS
└── __tests__/     ← 四个包的测试合并      23 个测试文件
```

通过别名引用，两侧映射不同但**别名本身相同**：

| 环境 | `@shell/*` 指向 |
| --- | --- |
| monorepo | `packages/web/admin/*` |
| 生成的项目 | `src/framework/*` |

**这是本方案的关键**：shell 源码在 monorepo 和生成项目里**字节相同**，
`sa create-admin` 只需复制目录，**不需要改写任何 import**。第一版方案里风险最高的
那块（CLI 里做 `@skyroc/web-admin/theme` → `@/framework/theme` 的批量改写）直接消失。

### 4.2 顺带消掉的东西

- 6 份 `package.json` / `tsconfig.json` / `.oxlintrc.json`
- 4 份 `tsdown.config.ts` + `dist/`（shell 不再需要构建，由 app 的 Vite 直接编译）
- 3 份 `vitest.config.ts` + `vitest.setup.ts`——根 `vitest.config.ts` 已经在 glob
  `packages/**/__tests__/**/*.test.ts`，23 个测试文件挪过去就自动被发现
- peerDependencies 取交集的坑（第一版方案 5.4 那条：`react` 三种写法要收敛成
  `^19.0.0`）——没有 `package.json` 就没有这个问题
- 6 个版本号

### 4.3 代价

**a) shell 的外部依赖要由 app 声明。** shell 共需 22 个外部依赖，三个 app 目前
已经声明了绝大部分，缺口很小：

| app | 需要补进 `dependencies` |
| --- | --- |
| `apps/admin` | `@better-scroll/core`、`@iconify/react`（现在在 devDeps）|
| `apps/admin-example` | `@iconify/react`（现在在 devDeps）|
| `apps/ruoyi-plus-fast` | `@better-scroll/core`、`@iconify/react`（现在在 devDeps）|

这其实更诚实——生成的项目本来就得把这些写进自己的 `package.json`。

**b) 没有包边界，依赖方向不再由模块解析强制。** 今天 `admin-layouts` 不可能 import
`apps/admin/src`；改成别名目录后就可能了。用 oxlint 的 `no-restricted-imports` 兜住：
`packages/web/admin/**` 禁止 import `@/*` 和 `~/*`。

## 5. 执行步骤

每步一个 commit，可独立验证和回滚。

### Step 1 — 底座补发 14 个包

按 3.2 的顺序发。**先做这一步**，因为它和 shell 改造完全独立，做完就能立刻验证
「独立模式装得上」这件事有没有变好。

验证：`npm view` 逐个确认版本，然后按 `PUBLISHING.md` 的复核命令重跑一遍闭包检查。

### Step 2 — shell 六合一，去掉包形态

1. `git mv` 六个包的 `src/*` 到 `packages/web/admin/<子目录>/`（保留 rename 历史）
2. 23 个测试文件归到 `packages/web/admin/__tests__/`，改相对路径
3. 删 6 份 `package.json` / `tsconfig.json` / `tsdown.config.ts` / `vitest.config.ts`
   / `.oxlintrc.json` / `dist/`
4. 三个 app + 模板的 `tsconfig.json` 加 `"@shell/*": ["../../packages/web/admin/*"]`
5. 三个 app 的 `package.json` 补 4.3(a) 表里的依赖
6. 全仓库把 200 处 `@skyroc/web-admin-*` import 改成 `@shell/*`
7. 加 oxlint 的 `no-restricted-imports` 规则

验证：三个 app 的 `typecheck` + `pnpm vitest run`（根配置）+ `apps/admin` 起 dev。

### Step 3 — admin-vite 支持 `@shell` 别名

`packages/web/admin-vite/src/config.ts:293` 的 `createResolveOptions` 现在接
`{ dedupeReact, rootAlias, srcAlias }`，加一个 `shellAlias`：

```ts
// monorepo:      shellAlias: '../../packages/web/admin'
// 生成的项目:     shellAlias: 'src/framework'（默认值）
if (shellAlias !== false) alias['@shell'] = resolve(root, shellAlias);
```

`admin-vite` 本来就是管别名的地方，这是它职责内的小改动。

### Step 4 — CLI 复制 shell 源码

| 文件 | 改什么 |
| --- | --- |
| `commands/sync-admin-template.ts:83` | `copyAdminSource` 增加一路：`packages/web/admin/` → 模板的 `src/framework/` |
| `template/materialize.ts` | 生成项目的 `tsconfig.json` 把 `@shell/*` 指向 `./src/framework/*`；`vite.config.ts` 不用改（用 `shellAlias` 默认值）|
| `template/resolve.ts:70` | 物化时跳过 `@skyroc/web-admin-*`（已经不存在了）；其余底座包照常写 `^version` |
| `commands/create-admin.ts:163` | warning 从「检查 private 标记」改成「检查全部底座包在 registry 上是否可解析」|

**没有 import 改写**——这是 4.1 换来的。

验证：`sa create-admin test-app --target /tmp/x`，在生成目录跑
`pnpm install && pnpm build`。

### Step 5 — 收尾

- `internal/tsconfig/web-app.json` 里的 `@skyroc/web-admin-theme/types` 改成
  `@shell/theme/types/theme.d.ts`（见 6.1）
- `ARCHITECTURE.md` 的目录分层、命名表更新
- `README.md` 包地图删掉 admin-* 那几行
- `PUBLISHING.md` 重新采集

## 6. 易碎点

按危险程度排序。这几处都是**静默失败**，不会有明显报错。

### 6.1 全局 `Theme` 命名空间（最危险）

`admin-theme/src/types/theme.d.ts` 用 `declare global { namespace Theme {} }` 注册
全局类型，靠 tsconfig 的 `types` 数组生效，而这个引用**硬编码在共享基座**：

```jsonc
// internal/tsconfig/web-app.json
"types": [..., "@skyroc/web-admin-theme/types"]
```

`packages/web/admin-layouts/tsconfig.json:9` 也有一份。改成别名目录后，`types` 数组
不能再写包名——要么改成相对路径，要么把 `theme.d.ts` 移进 app 的 `include` 范围。
漏改的表现是**几百个 `Theme.XXX` 静默变成报「找不到命名空间」**，而且生成项目里
同样会踩（`admin.meta.json:740` 是这条链路的展平版本）。

**建议**：Step 2 做完立刻单独验证这一条——`tsc --noEmit` 三个 app 全过才算数。

### 6.2 TanStack Router 模块增强

`admin-layouts/src/types/router.d.ts` 用 `import type {} from '@tanstack/react-router'`
做模块增强。它必须仍被 TypeScript 加载，`include` 范围变了就失效，同样是静默降级。

### 6.3 非 TS 资源

shell 不再走 tsdown 之后，这些资源由 app 的 Vite 直接处理，反而更简单——但要确认
Vite 的 `assetsInclude` / JSON 导入配置覆盖到：

| 资源 | 数量 |
| --- | --- |
| i18n 语言包 `i18n/langs/{zh-cn,en-us}/*.json` | 22 |
| theme 预设 `theme/presets/*.json` | 5 |
| CSS Modules `layouts/materials/libs/*/index.module.css` | 2（+2 个 `.d.ts`）|
| 全局样式 `styles/*.css` | 3 |
| 通知样式 `notification/notification.css` | 1 |

### 6.4 import 改写量

| 原包 | import 点 |
| --- | --- |
| `@skyroc/web-admin-theme` | 95 |
| `@skyroc/web-admin-layouts` | 49 |
| `@skyroc/web-admin-i18n` | 27 |
| `@skyroc/web-admin-notification` | 13 |
| `@skyroc/web-admin-runtime` | 12 |
| `@skyroc/web-admin-styles` | 4 |
| **合计** | **200** |

`admin-devtools`（16 处）和 `admin-vite`（5 处）保持包形态不动——前者是 dev-only
依赖，后者有 21 个构建期依赖，都不该混进运行时源码目录。

六个包之间的内部依赖是干净的 DAG，没有环：

```text
layouts ──28 个文件──> theme
        ── 1 个文件──> i18n
（notification / runtime / styles 互不引用）
```

## 7. 工作量与风险

| 步骤 | 工作量 | 风险 |
| --- | --- | --- |
| Step 1 发 8 个包 | 中，一次性 | 低，但版本号发错不可撤销（见 3.1）|
| Step 2 shell 零包化 | 中，200 处机械改写 | **中**——6.1 的全局类型是静默失败点 |
| Step 3 admin-vite 别名 | 小 | 低 |
| Step 4 CLI | 中（比第一版小，没有 import 改写）| **高**——没有端到端测试 |
| Step 5 收尾 | 小 | 低 |

**Step 4 的前置建议**：先给 `sa create-admin` 补一个端到端冒烟测试（生成 →
`pnpm install` → `build`）。独立模式正是因为缺这个测试，才会在 20 个依赖装不上的
状态下静默存活到现在。

回滚：Step 1 发出去的包无法撤销，但多发几个版本没有害处。Step 2/3/5 单 commit 可
revert。Step 4 只影响生成流程，最坏情况是回到今天（独立模式不可用）。


---

## 执行记录（2026-08-26）

Step 2–5 已完成，代码全部落地。与上文方案的偏差如下，以偏差为准：

1. **shell 保留了一份最小 `package.json`**（`@skyroc/web-admin-shell`，`private: true`、
   无 `exports`），而不是「完全没有 package.json」。它只做两件事：给 pnpm 声明 shell
   源码的依赖（22 个运行时依赖归 shell 自己管，app 无需代为声明），给 turbo 提供
   lint / typecheck / test 任务。同理保留了一份 tsconfig / vitest.config / .oxlintrc。
   六份归一份，仍然消掉了 5 份重复配置和全部 tsdown / dist / 版本号。
2. **`@skyroc/types`（`packages/@core/types`）一并折进了 shell**（`admin/types/`）。
   它的内容是 `Api.*` / `App.*` 全局命名空间——连 `sys_client.client_id`、租户 id 都
   写死在里面，本来就是 admin 域类型而非通用底座。`apps/expo-templete` 自带一份
   `declare namespace Api`，不受影响。跨端内核的待发布清单因此从 §3.2 的 14 个减为
   **13 个**（去掉 `@skyroc/types`）。
3. **模板侧 shell 镜像放在 `templates/admin-shell/`**（与 `templates/admin/` 平级），
   由 `sa sync-admin-template` 同步、`--check` 一并校验——保住了
   「`templates/admin/` 是 `apps/admin` 逐字节镜像」的既有不变量。
   `sa create-admin` 独立模式把它复制进生成项目的 `src/framework/`；
   `--workspace` 模式不复制，共享 `packages/web/admin`。
4. **§4.3(a) 的 app 依赖补齐不需要了**：shell 的 manifest package.json 自己声明依赖，
   三个 app 只删了 7 条旧依赖、加了一条 `@skyroc/web-admin-shell: workspace:*`。
5. **`web-admin-vite` / `web-admin-devtools` 保持包形态**（§3.3 决策为「先不动」），
   生成项目继续从 registry 装它们。
6. **端到端冒烟测试已补**：`packages/@core/scripts/__tests__/create-admin-smoke.test.ts`，
   standalone / workspace 双模式生成 + 生成物不变量校验（含逐条 `@shell/*` import
   落点自查）。不含 `pnpm install`——那要等发布完成，装不上属于发布问题而非生成问题。
7. 顺手修复：根 `vitest.config.ts` 自定义 `exclude` 覆盖掉了 vitest 默认排除
   （node_modules 里的测试会被捞进来）；`theme/antd/AntdProvider.tsx` className
   双空格笔误（对应测试期望单空格）；layouts 测试 fixture 缺 `nickname` 字段；
   模板 favicon 接受了与 `apps/admin` 的同步（此前是违反镜像不变量的漂移）。

验证结果：shell 227/227 测试、typecheck、lint 全绿；三个 app typecheck 通过
（ruoyi 剩两个与 shell 无关的固有路由注册表错误）；`apps/admin` 生产构建通过；
`pnpm check:admin-template` 通过；scripts 包 59/59（含冒烟）。

### 剩余事项

- **§3.2 的发布**：13 个包（原表去掉 `@skyroc/types`）。发布前记得 `form` → 0.0.3、
  `web-ui` → 0.1.4（版本号已被旧内容占用，见 §3.1）。
- 独立模式生成的项目在发布完成前 `pnpm install` 仍会失败——冒烟测试的注释里也写了
  这一点。发布完成后建议手动跑一次「生成 → install → build」全链路。
- `docs/docs/content/docs/web/admin-layouts/`（84K）还是旧包名口径的文档站内容，
  需要按 `@shell/layouts` 的新用法重写，本次未动。


### 第二轮合并（同日）：`web-ui-compose` / `web-ui-antd` 并入 shell

复查后确认这两个包同样满足「复制进项目」而非「发包」的判据：

- 消费者全部在 admin 生态（3 个 app + shell + 模板），playground / docs / native 零引用；
- `@skyroc/web-ui`（shadcn，已发布）不依赖它们；
- `web-ui-compose` 名义上"antd-free"，实际 peers 里就有 `antd` / `i18next` /
  `@tanstack/react-query`——绑得和 shell 一样死。

已并入 `packages/web/admin/ui/{compose,antd}`，经 `@shell/ui/compose` /
`@shell/ui/antd` 引用；两个包目录删除，168 个文件的 import 已改写。
待发布清单从 13 减为 **11**（+ `web-ui` 升版 + `form` 升版 = 13 次发布，
composition 变了：compose / antd 出列，`web-admin-vite` / `devtools` 计入——
它们仍走 registry，不发布则独立模式装不上）。

验证：shell 260/260（25 个测试文件）、typecheck、lint 全绿；三个 app typecheck
通过；`apps/admin` 构建通过；`check:admin-template` 通过；scripts 冒烟 59/59。
