---
name: native-component-doc
description: 为 @skyroc/native-ui 组件编写文档。当用户说出 native 组件名（如 Button、Cell、ActionSheet）并要求写/补文档时触发。自动定位组件源码、playground demo、已有文档，按 native-ui-docs 的规范生成或更新 MDX。
argument-hint: 组件名，如 Button、Cell、ActionSheet
---

# Native UI 组件文档工作流

为 `@skyroc/native-ui`（React Native + Uniwind）编写文档的专用工作流。

> 这不是 web-ui 那套。native 的 `<Demo>` 会把 demo 源码整份渲染出来、右栏还有整页手机预览，
> 因此**不写内联代码块**、**demo 一律具名导出**、**每个 demo 都要在汇总页里串一遍**。
> 与 `component-doc`（web-ui 用）的差异见文末「与 web-ui 文档规范的差异」。

## 文件定位规则

给定组件名 `$COMPONENT`（如 `ActionSheet`），转 kebab-case `$slug`（如 `action-sheet`）：

| 用途                | 路径                                                           |
| ------------------- | -------------------------------------------------------------- |
| 组件源码            | `packages/native/ui/src/components/$slug/`                      |
| Playground 单点 demo | `apps/native-ui-playground/src/demos/$slug/*.tsx`               |
| Playground 汇总页    | `apps/native-ui-playground/src/demos/$slug/index.tsx`            |
| Playground 路由页    | `apps/native-ui-playground/app/components/$slug.tsx`             |
| 文档 MDX            | `docs/native-ui-docs/content/docs/components/($group)/$slug.mdx` |

**文档基础设施**（了解即可，不必每次都读）：

| 文件                                            | 作用                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| `docs/native-ui-docs/components/mdx.tsx`         | MDX 组件注册，只有 `Demo` / `PropsTable` / `TypeTable` / `UnionType`  |
| `docs/native-ui-docs/components/demo/index.tsx`  | `<Demo>`：读 demo 源码 + 渲染预览 + 「在 playground 打开」            |
| `docs/native-ui-docs/components/demo/demo-preview.tsx` | 动态 import demos 目录，**按模块名取具名导出**                  |
| `docs/native-ui-docs/components/props-table.tsx` | `<PropsTable>` API 属性表                                            |
| `docs/native-ui-docs/components/type-table.tsx`  | `<TypeTable>` + `<UnionType>` 类型区                                 |
| `docs/native-ui-docs/components/type-anchor.tsx` | PascalCase 类型 → 锚点链接，`BUILTIN_TYPE_NAMES` 白名单               |
| `docs/native-ui-docs/components/type-registry.ts`| 跨页面类型链接注册表                                                 |
| `docs/native-ui-docs/lib/playground-demo.ts`     | 文档页 slug → playground 整页路由，决定是否分栏                      |

## 侧边栏分组

`content/docs/components/` 下按 fumadocs 路由组分组，路由组不进 URL（`(general)/button.mdx` → `/docs/components/button`）。
写完文档后**必须**把 `$slug` 加进对应分组的 `meta.json` 的 `pages` 里（meta.json 已预置全部规划中的 slug，通常只需确认位置正确）。

| 目录             | 标题     | 组件                                                                                                                                       |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `(general)`      | 通用     | button, floating-button, text, text-ellipsis, divider, image                                                                                 |
| `(layout)`       | 布局容器 | space, grid, cell, collapse                                                                                                                  |
| `(input)`        | 输入     | form, field, input, password-input, search, checkbox, radio, switch, slider, stepper, rate, signature, picker, picker-group, date-picker, time-picker, calendar, number-keyboard, tree-select |
| `(data-display)` | 数据展示 | avatar, badge, tag, count-down, rolling-text, swipe-cell                                                                                     |
| `(navigation)`   | 导航     | navbar, tabs, sidebar, anchor-nav, index-bar, back-top, pagination, dropdown-menu                                                            |
| `(overlay)`      | 弹层覆盖 | popup, dialog, sheet, action-sheet, share-sheet                                                                                              |
| `(feedback)`     | 反馈     | toast, notify                                                                                                                                |

`meta.json` 里列了但文件还不存在的 slug 会被 fumadocs 静默跳过（`resolveFolderItem` 找不到 node 直接 return），所以预置清单不会报错。

`meta.json` 里**不要写 `"collapsible": false`**。fumadocs-ui 16.14.4 的 `SidebarFolderTrigger`
在 `collapsible: false` 分支直接渲染成 `jsx("div", { ...props })`，而上层
（`layouts/docs/slots/sidebar.js:220`）传下来的 `className` 是个 `(state) => string` 函数 ——
函数原样落到 DOM 上，React 报
`Invalid value for prop \`className\` on <div> tag`，分组标题也因此丢掉全部样式类。
`collapsible` 走默认的 `true` 时，trigger 渲染成 Base UI 的 `Collapsible.Trigger`，函数 className
会被 `useRenderElement` 正常解析。`defaultOpen: true` 已经能让分组默认展开，不需要 `collapsible: false`。

