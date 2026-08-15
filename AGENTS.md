# AGENTS.md

本文件为编码智能体（Claude Code、Codex 等）在本仓库工作时提供指导。

> `CLAUDE.md` 是指向本文件的符号链接，全仓库只有一份事实来源。
> 修改本文件，永远不要直接编辑 `CLAUDE.md`。

## 规范索引

本文件只包含**跨端通用、随时可能被违反**的规则。平台专属规范放在对应子树，
工作涉及该子树时才需要阅读：

| 范围                                     | 文件                        |
| ---------------------------------------- | --------------------------- |
| Native 样式（Uniwind / 语义色 / 安全区） | `packages/native/AGENTS.md` |
| Web 样式（UnoCSS / 色阶 / antd）         | `packages/web/AGENTS.md`    |
| 包布局与命名（平台优先分层）             | `packages/ARCHITECTURE.md`  |

## Skills 调用规则（关键）

技能位于 `.agents/skills/`（`.claude/skills/` 为镜像）。
**权威清单以该目录为准**，此处不做枚举——手工维护的列表必然过期。

## 思考顺序

你是一位经验丰富的软件架构师与工程师。回应任何任务时，严格遵循以下顺序：

1. **功能开发**：先分析架构 → 描述系统结构、职责与交互 → 架构明确后才动手实现。
2. **代码重构**：先定义代码的理想终态 → 描述目标结构、抽象与边界 → 朝终态增量重构。
3. **调试修复**：先梳理已知信息 → 明确区分「事实 vs 假设」「症状 vs 根因」 → 问题空间厘清前不提修复方案。

信息不完整时请求澄清。不要急于写代码。行动前审慎且透明地推理。

---

## React 组件规范

以下规则定义的是**强制开发工作流**，不是建议、不是偏好、不是「最佳实践」。
违反这些规则的代码即视为**缺陷**，即使功能正常也必须修正。

## 组件定义

### 必须使用箭头函数

```tsx
// ✅ 正确
const Portal = (props: PortalProps) => { ... };

// ❌ 禁止 function 声明式组件
function Portal(props: PortalProps) { ... }
```

### 必须有独立的 Props 接口

用 `interface`，禁止在函数签名里内联。每个字段必须有 JSDoc 注释说明**意图**（不是重复类型）：

```tsx
interface PortalProps {
  /** 是否在容器不存在时自动创建 */
  autoCreate?: boolean;
  /** 传送门内容 */
  children: ReactNode;
}
```

### Props 在函数体内解构

**禁止**在参数位置解构，解构必须是函数体第一行：

```tsx
// ✅ 正确
const Portal = (props: PortalProps) => {
  const { autoCreate = false, children, container } = props;
  ...
};

// ❌ 禁止
const Portal = ({ autoCreate, children }: PortalProps) => { ... };
```

理由：保持单一可预测的入口、便于调试重构、防止 prop 意外遮蔽。

## Hooks 规则

### `useCallback` — 禁止使用

`useCallback` **不得**出现在组件代码中。以下用法一律禁止：

- 为传给子组件的函数「稳定」引用
- 配合 `React.memo` 阻止子组件重渲染
- 用来消除 `exhaustive-deps` 告警
- 任何预防性 / 防御性优化

若某处看起来「必须」用它，说明**设计有问题**，改设计而不是加 hook：

- 函数不闭包任何东西 → 提到组件外
- 命令式且不应影响渲染 → 改用 `ref`
- 其余 → 重划组件边界，让该函数不再跨界

> Web 端另有一层理由：`packages/web/admin-vite` 默认启用 React Compiler，
> 手动 memo 不仅多余，还可能干扰编译器优化。Native 端（Expo）未启用编译器，
> 但禁令同样成立——理由见文末「核心理念」。

### `useMemo` — 仅限两种场景

1. **从逻辑派生值**：memo 结果是一个**值**（不是函数），且逻辑非平凡
2. **高开销计算**：可证明的高开销，非预防性优化

其余场景**禁止**使用。

### `react-hooks/exhaustive-deps`

默认**不允许**禁用。仅当确认理解依赖模型、且行为是有意为之时可禁用，
且必须写在**文件顶部**，禁止行内禁用：

```ts
/* eslint-disable react-hooks/exhaustive-deps */
```

## 组件内部排列顺序

组件内部声明必须按以下顺序排列，不得随意穿插：

| 顺序 | 内容                       | 说明                              |
| ---- | -------------------------- | --------------------------------- |
| 0    | 常量                       | 组件**外部**，与实例无关的纯值    |
| 1    | 路由 / 安全区 / 环境 hooks | 环境上下文，最先获取              |
| 2    | `useState`                 | 组件自有状态                      |
| 3    | `useRef`                   | 命令式引用                        |
| 4    | 自定义 hooks               | 业务逻辑封装                      |
| 5    | 网络 hooks                 | query / mutation                  |
| 6    | 计算变量                   | 由以上状态派生                    |
| 7    | 函数声明                   | 事件处理、辅助逻辑                |
| 8    | `useEffect`                | 副作用，放在函数之后、return 之前 |
| 9    | `return`                   | JSX 渲染                          |

