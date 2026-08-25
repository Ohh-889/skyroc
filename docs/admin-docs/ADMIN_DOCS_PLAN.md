# Skyroc Admin React 新版文档实施计划

## 1. 目标

新版 `docs/admin-docs` 是面向 `apps/admin` 使用者和二次开发者的主文档，不是旧 Vue 文档的逐页搬运。

正文必须以当前 `apps/admin` 和 workspace package 现状为准。Vue 旧文档只提供“读者会问什么、上手路径是什么”的参考，旧 React 文档只提供早期 React 版主题参考。

这份文档本身不进入 Fumadocs 页面树，只作为后续重建 `docs/admin-docs/content/docs` 的施工说明。后续所有页面、目录、`meta.json`、站点入口和校验工作，都应按这份计划推进。

## 2. 事实来源

- Vue 旧文档：`/Users/wangshipeng/Documents/daima/laosoybean/soybean-admin-docs`
- 旧 React 文档：`/Users/wangshipeng/Documents/daima/soybean-react/soybean-admin-react-docs/src`
- 新文档站点：`docs/admin-docs`
- 当前应用事实源：`apps/admin`
- 共享包文档：`docs/web-kit-docs`
- 共享包源码：`packages/web/*`

## 3. 不迁移内容

- Vue 专属规范、NaiveUI、Pinia、Elegant Router 细节。
- 旧 React 文档里的 Redux、`@sa/*`、旧路由插件、过期实现描述。
- 个人见解文章、推荐页、捐赠页、生态列表、通用 Git/Node/软件安装教程。
- 共享包 API 长文不搬进 admin 文档，admin 文档只讲这些包在 `apps/admin` 中怎么被使用。

## 4. 实施清单

1. 建立 `docs/admin-docs/content/docs` 正式信息架构。
2. 补齐每个章节目录的 `meta.json`，用 Fumadocs 控制侧边栏顺序。
3. 更新站点信息：`lib/shared.ts` 的应用名、仓库信息。
4. 更新首页：从 Hello World 改成 Skyroc Admin React 文档入口。
5. 分两批写页面：先完成主路径，再补齐专题页和 FAQ。
6. 每页都从当前代码事实源反推内容，不能直接复制旧文档。
7. 最后跑类型检查、lint、build、diff check，并本地浏览验证。

## 5. 信息架构

