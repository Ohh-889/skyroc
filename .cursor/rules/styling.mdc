---
description: Styling rules covering UnoCSS, Ant Design tokens, and global styles
globs:
  - "src/styles/**"
  - "src/theme/**"
  - "src/components/**"
  - "src/layouts/**"
alwaysApply: true
---
# 样式规范 Styling Guide

## 技术栈
- **UnoCSS** 负责大部分原子化样式，配置位于 `uno.config.ts`，启用了 `presetUno`、`presetSkyrocAdmin`、`transformer-directives`、`transformer-variant-group`。
- 全局 token 定义在 `src/theme/vars.ts` 和 `src/theme/settings.ts`，通过 CSS 变量提供给 UnoCSS 与 Ant Design。
- 仍需编写样式文件时，优先使用 `*.module.scss` 或 `*.css`，并放在组件同级目录下。

## 使用约定
- UnoCSS 类命名遵循 `结构 → 状态 → 修饰`，常见 shortcut（如 `card-wrapper`）已在 `uno.config.ts` 定义，可直接复用。
- Ant Design 主题通过 `ConfigProvider` 注入，若需调整全局主题色，修改 `features/theme` 模块的设置后更新 `themeVars`。
- 避免在组件内写内联 magic number。若需要固定尺寸，请在 `App.Theme.ThemeToken` 中扩展后引用。
- 滚动条、全局重置、暗色模式等基础样式在 `src/styles/css`、`src/styles/scss`。仅当需要全局效果时才修改这些文件。

## 资源与图标
- 图标使用 `@iconify/react`（`Icon` 组件）或 `local icon`。`IconLocal*` 资源存放于 `src/assets/icons` 并通过 `vite-plugin-svg-icons` 注入。
- 动画推荐使用 `motion`（`motion/react`）或 CSS 变量驱动的过渡，确保 prefers-reduced-motion 用户体验。

## 开发小贴士
- 在 VSCode / Cursor 中开启 UnoCSS 插件以获得类名提示。
- 更新主题变量后需要重启 UnoCSS 以便热更新新 token。
- 若引入第三方 CSS（例如 Antd 组件样式），请在 `src/plugins/assets.ts` 统一引入，保持入口整洁。
