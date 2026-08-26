# @shell/theme

> Web 管理端主题管理包 — 基于 Jotai 的全局主题状态、React 组件、预设系统、副作用收口与 Ant Design 集成的完整解决方案

内置 Ant Design 主题算法（OKLCH 色板），面向应用层提供开箱即用的主题方案。
算法层的 API 见 [`docs/antd-algorithm.md`](./docs/antd-algorithm.md)。

## Features

- **单一数据源** — 以一个 Jotai atom 承载完整 `Theme.ThemeSetting`，所有组件共享
- **`useTheme` hook** — 统一读写主题入口，封装派生计算与 mutation
- **`AntdProvider`** — 自动桥接主题状态与 Ant Design `ConfigProvider`，整合 `App` 与 `Watermark`
- **`ThemeEffect`** — DOM class、CSS 滤镜、`localStorage` 持久化、水印定时器等副作用统一收口
- **预设系统** — 5 套开箱即用 JSON 预设（`default` / `dark` / `azir` / `compact` / `shadcn`），支持运行时切换
- **`setupTheme`** — 一次调用完成默认配置加载、缓存读取、版本覆盖检测与 atom 初始化
- **Ant Design UI 工具** — `message` / `modal` / `notification` 单例，可在组件外（如 axios 拦截器）任意位置调用
- **完整 TypeScript 类型** — 全局 `Theme` namespace，含 7 种布局、7 种页面动画等枚举

## Installation

> shell 不是 npm 包：monorepo 内经 `@shell/*` 别名直接引用源码（app 无需
> 声明任何依赖，shell 自己的 package.json 管理其运行时依赖），`pnpm create skyroc`
> 生成的独立项目里它就在 `src/framework/`，无需安装。

运行时依赖 `antd >= 6.0.0`、`react >= 19.0.0`、`jotai >= 2.0.0`，由 shell 的
`package.json`（monorepo）或生成项目自己的 `package.json` 提供。

## Quick Start

### 1. 初始化（应用入口）

```ts
import { setupTheme } from '@shell/theme';
import { storagePrefix } from '@/utils/storage';

setupTheme({
  buildTime: BUILD_TIME,
  overrides: {
    themeColor: '#6366F1'
  },
  storagePrefix
});
```

### 2. 挂载 AntdProvider

```tsx
import { AntdProvider } from '@shell/theme';

const AppProvider = ({ children }) => (
  <AntdProvider locale={antdLocales[locale]} userName={userInfo?.userName}>
    {children}
  </AntdProvider>
);
```

### 3. 挂载 ThemeEffect

```tsx
import { ThemeEffect } from '@shell/theme';

const GlobalEffect = () => <ThemeEffect />;
```

### 4. 在组件中使用 useTheme

```tsx
import { useTheme } from '@shell/theme';

const ThemePanel = () => {
  const { themeScheme, setThemeScheme, updateThemeColors, reset } = useTheme();

  return (
    <>
      <button onClick={() => setThemeScheme('dark')}>切换暗色</button>
      <button onClick={() => updateThemeColors('primary', '#6366F1')}>改主题色</button>
      <button onClick={reset}>重置</button>
    </>
  );
};
```

### 5. 应用预设

```ts
import { getAllPresets, getPreset, useTheme } from '@shell/theme';

const { setSettings } = useTheme();
const preset = getPreset('shadcn');
if (preset) setSettings(preset);
```

### 6. Ant Design UI 工具（无需 React context）

```ts
import { showConfirmModal, showErrorMessage, showSuccessMessage } from '@shell/theme';

showSuccessMessage('保存成功');
showErrorMessage('网络错误');
showConfirmModal({ title: '确认删除？', onOk: () => deleteItem(id) });
```

## Package Structure

