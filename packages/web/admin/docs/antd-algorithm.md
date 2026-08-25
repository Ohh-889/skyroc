# antd-algorithm — Ant Design 主题算法

> Ant Design 主题算法适配器 — 用 OKLCH 感知均匀色彩空间替换默认调色板生成器，输出符合 Ant Design token 规范的完整色彩与样式 token。

## 概述

`src/antd-algorithm/` 是 `@shell/theme` 的内部算法层，解决一个核心问题：

**Ant Design 默认使用 HSV 色彩空间生成调色板，感知均匀性差，不同色相在同一档位上视觉亮度不一致。** 本包用 OKLCH 算法替换这一过程，同时保留 Ant Design `algorithm` 接口的完整兼容性。

核心能力：

- **OKLCH 调色板生成**：输入任意 hex 色，生成 11 档（50–950 / 1–10）感知均匀色板
- **Ant Design 主题算法**：导出 `derivative` / `derivativeDark`，可直接注入 `ConfigProvider.theme.algorithm`
- **完整 token 生成**：颜色、字体、圆角、间距、控件高度的 token 生成器
- **语义色映射**：将色板映射为 Ant Design 语义色（Bg / BgHover / Border / BorderHover / Hover / Active / Text / TextHover / TextActive）
- **预设色族**：内置 13 个 Tailwind 风格预设色（blue / red / green / purple ...）
- **TypeScript 优先**：完整类型导出，与 `antd/lib/theme/interface` 对齐

## 定位

本层原先是独立包 `@skyroc/adapter-antd-theme`（后随 `@skyroc/web-admin-theme` 一起并入 shell），但全仓库只有
`src/antd/shared.ts` 一个消费者，已并入本包，不再单独发布。

它不在 `@shell/theme` 的公开 `exports` 中——应用层用
`getAntdTheme()` / `AntdProvider` 即可，无需直接触碰算法。下文的代码示例
面向的是本包内部的开发者。

**Peer dependencies**：`antd >= 5.0.0`

## 架构

```
src/
├── algorithm/
│   ├── default/             亮色 theme algorithm
│   │   ├── index.ts           derivative 导出
│   │   └── colors.ts          generateColorPalettes / generateNeutralColorPalettes
│   └── dark/                暗色 theme algorithm
│       ├── index.ts           derivativeDark 导出
│       └── colors.ts          暗色版调色板生成器
├── seed/                    种子 token
│   └── index.ts               defaultPresetColors / seedToken
├── shared/                  跨亮暗模式共享的 token 生成器
│   ├── genColorMapToken.ts    色板 → Ant Design color token map
│   ├── genFontMapToken.ts     字体 token（基于 UnoCSS rem 体系）
│   ├── genRadiusMapToken.ts   圆角 token
│   ├── genSizeMapToken.ts     间距 / 尺寸 token
│   ├── genCommonMapToken.ts   通用 token（动效、线宽等）
│   ├── genControlHeight.ts    控件高度 token
│   └── colorAlgorithm.ts      adjustLightness / lightenColor / darkenColor / mixColor
├── types/                   类型定义
└── index.ts                 公共 API 导出
```

## 快速上手

### 1. 注入 Ant Design theme algorithm

```tsx
import { ConfigProvider } from 'antd';
import { derivative, derivativeDark } from '../antd-algorithm';

function App({ isDark }: { isDark: boolean }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: [isDark ? derivativeDark : derivative],
        token: {
          colorPrimary: '#6366F1'
        }
      }}
    >
      <YourApp />
    </ConfigProvider>
  );
}
```

`derivative` / `derivativeDark` 完全符合 `DerivativeFunc<SeedToken, MapToken>` 类型约束，可直接替换 `theme.defaultAlgorithm` / `theme.darkAlgorithm`，无需改动任何 Ant Design 组件。

### 2. 使用预设色 + 自定义种子

```tsx
import { ConfigProvider } from 'antd';
import { defaultPresetColors, derivative, seedToken } from '../antd-algorithm';

<ConfigProvider
  theme={{
    algorithm: [derivative],
    token: {
      ...seedToken,            // 默认 fontSize=14、borderRadius=6 + 全部预设色
      ...defaultPresetColors,  // 仅注入 22 个预设色族
      colorPrimary: '#6366F1'
    }
  }}
>
  {children}
</ConfigProvider>
```

