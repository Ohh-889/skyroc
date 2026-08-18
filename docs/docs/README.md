# Skyroc Docs

Skyroc 的**主文档门户**，基于 [Fumadocs](https://fumadocs.dev) + Next.js 16 构建，部署在 Cloudflare Workers 上。

站点合并了原先分散的 `project-docs` / `admin-docs` / `core-docs` / `web-kit-docs` 四个文档站，
共约 134 篇内容、7 个顶级分区，共用同一次构建与同一份搜索索引。
`web-ui-docs`、`native-ui-docs` 仍是独立的组件 Playground 应用，只与本站做导航互通。

## 快速开始

```bash
# 仓库根目录
pnpm install
pnpm --filter docs dev

# 或在本目录
pnpm dev
```

打开 http://localhost:3000 查看首页，http://localhost:3000/docs 进入文档。

## 目录结构

| 路径                 | 说明                                                        |
| -------------------- | ----------------------------------------------------------- |
| `content/docs/`      | 全部 MDX 正文，按 7 个顶级分区分目录                        |
| `app/(home)/`        | 门户首页（Hero、阅读路径、能力矩阵、文档地图）与 header      |
| `app/docs/`          | 文档布局（`GlassLayout`）与 `[[...slug]]` 页面               |
| `app/api/search/`    | 搜索接口，由 `createFromSource(source)` 生成                 |
| `app/og/docs/`       | 每篇文档的 OG 封面图（构建期静态生成）                       |
| `app/llms*.txt`、`app/llms.mdx/` | 面向 LLM 的纯文本 / Markdown 出口                |
| `lib/source.ts`      | 内容源适配层，`loader()` 提供访问内容的统一接口              |
| `lib/shared.ts`      | 站点常量：站名、文档路由前缀、OG 与 Markdown 路由、Git 仓库信息 |
| `components/mdx.tsx` | MDX 组件映射                                                 |
| `middleware.ts`      | `.md` 后缀与 `Accept` 协商，把文档页重写到 Markdown 出口     |
| `CONTENT-PLAN.md`    | 内容规划与迁移清单：分区划分、篇目归属、重定向表             |

## 内容组织

侧边栏不是一棵树，而是**七棵独立的树**——每个分区目录的 `meta.json` 里写 `"root": true`，
`GlassLayout` 会自动把它们变成顶部分区切换器。

| 分区                | URL 前缀          | 读者意图                             |
| ------------------- | ----------------- | ------------------------------------ |
| 指南 `guide/`       | `/docs/guide/`    | 项目怎么跑、怎么组织、怎么协作       |
| Admin 应用 `admin/` | `/docs/admin/`    | 改 admin 的某个功能                  |
| 跨端核心 `core/`    | `/docs/core/`     | `@core/*` 的 API 怎么用              |
| 跨端 Hooks `hooks/` | `/docs/hooks/`    | 某个 hook 的签名与行为               |
| 表单原语 `form/`    | `/docs/form/`     | 表单怎么写、怎么校验、怎么不重渲染   |
| Web 端包 `web/`     | `/docs/web/`      | `web/*` 的 API 怎么用                |
| 包总览 `packages/`  | `/docs/packages/` | 31 个包都有啥、某个能力在哪个包      |

新增一篇文档：

1. 在对应分区目录下新建 `xxx.mdx`，frontmatter 至少写 `title` 与 `description`；
2. 把文件名加进同级 `meta.json` 的 `pages` 数组（顺序即侧边栏顺序，`"---分组名---"` 是分隔标题）；
3. 分区根 `meta.json` 里的 `icon` 取 [Lucide](https://lucide.dev) 图标名，由 `lucideIconsPlugin()` 解析。

内容规划、篇目来源与旧站重定向表见 [`CONTENT-PLAN.md`](./CONTENT-PLAN.md)。

## 面向 AI 的出口

除了给人看的页面，每篇文档同时以纯文本形式暴露，方便被模型抓取：

| 路由                              | 内容                                  |
| --------------------------------- | ------------------------------------- |
| `/llms.txt`                       | 全站索引                              |
| `/llms-full.txt`                  | 全站正文合集                          |
| `/llms.mdx/docs/*/content.md`     | 单篇处理后的 Markdown                 |
| `/docs/*.md`                      | 由 `middleware.ts` 重写到上一条        |
| `/docs/*`（`Accept` 偏好 Markdown）| 同上，响应带 `Vary: Accept`            |

## 部署（Cloudflare Workers）

通过 [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) 打包成 Worker，
配置在 [`wrangler.jsonc`](./wrangler.jsonc)（Worker 名、静态资源绑定、R2 增量缓存桶、日志）
与 [`open-next.config.ts`](./open-next.config.ts)（使用 R2 作为增量缓存）。

```bash
pnpm preview   # 本地以 workerd 运行，最接近线上
pnpm deploy    # 构建并发布
pnpm upload    # 只上传新版本，不切流量
pnpm cf-typegen # 由 wrangler.jsonc 生成 CloudflareEnv 类型
```

三个命令都会先跑 `worker:build`，它在 OpenNext 构建前先构建 `@skyroc/ui-types` 与 `@skyroc/type-utils`——
`@skyroc/web-ui` 依赖这两个包的构建产物，而 OpenNext 的构建阶段不会自动触发 workspace 依赖的构建。

两个容易踩的点：

- **`middleware.ts` 不要改名成 `proxy.ts`。** Next 16 推荐 `proxy.ts`，但它恒定运行在 Node.js runtime，
  而 `@opennextjs/cloudflare` 目前只支持 Edge middleware，改名会让 `pnpm deploy` 在打包阶段直接失败。
- **`next.config.mjs` 里的 `initOpenNextCloudflareForDev()`** 让 `next dev` 也能拿到 Cloudflare 绑定（R2 等），
  不要在精简配置时删掉。

## 脚本

| 命令                | 作用                                     |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | 启动开发服务器                           |
| `pnpm build`        | Next.js 生产构建                         |
| `pnpm start`        | 以 Node 运行生产构建                     |
| `pnpm lint`         | oxlint                                   |
| `pnpm types:check`  | `next typegen` + `tsc --noEmit`          |
| `pnpm worker:build` | 构建依赖包并产出 `.open-next/`           |
| `pnpm preview`      | 本地 workerd 预览                        |
| `pnpm deploy`       | 发布到 Cloudflare                        |
| `pnpm upload`       | 上传新版本但不切流量                     |
| `pnpm cf-typegen`   | 生成 `cloudflare-env.d.ts`               |

## 延伸阅读

- [Fumadocs 文档](https://fumadocs.dev) — Source API、MDX、布局与搜索
- [Fumadocs MDX](https://fumadocs.dev/docs/mdx) — 集合定义使用 `lib/source.ts` 中的 Macro API
- [Next.js 文档](https://nextjs.org/docs)
- [OpenNext Cloudflare 适配器](https://opennext.js.org/cloudflare)
