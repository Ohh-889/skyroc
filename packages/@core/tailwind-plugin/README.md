# @skyroc/tailwind-plugin

> Skyroc UI 的 Tailwind CSS 插件 — 通过 CSS 变量提供主题系统、12 套内置配色、语义化 token、可配置圆角与一组常用 utility，支持 Web / Native 双平台与运行时主题切换

构建于 [`@skyroc/color`](../../@core/color) 之上，与 [`@skyroc/web-admin-theme`](../admin-theme) 互不依赖：本包负责 Tailwind 端的样式系统，后者负责 React 状态与 Ant Design 集成。

## Features

- **CSS 变量驱动** — `:root` / `.dark` 双套变量，运行时切换主题无需重新构建
- **12 套内置主题** — `default` / `zinc` / `slate` / `stone` / `gray` / `neutral` / `red` / `rose` / `orange` / `green` / `blue` / `yellow` / `violet`，亮暗双模式开箱即用
- **语义化色阶** — `primary` / `destructive` / `success` / `warning` / `info` / `carbon` 自动展开 50–950 全色阶 + `DEFAULT` + `foreground`，由 `@skyroc/color` 推导
- **可配置圆角** — `--radius` 与 `rounded-sm/md/lg/xl` 联动，单一基准驱动整套圆角体系
- **Web / Native 双平台** — `web` 输出 `H S% L%` 三元组（支持 `bg-primary/50` alpha modifier），`native` 输出 hex
- **内置 utility** — `flex-center` / `flex-c` / `flex-1-hidden` / `i-flex-*` 等 13 个高频 flex utility + 4 个 shadcn 风格动画
- **根字号档** — `html.size-xs` ~ `size-2xl` 6 档，整体放缩 rem 体系
- **极小字号补足** — `text-2xs` / `text-3xs` / `text-4xs` 弥补 Tailwind 默认下限
- **覆盖友好** — 反馈色 / Sidebar 色独立可覆盖；`color: false` / `globals: false` 支持渐进集成
- **完整 TypeScript 类型** — `HslColorString` / `ThemeOptions` / `SkyrocUIPluginOptions` 等导出

## Installation

```bash
pnpm add -D @skyroc/tailwind-plugin tailwindcss
```

**Peer dependency**：`tailwindcss >= 3.4`

## Quick Start

### 1. 注册插件

```js
// tailwind.config.js
import { skyrocUIPlugin } from '@skyroc/tailwind-plugin';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [skyrocUIPlugin()]
};
```

### 2. 带选项配置

```js
import { skyrocUIPlugin } from '@skyroc/tailwind-plugin';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    skyrocUIPlugin({
      color: 'blue',     // 12 套内置主题之一
      radius: 0.75,      // 圆角基准（rem）
      platform: 'web',   // 'web' | 'native'
      globals: true,     // 是否注入 *.borderColor、body 全局样式
      darkSelector: '.dark'
    })
  ]
};
```

### 3. 在组件中使用

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground rounded-md px-4 py-2">
    主要按钮
  </button>

  <div className="bg-card border border-border rounded-lg p-4">
    <p className="text-muted-foreground">次要文字</p>
  </div>

  <div className="bg-primary-100 text-primary-900">浅色主背景</div>
  <div className="bg-destructive-500 text-destructive-foreground">错误状态</div>

  <div className="flex-center gap-2">居中内容</div>
