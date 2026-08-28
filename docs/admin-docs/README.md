# Skyroc Admin React Docs

`docs/admin-docs` 是 Skyroc Admin React 的应用文档站，内容面向 `apps/admin` 的使用者和二次开发者。

这份文档以当前仓库源码为事实源：启动流程、路由、菜单、权限、请求、主题、国际化、通知和部署说明都应先对齐 `apps/admin`、`packages/web/*`、`packages/@core/*` 的真实实现，再参考旧文档的问题清单。

## 文档结构

| 目录            | 内容                                    |
| --------------- | --------------------------------------- |
| `content/docs`  | Fumadocs 正文页面和侧边栏 `meta.json`。 |
| `app/docs`      | 文档页路由和布局。                      |
| `app/(home)`    | 文档站入口页。                          |
| `components`    | 文档站自己的 UI 和 MDX 渲染组件。       |
| `lib/source.ts` | Fumadocs content source 适配。          |
| `lib/shared.ts` | 文档站应用名、仓库信息和路由常量。      |

## 常用命令

从仓库根目录执行：

```bash
pnpm --filter admin-docs dev
pnpm --filter admin-docs types:check
pnpm --filter admin-docs lint
pnpm --filter admin-docs build
```

本地开发服务默认由 Next.js 分配端口。正文变更后至少运行：

```bash
pnpm --filter admin-docs types:check
git diff --check docs/admin-docs
```

## 写作约定

- `content/docs/index.mdx` 保持轻量，只做项目定位和阅读路径。
- 具体操作放到专题页，不把启动、路由、请求、部署细节堆进首页。
- 共享包 API 长文放在 `docs/web-kit-docs`；admin 文档只讲这些包在 `apps/admin` 中怎么被使用。
- 不迁移 Vue 专属内容、旧 React Router / Redux / `@sa/*` 描述、个人见解或通用工具教程。
- 新页面要同步对应目录的 `meta.json`，并从相关页面补内部链接。