| 路径 | 标题 | 读者目标 | 主要内容 | 事实源 |
| --- | --- | --- | --- | --- |
| `index.mdx` | 文档首页 | 知道项目是什么、从哪读起 | 定位、技术栈、架构概览、阅读路径 | `apps/admin/package.json`, `apps/admin/src` |
| `getting-started/quick-start.mdx` | 快速开始 | 跑起来项目 | Node/pnpm、安装、启动、构建、预览、Mock、scripts | `apps/admin/package.json`, `.env*` |
| `getting-started/editor-setup.mdx` | 开发工具配置 | 对齐编辑器和本地开发体验 | VS Code 推荐插件、OXC/Oxlint、i18n Ally、UnoCSS、生成文件只读约定 | `.vscode/extensions.json`, `.vscode/settings.json`, `apps/admin/package.json` |
| `getting-started/project-structure.mdx` | 项目结构 | 看懂目录职责 | `src` 目录、`packages/web/*` 与 app 边界 | `apps/admin/src`, `packages/web` |
| `architecture/bootstrap.mdx` | 启动流程 | 理解应用如何初始化 | `main -> bootstrap -> App`、devtools、theme、layout、i18n、render 顺序 | `main.tsx`, `bootstrap.tsx`, `App.tsx` |
| `architecture/runtime-providers.mdx` | 运行时 Provider | 理解 React Provider 和全局 effect 顺序 | QueryClient、Jotai、Devtools、Antd、通知、路由、GlobalEffect | `App.tsx`, `queryClient.ts`, `GlobalEffect.tsx` |
| `configuration/env-and-vite.mdx` | 环境变量与 Vite | 修改配置不走偏 | `.env`、代理、`defineConfig`、`application/vite` 边界 | `.env*`, `vite.config.ts`, `@skyroc/web-admin-vite` |
| `configuration/storage-and-cache.mdx` | 存储与缓存 | 看懂浏览器缓存和运行时缓存 | storage 前缀、token、语言、tabs、主题、React Query 清理 | `utils/storage.ts`, `features/auth`, `admin-theme`, `admin-layouts` |
| `routing/overview.mdx` | 路由概览 | 创建和理解页面路由 | TanStack Router、`routeTree.gen.ts`、路由组、动态路由 | `features/router`, `pages` |
| `routing/route-meta.mdx` | 路由元信息 | 配菜单、标题、图标、外链 | `staticData`、`i18nKey`、`menu`、`activeMenu`、隐藏菜单 | `pages/*`, `types/router.d.ts` |
| `routing/guards.mdx` | 路由守卫 | 理解登录拦截和守卫链路 | `guardAdminRoute`、用户初始化、router context、外链处理 | `guard.ts`, `use-auth.ts` |
| `routing/permission.mdx` | 权限 | 理解权限模型和 403 | 权限模型、静态/动态权限、超级角色、`hasMatchedRoutePermission` | `permissions.ts`, `guard.ts` |
| `layout/overview.mdx` | 布局系统 | 知道主布局如何组装 | `WebAdminLayout`、logo、footer、通知、头像 slot | `(admin)/layout.tsx` |
| `layout/menus-and-tabs.mdx` | 菜单与标签页 | 配置菜单、动态菜单、tabs | `setupAdminLayouts`、`menuCategories`、`menuNodeCallback`、`menuExtras`、cache tabs | `features/menus`, `bootstrap.tsx` |
| `request/overview.mdx` | 请求概览 | 看懂请求封装 | `request`、`demoRequest`、业务 code、token、错误提示适配 | `service/request/index.ts` |
| `request/service-modules.mdx` | 服务模块 | 新增业务接口 | `urls/api/hooks/keys/types` 分层、React Query hooks 接页面 | `service/api/*` |
| `request/proxy-and-backend.mdx` | 代理与后端对接 | 切换真实后端 | `VITE_SERVICE_BASE_URL`、`VITE_OTHER_SERVICE_BASE_URL`、`/proxy-default`、`/proxy-{key}` | `.env*`, admin-vite proxy |
| `theme/overview.mdx` | 主题系统 | 改主题和暗色模式 | `@shell/theme`、默认主题、本地缓存、Antd Provider | `config.ts`, `features/antd`, web-kit docs |
| `theme/i18n-and-icons.mdx` | 国际化与图标 | 改语言和图标 | `@shell/i18n`、语言配置、本地 svg、Iconify、前缀 | `locales`, `assets/svg-icon`, `.env` |
| `features/table-and-form.mdx` | 表格与表单 | 写管理页列表 | `useTable`、URL 查询同步、分页、列显隐、Antd Form 搜索 | `features/table`, `manage/user` |
| `features/demo-pages.mdx` | 示例页面边界 | 区分 demo、占位和真实业务入口 | `manage/user` 通知 demo、`manage/menu` 弹窗测试、`manage/role` 主题展示 | `apps/admin/src/pages/(admin)` |
| `features/charts-and-dashboard.mdx` | 图表与 Dashboard | 写首页图表和 dashboard 模块 | `useEcharts`、首页模块、暗色模式、尺寸监听、菜单 badge | `home/index.tsx`, `home/modules`, `hooks/use-echarts.ts` |
| `features/auth-login.mdx` | 登录认证 | 理解登录和退出 | 登录页结构、`useLogin/useAuth`、token 持久化、退出登录 | `(auth)/login`, `features/auth` |
| `features/notification.mdx` | 通知系统 | 使用通知能力 | `@shell/notification` 在 header 和示例页中的用法 | `(admin)/layout.tsx`, `manage/user` |
| `deployment/build-and-deploy.mdx` | 构建部署 | 正确部署生产包 | build、preview、history rewrite、Nginx、base url、常见问题 | `package.json`, `.env`, Vite config |
| `faq.mdx` | 常见问题 | 快速排错 | 菜单不显示、动态路由失效、刷新 404、代理失败、token、Vite 预设未构建、devtools 顺序 | 以上各模块 |

## 6. `index.mdx` 首页写作说明

`index.mdx` 是 `docs/admin-docs/content/docs` 的文档首页，负责建立读者的第一层心智模型。它不承担完整教程职责，也不写成营销型首页；它只回答三个问题：

- Skyroc Admin React 是什么。
- 当前应用由哪些层组成，各层分别负责什么。
- 新读者应该按什么顺序继续阅读。

### 6.1 页面定位

