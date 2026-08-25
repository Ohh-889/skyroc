---
name: component-doc
description: 为 @skyroc/web-ui 组件编写文档。当用户说出组件名（如 Button、Accordion、AlertDialog）时触发。自动定位组件源码、playground demo、已有文档，按照项目文档规范生成或更新 MDX 文档。
argument-hint: 组件名，如 Button、Accordion、AlertDialog
---

# Component Documentation Workflow

为 `@skyroc/web-ui` 组件库编写文档的专用工作流。

## 文件定位规则

给定组件名 `$COMPONENT`（用户输入，如 `Button`），将其转为 kebab-case `$slug`（如 `button`），然后按以下路径查找：

| 用途 | 路径 |
|---|---|
| 组件源码 | `packages/web/ui/shadcn/src/components/$slug/` |
| Playground Demo | `apps/web-ui-playground/src/app/[locale]/(demo)/$slug/modules/` |
| 文档 MDX | `apps/web-ui-docs/content/docs/components/$slug.mdx` |

**文档基础设施文件**（不需要每次都读，但需要了解）：

| 文件 | 作用 |
|---|---|
| `apps/web-ui-docs/components/props-table.tsx` | `<PropsTable>` — API 属性表格 |
| `apps/web-ui-docs/components/type-table.tsx` | `<TypeTable>` + `<UnionType>` — 类型定义区 |
| `apps/web-ui-docs/components/type-anchor.tsx` | 类型链接解析（PascalCase 自定义类型 → 蓝色可点击锚点） |
| `apps/web-ui-docs/components/type-registry.ts` | 跨页面类型链接注册表 |
| `apps/web-ui-docs/components/demo/index.tsx` | `<Demo>` — 从 playground 加载 live demo |
| `apps/web-ui-docs/components/mdx.tsx` | MDX 组件注册（Demo / PropsTable / TypeTable / UnionType） |

## 执行流程

### Phase 1: 源码阅读与行为校验

1. 读取 `packages/web/ui/shadcn/src/components/$slug/` 下所有文件
   - 重点关注：`index.ts`（导出）、`types.ts`（Props 定义）、`*-variants.ts`（样式变体）、主组件文件
2. 读取 `apps/web-ui-playground/src/app/[locale]/(demo)/$slug/modules/` 下所有 demo
   - 如果目录不存在或 demo 数量不足以覆盖文档需要的功能章节，标记为"需创建 demo"
3. 如果 preset 包装器存在，读取 `packages/web/ui/shadcn/src/preset/$slug/` 了解预设封装和 `useComponentConfig` 集成
4. 如果已有文档 MDX，读取 `apps/web-ui-docs/content/docs/components/$slug.mdx`
5. 读取一个已完成的文档作为参考模板（优先 `alert.mdx`，其次 `button.mdx`）

#### 实现一致性校验（必须执行）

文档不是 API 想象稿，必须从 **源码、类型、demo、实际行为** 四者交叉验证。

写文档前必须同时检查：

- `types.ts` 声明了哪些 public props / types
- 主组件实际解构了哪些 props
- props 是否真的传递给对应子组件或底层库
- 默认值实际在哪里设置
- `classNames` / slot props / `size` / `variant` / `color` 等样式控制是否真的生效
- `index.ts` 实际导出了哪些组件和类型

如果发现 **类型/API 承诺** 与 **实现行为** 不一致：

1. 先明确指出这是实现问题或 API 语义不一致
2. 如果任务允许修改代码，应优先修实现或类型，而不是在文档里规避
3. 如果不能修改实现，必须在最终说明中列为风险/阻塞，并在文档中避免承诺未实现能力
4. 不允许只降低文档表述来掩盖实现 bug

典型例子：

- `BottomSheetProps.size` 声明为主组件尺寸，但主组件没有传给 `BottomSheetContent`：这是实现 bug，应提出或修复
- props 被解构但没有使用：不要在文档中承诺该能力已生效
- 类型继承了底层库 props，但封装组件覆盖或丢弃了其中一部分：以实际封装行为为准

### Phase 2: 文档编写

#### MDX 结构（必须遵循）

```mdx
---
title: $COMPONENT
description: 一句话描述组件用途
---

组件概述段落。

\`\`\`tsx
import { ... } from '@skyroc/web-ui';
\`\`\`

## 何时使用

- 使用场景 1
- 使用场景 2
- 与相似组件的区分

## 功能章节 1（如"颜色"、"变体"、"尺寸"等）

说明文字 + 表格（可选）

<Demo src="@playground/$slug/modules/DemoName" />

\`\`\`tsx
// 内联代码作为 API 快速参考
<Component prop="value" />
\`\`\`

## 功能章节 N

...

## API

### $COMPONENT

通用属性参考说明。

<PropsTable data={[...]} />

### 子组件（如有）

<PropsTable data={[...]} />

## 类型

<TypeTable data={[...]} />
<UnionType name="..." description="..." type="..." />
```

#### Demo + 内联代码的组合模式（必须遵循）

