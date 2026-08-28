# @skyroc/color

专业级色彩工具包，提供三种调色板生成算法（Ant Design、推荐算法、OKLCH）、颜色格式转换、WCAG 无障碍对比度检测与暗色模式支持。

底层依赖 [colord](https://github.com/omgovich/colord)（基础颜色解析与转换）和 [culori](https://culorijs.org/)（OKLCH 色彩空间与 WCAG 对比度）。

## 特性

- **三种调色板生成算法**：Ant Design HSV 算法、基于 Tailwind 色板的推荐算法、OKLCH 感知均匀算法
- **基础颜色操作**：格式转换（hex/rgb/hsl/hsv）、混合、透明度、明暗调节
- **1500+ 色名匹配**：输入任意颜色，返回最近的自然语言色名
- **WCAG 无障碍**：对比度计算、AA/AAA 等级判断、自动推荐文字色
- **暗色模式**：反转明度曲线生成暗色主题色板
- **内置 Tailwind 色板数据**：22 个色族、每族 11 档（50–950）

## 安装

```bash
npm install @skyroc/color
```

## 架构

```
src/
├── types/          类型定义（ColorPalette、ColorPaletteNumber 等）
├── shared/         基础工具
│   ├── colord.ts     colord 封装（格式转换、混合、明暗调节等）
│   └── name.ts       色名匹配（1500+ 色名表惰性预解析 + 结果缓存）
├── constant/       内置数据
│   ├── name.ts       色名表 [hex, name][] + hex → name 映射
│   └── palette.ts    Tailwind 风格预设色板（22 个色族 × 11 档）
└── palette/        三种调色板生成算法
    ├── index.ts      统一入口（getColorPalette / getPaletteColorByNumber）
    ├── antd.ts       Ant Design HSV 算法（11 档，主色在第 6 档）
    ├── recommend.ts  推荐算法（deltaE 最近色族 + HSL 比例调整）
    └── oklch.ts      OKLCH 感知均匀算法（含 WCAG、暗色模式）
```

数据流向：

```
输入颜色 (any CSS color)
    │
    ├──► Ant Design 算法
    │     HSV 空间 → 色相偏移 + 饱和度/亮度步进 → 11 档色板
    │
    ├──► 推荐算法
    │     deltaE 匹配内置色族 → HSL 色相/饱和度比例映射 → 11 档色板
    │
    └──► OKLCH 算法
          OKLCH 空间 → 色度补偿 + 色相旋转 + sRGB 色域映射 → 11 档色板
                                                            + WCAG 对比度分析
                                                            + 暗色模式变体
```

## API

### 调色板生成 — 统一入口

#### `getColorPalette`

根据输入颜色生成 11 档色板。第二个参数可以直接传算法名，也可以传完整配置对象：

```ts
type ColorPaletteConfig =
  | PaletteAlgorithm
  | {
      algorithm?: PaletteAlgorithm; // default: 'antd'
      darkTheme?: boolean; // default: false，仅 antd 算法生效
      darkThemeMixColor?: string; // default: '#141414'，仅 antd 算法生效
    };

function getColorPalette(
  color: AnyColor,
  config?: ColorPaletteConfig // default: 'antd'
): Map<ColorPaletteNumber, string>;
```

```ts
import { getColorPalette } from '@skyroc/color';

const antdMap = getColorPalette('#1677ff');
console.log(antdMap.get(500)); // 主色

const recommendMap = getColorPalette('#1677ff', 'recommended');
const oklchMap = getColorPalette('#1677ff', 'oklch');

// antd 暗色主题变体
const darkMap = getColorPalette('#1677ff', { algorithm: 'antd', darkTheme: true });
```

输入颜色会被统一归一化为小写 6 位 hex，因此 `'#1677FF'`、`'rgb(22, 119, 255)'`、`'red'` 等写法产出的色板中不会混入原始字符串。

#### `getPaletteColorByNumber`

快捷取指定色阶的 hex 值：

```ts
function getPaletteColorByNumber(
  color: AnyColor,
  number: ColorPaletteNumber,
  config?: ColorPaletteConfig // default: 'antd'
): string;
```

```ts
import { getPaletteColorByNumber } from '@skyroc/color';

const hex = getPaletteColorByNumber('#1677ff', 200);
const oklchHex = getPaletteColorByNumber('#1677ff', 200, 'oklch');
const darkHex = getPaletteColorByNumber('#1677ff', 200, { darkTheme: true });
```

---

### 调色板生成 — Ant Design 算法

以输入色为第 6 档（主色），向浅色方向（1–5 档）递增亮度、递减饱和度，向深色方向（7–11 档）递减亮度、递增饱和度，同时对色相做小幅偏移。

#### `getAntDPaletteColorByIndex`

```ts
function getAntDPaletteColorByIndex(
  color: AnyColor,
  index: ColorIndex // 1-11，6 为主色
): string;
```

```ts
import { getAntDPaletteColorByIndex } from '@skyroc/color';

const main = getAntDPaletteColorByIndex('#1677ff', 6); // 主色
const light = getAntDPaletteColorByIndex('#1677ff', 1); // 最浅
const dark = getAntDPaletteColorByIndex('#1677ff', 11); // 最深
```

#### `getAntDColorPalette`

生成完整 11 档色板，支持暗色主题变体：

```ts
function getAntDColorPalette(
  color: AnyColor,
  darkTheme?: boolean, // default: false
  darkThemeMixColor?: string // default: '#141414'
): string[];
```

```ts
import { getAntDColorPalette } from '@skyroc/color';

// 亮色主题
const lightPalette = getAntDColorPalette('#1677ff');
// => ['#e6f4ff', '#bae0ff', ..., '#001d66', '#00114d']

// 暗色主题
const darkPalette = getAntDColorPalette('#1677ff', true);

// 自定义暗色混合底色
const customDark = getAntDColorPalette('#1677ff', true, '#1a1a2e');
```

---

### 调色板生成 — 推荐算法

通过 CIE76 色差（deltaE）在内置 Tailwind 色板中找到最近色族，然后以输入色与匹配色阶的 HSL 色相差和饱和度比率为基准，对该色族的每一档做色相偏移与饱和度缩放，生成风格一致的 11 档色板。

#### `getRecommendedColorPalette`

```ts
function getRecommendedColorPalette(color: string): ColorPaletteMatch;
```

```ts
import { getRecommendedColorPalette } from '@skyroc/color';

const result = getRecommendedColorPalette('#6366f1');
console.log(result.name); // 色族名
console.log(result.main.hex); // 500 档 hex
console.log(result.match.number); // 输入色最接近的色阶编号
console.log(result.colorMap.get(200)); // 取 200 档
```

#### `getRecommendedPaletteColorByNumber`

```ts
function getRecommendedPaletteColorByNumber(color: string, number: ColorPaletteNumber): string;
```

---

### 调色板生成 — OKLCH 算法

基于 [OKLCH](https://oklch.com/) 感知均匀色彩空间，灵感来自 Apple Human Interface Guidelines。相比 HSV/HSL，OKLCH 能保证不同色相在同一明度下的视觉亮度一致。

核心特性：

- **数据驱动明度曲线**：基于 Tailwind 官方色板的 OKLCH 分析数据
- **色相感知色度补偿**：不同色相有不同的最佳色度-明度曲线
- **Apple 风格色相旋转**：暖色越亮越偏黄、越暗越偏红；冷色反之
- **二分法 sRGB 色域映射**：在保留最大色彩饱满度的前提下确保 sRGB 可显示

#### `generateOklchPalette`

基础 OKLCH 色板生成：

```ts
function generateOklchPalette(color: string): ColorPaletteFamily;
```

```ts
import { generateOklchPalette } from '@skyroc/color';

const family = generateOklchPalette('#6366f1');
console.log(family.name); // 自动命名
console.log(family.palettes); // 11 档 { hex, number }[]
```

#### `getOklchColorPalette`

返回 `ColorPaletteMatch`，自动找到与输入色最接近的色阶：

```ts
function getOklchColorPalette(color: string): ColorPaletteMatch;
```

#### `getOklchPaletteColorByNumber`

快捷取指定色阶的 hex：

```ts
function getOklchPaletteColorByNumber(color: string, number: ColorPaletteNumber): string;
```

#### `generateOklchPaletteAdvanced`

支持自定义配置的高级生成：

```ts
function generateOklchPaletteAdvanced(color: string, options?: OklchPaletteOptions): ColorPaletteFamily;
```

```ts
import { generateOklchPaletteAdvanced } from '@skyroc/color';

// 关闭色相旋转，使用自定义明度曲线
const palette = generateOklchPaletteAdvanced('#6366f1', {
  appleHueShift: false,
  lightnessCurve: [0.97, 0.94, 0.89, 0.82, 0.74, 0.66, 0.58, 0.5, 0.43, 0.38, 0.26]
});

// 以 600 档为基准反推色度强度
const palette600 = generateOklchPaletteAdvanced('#6366f1', { forceStep: 600 });
```

> `lightnessCurve` 必须恰好 11 个值（顺序为 50 → 950），长度不符会直接抛错而不是静默回退。
>
> `forceStep` 只改变反推基准色度时参照的档位，**不会**把输入色原样放进该档——需要精确保留输入色请用 `generateOklchPaletteAnchored`。

#### `generateOklchPaletteAnchored`

精确保留输入色的增强版本。在匹配档位上使用原始输入色（不做任何近似），其余档位的明度曲线整体平移以穿过该点，并附带每档的 OKLCH 数值与 CSS 字符串：

```ts
function generateOklchPaletteAnchored(color: string, forceStep?: ColorPaletteNumber): ColorPaletteFamilyWithOklch;
```

```ts
import { generateOklchPaletteAnchored } from '@skyroc/color';

const result = generateOklchPaletteAnchored('#6366f1');
console.log(result.matchedStep); // 500
console.log(result.palettes[5].hex); // '#6366f1'（精确保留）
console.log(result.palettes[5].oklchCss); // 'oklch(55.69% 0.215 277.01)'
console.log(result.inputOklchCss); // 输入色的 OKLCH CSS

// 强制放在 600 档
const result600 = generateOklchPaletteAnchored('#6366f1', 600);
console.log(result600.palettes[6].hex); // '#6366f1'
```

> `generateOklchPaletteEx` 是本函数的旧别名，已标记 `@deprecated`，行为完全一致。

---

### WCAG 无障碍

#### `getContrastRatio`

计算两颜色之间的 WCAG 对比度（范围 1–21）：

```ts
function getContrastRatio(color1: string, color2: string): number;
```

#### `meetsWcagContrast`

判断对比度是否满足 WCAG 要求：

```ts
function meetsWcagContrast(
  ratio: number,
  level?: WcagLevel, // default: 'AA'
  textSize?: TextSize // default: 'normal'
): boolean;
```

| 等级 | 正常文字 | 大号文字 |
| ---- | -------- | -------- |
| AA   | >= 4.5   | >= 3.0   |
| AAA  | >= 7.0   | >= 4.5   |

```ts
import { getContrastRatio, meetsWcagContrast } from '@skyroc/color';

const ratio = getContrastRatio('#1677ff', '#ffffff');
meetsWcagContrast(ratio, 'AA', 'normal'); // false（4.5 要求）
meetsWcagContrast(ratio, 'AA', 'large'); // true（3.0 要求）
```

#### `generateOklchPaletteWithContrast`

生成色板并附带完整的 WCAG 对比度分析：

```ts
function generateOklchPaletteWithContrast(color: string): PaletteContrastInfo;
```

```ts
import { generateOklchPaletteWithContrast } from '@skyroc/color';

const info = generateOklchPaletteWithContrast('#1677ff');

// 查看各档与白色的对比度
info.contrastVsWhite.forEach((ratio, number) => {
  console.log(`${number}: ${ratio.toFixed(2)}`);
});

// 白底上满足 AA 的色阶
console.log(info.passAAonWhite); // e.g. [600, 700, 800, 900, 950]

// 每档推荐的文字颜色（黑或白）
console.log(info.recommendedTextColor.get(500)); // '#ffffff' 或 '#000000'
```

#### `findAccessibleTextColor`

在色板中找到满足 WCAG AA 标准的最佳文字色阶：

```ts
function findAccessibleTextColor(
  paletteColor: string,
  backgroundColor: string,
  preferDark?: boolean // default: true
): ColorPaletteNumber | null;
```

```ts
import { findAccessibleTextColor } from '@skyroc/color';

// 在白色背景上，用 #1677ff 色板中找深色文字
const step = findAccessibleTextColor('#1677ff', '#ffffff', true);
console.log(step); // e.g. 700

// 在深色背景上找浅色文字
const lightStep = findAccessibleTextColor('#1677ff', '#1a1a2e', false);
```

---

### 暗色模式

#### `generateDarkModePalette`

使用整体压暗的明度曲线生成暗色主题色板。**档位号语义与亮色色板一致**——50 最亮（L=0.96）、950 最暗（L=0.18），只是整条曲线比亮色色板更暗：

```ts
function generateDarkModePalette(color: string): ColorPaletteFamily;
```

```ts
import { generateDarkModePalette } from '@skyroc/color';

const darkPalette = generateDarkModePalette('#1677ff');
// darkPalette.palettes[0].hex  → 50 档（最亮）
// darkPalette.palettes[10].hex → 950 档（最暗）
```

> 暗色主题中需要深色背景时应取 900 / 950 档，而不是依赖档位号被翻转。这样 `--primary-50` 之类的 CSS 变量在明暗两套主题下含义保持一致。

---

### 基础颜色工具

#### 格式转换与校验

```ts
import { isValidColor, getHex, getRgb, getHsl, getHsv, transformHslToHex } from '@skyroc/color';

isValidColor('#1677ff'); // true
isValidColor('not-a-color'); // false

getHex('rgb(22, 119, 255)'); // '#1677ff'
getRgb('#1677ff'); // { r: 22, g: 119, b: 255, a: 1 }
getHsl('#1677ff'); // { h: 215, s: 100, l: 54, a: 1 }
getHsv('#1677ff'); // { h: 215, s: 91, v: 100, a: 1 }
transformHslToHex({ h: 215, s: 100, l: 54 }); // '#1677ff'
```

#### 色差计算

```ts
import { getDeltaE } from '@skyroc/color';

// CIE76 色差（0 = 完全相同，1 = 最大差异）
const delta = getDeltaE('#1677ff', '#1890ff');
console.log(delta); // e.g. 0.035
```

#### 透明度与混合

```ts
import { addColorAlpha, mixColor, transformColorWithOpacity } from '@skyroc/color';

addColorAlpha('#1677ff', 0.5); // '#1677ff80'
mixColor('#1677ff', '#ff4d4f', 0.5); // 50% 混合

// 将半透明色转为在指定背景上的不透明近似色
transformColorWithOpacity('#1677ff', 0.3); // 白底近似
transformColorWithOpacity('#1677ff', 0.3, '#000000'); // 黑底近似
```

#### 明暗调节

```ts
import { adjustLightness, lightenColor, darkenColor, isWhiteColor } from '@skyroc/color';

adjustLightness('#1677ff', 20); // 变亮（正数）
adjustLightness('#1677ff', -20); // 变暗（负数）
lightenColor('#1677ff', 20);
darkenColor('#1677ff', 20);
isWhiteColor('#ffffff'); // true
```

#### 色名匹配

在 1500+ 色名表中查找最近匹配，算法综合 RGB 欧氏距离和 HSL 距离（HSL 权重 2 倍）：

```ts
import { getColorName } from '@skyroc/color';

getColorName('#1677ff'); // e.g. 'Dodger Blue'
getColorName('#ff0000'); // 'Red'
getColorName('#2ecc71'); // e.g. 'Shamrock'
```

---

### 内置数据

#### `colorPalettes`

Tailwind 风格的预设色板，包含 22 个色族，每族 11 档（50–950）：

```ts
import { colorPalettes } from '@skyroc/color';

// 22 个色族
// ['Slate', 'Gray', 'Zinc', 'Neutral', 'Stone',
//  'Red', 'Orange', 'Amber', 'Yellow', 'Lime',
//  'Green', 'Emerald', 'Teal', 'Cyan', 'Sky',
//  'Blue', 'Indigo', 'Violet', 'Purple', 'Fuchsia',
//  'Pink', 'Rose']

const bluePalette = colorPalettes.find(f => f.name === 'Blue');
console.log(bluePalette?.palettes);
// [{ hex: '#eff6ff', number: 50 }, ..., { hex: '#172554', number: 950 }]
```

---

## 三种算法对比

|                   | Ant Design           | 推荐算法            | OKLCH                            |
| ----------------- | -------------------- | ------------------- | -------------------------------- |
| **色彩空间**      | HSV                  | HSL + deltaE        | OKLCH（感知均匀）                |
| **色阶数量**      | 11 档（索引 1-11）   | 11 档（50-950）     | 11 档（50-950）                  |
| **主色位置**      | 第 6 档              | 500 档              | 500 档（可自定义）               |
| **感知均匀性**    | 一般                 | 依赖预设数据        | 优秀                             |
| **色度补偿**      | 无                   | 无                  | 有（按色相族自适应）             |
| **色相旋转**      | 线性偏移             | 等比映射            | Apple 风格自然旋转               |
| **暗色模式**      | 混色法               | 不支持              | 反转明度曲线                     |
| **WCAG**          | 不支持               | 不支持              | 完整支持                         |
| **sRGB 色域映射** | 无                   | 无                  | 二分法精确映射                   |
| **OKLCH 值输出**  | 不支持               | 不支持              | 支持（`generateOklchPaletteEx`） |
| **适用场景**      | 兼容 Ant Design 生态 | Tailwind 风格一致性 | 设计系统、无障碍要求高的场景     |

**选择建议：**

- 需要与 Ant Design 组件库保持一致 → **Ant Design 算法**
- 希望生成的色板风格接近 Tailwind 预设 → **推荐算法**
- 追求感知均匀、需要 WCAG 合规、或构建独立设计系统 → **OKLCH 算法**

---

## 使用场景

### 主题色生成

从品牌色一键生成完整色板，输出 CSS 变量或设计 Token：

```ts
import { generateOklchPaletteEx } from '@skyroc/color';

const brand = generateOklchPaletteEx('#6366f1');

brand.palettes.forEach(({ hex, number, oklchCss }) => {
  console.log(`--color-primary-${number}: ${hex};`);
  console.log(`--color-primary-${number}-oklch: ${oklchCss};`);
});
```

### 无障碍合规检测

```ts
import { generateOklchPaletteWithContrast } from '@skyroc/color';

const info = generateOklchPaletteWithContrast('#1677ff');

console.log('白底 AA 合规色阶:', info.passAAonWhite);

info.recommendedTextColor.forEach((textColor, step) => {
  console.log(`${step} 档背景 → 文字用 ${textColor}`);
});
```

### 亮色/暗色主题切换

```ts
import { generateOklchPalette, generateDarkModePalette } from '@skyroc/color';

const brandColor = '#1677ff';
const lightPalette = generateOklchPalette(brandColor);
const darkPalette = generateDarkModePalette(brandColor);
// 两套色板档位语义一致：50 最浅 → 950 最深
// 区别在于暗色整条明度曲线被压暗，深色背景取 900 / 950 档
```

### 透明色转不透明

适合不支持透明度的渲染环境（邮件客户端、PDF 等）：

```ts
import { transformColorWithOpacity } from '@skyroc/color';

const opaqueOnWhite = transformColorWithOpacity('#1677ff', 0.3);
const opaqueOnDark = transformColorWithOpacity('#1677ff', 0.3, '#1a1a2e');
```

---

## 核心类型

```ts
// 色阶编号
type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

// Ant Design 算法索引（1-11，6 为主色）
type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// 算法选择
type PaletteAlgorithm = 'antd' | 'oklch' | 'recommended';

// 统一入口配置：直接给算法名，或给完整配置对象
type ColorPaletteConfig =
  | PaletteAlgorithm
  | {
      algorithm?: PaletteAlgorithm;
      darkTheme?: boolean;
      darkThemeMixColor?: string;
    };

// WCAG
type WcagLevel = 'AA' | 'AAA';
type TextSize = 'normal' | 'large';

// 单档
type ColorPalette = { hex: string; number: ColorPaletteNumber };

// 色族
type ColorPaletteFamily = { name: string; palettes: ColorPalette[] };

// 匹配结果
type ColorPaletteMatch = ColorPaletteFamily & {
  colorMap: Map<ColorPaletteNumber, ColorPalette>;
  main: ColorPalette; // 500 档
  match: ColorPalette; // 与输入色最接近的档
};

// OKLCH 高级选项
interface OklchPaletteOptions {
  appleHueShift?: boolean; // 是否启用 Apple 风格色相旋转，default: true
  chromaCompensation?: boolean; // 是否启用色度补偿，default: true
  lightnessCurve?: number[]; // 自定义明度曲线（11 个值，从亮到暗）
  forceStep?: ColorPaletteNumber; // 强制将输入色放在指定色阶
  includeOklch?: boolean; // 是否在输出中包含 OKLCH 值，default: false
}

// 带 OKLCH 数值的扩展类型
interface ColorPaletteWithOklch extends ColorPalette {
  oklch: { l: number; c: number; h: number };
  oklchCss: string; // e.g. "oklch(58.5% 0.204 277.1)"
}

interface ColorPaletteFamilyWithOklch {
  name: string;
  palettes: ColorPaletteWithOklch[];
  matchedStep: ColorPaletteNumber;
  inputOklch: { l: number; c: number; h: number };
  inputOklchCss: string;
}

// WCAG 对比度分析结果
interface PaletteContrastInfo {
  palette: ColorPaletteFamily;
  contrastVsWhite: Map<ColorPaletteNumber, number>;
  contrastVsBlack: Map<ColorPaletteNumber, number>;
  passAAonWhite: ColorPaletteNumber[];
  passAAonBlack: ColorPaletteNumber[];
  recommendedTextColor: Map<ColorPaletteNumber, '#ffffff' | '#000000'>;
}
```

## License

MIT
