# Web 样式规范

适用于 `packages/web/**` 与 Web 应用（`apps/admin` 等）。
通用 React 组件规则见仓库根 `AGENTS.md`。

> `CLAUDE.md` 是指向本文件的符号链接，只修改本文件。

## 样式方案

UnoCSS + `@skyroc/tailwind-plugin`（`platform: 'web'`，默认值），通过 `className` prop。

## React Compiler 已启用

`packages/web/admin-vite/src/plugins/babel.ts` 默认注入 `reactCompilerPreset`，
需要关闭时传 `reactCompiler: false`。

因此根 `AGENTS.md` 中「禁止 `useCallback`」在 Web 端有额外理由：手动 memo
不仅多余，还可能干扰编译器优化。

## 颜色体系

### 语义色 token（强制优先）

`primary` `secondary` `destructive` `success` `warning` `info` `muted`
`foreground` `muted-foreground` `border` `carbon`

```tsx
className="text-primary"
className="text-muted-foreground"
className="bg-secondary"
className="border-border"
```

### 色阶 50–950

所有语义色均注册了 50–950 色阶（`colorScale()`，
见 `packages/@core/tailwind-plugin/src/index.ts`）。需要深浅变体时优先用色阶：

```tsx
// ✅ 色阶
className="bg-primary-50"
className="text-primary-700"
className="bg-destructive-100"

// ✅ 或 opacity 修饰符
className="bg-primary/10"

// ❌ 不要手写近似色
className="bg-[#343C610D]"     // → bg-primary-50 或 bg-primary/5
className="bg-[#ef44441a]"     // → bg-destructive-50 或 bg-destructive/10
```

### ⚠️ style 场景的变量写法与 Native 不同

Web 的 CSS 变量存的是 **HSL 三元组**，必须包 `hsl()`
（`generate.ts:145` — `native ? hslToHex(value) : value`）：

```tsx
// ✅ Web
style={{ color: 'hsl(var(--primary) / 0.3)' }}

// ❌ Native 的写法，Web 上无效
style={{ color: 'var(--primary)' }}
```

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

---

## 待补充

以下条目尚无经过核实的约定，需要时再写，**不要凭空补**：

- antd 组件的封装/覆盖边界（何时用 `@skyroc/web-ui-antd`，何时直接用 antd）
- `@skyroc/web-ui` / `web-ui-compose` / `web-ui-antd` 三层的选用规则
- 布局与间距的项目级约定（Tailwind 默认 scale 无需重复说明）