每个功能章节的示例由两部分组成，缺一不可：

1. **`<Demo>` 标签**（必须）：引用 playground 源码，用户可在文档中看到交互式 live demo 和完整源码。
2. **内联代码块**（推荐）：紧跟在 `<Demo>` 后面，提供简洁的 API 用法速查。

内联代码块的编写原则：
- 不需要完整组件结构，只展示关键 API 用法（最核心的 props 组合）
- Hooks 类的章节用 1-3 行代码展示调用签名即可
- 如果 Demo 本身已经足够简单直观，可以省略内联代码
- 纯展示类章节（如尺寸枚举、变体枚举）可以用表格代替内联代码

示例：

```mdx
## 受控模式

通过 `page` + `onPageChange` 实现受控分页。

<Demo src="@playground/pagination/modules/Controlled" />

\`\`\`tsx
const [page, setPage] = useState(1);

<Pagination
  total={200}
  itemsPerPage={10}
  page={page}
  onPageChange={setPage}
/>
\`\`\`
```

#### PropsTable 书写规则

- `type` 字段：短字面量联合类型必须直接内联，不要另起 PascalCase 类型名，也不要在 `## 类型` 区域写 `<UnionType>`。
- 典型需要内联的类型：
  - 主题色：`"'primary' | 'destructive' | 'success' | 'warning' | 'info' | 'carbon' | 'secondary' | 'accent'"`
  - 尺寸：`"'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'"`
  - 状态 / 方向 / 位置 / 形状等短联合：`"boolean | 'indeterminate'"`、`"'horizontal' | 'vertical'"`、`"'left' | 'right'"`、`"'square' | 'rounded'"`
- 对象类型、复杂派生类型、外部库大型类型、子组件 Props、classNames/slots 配置，使用 PascalCase 类型名引用。
- PascalCase 类型名由 `typeToReactNode` 自动渲染为蓝色可点击链接，跳转到当前页类型定义或 `type-registry.ts` 注册的跨页锚点。
- `default` 用字符串表示，如 `"'md'"`、`'false'`
- `required: true` 仅在属性必填时添加

#### 类型完整性规则（严格遵循）

**核心原则：PropsTable / TypeTable 中出现的每一个非内置 PascalCase 类型名，都必须在当前页 `## 类型` 区域有对应定义，或在 `type-registry.ts` 中注册了跨页面链接。不允许出现"引用了但未定义"的类型。**

检查清单（写完文档后逐项核对）：

1. 遍历所有 `<PropsTable>` 的 `type` 字段，收集全部 PascalCase 类型名
2. 遍历所有 `<TypeTable>` 的 `fields[].type`，收集全部 PascalCase 类型名
3. 排除内置类型（`ReactNode`、`HTMLElement`、`Record`、`Partial` 等，见 `type-anchor.tsx` 的 `BUILTIN_TYPE_NAMES`）
4. 对剩余的每一个类型名，确认以下之一成立：
   - 在当前页的 `<TypeTable>` 中作为 `name` 定义
   - 在当前页的 `<UnionType>` 中作为 `name` 定义
   - 在 `type-registry.ts` 中注册了跨页面链接
5. 如有遗漏，补充定义后再输出
6. 如果遗漏类型只是短字面量联合类型（如 ThemeSize、ThemeColor、方向、位置、形状、简单状态），不要补 `<UnionType>`，应改为在 `type` 字段直接内联。

特别注意：

- **子组件 Props 类型**：如果组件有 `titleProps: AlertTitleProps`、`descriptionProps: AlertDescriptionProps` 等 props，这些类型也必须在 TypeTable 中定义，包含各自的字段列表
- **组件本目录导出的 public 类型**：`index.ts` / `types.ts` 导出的 Props、ClassNames/Ui、Slots、ItemData、Option、Variant 等类型，都必须在当前页类型区定义或跨页注册
- **封装依赖类型**：如果组件类型继承 `StyledComponentProps<T>`、`HTMLComponentProps<T>`、Radix Props、Vaul Props 等，需要在类型区说明这些包装类型和关键字段
- **不要展开无关大类型**：如果引用外部组件的大型 Props（如 `ButtonProps`、`DropdownMenuProps`），且该类型不属于当前组件，可以只引用并通过 `type-registry.ts` 跨页链接；不要在当前页复制展开全部字段
- **共享主题类型**：`ThemeColor`、`ThemeSize` 这类短联合直接内联；`ClassValue` 这类复杂类型可以在类型区保留定义。
- **BUILTIN_TYPE_NAMES 维护**：如果文档中用到了 PascalCase 类型名但它并非当前组件定义的自定义类型（如 `DeepPartial`、`ElementType`、`StandardSchema`、`Values` 等泛型/外部类型），需要确认它已在 `type-anchor.tsx` 的 `BUILTIN_TYPE_NAMES` 中注册。如果没有注册，会生成错误的本地锚点链接。遇到这种情况需要将其添加到 `BUILTIN_TYPE_NAMES` 中。

#### 常用内联类型（直接复制使用）