首页面向第一次进入文档的使用者和二次开发者。正文要让读者快速知道这是一个基于 `apps/admin` 的 React 中后台应用模板，当前实现以 React、Vite、TypeScript、TanStack Router、React Query、Jotai、Ant Design、UnoCSS 和 Skyroc workspace packages 为主。

首页只做总览和导读，不在本页展开安装、目录逐项说明、启动流程源码细节、路由配置细则、请求封装细则或部署方案。这些内容应通过内部链接引导到对应页面。

### 6.2 当前系统结构

写首页前先按下面结构理解当前应用：

- `apps/admin/package.json` 定义应用定位、运行脚本、基础技术栈和 workspace 包依赖。
- `apps/admin/src/main.tsx` 是浏览器入口；开发环境先加载 `@skyroc/web-admin-devtools/jotai`，再进入应用 bootstrap。
- `apps/admin/src/bootstrap.tsx` 是启动编排层；它依次完成主题初始化、布局系统初始化、插件注册、i18n 初始化，最后渲染 `App`。
- `apps/admin/src/App.tsx` 是 Provider 组合层；它挂载 QueryClient、Jotai、开发工具、Ant Design Provider、通知 Provider、动画能力、路由 Provider 和全局副作用。
- `apps/admin/src/features/*` 承载 admin 应用内的业务能力封装，例如路由、菜单、权限、表格、表单、Ant Design 适配和全局 effect。
- `packages/web/*` 提供可复用的基础能力，例如 admin layout、theme、i18n、runtime、notification、Vite preset、UI 组件和工具包。

首页里的“架构概览”应表达这个关系：`apps/admin` 负责应用编排和业务页面，`features/*` 承接应用内能力，`packages/web/*` 提供共享能力，页面和服务模块在这些基础设施之上完成具体业务。

### 6.3 推荐正文结构

`index.mdx` 建议按下面顺序写：

1. 页面标题：使用 `Skyroc Admin React` 或 `Skyroc Admin React 文档`。
2. 简短定位：说明它是 React 中后台应用模板和二次开发入口，事实以当前 `apps/admin` 为准。
3. 技术栈速览：列出 React、Vite、TypeScript、TanStack Router、React Query、Jotai、Ant Design、UnoCSS、Skyroc workspace packages。
4. 架构概览：用一张简短表格说明应用入口、启动编排、Provider 组合、路由菜单权限、请求服务、主题/i18n/layout 的职责和关键文件。
5. 阅读路径：按读者目标给出路径，而不是按源码目录平铺。
6. 事实源提示：提示文档以当前代码为准，旧 Vue/旧 React 文档只能作为问题清单参考。

### 6.4 阅读路径设计

首页至少提供以下阅读路径：

- 第一次跑项目：`getting-started/quick-start.mdx` -> `getting-started/editor-setup.mdx` -> `getting-started/project-structure.mdx`。
- 看懂启动和应用骨架：`architecture/bootstrap.mdx` -> `layout/overview.mdx` -> `layout/menus-and-tabs.mdx`。
- 开发页面和路由：`routing/overview.mdx` -> `routing/route-meta.mdx` -> `routing/guards.mdx` -> `routing/permission.mdx`。
- 接接口和数据：`request/overview.mdx` -> `request/service-modules.mdx` -> `request/proxy-and-backend.mdx`。
- 改主题、语言和图标：`theme/overview.mdx` -> `theme/i18n-and-icons.mdx`。
- 部署上线：`deployment/build-and-deploy.mdx` -> `faq.mdx`。

链接目标以后续实际创建的 `content/docs` 文件为准。页面不存在时，先在计划中保留路径，不要在已发布正文里制造死链。

### 6.5 首页必须避免的内容

- 不复制 Vue 旧文档里的 NaiveUI、Pinia、Elegant Router、Vue 目录约定。
- 不复制旧 React 文档里的 Redux、`@sa/*`、旧路由插件或过期实现描述。
- 不把共享包 API 长文搬进首页；首页只说明这些包在 `apps/admin` 中的角色。
- 不写通用 Node、Git、编辑器安装教程；开发工具内容只讲当前仓库 `.vscode` 和脚本约定。
- 不把首页写成品牌宣传页、捐赠页、生态列表或个人观点文章。
- 不在首页堆完整命令清单；安装、启动、构建、预览命令属于 quick start 页面。

### 6.6 写作验收

完成 `index.mdx` 后应检查：

