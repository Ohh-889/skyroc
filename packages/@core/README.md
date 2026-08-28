# `@core` 基础设施包

`packages/@core/` 集中存放与业务无关、可独立复用的运行时基础设施和项目 CLI。

这里的 `@core` 是仓库内的物理目录分组，不是 TypeScript namespace、npm scope，
也不代表存在 `@skyroc/core` 包。整个 `packages/` 的分层和新包放置规则见
[`../ARCHITECTURE.md`](../ARCHITECTURE.md)。

## 准入条件

放入 `@core/` 的包应同时满足：

- 提供通用基础能力，不包含具体应用的业务逻辑。
- 不依赖 DOM、React Native UI 或某个应用的运行时环境；平台差异通过适配器或子入口隔离。
- 有清晰且可独立测试、构建和发布的职责边界。
- 与其他包保持单向依赖，不形成循环依赖。

以下内容不放入 `@core/`：

- 纯类型或极轻量共享工具：并入已有的同性质包（通用工具类型进 `@skyroc/utils/type`，
  设计令牌与组件词汇进 `@skyroc/tailwind-plugin`），不要为几十行类型单开一个包。
- 通用 React Hooks：放入 `packages/hooks/`。
- Web、Native UI 和平台运行时：放入对应平台子树。
- 页面、业务组件和应用流程：留在应用或明确的业务模块中。

新增纯类型时先找已有的归属包，独立发一个纯类型包要付版本、README、构建与发布的
长期成本 —— `@skyroc/type-utils` 和 `@skyroc/ui-types` 就是这么退役的，分别并入了
`@skyroc/utils/type` 与 `@skyroc/tailwind-plugin/ui`；`@skyroc/types` 的全局命名空间
声明（`Api` / `App` 等）同样并入了 admin shell 的 `packages/web/admin/types/`。

## 当前包

| 目录               | 包名                      | 职责                                                           | 关键边界或公开子入口                                                       |
| ------------------ | ------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `utils/`           | `@skyroc/utils`           | 跨平台通用工具                                                 | 平台无关入口及 `./cn`、`./crypto`、`./path`、`./scheduler`、`./web`        |
| `color/`           | `@skyroc/color`           | 颜色转换和调色板生成                                           | 不依赖其他 `@core` 包                                                      |
| `axios/`           | `@skyroc/axios`           | 类型安全的 HTTP 客户端                                         | 依赖 `@skyroc/utils`                                                       |
| `state/`           | `@skyroc/core-state`      | Jotai 状态管理封装                                             | React 和 Jotai 为 peer dependencies                                        |
| `logger/`          | `@skyroc/logger`          | 跨平台日志及平台存储适配                                       | 不依赖其他 `@core` 包                                                      |
| `service/`         | `@skyroc/service`         | 请求与查询基础设施                                             | 依赖 `@skyroc/axios`；`.`、`./query`                                       |
| `tailwind-plugin/` | `@skyroc/tailwind-plugin` | 设计令牌唯一来源，生成 Web / Native 的 Tailwind 主题变量与预设 | 构建期插件；依赖 `@skyroc/color`，由 `platform` 选项区分 Web / Native 输出 |
| `create-skyroc/`   | `create-skyroc`           | `pnpm create skyroc` 脚手架入口                                | 构建时准备模板资产，发布包自包含，不依赖 `@skyroc/scripts`                 |
| `scripts/`         | `@skyroc/scripts`         | 项目自动化 CLI                                                 | Node.js 工具，可执行命令 `sa`                                              |

包版本、完整依赖和导出始终以对应 `package.json` 为准，本表不重复维护这些易变信息。

## 内部依赖

当前主要的内部依赖链是：

```text
@skyroc/service
└── @skyroc/axios
    └── @skyroc/utils

@skyroc/tailwind-plugin
└── @skyroc/color
```

`color`、`logger`、`scheduler`、`state` 和 `scripts` 目前不依赖其他 `@core` 包。
`types` 提供全局声明，不作为运行时代码出现在上述依赖链中。

维护内部依赖时遵守：

- 允许职责明确的单向依赖，禁止循环依赖和基础包反向依赖上层包。
- 只通过目标包 `package.json#exports` 声明的入口导入。
- 平台专属实现使用适配器或独立子入口，不混入默认跨平台入口。
- 新增或调整包时，同步维护该包 README；只有目录职责或依赖边界变化时才更新本文。