</div>
```

### 4. 切换暗色

通过为根元素加 `.dark` 类即可（class 名由 `darkSelector` 决定）：

```ts
document.documentElement.classList.toggle('dark');
```

### 5. 自定义颜色（基于内置主题局部覆盖）

```ts
skyrocUIPlugin({
  color: {
    base: 'blue',
    light: { primary: '210 100% 50%' },
    dark: { primary: '210 100% 60%' }
  }
});
```

## Package Structure

```
src/
├── index.ts              skyrocUIPlugin 主入口（plugin.withOptions）
├── presets.ts            presetSkyrocUI()：flex-* / animate-* utility
├── themePresets.ts       skyrocUITheme()：base 样式（CSS 变量 + keyframes + html.size-* 字号档）
├── generate.ts           generateCSSVars / generateGlobalStyles + 色板生成
├── theme.json            12 套内置颜色主题的亮暗 CSS 变量（详见下方说明）
└── types.ts              类型定义（HslColorString / ThemeOptions ...）
```

## API 速览

| 导出 | 类型 | 说明 |
|------|------|------|
| `skyrocUIPlugin(options?)` | plugin | 主插件，同时完成 `addBase` + `addUtilities` + `theme.extend` |
| `skyrocUITheme(options)` | function | 返回 `addBase` 输入对象（CSS 变量 + 全局样式 + 字号档 + keyframes）|
| `presetSkyrocUI()` | function | 返回 `addUtilities` 输入对象（`flex-*` / `i-flex-*` / `animate-*`）|
| `generateCSSVars(theme, onlyOne?, native?)` | function | 底层 CSS 变量生成器，可在 SSR / 服务端单独使用 |
| `generateGlobalStyles()` | function | 返回 `*` / `body` / `.lucide` 全局样式片段 |
| `builtinColors` | const | 12 套内置颜色名数组 |
| `builtinColorMap` | const | 颜色名 → 主色 hsl 字符串映射 |
| `builtinRadiuses` | const | 可用圆角枚举 `[0, 0.3, 0.5, 0.75, 1]` |
| `SkyrocUIPluginOptions` / `ThemeOptions` / `ThemeConfig` / `ThemeColorKey` 等 | type | 完整类型导出 |

完整 API 文档（含字段说明、token 表格、设计取舍、Web/Native 差异）：见 [`apps/web-kit-docs/content/docs/tailwind-plugin.mdx`](../../../apps/web-kit-docs/content/docs/tailwind-plugin.mdx)。

## 主题颜色速查

**基础**：`background` / `foreground` / `card` / `card-foreground` / `popover` / `popover-foreground` / `muted` / `muted-foreground` / `accent` / `accent-foreground` / `border` / `input` / `ring` / `secondary` / `secondary-foreground`

**语义（含 50–950 色阶）**：`primary` / `destructive` / `warning` / `success` / `info` / `carbon`

**Sidebar**：`sidebar-background` / `sidebar-foreground` / `sidebar-primary[-foreground]` / `sidebar-accent[-foreground]` / `sidebar-border` / `sidebar-ring`

## 关于 `theme.json`

`theme.json` 是 **shadcn 风格的 13 套内置主题预设**（`default` + 12 套配色），里面的 `background` / `card` / `foreground` / `muted` / `accent` / `border` 等 surface 色由设计师为每套主题独立挑选，**不是**从某个基础色 (`primary`) 用算法预计算出来的缓存。

因此：

- 这份文件需要**手工维护**，不要尝试用脚本基于 `@skyroc/color` 重新生成（surface 色无法从 primary 推导）
- 运行时 `primary` / `destructive` / `success` / `warning` / `info` / `carbon` 的 50–950 色阶仍然通过 `@skyroc/color` 的 `getColorPalette` 实时算出（见 [generate.ts](src/generate.ts)）
- 如果只想增删一套配色，按现有 JSON 结构追加/删除即可；建议参考 shadcn/ui 的同名主题保持视觉一致

## 设计要点

- **`hsl(var(--xxx))` 而非 `var(--xxx)`**：变量存 `H S% L%` 三元组，使 `bg-primary/50` 这类 alpha modifier 可工作；Native 平台不需要 alpha modifier，因此存 hex
- **`radius` 用 rem 而非 px**：与 `html.size-*` 根字号档联动，圆角随字号比例缩放
- **keyframes 与 utility 分散注入**：`@keyframes` 通过 `addBase`、`animate-*` 通过 `addUtilities`，插件自动协调
- **覆盖式 API 设计**：`color`、`feedbackColor`、`sidebar` 三个 variant 独立可覆盖；`color: false` / `globals: false` 支持仅取部分能力的渐进集成

## Related Packages

- [`@skyroc/color`](../../@core/color) — OKLCH 色板生成与色彩工具
- [`@skyroc/web-admin-theme`](../admin-theme) — React 主题状态 + Ant Design 集成
- [`@skyroc/adapter-antd-theme`](../antd-theme) — Ant Design 主题算法适配

## License

MIT