- 首页能在 1 到 2 屏内说明项目定位、技术栈和阅读路径。
- 技术栈和关键文件都能从 `apps/admin/package.json`、`apps/admin/src/main.tsx`、`apps/admin/src/bootstrap.tsx`、`apps/admin/src/App.tsx`、`apps/admin/src/config.ts` 和 `apps/admin/src/features/*` 对上。
- 读者能从首页进入第一批主路径页面。
- 页面没有 Hello World、Next.js、Fumadocs 默认示例、Vue/Redux/`@sa/*` 等过期内容。
- 如果实际页面链接尚未创建，发布前要么先补页面，要么临时去掉对应死链。

## 7. 第一批必须完成页面

优先完成主路径页面，保证用户能跑起来、看懂核心架构、能开始二次开发：

- `index.mdx`
- `getting-started/quick-start.mdx`
- `getting-started/editor-setup.mdx`
- `getting-started/project-structure.mdx`
- `architecture/bootstrap.mdx`
- `architecture/runtime-providers.mdx`
- `configuration/env-and-vite.mdx`
- `configuration/storage-and-cache.mdx`
- `routing/overview.mdx`
- `routing/route-meta.mdx`
- `routing/guards.mdx`
- `routing/permission.mdx`
- `request/overview.mdx`
- `layout/overview.mdx`
- `layout/menus-and-tabs.mdx`

## 8. 第二批补齐页面

第一批完成并验证后，再补齐专题能力：

- `request/service-modules.mdx`
- `request/proxy-and-backend.mdx`
- `theme/overview.mdx`
- `theme/i18n-and-icons.mdx`
- `features/table-and-form.mdx`
- `features/demo-pages.mdx`
- `features/charts-and-dashboard.mdx`
- `features/auth-login.mdx`
- `features/notification.mdx`
- `deployment/build-and-deploy.mdx`
- `faq.mdx`

## 9. 每页写作模板

每个页面都按这个结构写，避免散文式说明：

- 页面目标：这页解决什么问题。
- 适用场景：读者什么时候应该看这页。
- 当前实现位置：列出 2 到 5 个关键文件。
- 核心概念：解释当前实现的结构、职责和交互。
- 最小可用示例：给出能直接照着改的示例。
- 常见误区：指出旧文档不能照搬或容易误解的点。
- 相关链接：链接到相关 admin 页面或 `docs/web-kit-docs` 共享包文档。

## 10. 实施顺序

### 第一步：落施工说明

创建本文件 `docs/admin-docs/ADMIN_DOCS_PLAN.md`，把新版文档的定位、范围、事实源、信息架构、批次和验收方式定下来。

这一阶段只写计划文档，不创建 `content/docs` 页面，不改站点配置。

### 第二步：清理站点骨架入口

更新 `docs/admin-docs/lib/shared.ts`：

- `appName` 改为 `Skyroc Admin React`。
- `gitConfig` 改为当前仓库对应信息。
- 保持 `docsRoute`、`docsImageRoute`、`docsContentRoute` 的路径语义不变，除非后续站点路由策略改变。

更新 `docs/admin-docs/app/(home)/page.tsx`：

- 删除 Hello World 占位内容。
- 改成新版文档入口。
- 首页只做文档导航，不写营销型落地页。

### 第三步：建立目录和侧边栏

在 `docs/admin-docs/content/docs` 下建立以下目录：

- `getting-started`
- `architecture`
- `configuration`
- `routing`
- `layout`
- `request`
- `theme`
- `features`
- `deployment`

同时补齐：

- 根级 `content/docs/meta.json`
- 每个章节目录下的 `meta.json`

侧边栏顺序按读者上手路径组织，不按源码目录机械排序。

### 第四步：写第一批主路径页面

先写第一批必须完成页面。写作目标是让读者可以完成下面动作：

- 跑起 `apps/admin`。
- 看懂 monorepo 和 app/package 边界。
- 知道应用启动顺序。
- 会改环境变量和 Vite 配置。
- 会创建页面路由并配置路由元信息。
- 理解登录守卫和权限判断。
- 看懂请求封装。
- 会接入主布局、菜单和 tabs。

这一批完成后，必须先验证，再进入第二批。

### 第五步：写第二批专题页面

补齐请求服务模块、代理后端、主题、国际化、图标、表格表单、登录认证、通知、部署和 FAQ。

第二批页面应优先沉淀“二次开发时一定会改”的内容，不写大而泛的概念介绍。

