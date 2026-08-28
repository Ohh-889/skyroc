# Native UI Docs

[`@skyroc/native-ui`](../../packages/native/ui) 的文档站，基于 Next.js + [Fumadocs](https://fumadocs.dev) 构建。

与普通组件库文档不同的是，这里的示例不是截图或静态代码块：文档直接复用 [Native UI Playground](../../apps/native-ui-playground) 的 demo 源码，通过 `react-native-web` + Uniwind 在浏览器里跑真实的 React Native 组件，因此文档、playground 与组件实现始终是同一份代码。

## 启动

在仓库根目录安装依赖后运行：

```bash
pnpm --filter native-ui-docs dev
```

默认打开 http://localhost:3000。其他命令：

```bash
pnpm --filter native-ui-docs build        # 生产构建
pnpm --filter native-ui-docs start        # 运行构建产物
pnpm --filter native-ui-docs types:check  # next typegen + tsc --noEmit
pnpm --filter native-ui-docs lint         # oxlint
```

预览要读取 playground 与组件库源码，必须在本仓库内运行，不能单独把这个目录拷出去。

## 环境变量

全部可选，缺省时对应能力自动降级：

| 变量                         | 作用                                                                  |
| ---------------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | 站点地址，用于 OG / Twitter 卡片图的绝对路径                          |
| `NEXT_PUBLIC_PLAYGROUND_URL` | 设置后每个 Demo 会显示「在 playground 打开」入口（Expo Web 部署地址） |
| `OPENROUTER_API_KEY`         | AI 问答（`/api/chat`）所需，未设置时该功能不可用                      |
| `OPENROUTER_MODEL`           | AI 问答使用的模型，默认 `anthropic/claude-3.5-sonnet`                 |

## 目录职责

```text
content/docs/
├── meta.json                 # 顶层顺序：组件 / 概览
├── overview/                 # 介绍、快速开始、根布局、主题、依赖说明
└── components/               # 50 个组件文档，按 (general)/(input)/... 分组
app/
├── (home)/                   # 落地页
├── docs/[[...slug]]/page.tsx # 文档页；有对应 playground 路由时启用左右分栏
├── api/chat|search/          # AI 问答与全文搜索
├── llms.txt|llms-full.txt|llms.mdx/  # 面向模型的纯文本输出
└── og/docs/                  # OG 图片生成
components/
├── mdx.tsx                   # 注册 MDX 全局组件（Demo / PropsTable / TypeTable / UnionType）
├── demo/                     # 预览：源码读取、手机框、整页预览、RN 运行时
├── props-table.tsx           # 属性表
├── type-table.tsx            # 类型定义块与联合类型
└── type-registry.ts          # 跨页面类型链接注册表
lib/
├── source.ts                 # 内容源；getRootTabs 提供侧栏模块切换器
├── playground-demo.ts        # 文档 slug → playground 整页路由的解析
├── expo-router.tsx           # web 端 expo-router 替身
├── expo-vector-icons.tsx     # web 端图标替身（lucide-react）
└── skia-web.ts               # 按需加载 CanvasKit
```

## 内容组织

- 每个分区由 `meta.json` 的 `root: true` 标记，`getRootTabs()` 据此生成侧栏顶部的模块切换器。
- `components/` 下的括号目录 `(general)`、`(input)` 等只用于分组，不进入 URL；顺序由 `components/meta.json` 的 `pages` 控制，`---xxx---` 是分隔标题。
- 文档文件名即路由 slug，也是与 playground 整页路由的匹配键：`components/(general)/button.mdx` ↔ `apps/native-ui-playground/app/components/button.tsx`。两者同名时文档页自动变成左右分栏，右侧常驻整页真机预览（≥1280px 生效）。

## 写作约定

frontmatter 只需要 `title` 和 `description`：

```mdx
---
title: Button
description: 触发即时操作的按钮组件
---
```

可用的 MDX 组件：

- `<Demo src="@playground/button/ButtonBasic" />` —— 唯一的示例写法。`src` 必须以 `@playground/` 开头，映射到 `apps/native-ui-playground/src/demos/<path>.tsx`；服务端读源码渲染代码块，客户端动态 import 同一个模块渲染可交互预览。不接受任意路径，docs 侧不要另写示例文件。
- `<PropsTable data={[...]} />` —— 属性表，字段为 `name` / `description` / `type` / `default` / `required`。
- `<TypeTable />`、`<UnionType />` —— 类型定义块，会生成 `#type-xxx` 锚点。

类型名在正文与表格中会自动变成链接：当前页有定义就跳页内锚点，否则查 `components/type-registry.ts`；两者都没有则保持纯文本，不会产生 404。新增跨页引用的公共类型时记得在注册表补一行。

## 新增一篇组件文档

1. 在 playground 补齐 demo（`src/demos/<component>/*.tsx`）与整页路由（`app/components/<component>.tsx`），流程见 [playground README](../../apps/native-ui-playground/README.md)。
2. 在 `content/docs/components/(分类)/<component>.mdx` 写文档，文件名与 playground 路由名保持一致。
3. 用 `<Demo src="@playground/<component>/<DemoName>" />` 引用示例，不要复制粘贴代码。
4. 在对应分组的 `meta.json` 中登记页面顺序。
5. 组件对外类型若会被别的页面引用，在 `type-registry.ts` 注册。

仓库内的 `native-component-doc` skill 会按上述规范生成或更新文档。

## 机器可读输出

- `/llms.txt`、`/llms-full.txt`：站点索引与全文。
- `/docs/<path>.md`，或对 `/docs/<path>` 发送偏好 Markdown 的 `Accept` 头（见 `proxy.ts`）：返回单页 Markdown。
- 文档页顶部的复制按钮与 View Options 使用的就是这套地址。

## Web 兼容适配

把 React Native 组件跑在浏览器里需要一批非常规配置，改动前请先读 `next.config.mjs` 里的成段注释，它记录了每条配置对应的具体报错：

- `transpilePackages`：RN 依赖普遍直接发未编译的 JSX / TS 源码，且只有列进来才会走 `.web.*` 实现。**新增 RN 依赖时必须同步这里**，与 `packages/native/ui` 的 `peerDependencies`、playground 的 `dependencies` 对齐。
- `resolveAlias`：`expo-router` 与 `@expo/vector-icons` 在 web 上换成 `lib/` 下的本地替身。
- `resolveExtensions`：`.web.*` 优先，且必须原样抄全默认列表（Turbopack 是整体替换）。
- `reactStrictMode: false`：`react-native-web` 的 Modal 在 StrictMode 双调用 effect 下会丢失挂载节点，只影响 dev 预览。
- 预览一律 `ssr: false`：Uniwind 解析 `accent-*` 等类名依赖真实 DOM 探针，服务端渲染会得到错误颜色且 React 不会修正。
- Skia 系组件先挂 CanvasKit wasm 再 import demo，见 `lib/skia-web.ts`。

## 相关文档

- 组件库安装、主题与宿主接入：[`packages/native/ui/README.md`](../../packages/native/ui/README.md)
- 示例编写与真机验证：[`apps/native-ui-playground/README.md`](../../apps/native-ui-playground/README.md)

## 部署（Cloudflare Workers）

通过 [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) 打包成 Worker，
配置在 [`wrangler.jsonc`](./wrangler.jsonc)（Worker 名 `soybean-react-native-ui-docs`、静态资源绑定、R2 增量缓存桶、日志）
与 [`open-next.config.ts`](./open-next.config.ts)（使用 R2 作为增量缓存），与 `docs` / `web-ui-docs` 两个站点保持同一套配置。

```bash
pnpm preview    # 本地以 workerd 运行，最接近线上
pnpm deploy     # 构建并发布
pnpm upload     # 只上传新版本，不切流量
pnpm cf-typegen # 由 wrangler.jsonc 生成 CloudflareEnv 类型
```

前三个命令都会先跑 `worker:build`（即 `opennextjs-cloudflare build`），它内部再去调 `pnpm build`。

`build` 脚本过去要先构建 `@skyroc/ui-types` 与 `@skyroc/type-utils`——这两个包的 `main` / `types`
指向 `dist/`，CI 上 `pnpm install` 之后 dist 是空的，缺这一步类型检查会报 `TS2307`。这两个包已分别
并入 `@skyroc/tailwind-plugin/ui` 与 `@skyroc/utils/type`，而它们和其余 `@skyroc/*` 一样开发态直接
指向 `src/`，所以这个预构建步骤已经删除。

`/api/chat` 用到的 `OPENROUTER_API_KEY` 不会被打进产物，需要单独配置：

```bash
npx wrangler secret put OPENROUTER_API_KEY   # 线上
echo 'OPENROUTER_API_KEY=...' > .dev.vars    # pnpm preview 本地（.env.local 只对 next dev 生效）
```

几个容易踩的点：

- **`middleware.ts` 不要改名成 `proxy.ts`。** Next 16 推荐 `proxy.ts`，但它恒定运行在 Node.js runtime，
  而 `@opennextjs/cloudflare` 目前只支持 Edge middleware，改名会让 `pnpm deploy` 在打包阶段直接失败。
- **`next.config.mjs` 里的 `initOpenNextCloudflareForDev()`** 让 `next dev` 也能拿到 Cloudflare 绑定（R2 等），
  不要在精简配置时删掉。
- **`NEXT_PUBLIC_SITE_URL`** 是构建期内联的（用于 `metadataBase` 与 OG 图），要在跑 `pnpm deploy` 的环境里设好，
  运行时再往 wrangler 里加 vars 是不生效的。

## 脚本

| 命令                | 作用                                         |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | 启动开发服务器                               |
| `pnpm build`        | 构建依赖包 + Next.js 生产构建                |
| `pnpm start`        | 以 Node 运行生产构建                         |
| `pnpm lint`         | oxlint                                       |
| `pnpm types:check`  | 构建依赖包 + `next typegen` + `tsc --noEmit` |
| `pnpm worker:build` | 产出 `.open-next/`                           |
| `pnpm preview`      | 本地 workerd 预览                            |
| `pnpm deploy`       | 发布到 Cloudflare                            |
| `pnpm upload`       | 上传新版本但不切流量                         |
| `pnpm cf-typegen`   | 生成 `cloudflare-env.d.ts`                   |
