# @skyroc/native-ui

面向 React Native / Expo 的移动端组件库，使用 [Uniwind](https://docs.uniwind.dev) 和 Tailwind CSS v4 编写。组件与 Web 端共用 `@skyroc/tailwind-plugin` 中的设计令牌，并通过 `className`、语义色和统一的组件 API 保持一致的开发体验。

> 当前版本为 `0.1.0`，组件仍在持续补充和校准。仓库内的 [Native UI Playground](../../../apps/native-ui-playground) 是查看实际效果、交互行为和用法示例的首选入口。

## 能力概览

- 基础组件：`Button`、`Cell`、`Divider`、`Grid`、`Image`、`Space`、`Text`
- 表单组件：`Checkbox`、`Field`、`Form`、`Input`、`Radio`、`Rate`、`Search`、`Slider`、`Stepper`、`Switch` 等
- 选择组件：`Calendar`、`DatePicker`、`NumberKeyboard`、`Picker`、`TimePicker`、`TreeSelect` 等
- 反馈组件：`ActionSheet`、`Dialog`、`Notify`、`Popup`、`Sheet`、`Toast` 等
- 展示与导航：`Avatar`、`Badge`、`Collapse`、`Tabs`、`Tag`、`NavBar`、`Pagination` 等

完整组件清单与可交互示例见 [`apps/native-ui-playground/src/component-catalog.ts`](../../../apps/native-ui-playground/src/component-catalog.ts)。

## 在当前仓库中使用

仓库已统一管理 React Native、Uniwind 和各原生依赖，应用只需声明组件库依赖：

```json
{
  "dependencies": {
    "@skyroc/native-ui": "workspace:*"
  }
}
```

如需在仓库外安装，请先确保宿主项目已完成 Expo、React Native 和 Uniwind 配置，再安装组件库：

```bash
pnpm add @skyroc/native-ui uniwind
pnpm add -D @skyroc/tailwind-plugin tailwindcss
```

组件使用到的原生能力以 `peerDependencies` 声明。请根据实际使用的组件，通过 `expo install` 安装对应依赖；版本要求以本包的 [`package.json`](./package.json) 为准。

## 宿主应用接入

### 1. 配置 Metro

在宿主应用的 `metro.config.js` 中，让 Uniwind 读取应用级 CSS 入口：

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts'
});
```

### 2. 接入设计令牌并扫描组件源码

在宿主应用的 `global.css` 中启用 Native 平台主题：

```css
@import 'tailwindcss';
@import 'uniwind';

@plugin "@skyroc/tailwind-plugin" {
  platform: 'native';
}

@source "./node_modules/@skyroc/native-ui/dist";
```

`@source` 路径相对于 `global.css`。发布包扫描 `dist`；workspace 软链接开发时扫描 `src`。路径必须指向当前安装方式下实际存在的组件代码，否则 Tailwind 无法发现组件库内部使用的 className。仓库内可直接参考 playground 的 [`global.css`](../../../apps/native-ui-playground/global.css)。

### 3. 在根布局初始化运行时能力

CSS 入口应从应用根布局导入。安全区工具类还需要宿主应用把 inset 同步给 Uniwind：

```tsx
import { BottomSheetModalProvider, PortalHost } from '@skyroc/native-ui';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import './global.css';

const UniwindInsetsBridge = () => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Uniwind.updateInsets(insets);
  }, [insets]);

  return null;
};

const AppRoot = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <UniwindInsetsBridge />
      <BottomSheetModalProvider>
        <View className="flex-1">{/* 应用路由或页面 */}</View>
        <PortalHost />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
```

- `UniwindInsetsBridge`：让 `pt-safe`、`pb-safe` 等安全区工具类获得真实值。
- `PortalHost`：承载 `Toast`、`Dialog`、`Notify` 等全局浮层，应放在页面内容之后。
- `BottomSheetModalProvider`：为 `Sheet`、`Picker` 等底部面板提供运行环境。
- `GestureHandlerRootView`：为手势驱动组件提供根容器。

可直接对照 playground 的完整 [`app/_layout.tsx`](../../../apps/native-ui-playground/app/_layout.tsx)。

## 基本使用

```tsx
import { Button, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

interface SubmitPanelProps {
  /** 是否正在提交 */
  submitting?: boolean;
  /** 点击提交时执行 */
  onSubmit: () => void;
}

const SubmitPanel = (props: SubmitPanelProps) => {
  const { onSubmit, submitting = false } = props;

  return (
    <View className="gap-3 rounded-2xl bg-background p-4">
      <Text className="text-lg font-semibold text-foreground">确认提交</Text>
      <Button
        loading={submitting}
        size="lg"
        onPress={onSubmit}
      >
        提交
      </Button>
    </View>
  );
};
```

组件和类型均从包根路径导入：

```tsx
import { DatePicker, Toast, showToast } from '@skyroc/native-ui';
import type { DatePickerFormatter, ToastPosition } from '@skyroc/native-ui';
```

## 主题与样式

组件优先使用 `primary`、`foreground`、`muted`、`border`、`destructive` 等语义色。主题由宿主应用切换，组件不需要编写 `dark:` 分支：

```tsx
import { Uniwind } from 'uniwind';

Uniwind.setTheme('dark'); // light | dark | system
```

开发组件时遵循以下原则：

- 静态样式使用 Uniwind `className`，运行时计算值才使用 `style`。
- 动态变体使用 `tailwind-variants` 或显式映射，不能拼接 `bg-${color}` 一类 className。
- 合并外部 className 使用包内 `cn()`，避免冲突样式同时生效。
- 文本使用本包的 `Text`，分隔线使用 `Divider`。
- Native CSS 变量保存的是 hex，原生颜色属性使用 `var(--primary)`，不要写 `hsl(var(--primary))`。

完整约束见 [`packages/native/AGENTS.md`](../AGENTS.md)。

## 本地开发

从仓库根目录启动 playground：

```bash
pnpm --filter native-ui-playground start
```

也可以直接启动指定平台：

```bash
pnpm --filter native-ui-playground ios
pnpm --filter native-ui-playground android
pnpm --filter native-ui-playground web
```

新增或调整组件时，保持下面三处同步：

1. 在 `packages/native/ui/src/components/<component>` 实现并从组件索引导出。
2. 在 `apps/native-ui-playground/src/demos/<Component>Demo.tsx` 编写真实交互示例。
3. 在 `apps/native-ui-playground/app/components/<component>.tsx` 添加示例路由，并登记到 `src/component-catalog.ts`。

针对性验证：

```bash
pnpm --filter @skyroc/native-ui typecheck
pnpm --filter @skyroc/native-ui build
pnpm --filter native-ui-playground typecheck
```

## 相关入口

- [Native UI Playground](../../../apps/native-ui-playground)
- [组件目录](./src/components)
- [Native 开发规范](../AGENTS.md)
- [跨平台包架构](../../ARCHITECTURE.md)
