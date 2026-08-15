# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex, ...) when working with
code in this repository.

> `CLAUDE.md` is a symlink to this file — there is exactly one source of truth.
> Edit this file; never edit `CLAUDE.md` directly.

## Skills Usage Rules (CRITICAL)

### Project Skills Overview

Skills live in `.agents/skills/` (mirrored at `.claude/skills/`).
**Read that directory for the authoritative list** — it is never enumerated here, because a
hand-maintained list always drifts out of date.

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
  - Stabilizing a function reference passed down to a child component
  - Preventing child re-renders in combination with `React.memo`
  - Silencing `react-hooks/exhaustive-deps` warnings
  - Preemptive or defensive optimization of any kind

If `useCallback` feels **necessary**, the design is wrong. Fix the design instead:

- Hoist the function out of the component if it closes over nothing
- Use a `ref` when the callback is imperative and must not affect render
- Re-draw the component boundary so the function no longer crosses it

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

### 7. What is machine-enforced

Most of the rules above are review-time conventions. Only these are enforced by oxlint
(`internal/config/oxlint/react.json`):

| Rule                                    | Lint rule                                       |
| --------------------------------------- | ----------------------------------------------- |
| §2 `useCallback` forbidden              | `no-restricted-imports` (react → `useCallback`) |
| §2 `exhaustive-deps` may not be relaxed | `react/exhaustive-deps: error`                  |

§3.1 (arrow-function components), §3.3 (no parameter destructuring) and the `Boolean(value)`
rule have no equivalent oxlint rule today and are enforced by review only.

---

### 8. Philosophy (non-negotiable)

- React is **not** about “preventing re-renders”
- Hooks are **semantic tools**, not performance hacks
- Readability > premature optimization
- Architecture errors must not be patched with hooks

If a hook feels “necessary”, question the design first.
