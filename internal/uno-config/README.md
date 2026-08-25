# @skyroc/uno-config

SoyBean Admin 的 UnoCSS 预设配置，包含主题系统、颜色调色板、快捷方式和 UI Kit 扫描器。

## 特性

- 🎨 **主题系统**: 13 种内置主题颜色，支持亮色/暗色模式
- 🌈 **颜色调色板**: 自动生成 50-950 色阶和语义化颜色别名
- ⚡ **快捷方式**: 常用的 Flex、Position、Text 快捷类
- 🎬 **动画支持**: Accordion、Collapsible、Enter 动画
- 📦 **UI Kit 扫描器**: 自动扫描 ui-kit 目录下的组件源文件

## 安装

```bash
pnpm add @skyroc/uno-config
```

## 基础使用

```ts
// uno.config.ts
import { presetSoybeanAdmin } from '@skyroc/uno-config';
import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
  presets: [presetWind4({ dark: 'class' }), presetSoybeanAdmin()]
});
```

## UI Kit 扫描器

扫描器可以自动检测 `ui-kit` 目录下所有子包的源文件，并生成 UnoCSS 内容配置。

### 使用方式

#### 方式 1: 使用 `createUnoContentConfig` (推荐)

最简单的方式，直接生成 UnoCSS 内容配置：

```ts
// uno.config.ts
import { createUnoContentConfig, presetSoybeanAdmin } from '@skyroc/uno-config';
import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
  content: {
    filesystem: [
      // 自动扫描 ui-kit 目录
      ...createUnoContentConfig(),
      // 你的应用源文件
      'src/**/*.{ts,tsx}'
    ]
  },
  presets: [presetWind4({ dark: 'class' }), presetSoybeanAdmin()]
});
```

#### 方式 2: 使用 `scanUiKitPackagesSync` (同步)

需要更多控制时使用：

```ts
import { scanUiKitPackagesSync } from '@skyroc/uno-config';

const result = scanUiKitPackagesSync({
  workspaceRoot: process.cwd(),
  uiKitRoot: 'ui-kit',
  pattern: '**/*.{ts,tsx}',
  exclude: ['node_modules', 'dist', '__tests__']
});

console.log('Found packages:', result.packages.length);
console.log('Total files:', result.allFiles.length);

// 使用在 UnoCSS 配置中
export default defineConfig({
  content: {
    filesystem: result.allFilesRelative
  }
});
```

#### 方式 3: 使用 `scanUiKitPackages` (异步)

```ts
import { scanUiKitPackages } from '@skyroc/uno-config';

const result = await scanUiKitPackages({
  workspaceRoot: process.cwd()
});

console.log('Found packages:', result.packages);
```

### 配置选项

```ts
interface UiKitScannerOptions {
  /**
   * ui-kit 目录的根路径
   * @default 'ui-kit'
   */
  uiKitRoot?: string;

  /**
   * 要扫描的文件模式
   * @default '**\/*.{ts,tsx}'
   */
  pattern?: string;

  /**
   * 要排除的目录
   * @default ['node_modules', 'dist', '__tests__', '**\/*.test.{ts,tsx}', '**\/*.spec.{ts,tsx}']
   */
  exclude?: string[];

  /**
   * 工作区根目录（用于解析相对路径）
   */
  workspaceRoot?: string;
}
```

### 返回结果

```ts
interface ScanResult {
  /**
   * 所有子包
   */
  packages: UiKitPackage[];

  /**
   * 所有源文件路径（绝对路径）
   */
  allFiles: string[];

  /**
   * 所有源文件路径（相对于工作区的相对路径）
   */
  allFilesRelative: string[];
}

interface UiKitPackage {
  /**
   * 子包名称
   */
  name: string;

  /**
   * 子包路径
   */
  path: string;

  /**
   * 源文件列表
   */
  files: string[];
}
```

## 示例

运行示例代码：

```bash
cd internal/uno-config
pnpm tsx example-scanner.ts
```

## 主题颜色

### 内置主题

- default
- zinc
- slate
- stone
- gray
- neutral
- red
- rose
- orange
- green
- blue
- yellow
- violet

### 主题色键

- `primary`
- `info`
- `success`
- `warning`
- `error`

### 颜色调色板

每种主题色都有完整的色阶和语义化别名：

- **色阶**: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`
- **语义别名**:
  - `DEFAULT`: 默认颜色
  - `bg`, `bg-hover`: 背景颜色
  - `border`, `border-hover`: 边框颜色
  - `hover`, `active`: 交互状态
  - `text`, `text-hover`, `text-active`: 文本颜色
  - `light`, `lighter`, `lightest`: 浅色系列

### 使用示例

```tsx
// 主题色
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-success text-success-foreground">Success</div>

// 色阶
<div className="bg-primary-50">Very light</div>
<div className="bg-primary-500">Medium</div>
<div className="bg-primary-900">Very dark</div>

// 语义化颜色
<div className="bg-primary-bg">Background</div>
<div className="bg-primary-hover">Hover state</div>
<div className="border border-primary-border">Border</div>
<div className="text-primary-text">Text</div>
```

## 文本变体

内置文本颜色变体：

- `text-base`: 基础文本
- `text-secondary`: 次要文本
- `text-tertiary`: 第三级文本
- `text-quaternary`: 第四级文本
- `text-placeholder`: 占位符文本
- `text-disabled`: 禁用文本
- `text-heading`: 标题文本
- `text-label`: 标签文本
- `text-description`: 描述文本
- `text-light-solid`: 浅色实心文本

## 快捷方式

### Flex 快捷方式

- `flex-center`: 水平垂直居中
- `flex-col-center`: 垂直方向居中
- `flex-x-center`: 水平居中
- `flex-y-center`: 垂直居中

### Position 快捷方式

- `absolute-lt`: 左上角
- `absolute-rt`: 右上角
- `absolute-lb`: 左下角
- `absolute-rb`: 右下角
- `absolute-center`: 居中
- `fixed-lt`, `fixed-rt`, `fixed-lb`, `fixed-rb`, `fixed-center`

### Text 快捷方式

- `nowrap-hidden`: 单行截断
- `ellipsis-text`: 省略号截断

## 动画

- `animate-accordion-down`
- `animate-accordion-up`
- `animate-collapsible-down`
- `animate-collapsible-up`
- `enter-x:nth-child(n)`: 从右侧进入
- `-enter-x:nth-child(n)`: 从左侧进入
- `enter-y:nth-child(n)`: 从下方进入
- `-enter-y:nth-child(n)`: 从上方进入

## License

MIT