## 执行流程

### Phase 1：读源码与 demo，做一致性校验

1. 读 `packages/native/ui/src/components/$slug/` 全部文件
   - `index.ts`：实际导出了哪些组件、哪些类型
   - `types.ts`：public props 与类型别名
   - `*-variants.ts`：`slots` / `variants` / `compoundVariants` / `defaultVariants` —— **表格里的每一行数值都从这里抄，不要凭印象写**
   - 主组件 `*.tsx`：props 实际怎么解构、默认值在哪、有没有 `hitSlop` / `accessibilityState` / `TextClassContext` / Portal 之类的 RN 特有行为
2. 读 `apps/native-ui-playground/src/demos/$slug/` 全部 demo + `index.tsx` 汇总页
   - 汇总页的 `<Section title/description>` 就是**天然的章节大纲**，文档章节直接对齐它
3. 已有文档就读一遍，判断是补全还是重写
4. 参考范例：`docs/native-ui-docs/content/docs/components/(general)/button.mdx`（当前唯一的完整样板）

#### 实现一致性校验（必须执行）

文档不是 API 想象稿，从**源码 / 类型 / variants / demo** 四者交叉验证：

- `types.ts` 声明的 props，主组件是否真的解构并使用
- 默认值实际在哪里设置（`defaultVariants` vs 组件内 `= false`），两处不一致时以运行时为准
- `classNames` 的每个 slot 是否真的接到了对应节点上
- `index.ts` 是否真的导出了你要写进文档的类型
- RN 特有：`hitSlop`、`accessibilityRole` / `accessibilityState`、`Pressable` 透传、`TextClassContext` 继承范围、Portal / Modal 挂载点

发现类型/API 承诺与实现不一致时：先明确指出这是实现问题；能改就改实现或类型，不要在文档里绕过去；不能改就在最终说明里列为风险，并且**不在文档中承诺未实现的能力**。不允许靠降低文档表述来掩盖实现 bug。

### Phase 2：写文档

#### MDX 结构

```mdx
---
title: $COMPONENT
description: 一句话描述组件用途
---

概述段落：组件做什么、基于什么 RN 原语封装、有什么与众不同的行为。

\`\`\`tsx
import { $COMPONENT } from '@skyroc/native-ui';
\`\`\`

## 基础用法

<Demo src="@playground/$slug/$DemoBasic" />

## 何时使用

- 使用场景 / 移动端取舍
- 与相似组件的区分（如 Popup vs Sheet vs ActionSheet）

## 功能章节（variant / color / size / shape / ...）

说明文字 +（枚举类的）表格

<Demo src="@playground/$slug/$DemoName" />

补充说明：容易踩的坑、和 web 端行为不同的地方

## 无障碍

role / accessibilityState / 热区 等 RN 专属说明（有就写）

## API

### $COMPONENT

<PropsTable data={[...]} />

## 类型

\`\`\`ts
import type { ... } from '@skyroc/native-ui';
\`\`\`

<UnionType ... />
<TypeTable data={[...]} />
```

#### Demo 引用规则（native 专属）

- 格式：`<Demo src="@playground/$slug/$DemoName" />`，**没有 `modules/` 这一层**（那是 web-ui 的）
- **不要在 `<Demo>` 后面贴内联代码块**。`<Demo>` 已经把整份 demo 源码渲染在预览下方了，内联代码是重复噪音
- **覆盖率要求：`src/demos/$slug/index.tsx` 里串的每个子 demo，文档必须有且仅有一处 `<Demo>` 引用**。章节顺序也尽量对齐汇总页
- demo 缺失时**必须补 demo**，不能因为没 demo 就只写文字

写完用这条命令核对覆盖率（无输出即一一对应）：

```bash
slug=button; group='(general)'
diff \
  <(ls apps/native-ui-playground/src/demos/$slug | grep -v '^index' | sed 's/\.tsx$//' | sort) \
  <(grep -o "@playground/$slug/[A-Za-z0-9]*" "docs/native-ui-docs/content/docs/components/$group/$slug.mdx" | sed 's|.*/||' | sort -u)
```

#### 新建 Playground Demo 的规范

1. 路径：`apps/native-ui-playground/src/demos/$slug/$DemoName.tsx`，`$DemoName` 以组件名开头（`ButtonLoading`、`CellSize`）
2. **必须具名导出，且导出名 === 文件名** —— `demo-preview.tsx` 是按模块名去取 `mod[exportName]` 的，写成 `export default` 或改名都会拿不到组件
3. 模板：

```tsx
import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonLoading = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {/* ... */}
    </View>
  );
};

export { ButtonLoading };
```

4. 约束：
   - 不写 `'use client'`（RN，不是 Next 客户端组件）
   - 从 `@skyroc/native-ui` 导入组件，不从内部路径导入
   - 容器统一 `View` + uniwind 类名，带上 `bg-background p-4`，保证在文档预览的手机框里边距一致
   - 每个 demo 只聚焦一个功能点，自包含，不依赖同目录 `shared.tsx`
   - 需要文字就用 `@skyroc/native-ui` 的 `Text`，才能继承 `TextClassContext`