### 3. 单独生成调色板

```ts
import {
  generateColorPalettes,
  generateDarkColorPalettes
} from '../antd-algorithm';

const palette = generateColorPalettes('#6366F1');
// palette[1]  → 最浅背景色
// palette[6]  → 主色（接近原色）
// palette[10] → 最深色

const darkPalette = generateDarkColorPalettes('#6366F1');
```

### 4. 单独生成完整 color token

```ts
import { genColorMapToken } from '../antd-algorithm';
import { generateNeutralColorPalettes } from '../antd-algorithm';

const colorToken = genColorMapToken(
  {
    colorPrimary: '#6366F1',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#F43F5E',
    colorInfo: '#0EA5E9',
    colorBgBase: '#ffffff',
    colorTextBase: '#000000'
  } as any,
  { generateNeutralColorPalettes }
);
// colorToken 含中性色 + 蒙版 colorBgMask + colorWhite
```

## API 参考

### Theme Algorithm

#### `derivative`

亮色主题算法，注入 `ConfigProvider.theme.algorithm`。

```ts
import type { DerivativeFunc } from '@ant-design/cssinjs';
import type { MapToken, SeedToken } from 'antd/lib/theme/interface';

const derivative: DerivativeFunc<SeedToken, MapToken>;
```

内部流程：

```
seedToken.colorPrimary
    │
    ▼
generateColorPalettes(color)   ← OKLCH 生成 11 档色板
    │
    ▼
色板映射到 Ant Design index 1–10：
  50  → 1   (最浅背景)
  100 → 2
  200 → 3   (边框)
  300 → 4
  400 → 5   (hover)
  500 → 6   (主色)
  600 → 7   (active)
  700 → 8
  800 → 9   (文字)
  900 → 10
    │
    ▼
genColorMapToken / genFontMapToken / genRadiusMapToken /
genSizeMapToken / genControlHeight / genCommonMapToken
    │
    ▼
完整 MapToken（语义色 + 字号 + 圆角 + 间距 + 控件高度）
```

对预设色（`blue` / `geekblue` / `red` ... 非 `color` 前缀）只输出 `palette vars`（`blue-1`...`blue-10`、`blue-50`...`blue-950`）；对功能色（`colorPrimary` / `colorSuccess` / `colorWarning` / `colorError` / `colorInfo`）额外输出全部语义色变体。

#### `derivativeDark`

暗色主题算法，暗色模式下替换 `derivative`。

暗色模式对色板的语义映射做了特殊处理：

| 语义 token              | 亮色来源        | 暗色来源              |
| --------------------- | ----------- | ----------------- |
| `colorPrimaryBg`      | palette[1]  | palette[3]（边框色）   |
| `colorPrimaryBgHover` | palette[2]  | palette[4]        |

