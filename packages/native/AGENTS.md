# Native 样式规范

适用于 `packages/native/**` 与 Expo 应用（`apps/native-ui-playground` 等）。
通用 React 组件规则见仓库根 `AGENTS.md`。

> `CLAUDE.md` 是指向本文件的符号链接，只修改本文件。

## 样式方案

**Uniwind（Tailwind CSS v4）**，通过 `className` prop。不是 NativeWind。

样式入口在应用的 `global.css`：

```css
@import 'tailwindcss';
@import 'uniwind';

@plugin "@skyroc/tailwind-plugin" {
  platform: 'native';
}
```

语义色与色阶由 `@skyroc/tailwind-plugin` 生成，**没有** `@skyroc/native-theme` 这个包。

## 强制使用 className

```tsx
// ✅ Uniwind className
<View className="flex-1 items-center justify-center bg-white px-4">

// ❌ 禁止 StyleSheet.create
const styles = StyleSheet.create({ container: { flex: 1 } });
```

### 允许使用 style 的场景

仅当值来自**运行时计算**且无法用 className 表达：

```tsx
// ✅ 安全区域（运行时值）
<View style={{ paddingTop: insets.top }}>

// ✅ 动态背景色（来自数据）
<View style={{ backgroundColor: avatarConfig.backgroundColor }}>

// ❌ 静态值不应该用 style
<View style={{ paddingHorizontal: 16 }}>   // 应该用 className="px-4"
```

两者共存时，静态走 className、动态走 style：

```tsx
<View
  className="flex-1 items-center justify-center bg-white"
  style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
>
```

## 颜色体系

### 语义色 token（强制优先）

`primary` `secondary` `destructive` `success` `warning` `info` `muted`
`foreground` `muted-foreground` `border` `carbon`

```tsx
className="text-primary"           // 主色文字
className="text-muted-foreground"  // 辅助文字
className="bg-secondary"           // 次要背景
className="border-border"          // 边框色
```

### 色阶 50–950

Native 与 Web 一样拥有完整色阶（由 `colorScale()` 生成，
见 `packages/web/tailwind-plugin/src/index.ts`）。需要深浅变体时优先用色阶：

```tsx
// ✅ 色阶
className="bg-primary-50"
className="text-primary-700"
className="border-warning-200"

// ✅ 或 opacity 修饰符
className="bg-primary/10"
className="text-primary/30"

// ❌ 不要手写近似色
className="bg-[#343C610D]"
```

### ⚠️ style 场景的变量写法与 Web 不同

Native 的 CSS 变量存的是 **hex**，Web 存的是 HSL 三元组
（`generate.ts:145` — `native ? hslToHex(value) : value`）。因此：

```tsx
// ✅ Native：直接引用，不要包 hsl()
placeholderTextColor="var(--primary)"

// ❌ Native 上无效（hsl() 不能接受 hex）
placeholderTextColor="hsl(var(--primary) / 0.3)"   // 这是 Web 的写法
```

需要透明度时优先用 className 的 opacity 修饰符，而不是手写变量。

### 色值 → token 映射

遇到这些设计稿色值**必须**用对应 token，不得写死 hex：

| 设计稿色值 | Token |
| --- | --- |
| `#343C61` | `primary` |
| `#343C61` 60% | `muted-foreground` |
| `#FFA929` | `warning` |
| `#F7F8FA` | `secondary` / `muted` |
| 边框灰 | `border` |

### 优先级

```
语义色 token → 色阶 / opacity 修饰符 → Tailwind 预设色 → arbitrary value（最后手段）
```

只有确认语义色、色阶、预设色都无匹配时，才允许
`className="text-[#8B5CF6]"` 这类 arbitrary value。

## 安全区域

用 `useSafeAreaInsets()` + `style`，**不用** `SafeAreaView`：

```tsx
const insets = useSafeAreaInsets();

// 顶部 — 仅 Tab 页面需要手动处理
// 有 NavBar 的子页面不需要，NavBar 内部自带 paddingTop: insets.top
<View style={{ paddingTop: insets.top }}>

// 底部通常加额外间距
<View style={{ paddingBottom: insets.bottom + 16 }}>
```

## 组件库

文字和分隔线必须用 `@skyroc/native-ui`，不要用 RN 原生的：

```tsx
import { Divider, Text } from '@skyroc/native-ui';

<Text className="text-lg font-semibold text-primary">标题</Text>
<Divider />
```

RN 的 `Text` 缺少主题和字体集成；分隔线不要手写 `<View className="h-px ..." />`。

## 禁止事项

| 禁止 | 替代 |
| --- | --- |
| `StyleSheet.create` | Uniwind `className` |
| Tamagui 样式 props（`paddingInline`、`backgroundColor`） | Uniwind `className` |
| 内联 `style` 写静态值 | Uniwind `className` |
| 手写分隔线 | `<Divider />` |
| `Box` 组件 | RN 的 `View` |
| RN 的 `Text` | `@skyroc/native-ui` 的 `Text` |
| 写死已有 token 的 hex（`text-[#343C61]`） | 语义色 token（`text-primary`） |
| `hsl(var(--x))` | Native 用 `var(--x)` |
