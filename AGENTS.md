# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Skills Usage Rules (CRITICAL)

### Project Skills Overview

This project has 11 skills located in `.Codex/skills/`:

1. code-simplifier
2. component-refactoring
3. doc-coauthoring
4. feature-dev
5. frontend-code-review
6. frontend-design
7. frontend-testing
8. senior-frontend
9. skill-creator
10. ui-ux-pro-max
11. vercel-react-best-practices

### ❗ Absolute Skill Invocation Rules

1. No implicit skill loading

Codex MUST NOT load, invoke, or apply any skill by default.

Do NOT auto-select skills

Do NOT suggest which skill to use

Do NOT preload skill behavior

Do NOT combine skills

Skills are only used when the user explicitly instructs which one to use.

### Skill Usage Scenarios

When directed by the user, use skills according to these scenarios:

| User Intent / Scenario         | Skill                                        |
| ------------------------------ | -------------------------------------------- |
| 写完代码后（统一收尾）         | `.Codex/skills/code-simplifier`             |
| 写文档 / 技术文档 / 方案文档   | `.Codex/skills/doc-coauthoring`             |
| 重构已有组件                   | `.Codex/skills/component-refactoring`       |
| 遵循 / 对齐最佳实践            | `.Codex/skills/vercel-react-best-practices` |
| 完成较大的需求 / 系统级改动    | `.Codex/skills/vercel-react-best-practices` |
| 让我像设计师一样思考 UI / UX   | `.Codex/skills/ui-ux-pro-max`               |
| 开发一个明确的功能需求         | `.Codex/skills/feature-dev`                 |
| 我让你**主动**做代码审查       | `.Codex/skills/frontend-code-review`        |
| 前端视觉 / 界面设计            | `.Codex/skills/frontend-design`             |
| 前端测试 / 测试策略 / 测试用例 | `.Codex/skills/frontend-testing`            |
| 设计组件 / 项目 / 需求的架构   | `.Codex/skills/senior-frontend`             |

## Important Notes

You are an experienced software architect and engineer.

When responding to any task, strictly follow this thinking order:

1. Feature development:
   - Always start by analyzing the architecture.
   - Describe the system structure, responsibilities, and interactions.
   - Only proceed to implementation after the architecture is explicit.

2. Code refactoring:
   - First define the ideal final state of the code.
   - Clearly describe the desired structure, abstractions, and boundaries.
   - Refactor incrementally toward that target state.

3. Debugging and fixing issues:
   - First organize and summarize all known information.
   - Explicitly distinguish:
     - facts vs assumptions
     - symptoms vs root causes
   - Do not suggest fixes until the problem space is fully mapped.

If information is incomplete, request clarification.
Do not rush to code.
Reason carefully and transparently before acting.

### Boolean condition rules

- When a condition only needs truthiness, always write `Boolean(value)`.
- Do not use explicit nullish comparisons such as `value !== undefined` or `value != null` merely to produce a boolean condition.
- Explicit nullish comparisons are allowed only when `undefined` must remain distinct from `0`, an empty string, `false`, or `null`.

## React Component Coding Workflow & Rules

### 1. This is a workflow, not just style

The following rules define a **mandatory development workflow** for React components.
They are not suggestions, not preferences, and not “best practices”.
Code that violates these rules is considered **incorrect**, even if it works.

### 2. Hooks usage rules (strict)

#### ❌ `useCallback` — **forbidden**

- `useCallback` must **never** appear in React component code.
- Do **not** use it for:

---

#### ⚠️ `useMemo` — **allowed only in two cases**

`useMemo` may appear **only** under the following conditions:

1. **Deriving a value from logic**
   - The memoized result is a **value**, not a function.
   - The logic is non-trivial and meaningful.

2. **Official React guidance: expensive computation**
   - The computation is demonstrably expensive.
   - Not used preemptively or defensively.

Anything else is **over-optimization and forbidden**.

---

#### ❌ `react-hooks/exhaustive-deps`

- Disabling `react-hooks/exhaustive-deps` is **not allowed by default**.
- It may only be disabled when:
  - The dependency model is **fully understood**
  - And the behavior is **intentional and documented**

When disabled, it must be placed at the **top of the file**, not inline.

```ts
/* eslint-disable react-hooks/exhaustive-deps */
```

---

### 3. Component definition rules (mandatory)

#### 3.1 Component must be an arrow function

- Components must **always** be defined as arrow functions.
- PascalCase is mandatory.

```ts
const Portal = (props: PortalProps) => {
  ...
};
```

❌ Function declarations are forbidden:

```ts
function Portal(props: PortalProps) {}
```

---

#### 3.2 Props type must be explicitly defined

- Every component must define a dedicated props type.
- Use `interface` by default.
- Do **not** inline props typing in the function signature.

```ts
interface PortalProps {
  /** 是否在容器不存在时自动创建 */
  autoCreate?: boolean;

  /** 传送门内容 */
  children: ReactNode;

  /** 容器 ID 或 CSS 选择器 */
  container: string | HTMLElement;

  /** 容器不存在时的回退内容 */
  fallback?: ReactNode;

  /** 自动创建时的标签名 */
  tagName?: keyof HTMLElementTagNameMap;
}
```

- Every field **must** have a comment.
- Comments explain **intent**, not obvious types.

---

#### 3.3 Props destructuring rule (very strict)

- **Never destructure props in the function parameter**
- Props must be destructured **inside the function**
- It must be the **first line of the component body**

✅ Correct:

```ts
const Portal = (props: PortalProps) => {
  const {
    autoCreate = false,
    children,
    container,
    fallback = null,
    tagName = 'div',
  } = props;

  ...
};
```

❌ Forbidden:

```ts
const Portal = ({ autoCreate = false, children }: PortalProps) => {};
```

Reason:

- Keeps a single, predictable entry point
- Easier debugging and refactoring
- Prevents accidental prop shadowing

---

### 4. Internal function rules

- Internal helper functions:
  - Must be declared as **function declarations**, not arrow functions
  - Must be defined **inside the component**, unless reusable

```ts
function findTargetElement() {
  ...
}
```

Rationale:

- Clear execution intent
- Avoid unnecessary closures
- Better stack traces

---

### 5. State & ref intent separation

- `useState` → **render-affecting state only**
- `useRef` → **imperative, lifecycle-bound, or mutable state**

If something:

- Does not affect render → `useRef`
- Affects render → `useState`

Never mix responsibilities.

---

### 6. Effects must be intentional

- `useEffect` must represent:
  - lifecycle binding
  - external system sync
  - DOM / imperative integration

If an effect exists:

- Its purpose must be obvious from reading it
- Side effects must be localized
- Cleanup must be present if resources are created

---

### 7. Example compliance (Portal component)

The following component is considered **correct** under this workflow:

- Arrow function component
- Explicit props interface with comments
- No `useCallback`
- No unnecessary `useMemo`
- Intentional effect
- Clear ref vs state separation

(Your provided `Portal` implementation complies with these rules.)

---

### 8. Philosophy (non-negotiable)

- React is **not** about “preventing re-renders”
- Hooks are **semantic tools**, not performance hacks
- Readability > premature optimization
- Architecture errors must not be patched with hooks

If a hook feels “necessary”, question the design first.