以下类型在多数组件文档中都需要，按需取用：

```mdx
type: "'primary' | 'destructive' | 'success' | 'warning' | 'info' | 'carbon' | 'secondary' | 'accent'"

type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'"

<UnionType name="ClassValue" description="CSS 类名类型" type="string | null | undefined | Record<string, boolean> | ClassValue[]" />
```

#### 类型定义规则

- 页面底部 `## 类型` 区域定义本页引用的所有非内置类型
- `<TypeTable>` — 对象类型（有字段列表的类型，如 ClassNames、子组件 Props）
- `<UnionType>` — 复杂联合、外部库派生类型、确实需要解释的类型定义；短字面量联合不要使用 `<UnionType>`，直接内联到表格
- 类型名与 PropsTable 中的 `type` 字段一致，系统自动生成锚点 ID
- 排列顺序建议：先 `<TypeTable>`（对象类型），再 `<UnionType>`（联合类型）

#### 跨页面类型引用

当 PropsTable 中引用了定义在**其他页面**的类型（如 AlertDialog 引用 ButtonProps）：

1. 在 `apps/web-ui-docs/components/type-registry.ts` 中注册映射
2. 格式：`TypeName: '/docs/components/target-page#anchor'`
3. 无需在当前页重复定义该类型

#### Demo 引用规则

- 格式：`<Demo src="@playground/$slug/modules/DemoModuleName" />`
- **每个功能章节必须有 Demo**，Demo 是文档的核心展示方式，不可省略
- 优先复用 playground 中已经存在、能代表功能点的 demo
- 引用 demo 前检查 demo 文件是否依赖本地 `./shared`、同目录模块、图片、路由组件或其他非 scope 内容
- 如果 demo 不是自包含的，必须确认当前 Demo transformer / react-live 环境能处理这些 import
- 如果不能处理，选择以下方式之一：
  - 调整 playground demo 使其可在文档中运行
  - 新增 docs 专用 demo
  - 在最终说明中明确该 demo 存在运行时风险
- 不允许假设所有 playground demo 都能被 react-live 直接执行

#### 创建缺失的 Playground Demo（必须执行）

当 playground `modules/` 目录不存在或缺少所需 demo 时，**必须创建**，不能因为缺 demo 而只写内联代码。

**创建 demo 文件的规范：**

1. 文件路径：`apps/web-ui-playground/src/app/[locale]/(demo)/$slug/modules/$DemoName.tsx`
2. 文件结构模板：

```tsx
'use client';

import { ... } from '@skyroc/web-ui';

const $DemoName = () => {
  // demo 实现
  return (
    <div className="...">
      ...
    </div>
  );
};

export default $DemoName;
```

3. 创建规则：
   - 必须添加 `'use client'` 指令
   - 组件使用箭头函数 + PascalCase 命名
   - 必须使用 `export default` 导出
   - 从 `@skyroc/web-ui` 导入 UI 组件，不要从内部路径导入
   - 图标从 `lucide-react` 导入
   - 避免依赖外部 `shared.tsx`，demo 应自包含（如需共享常量直接内联到各 demo 中）
   - 使用 tailwind 类名进行布局样式
   - 每个 demo 聚焦展示一个功能点，保持简洁

4. 同步 `page.tsx`：如果 `page.tsx` 不存在或未引用新 demo，需要一并创建/更新

**判断流程：**

```
读取 playground/$slug/modules/ 目录
  ├── 已有 demo 覆盖文档需要的功能点 → 直接引用
  ├── 有 page.tsx 但缺少部分 demo → 补充缺失的 demo 模块
  └── 目录不存在 → 创建全部 demo 模块 + page.tsx
```

#### react-live scope 注意事项

Demo 在 `react-live` 沙箱中执行，scope 定义在 `apps/web-ui-docs/components/demo/scope.ts`。需注意：

- scope 中同时导入了 `@skyroc/web-ui` 和 `lucide-react`，后者也导出部分同名组件（如 `Badge`）
- 当前 scope 的赋值顺序保证 `@skyroc/web-ui` 优先（最后赋值覆盖同名导出）
- 如果新增的组件名与 `lucide-react` 图标同名，需确认 scope 中不存在冲突，或调整赋值顺序

#### 工作区边界

- 默认只新增或修改目标文档 `apps/web-ui-docs/content/docs/components/$slug.mdx`
- 不要回滚、格式化或整理与当前组件文档无关的用户改动
- 如果组件源码已有未提交改动，必须基于当前工作区实现写文档
- 只有当实现问题会导致文档无法正确描述组件时，才修改组件源码或类型；修改前先说明发现的问题
- 最终回复中要明确区分：本次修改的文件、已有但未处理的工作区改动、验证结果或未验证原因

## 参考范例

以 `apps/web-ui-docs/content/docs/components/alert.mdx` 为首选参考，`button.mdx` 为辅助参考。

`alert.mdx` 展示了完整的类型引用模式：PropsTable 使用类型名引用 → 类型区包含全部 TypeTable 和 UnionType 定义 → 无遗漏。
