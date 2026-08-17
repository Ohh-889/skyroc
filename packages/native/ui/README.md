# @skyroc/native-ui

React Native 组件库，基于 [Uniwind](https://docs.uniwind.dev)（Tailwind CSS v4 for React Native）。

设计令牌与 `@skyroc/web-ui` 共用 `@skyroc/ui-tokens` 这一份来源，因此三端（web / native / miniapp）颜色与圆角保持一致。

## 安装

```bash
pnpm add @skyroc/native-ui uniwind tailwindcss
```

`react`、`react-native`、`uniwind`、`tailwindcss` 都是 peer 依赖，由宿主 App 提供。

## 接入

Uniwind 的全部构建期配置都在**宿主 App**，本库不需要任何 metro / babel 配置。

### 1. metro.config.js

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// withUniwindConfig 必须是最外层 wrapper
module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts'
});
```

### 2. global.css

```css
@import 'tailwindcss';
@import 'uniwind';
@import '@skyroc/native-ui/theme.css';

/* Tailwind v4 以 global.css 所在目录为扫描根，库的 className 必须显式声明 */
@source '../../packages/native/ui/src';
```

> 从 npm 安装（而非 workspace 软链）时，Tailwind v4 默认跳过 `node_modules`，`@source` 要改成
> `@source '../node_modules/@skyroc/native-ui/dist';`

### 3. 在根组件导入

```tsx
// app/_layout.tsx
import '../global.css';
```

不要在 `index.ts` / `index.js` 里导入，会让热更新退化成整包重载。

## 使用

```tsx
import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

export const Demo = () => (
  <View className="gap-3 bg-background p-4">
    <Button onPress={submit}>提交</Button>
    <Button
      color="destructive"
      variant="outline"
    >
      删除
    </Button>
    <Button
      loading={submitting}
      shape="rounded"
      size="lg"
    >
      保存
    </Button>
  </View>
);
```

## 主题

`src/styles/theme.css` 用 Tailwind v4 的 `@layer theme` + `@variant light/dark` 定义 CSS 变量，组件里一律写语义类名
（`bg-primary`、`text-foreground`），不写 `dark:` 前缀，切主题自动生效：

```tsx
import { Uniwind } from 'uniwind';

Uniwind.setTheme('dark'); // 'light' | 'dark' | 'system'
```

新增自定义主题时，**必须**在每个 `@variant` 里声明完全相同的一组变量，否则 Uniwind 会在运行时报错；同时要在
`metro.config.js` 的 `extraThemes` 里注册。

## 编写组件的约束

1. **className 必须是完整字面量**。Tailwind 在构建期扫描源码文本，`bg-${color}` 这类拼接不会产出任何样式。用
   `tailwind-variants` 的 `compoundVariants` 或映射对象。
2. **RN 不继承文字样式**。文字颜色要落在 `<Text>` 上，所以组件用 `tv({ slots })` 拆出 `root` / `label` 等插槽。
3. **非 style 的颜色属性走 `accent-` 通道**。`ActivityIndicator` 的 `color`、`TextInput` 的 `placeholderTextColor`
   等不属于 `style`，必须用对应的 `{prop}ClassName` + `accent-` 前缀。
4. **不要用 `withUniwind` 包 `react-native` 组件**。`View` / `Text` / `Pressable` 等原生就支持 `className`，包一层反而
   会破坏行为；`withUniwind` 只用于第三方组件（`expo-image`、`expo-blur` 等）。
5. **合并外部 className 一律走 `cn()`**。Uniwind 不做去重，冲突的工具类会同时生效且结果不确定。
6. 组件写法遵循仓库根 `CLAUDE.md` 的 React 规范：箭头函数组件、props 独立 interface 且每个字段有注释、函数体第一行解构
   props、禁用 `useCallback`。

## 开发

```bash
pnpm --filter @skyroc/native-ui typecheck
pnpm --filter @skyroc/native-ui build

# 调试台
pnpm --filter native-ui-playground start
```