参考 Ant Design 官方实现 [issue#30524](https://github.com/ant-design/ant-design/issues/30524#issuecomment-871961867)，使用 `colorPrimaryBorder` 作为选中项背景，提升暗色场景下的视觉反馈。

---

### 调色板生成

| 函数                                | 说明                                    |
| --------------------------------- | ------------------------------------- |
| `generateColorPalettes(color)`    | 亮色模式调色板，返回 `Record<number, string>`，键为 1–10 与 50–950 |
| `generateDarkColorPalettes(color)` | 暗色模式调色板（明度曲线反转）                       |
| `generateNeutralColorPalettes(bg, text)` | 亮色中性色（背景、文字、边框）                       |
| `generateDarkNeutralColorPalettes(bg, text)` | 暗色中性色                                 |

```ts
import { generateColorPalettes } from '../antd-algorithm';

const palette = generateColorPalettes('#6366F1');
// palette[6]  → 主色
// palette[500] → 同上（Tailwind 索引等价）
```

---

### Token 生成器

#### `genColorMapToken`

将种子 token 转为 Ant Design `ColorMapToken`，仅生成中性色（背景、文字、边框、蒙版），功能色由 `derivative` / `derivativeDark` 主流程注入。

```ts
function genColorMapToken(
  seed: SeedToken,
  options: { generateNeutralColorPalettes: GenerateNeutralColorMap }
): ColorMapToken;
```

每个功能色（primary / success / warning / error / info）会派生出完整语义链：

```
colorXxx           主色
colorXxxBg         背景（最浅）
colorXxxBgHover    背景 hover
colorXxxBorder     边框
colorXxxBorderHover 边框 hover
colorXxxHover      hover
colorXxxActive     active（按下）
colorXxxText       文字
colorXxxTextHover  文字 hover
colorXxxTextActive 文字 active
```

#### `genFontMapToken(baseFontSize = 16)`

基于 UnoCSS rem 体系生成字体 token，包含 `fontSize` / `fontSizeLG` / `fontSizeSM` / `fontSizeXL` / `fontSizeHeading1`-`5`、`lineHeight*`，并扩展 `TextXs`-`Text9xl` 与 `LineHeightXs`-`LineHeight9xl`，覆盖 12px ~ 128px 全档位。

```ts
import { genFontMapToken, FONT_SIZES, LINE_HEIGHTS } from '../antd-algorithm';

const fontTokens = genFontMapToken(16);
// fontSize: 16, fontSizeSM: 14, fontSizeLG: 18, fontSizeXL: 20
// fontSizeHeading1: 48, fontSizeHeading5: 20
// TextXs: 12, ..., Text9xl: 128
```

#### `genRadiusMapToken(borderRadius = 6)`

```ts
import { genRadiusMapToken, genExtendedRadiusToken } from '../antd-algorithm';

genRadiusMapToken(6);
// { borderRadiusXS: 2, borderRadiusSM: 4, borderRadius: 6, borderRadiusLG: 8, borderRadiusOuter: 4 }

genExtendedRadiusToken(6);
// 在上面基础上增加 borderRadiusXL/2XL/3XL/4XL/Full
```

#### `genSizeMapToken(sizeUnit = 4)`

```ts
import { genSizeMapToken } from '../antd-algorithm';

genSizeMapToken(4);
// sizeXXS: 4, sizeXS: 8, sizeSM: 12, size: 16, sizeMD: 20,
// sizeLG: 24, sizeXL: 32, sizeXXL: 48
```

#### `genCommonMapToken(seed)` / `genControlHeight(seed)`

通用 token（动画时长、线宽等）与控件高度（`controlHeight` / `controlHeightSM` / `controlHeightLG` ...），与 Ant Design 默认行为对齐。

---

### 工具函数

#### `genPaletteVars(name, palette)`

生成 CSS 变量格式的调色板，同时输出 antd 与 Tailwind 两种索引：

```ts
import { genPaletteVars, generateColorPalettes } from '../antd-algorithm';

const palette = generateColorPalettes('#6366F1');
genPaletteVars('primary', palette);
// {
//   'primary-1':  '#...',  'primary-2':  '#...',  ... 'primary-10': '#...',
//   'primary-50': '#...',  'primary-100': '#...', ... 'primary-950': '#...'
// }
```

#### `genSemanticColors({ name, colors, config })`

按 `SemanticColorConfig` 把色板映射为完整语义色对象。`name` 同时支持 `colorPrimary` / `Primary` / `primary` 三种写法。

```ts
import {
  FUNCTIONAL_SEMANTIC_CONFIG,
  PRIMARY_SEMANTIC_CONFIG,
  generateColorPalettes,
  genSemanticColors
} from '../antd-algorithm';

const colors = generateColorPalettes('#10B981');
genSemanticColors({
  name: 'colorSuccess',
  colors,
  config: FUNCTIONAL_SEMANTIC_CONFIG
});
// { colorSuccess, colorSuccessBg, colorSuccessBgHover, colorSuccessBorder, ... }
```

#### 颜色工具（来自 `@skyroc/color`）

```ts
import {
  adjustLightness,
  darkenColor,
  lightenColor,
  mixColor
} from '../antd-algorithm';

adjustLightness('#6366F1', 20);        // 调亮 20%
adjustLightness('#6366F1', -20);       // 调暗 20%
lightenColor('#6366F1', 20);
darkenColor('#6366F1', 20);
mixColor('#6366F1', '#ffffff', 0.3);   // 混合
```

---

### 种子 token

#### `defaultPresetColors`

内置 Tailwind 风格的预设色（含 13 个色族 + 5 个功能色），可直接注入 `ConfigProvider.theme.token`：

| 类别  | 色族                                   |
| --- | ------------------------------------ |
| 蓝   | `blue` `geekblue` `cyan`             |
| 紫粉  | `purple` `magenta` `pink`            |
| 红橙  | `red` `orange` `volcano`             |
| 黄金  | `yellow` `gold`                      |
| 绿   | `green` `lime`                       |
| 功能色 | `colorPrimary` `colorInfo` `colorSuccess` `colorWarning` `colorError` |

#### `seedToken`

在 `defaultPresetColors` 基础上补充默认 `fontSize: 14`、`borderRadius: 6`，可作为 `theme.token` 的初始值。

---

### 常量

| 常量                | 说明                                                        |
| ----------------- | --------------------------------------------------------- |
| `ANTD_INDEXES`    | Ant Design 色板索引数组 `[1, 2, ..., 10]`                       |
| `TAILWIND_INDEXES`| Tailwind 色阶数组 `[50, 100, ..., 950]`                       |
| `LIGHT_BG_BASE`   | 亮色模式背景基准                                                  |
| `LIGHT_TEXT_BASE` | 亮色模式文字基准                                                  |
| `DARK_BG_BASE`    | 暗色模式背景基准                                                  |
| `DARK_TEXT_BASE`  | 暗色模式文字基准                                                  |
| `FONT_SIZES` / `LINE_HEIGHTS` | UnoCSS 风格 rem 字号与行高表（xs ~ 9xl）                |
| `RADIUS_MULTIPLIERS` | 圆角倍率表（none / xs / sm / md / lg / xl / 2xl / 3xl / 4xl / full） |
| `SPACING_MULTIPLIERS` | 间距倍率表（3xs / 2xs / xs / md / lg / xl / 2xl ... 9xl）    |
| `PRIMARY_SEMANTIC_CONFIG` | 主色语义映射配置                                          |
| `FUNCTIONAL_SEMANTIC_CONFIG` | 功能色语义映射配置（hover 走 4 档）                         |

---

### 类型导出

```ts
import type {
  // 来自 antd 的转出
  ColorMapToken,
  ColorNeutralMapToken,
  MapToken,
  SeedToken,

  // 包内类型
  ColorMap,
  GenerateColorMap,
  GenerateNeutralColorMap,
  PaletteGenerators,
  SemanticColorConfig,
  RadiusMapToken,
  ExtendedRadiusToken,
  RadiusSizeKey,
  SpacingSizeKey,
  FontSizeKey,
  ExtendedFontMapToken
} from '../antd-algorithm';
```

---

## 设计说明

### 为什么选 OKLCH

HSV / HSL 在感知上是不均匀的：黄色在 50% 亮度时视觉亮度接近 90%，蓝色接近 30%。同一色板索引下，不同色相的视觉重量差异很大，导致多主题切换时界面一致性差。

OKLCH（Oklab 的柱坐标系）在相同 L 值下保证跨色相的感知亮度一致，是目前 CSS Color Level 4 推荐的感知均匀色彩空间。

### 为什么不直接用 `@ant-design/colors`

Ant Design 官方基于 HSV 的 `generate()` 函数主色固定在第 6 档，对色相的偏移量是硬编码的线性值，在暖色（橙、黄）上会产生明显的色相漂移，且没有 sRGB 色域夹紧，部分颜色超出显示范围会被截断。

本包的 OKLCH 生成器使用二分法做 sRGB 色域映射，并基于 Tailwind 官方色板的 OKLCH 分析数据拟合明度曲线，保证生成结果在各主流显示设备上的可显示性。

### 与 Ant Design 的兼容性

`derivative` / `derivativeDark` 完全符合 `DerivativeFunc<SeedToken, MapToken>` 类型约束，接受标准 `SeedToken`，返回标准 `MapToken`，不需要修改任何 Ant Design 组件，直接替换 `algorithm` 即可生效。

## 关联包

- [`@skyroc/color`](../../color) — OKLCH 调色板核心算法
- [`@skyroc/web-theme`](../web-theme) — Web 主题（配置、预设、hooks、CSS 变量）
- [`@skyroc/tailwind-plugin`](../tailwind-plugin) — Tailwind CSS 主题插件

## License

[MIT](../../../LICENSE) License © 2024-PRESENT [Ohh](https://github.com/Ohh-889)
