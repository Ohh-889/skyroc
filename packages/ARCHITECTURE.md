# Packages 架构

本文规定 `packages/` 下包的放置位置、命名方式和依赖边界。

本文只记录跨包且相对稳定的架构规则：

- 包的实际名称、入口和依赖以各包的 `package.json` 为准。
- 单个包的 API、开发命令和使用方式放在该包的 README 中。
- React 组件通用规范见仓库根目录的 [`AGENTS.md`](../AGENTS.md)。
- Web 和 Native 的样式规范分别见 [`web/AGENTS.md`](./web/AGENTS.md) 和
  [`native/AGENTS.md`](./native/AGENTS.md)。

## 目录分层

`packages/` 按“跨平台基础能力 + 平台子树”组织：

```text
packages/
├── @core/                  # 跨平台运行时基础设施、共享构建工具和独立 CLI
│   └── tailwind-plugin/    # @skyroc/tailwind-plugin，Web / Native 共用的设计令牌来源
├── hooks/                  # React Hooks；平台能力通过子入口隔离
├── primitives/             # 可复用的交互或领域原语
├── web/                    # Web UI、管理端运行时、主题和构建能力
│   └── ui/
│       ├── shadcn/         # @skyroc/web-ui
│       ├── compose/        # @skyroc/web-ui-compose
│       └── antd/           # @skyroc/web-ui-antd
└── native/                 # React Native / Expo 专属能力
    └── ui/                 # @skyroc/native-ui
```

`@core` 只是物理目录分组，不是 TypeScript namespace，也不代表存在
`@skyroc/core` 这个包。其当前包列表和内部边界见
[`@core/README.md`](./@core/README.md)。

不要在尚未创建实现前，把预留平台或设想中的包写进当前目录结构。

## 放置规则

| 位置 | 放入条件 | 不应包含 |
| --- | --- | --- |
| `@core/` | 与业务无关、可独立复用的运行时基础设施、跨端共享的构建工具或 CLI；纯类型也归到这里的既有包 | 页面逻辑、业务组件、具体平台 UI |
| `hooks/` | 可跨应用复用的 React Hooks；浏览器能力使用独立子入口 | UI 组件、应用业务流程、未隔离的平台副作用 |
| `primitives/` | 可跨应用复用、有独立状态或交互模型的底层原语 | 完整页面、管理端业务物料 |
| `web/` | 依赖 DOM、浏览器、Ant Design、Web 构建工具或管理端运行时 | React Native 或 Expo API |
| `native/` | 依赖 React Native、Expo、Uniwind 或原生模块 | DOM、Ant Design、Web 构建工具 |

判断新包位置时按以下顺序：

1. 是否依赖某个平台的 API？依赖则进入对应平台子树。
2. 是否只是一组纯类型？**不要为此新建包**，并入已有的同性质包，见下方「纯类型的归属」。
3. 是否是通用 React Hook？是则进入 `hooks/`，并隔离平台子入口。
4. 是否是业务无关的运行时基础设施、跨端共享的构建工具或 CLI？是则进入 `@core/`。
5. 是否是可复用的底层交互模型？是则进入 `primitives/`。
6. 其余业务能力优先留在应用或明确的业务模块中，不因“可能复用”提前建包。

### 纯类型的归属

| 内容 | 归属 |
| --- | --- |
| 通用 TS 工具类型（路径推导、递归变换、函数类型） | `@skyroc/utils` 的 `./type` 子入口 |
| 依赖 DOM 的类型（`FieldElement` 等） | `@skyroc/utils` 的 `./web` 子入口 |
| 设计令牌与三端组件词汇（`ThemeColor`、`ThemeSize` 等） | `@skyroc/tailwind-plugin` 的 `./ui` 子入口 |
| 只有一个 UI 包在用的类型（`WithClassName` 等） | 该包自己的 `types/shared.ts` |
| 全局命名空间声明（`Api`、`Router` 等） | `@skyroc/types` |

这条规则来自一次实际回退：`packages/shared/` 曾经装着 `@skyroc/ui-types` 与
`@skyroc/type-utils` 两个纯类型包，为几十行类型长期支付版本、README、构建与发布的成本；
而 `@skyroc/ui-types` 的 `ThemeColor` 和 `@skyroc/tailwind-plugin` 里 `tokens.ts` 的
`SemanticColorName` 还长成了一字不差的两份定义。**类型离它的真正来源越远，越容易长出第二份。**
两个包已并入上表的归属，`packages/shared/` 目录随之删除。

## 包命名

| 包类别 | 命名方式 | 示例 |
| --- | --- | --- |
| 跨平台能力 | 不带平台前缀 | `@skyroc/utils`、`@skyroc/hooks`、`@skyroc/form` |
| Web 专属能力 | `@skyroc/web-*` | `@skyroc/web-ui`、`@skyroc/web-admin-runtime` |
| Native 专属能力 | `@skyroc/native-*` | `@skyroc/native-ui` |
| 平台适配器 | `@skyroc/adapter-*` | `@skyroc/adapter-antd-theme` |

新增平台 UI 包时不要使用 `@skyroc/ui` 这种无法识别所属平台的裸名。
目录名和发布包名不要求完全相同，最终名称以 `package.json#name` 为准。

仓库中已有少量历史专名，例如位于 `web/` 下的 `@skyroc/materials`。新包不要仅为保持
这些历史名称而继续扩大例外。跨平台能力的裸名是合规的，例如 `@core/` 下的
`@skyroc/tailwind-plugin`。

## 依赖边界

依赖总体从应用和平台实现流向跨平台基础能力：

```text
apps
├── web packages
├── native packages
└── cross-platform packages

web / native / primitives
└── hooks / @core

hooks
└── @core
```

必须遵守以下规则：

- 禁止循环依赖。
- 跨平台包不得依赖 Web 或 Native 平台包。
- Web 和 Native 包不得互相依赖。
- 包之间只能通过公开 `exports` 访问，不得导入其他包的 `src` 内部路径。
- 同一层内允许存在职责明确的单向依赖；不要用“同层”作为禁止依赖的理由。
- `@core/` 保持在依赖链底部，不反向依赖 `hooks/`、`primitives/` 或平台包。
- 应用可以组合多个包，但不应把应用业务反向下沉进通用包。

`@skyroc/tailwind-plugin` 同时为 Web 和 Native 生成设计令牌，因此位于 `@core/` 而非
`web/`。Native 包可以依赖它，但这不代表 Native 包可以依赖 Web 运行时包——跨端共享的
构建工具必须先下沉到 `@core/`，不能以“反正只有构建期用”为由跨平台子树引用。

## 平台样式边界

| 平台 | 当前方案 | 配置归属 |
| --- | --- | --- |
| Web | UnoCSS + `@skyroc/tailwind-plugin` | Web 应用和 Web 构建包 |
| Native | Uniwind（Tailwind CSS v4）+ `@skyroc/tailwind-plugin` | Expo 宿主应用 |

组件包不接管宿主应用的构建配置。具体的 className、语义色、安全区和构建入口约定，
以对应平台的 `AGENTS.md` 为准。