5. **同步汇总页**：在 `src/demos/$slug/index.tsx` 里 import 并加一个 `<Section title description>`。汇总页只负责串场，不要把示例代码写回去
6. **确认整页路由存在**：`apps/native-ui-playground/app/components/$slug.tsx`。它是文档右栏分栏预览的来源（`resolvePlaygroundPage` 按最后一段 slug 找同名文件），缺了文档就退回单栏

#### PropsTable 书写规则

- 短字面量联合**直接内联**到 `type` 字段，不要另起 PascalCase 类型名，也不要写 `<UnionType>`
  - 例：`"'solid' | 'tonal' | 'outline' | 'ghost'"`、`"'sm' | 'md' | 'lg' | 'icon'"`、`"'horizontal' | 'vertical'"`
- 对象类型、slot 配置、子组件 Props、外部大型类型才用 PascalCase 引用
- `default` 用字符串写：`"'md'"`、`'false'`
- `required: true` 仅必填时加
- 表格开头或结尾说明透传关系：如「除下表外，`Button` 透传 `Pressable` 的全部属性」
- `ref` 也写进表里（RN 的 ref 常用于 `measure` / 滚动定位）

#### 类型完整性规则（严格遵循）

**PropsTable / TypeTable 中出现的每一个非内置 PascalCase 类型名，都必须在当前页 `## 类型` 区域有定义，或在 `type-registry.ts` 注册跨页链接。**

写完逐项核对：

1. 收集所有 `<PropsTable>` 的 `type`、所有 `<TypeTable>` 的 `fields[].type` 里的 PascalCase 词
2. 排除 `type-anchor.tsx` 的 `BUILTIN_TYPE_NAMES`（含 RN 原语：`PressableProps` / `ViewStyle` / `TextStyle` / `StyleProp` / `GestureResponderEvent` / `AccessibilityRole` / `View` / `Ref` 等）
3. 剩下的每一个都要满足：当前页 `<TypeTable name>` 定义 ∨ 当前页 `<UnionType name>` 定义 ∨ `type-registry.ts` 注册
4. 遗漏的如果只是短联合 → 改成内联，不补 `<UnionType>`
5. 用到了 PascalCase 但它是 React / RN / TS 内置或三方类型 → 加进 `BUILTIN_TYPE_NAMES`，否则会生成错误的本页锚点
6. 跨页引用格式：`TypeName: '/docs/components/target-slug#anchor'`（注意 `docsRoute = '/docs'`，别漏 `/docs` 前缀）

#### 类型区写法

- 先给一段 `import type { ... } from '@skyroc/native-ui'` 代码块，列出本组件对外导出的类型
- `<UnionType>`：联合类型（由 variants 推导出来的 `XxxVariant` / `XxxSize` / `XxxSlots` 等），一句话说明它控制什么
- `<TypeTable>`：对象类型（`SlotClassNames`、子组件 Props、Option / ItemData 之类）
- 顺序建议：`<UnionType>` 在前（跟 Props 表顺序对应），`<TypeTable>` 在后

### Phase 3：收尾核对

1. 覆盖率命令跑一遍，`<Demo>` 与 demos 目录一一对应
2. 分组 `meta.json` 的 `pages` 含 `$slug`
3. 类型完整性清单逐条过
4. 表格里的数值（高度、字号、间距、圆角）与 `*-variants.ts` 逐条对得上
5. 最终回复里区分：本次改了哪些文件、发现但未处理的实现问题、未验证的部分及原因

## 工作区边界

- 默认只动：目标 `$slug.mdx`、缺失的 playground demo 及其汇总页、分组 `meta.json`
- 不回滚、不格式化、不整理与本组件无关的用户改动
- 组件源码有未提交改动时，基于当前工作区实现写文档
- 只有实现问题导致文档无法正确描述组件时，才改组件源码或类型，且改之前先说明问题

## 与 web-ui 文档规范的差异

| 维度         | web-ui (`component-doc`)                     | native-ui（本 skill）                              |
| ------------ | -------------------------------------------- | -------------------------------------------------- |
| Demo 路径    | `@playground/$slug/modules/Name`             | `@playground/$slug/Name`（无 `modules`）            |
| Demo 导出    | `export default`                             | **具名导出，名字 === 文件名**                       |
| 内联代码块   | 推荐，跟在 `<Demo>` 后                        | **不写**，`<Demo>` 已渲染完整源码                   |
| Demo 运行时  | react-live 沙箱 + `scope.ts`                 | Turbopack 动态 import 真实 RN 组件，`ssr: false`     |
| 整页预览     | 无                                            | 右栏手机框渲染 `app/components/$slug.tsx` 整页       |
| `'use client'` | 需要                                        | 不需要                                              |
| 内置类型白名单 | DOM / React 为主                            | 额外含 RN 原语（`PressableProps` / `ViewStyle` 等）  |
