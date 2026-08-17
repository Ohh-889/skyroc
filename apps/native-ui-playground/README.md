# Native UI Playground

`@skyroc/native-ui` 的 Expo 调试台，用于浏览组件目录、验证真实交互，并为组件文档提供可复用示例。

当前首页按基础、表单、选择、反馈、展示和导航分类展示组件，支持按名称或用途搜索。每个组件都有独立路由，示例实现集中在 [`src/demos`](./src/demos)。

## 启动

在仓库根目录安装依赖后运行：

```bash
pnpm --filter native-ui-playground start
```

在 Expo 终端中选择 iOS、Android 或 Web，也可以直接运行：

```bash
pnpm --filter native-ui-playground ios
pnpm --filter native-ui-playground android
pnpm --filter native-ui-playground web
```

涉及原生模块或配置变更时，需要使用 development build；普通组件样式与交互调整可复用已有构建。

## 目录职责

```text
app/
├── _layout.tsx              # 全局 Provider、Portal 与安全区初始化
├── (tabs)/index.tsx         # 可搜索的组件目录首页
└── components/*.tsx         # 每个组件的 Expo Router 页面
src/
├── component-catalog.ts     # 首页分类、名称、描述与路由
└── demos/*Demo.tsx          # 可交互组件示例
global.css                   # Uniwind、设计令牌与源码扫描入口
metro.config.js              # Uniwind Metro 配置
```

## 新增组件示例

1. 在 `src/demos/<Component>Demo.tsx` 创建可独立渲染的示例。
2. 在 `app/components/<component>.tsx` 创建路由页面，使用 `NavBar` 并渲染 Demo。
3. 在 `src/component-catalog.ts` 中登记名称、用途、分类和路由。
4. 同时更新组件文档对 Demo 的引用，避免文档和运行效果分叉。

路由层只负责页面壳和导航，组件状态、变体组合与交互场景放在 Demo 中。这样 playground 与文档可以复用同一份示例。

## 应用级初始化

[`app/_layout.tsx`](./app/_layout.tsx) 集中提供组件库依赖的运行时环境：

- `GestureHandlerRootView`：手势根容器。
- `BottomSheetModalProvider`：底部面板挂载环境。
- `PortalHost`：全局浮层宿主。
- `Uniwind.updateInsets(insets)`：把安全区数据同步给 `*-safe` 工具类。

不要把这些初始化重复放进单个 Demo 或组件实现。

## 验证

```bash
pnpm --filter native-ui-playground typecheck
pnpm --filter @skyroc/native-ui typecheck
pnpm --filter @skyroc/native-ui build
```

组件交互与布局仍需在目标平台打开对应示例页确认，尤其是手势、键盘、弹层、安全区和原生模块相关组件。

组件库安装、主题和宿主接入说明见 [`packages/native/ui/README.md`](../../packages/native/ui/README.md)。