```tsx
const CODE_LENGTH = 6;                                    // 0. 常量在组件外

const MyScreen = (props: MyScreenProps) => {
  const { title } = props;

  const router = useRouter();                             // 1. 环境
  const insets = useSafeAreaInsets();

  const [value, setValue] = useState('');                 // 2. state
  const inputRef = useRef<TextInput>(null);               // 3. ref

  const { count, start } = useCountDownTimer(60);         // 4. 自定义 hooks
  const { data: profile } = useMyProfileQuery();          // 5. 网络 hooks
  const { mutate: submit, isPending } = useSubmitMutation();

  const canSubmit = value.length > 0 && !isPending;       // 6. 计算变量

  function handleSubmit() { ... }                         // 7. 函数声明

  useEffect(() => { ... }, []);                           // 8. 副作用

  return ( ... );                                         // 9. JSX
};
```

> **原则**：数据流自上而下——先声明数据源，再派生，再处理，最后渲染。
> 后面的可以引用前面的，前面的不应依赖后面的。

### 例外：初始值依赖上游数据

当 `useState` 的初始值需要由 hook / 网络接口的返回值决定时，允许把该 `useState`
下移到数据源之后：

```tsx
const { data: profile } = useMyProfileQuery();
const profilePhone = profile?.phone_number ?? '';

// ✅ 初始值依赖 profilePhone，放在数据源之后
const [phone, setPhone] = useState(phoneParam ?? profilePhone);
```

**判断标准**：初始值表达式引用了前面的 hook 返回值或派生变量，则该 state
跟随其依赖的位置，而非固定在第 2 层。

## 内部函数

组件内的辅助函数必须使用 **function 声明**（不是箭头函数）；可复用的应提到组件外：

```tsx
// ✅ function 声明
function findTargetElement() { ... }

// ❌ 禁止箭头函数
const findTargetElement = () => { ... };
```

理由：执行意图清晰、栈追踪更好。

## State vs Ref

| 用途                        | Hook       |
| --------------------------- | ---------- |
| 影响渲染的状态              | `useState` |
| 命令式 / 不触发渲染的可变值 | `useRef`   |

绝不混淆职责。

## useEffect

仅用于：生命周期绑定、外部系统同步、DOM / 命令式集成。

目的必须一读即明；副作用必须局部化；**创建了资源必须有 cleanup**。

## Boolean 条件规则

- 只需判断真值时，一律写 `Boolean(value)`
- 不要仅为得到布尔条件而写 `value !== undefined`、`value != null`
- 仅当 `undefined` 必须与 `0`、空字符串、`false`、`null` 区分开时，才允许显式空值比较

---

## 命名规范

### 文件命名

| 类型 | 格式 | 示例 |
| --- | --- | --- |
| 组件文件 | **PascalCase** | `TreeRoot.tsx`, `CheckboxGroup.tsx` |
| 测试文件 | kebab-case + `.test` | `button-group.test.tsx` |
| Hook 文件 | kebab-case，`use-` 前缀 | `use-auth.ts` |
| 类型文件 | kebab-case | `types.ts`, `types.d.ts` |
| 常量 / 工具文件 | kebab-case | `service-config.ts`, `atom-with-storage.ts` |

> 组件文件是 PascalCase，**与文件内导出的组件名一致**；只有测试和非组件模块用 kebab-case。

### 导出命名

| 类型 | 格式 | 示例 |
| --- | --- | --- |
| 组件 | PascalCase | `Button`, `PasswordInput` |
| Hook | camelCase，`use` 前缀 | `useAuth`, `useLoginMutation` |
| 常量 | UPPER_SNAKE_CASE | `AUTH_URLS`, `SERVICE_CODES` |
| 类型 / 接口 | PascalCase | `AuthTokens`, `LoginParams` |
| 工具函数 | camelCase | `createAppRequest`, `getAtomValue` |

### API 相关命名

| 类型 | 规则 | 示例 |
| --- | --- | --- |
| URL 常量 | `MODULE_URLS` | `AUTH_URLS`, `MONITOR_CACHE_URLS` |
| Query Keys | `MODULE_QUERY_KEYS` | `AUTH_QUERY_KEYS` |
| Mutation Keys | `MODULE_MUTATION_KEYS` | `AUTH_MUTATION_KEYS` |
| Fetch 函数 | `fetchXxx` | `fetchLogin`, `fetchCaptcha` |
| Query Hook | `useXxxQuery` | `useCacheInfoQuery` |
| Mutation Hook | `useXxxMutation` | `useAssignRoleMembersMutation` |

### API 类型

定义在 `packages/@core/types/src/api/*.d.ts`，写在 `declare global` 内、用**点号分段**的
namespace，字段一律 **camelCase**，每个字段必须有注释：

```ts
declare global {
  namespace Api.Auth {
    /** 账号密码登录 */
    type PwdLoginParams = LoginContext & {
      /** 图形验证码内容 */
      code?: string;
      /** 密码 */
      password: string;
      /** 用户名 */
      userName: string;
    };
  }
}
```

后端返回 snake_case 时在 service 层转换，**不要把 snake_case 带进类型定义**。

### Feature 模块结构

```
features/<name>/
├── components/        # 该 feature 私有的组件
├── use-xxx.ts         # hooks 平铺，不套 hooks/ 目录
└── types.ts           # 需要时才建
```

不使用 `core/` 子目录；hooks 直接平铺在模块根下。

---

## 核心理念

- React **不是**关于「防止 re-render」
- Hooks 是**语义工具**，不是性能 hack
- 可读性 > 过早优化
- **架构错误不能用 hooks 来打补丁**

如果某个 hook 让你觉得「必须要用」，先质疑设计。