```
src/
├── antd/                       Ant Design 集成
│   ├── AntdProvider.tsx        ConfigProvider + App + Watermark 封装
│   ├── shared.ts               getAntdTheme()：状态 → ConfigProvider.theme
│   └── ui.ts                   message / modal / notification 单例
├── components/
│   ├── ThemeEffect.tsx         副作用组件（DOM、storage、滤镜、定时器）
│   ├── ThemeSchemaSwitch.tsx   light / dark / auto 切换按钮
│   └── ThemeSchemaSegmented.tsx 分段式主题选择控件
├── config/
│   └── default.ts              defaultThemeSettings
├── hooks/
│   └── use-theme.ts            themeSettingsAtom + themeUserNameAtom + useTheme()
├── presets/                    5 套预设 JSON
├── types/
│   └── theme.d.ts              全局 Theme namespace
├── utils/
│   ├── dark-mode.ts            toggleCssDarkMode / isDarkModeClass
│   ├── filters.ts              toggleAuxiliaryColorModes / clearAuxiliaryColorModes
│   └── settings.ts             mergeThemeSettings / getThemeColors / getDefaultThemeSettings
├── setup.ts                    setupTheme / defineThemeOverrides
└── index.ts                    统一导出
```

## API 速览

| 导出 | 类型 | 说明 |
|------|------|------|
| `setupTheme(options)` | function | 初始化主题：默认配置、缓存读取、版本覆盖、atom 写入 |
| `defineThemeOverrides(overrides)` | function | 类型安全的覆盖配置定义辅助 |
| `useTheme()` | hook | 主题读写入口，返回所有字段 + 派生值 + mutation 函数 |
| `themeSettingsAtom` | atom | 主题状态唯一数据源（Jotai） |
| `themeUserNameAtom` | atom | 水印用户名 atom，由 `AntdProvider` 写入 |
| `AntdProvider` | component | 桥接主题与 Ant Design `ConfigProvider` |
| `ThemeEffect` | component | 副作用组件（渲染为 `null`） |
| `ThemeSchemaSwitch` | component | light / dark / auto 循环切换按钮 |
| `ThemeSchemaSegmented` | component | 三态分段式选择控件 |
| `getAntdTheme(colors, dark, settings)` | function | 状态转 Ant Design `theme` 配置 |
| `getAllPresets()` / `getPreset(name)` | function | 预设系统访问 |
| `presets` / `defaultPreset` / `dark` / `azir` / `compact` / `shadcn` | const | 预设具名导出 |
| `mergeThemeSettings` / `getThemeColors` / `getDefaultThemeSettings` | function | 配置工具 |
| `toggleCssDarkMode` / `isDarkModeClass` | function | DOM dark class 操作 |
| `toggleAuxiliaryColorModes` / `clearAuxiliaryColorModes` | function | 灰度 / 色弱滤镜 |
| `defaultThemeSettings` / `themeSchemeIcons` | const | 默认配置与图标映射 |
| `showMessage` / `showModal` / `showNotification` 系列 | function | Ant Design UI 单例工具 |

完整 API 文档（含字段说明、类型定义、设计取舍）：见 [`apps/web-kit-docs/content/docs/theme/admin-theme.mdx`](../../../apps/web-kit-docs/content/docs/theme/admin-theme.mdx)。

## 设计要点

- **单 atom 架构**：预设应用是原子操作，不会产生中间渲染状态；持久化只需序列化一个对象
- **副作用收口**：所有 DOM 操作和 storage 写入集中在 `ThemeEffect`，`useTheme` 本身无副作用，便于测试
- **`userName` 通过 atom 传递**：`AntdProvider` 写入 `themeUserNameAtom`，所有 `useTheme()` 自动获得完整 `watermarkContent`，无 prop drilling

## Related Packages

- [`@skyroc/color`](../../@core/color) — 核心色板生成
- [`@shell/ui/antd`](../ui-antd) — Ant Design 业务组件封装
- [`@skyroc/hooks`](../../hooks) — 通用 hooks 集合

## License

MIT