### 第六步：最终统一校验

所有页面完成后统一执行校验命令，并本地启动站点进行浏览检查。

## 11. 专题页补充说明

第二批专题页写作时，需要同步建立对应目录的侧边栏信息，并特别注意以下当前事实：

| 路径 | 写作重点 | 需要特别说明的当前事实 |
| --- | --- | --- |
| `theme/overview.mdx` | `setupTheme`、默认主题、缓存覆盖、Ant Design Provider、`ThemeEffect` | 当前应用只在 `bootstrap.tsx` 调用 `setupTheme({ buildTime: BUILD_TIME })`；默认主题来自共享包，应用专属覆盖不应直接写进页面。 |
| `theme/i18n-and-icons.mdx` | `setupI18n`、语言缓存、Ant Design locale、Dayjs 同步、本地 svg、Iconify provider | i18n 运行时由共享包提供，`apps/admin` 负责默认语言、storage、第三方 locale 同步和图标前缀配置。 |
| `architecture/runtime-providers.mdx` | QueryClient、Jotai、Devtools、Antd、通知、路由、GlobalEffect | Provider 顺序要以 `App.tsx` 为准；生产环境更新检测属于插件，不属于 React Provider。 |
| `configuration/storage-and-cache.mdx` | `VITE_STORAGE_PREFIX`、`localStg`、token、tabs、语言、主题、React Query cache | 当前主题包没有接入 `localStg`，如果修改 `VITE_STORAGE_PREFIX`，主题缓存前缀不会自动同步。 |
| `features/table-and-form.mdx` | `useTable`、搜索表单、分页、列设置、`useTableOperate` | `features/table` 已有能力层，但当前 `manage/user` 页面没有消费 `useTable()`；它现在主要是通知演示页。 |
| `features/demo-pages.mdx` | 当前页面清单、demo/占位/真实业务边界、替换为真实业务页的路径 | `manage/menu` 是 message/notification/modal 测试页，`manage/role` 是 UnoCSS 主题展示页，`manage/user` 是通知 demo。 |
| `features/charts-and-dashboard.mdx` | 首页模块、`useEcharts`、暗色模式、尺寸监听、菜单 badge | 当前 dashboard 是可运行示例，但数据以示例为主；接真实接口时应进入服务模块。 |
| `features/auth-login.mdx` | 登录页结构、`useInitLogin/useAuth`、token 持久化、用户初始化、退出登录 | 登录成功必须走 `setAuth -> initAuth -> initMenus -> navigate`，不要在页面里绕开认证链路。 |
| `features/notification.mdx` | `NotificationProvider`、`NotificationButton`、通知 context、声音和浏览器通知 | 通知状态当前是前端内存态，声音资源由 `apps/admin` 注入，不硬编码进共享包。 |
| `deployment/build-and-deploy.mdx` | 构建脚本、preview、env mode、`VITE_BASE_URL`、Nginx history rewrite | 当前 TanStack Router 使用默认 browser history，线上刷新深层路由必须由服务端 rewrite 到 `index.html`。 |

这些页面写作时仍按第 9 节模板组织，但允许根据页面性质把“最小可用示例”和“常见误区”扩展得更具体。新增内容必须以当前 `apps/admin` 和 `packages/web/*` 源码为准；如果计划表里的事实源和当前源码不一致，正文要显式写出现状，不能按旧预期补假文档。

检查重点：

- 侧边栏是否完整。
- 内部链接是否能打开。
- 代码块是否能正常渲染。
- 页面是否仍有 Hello World、Next.js、Fumadocs 默认示例内容。
- 是否误搬 Vue/Redux/`@sa/*` 等过期内容。

## 12. 校验方式

- `pnpm --filter admin-docs types:check`
- `pnpm --filter admin-docs lint`
- `pnpm --filter admin-docs build`
- `git diff --check docs/admin-docs`
- 本地启动 `pnpm --filter admin-docs dev`，检查首页、侧边栏、搜索、代码块、内部链接和 mobile 布局。

## 13. 验收标准

- `ADMIN_DOCS_PLAN.md` 能让后续实现者不再重新判断文档范围。
- 每个计划页面都有明确写作目标、参考来源、代码事实源。
- 明确标出哪些旧文档内容废弃，避免误搬。
- 后续可以按这个文档逐批创建 `content/docs` 页面和 `meta.json`。
- `apps/admin` 运行时代码不改，只读取它作为文档事实来源。
