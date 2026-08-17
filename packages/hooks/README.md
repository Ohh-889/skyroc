# @skyroc/hooks

与业务无关的通用 React Hooks 和轻量 Store 基础设施。通过 subpath exports 区分跨端能力与浏览器专用能力。

## 子入口

| 入口                | 包含内容                          | 适用平台                     |
| ------------------- | --------------------------------- | ---------------------------- |
| `@skyroc/hooks`     | Store + 不依赖浏览器 API 的 hooks | Web / React Native / MiniApp |
| `@skyroc/hooks/web` | 主入口全部内容 + 浏览器专用 hooks | Web                          |

```text
@skyroc/hooks
├── "."      → 跨端 Store 和 hooks
└── "./web"  → 浏览器 hooks + re-export 主入口
```

主入口不得依赖 `window`、`document`、`navigator` 等浏览器 API；`./web` 用于隔离这些平台能力。

本包独立放在 `packages/hooks/`，作为 Web、Native 和 MiniApp 可共同使用的 React 能力包。它不属于 `packages/web/`，因为主入口不绑定浏览器平台。

## 公开 API

### 主入口

| API                 | 用途                                                              |
| ------------------- | ----------------------------------------------------------------- |
| `Store`             | 可继承的轻量状态基类                                              |
| `useStore`          | 通过 `useSyncExternalStore` 订阅 Store 或其他 `Subscribable` 对象 |
| `Subscribable`      | `useStore` 接受的可订阅对象类型                                   |
| `useArray`          | 提供增删、排序、移动和重置等操作的数组状态                        |
| `useCaptcha`        | 验证码请求、校验、loading 和倒计时状态                            |
| `useCountDownTimer` | 可启动、停止的通用倒计时                                          |
| `useLoading`        | 提供 `loading`、`startLoading` 和 `endLoading`                    |
| `useNow`            | 按指定间隔更新时间，并支持暂停和恢复                              |

`useCaptcha` 还导出 `CaptchaCountingLabelGetter`、`CaptchaRequest`、`CaptchaTargetValidator` 和 `UseCaptchaOptions` 类型。

### Web 入口额外提供

| API              | 用途                                 |
| ---------------- | ------------------------------------ |
| `useCopy`        | 复制文本到剪贴板，并提供复制结果状态 |
| `useSystemTheme` | 监听系统深浅色偏好                   |
| `ThemeName`      | 系统主题名称类型                     |

## 使用

跨端能力从主入口导入，浏览器专用能力从 `./web` 导入：

```ts
import { Store, useArray, useCaptcha, useLoading } from '@skyroc/hooks';
import { useCopy, useSystemTheme } from '@skyroc/hooks/web';
```

`./web` 会 re-export 主入口，因此 Web 代码也可以只从 `@skyroc/hooks/web` 导入；分开导入可以更直观地表达平台边界。

### useCaptcha

```tsx
import { useCaptcha } from '@skyroc/hooks';
import type { CaptchaRequest } from '@skyroc/hooks';

interface CaptchaButtonProps {
  /** 发送验证码的请求逻辑 */
  request: CaptchaRequest;
  /** 验证码接收目标 */
  target: string;
}

const CaptchaButton = (props: CaptchaButtonProps) => {
  const { request, target } = props;

  const { getCaptcha, isCounting, label, loading } = useCaptcha('获取验证码', count => `${count}秒后重新获取`, {
    request,
    seconds: 60,
    validateTarget: value => Boolean(value.trim())
  });

  function handleClick() {
    getCaptcha(target);
  }

  return (
    <button
      disabled={isCounting || loading}
      type="button"
      onClick={handleClick}
    >
      {label}
    </button>
  );
};
```

`getCaptcha` 会先执行目标校验。校验失败或正在请求时不会重复发送；请求成功后开始倒计时，请求结束后自动关闭 loading。

Store 与 `useStore` 的继承、订阅和 selector 用法见 [`src/store/README.md`](./src/store/README.md)。

## 与 ahooks 的关系

- `ahooks` 是本包的 dependency，仅用于内部实现。
- 本包不 re-export `ahooks`。消费者需要其他 `ahooks` 能力时，应自行声明依赖并直接导入。
- 判断一个 hook 是否能进入主入口，应看它运行时是否依赖浏览器 API，而不是仅看依赖库的适用平台。

## 新增 Hook 规则

### 放置位置

| 条件                                                    | 放入                              |
| ------------------------------------------------------- | --------------------------------- |
| 不依赖 DOM / 浏览器 API                                 | `src/`，从主入口导出              |
| 依赖 `window`、`document`、`navigator`、`matchMedia` 等 | `src/web/`，从 `./web` 导出       |
| 依赖业务逻辑、i18n、特定 feature 或特定 UI 库           | 不放本包，留在对应 feature 或 app |

### 编码规范

遵循项目根目录 [`AGENTS.md`](../../AGENTS.md) 中的 React 编码规则：

- 禁止使用 `useCallback`。
- `useMemo` 仅用于非平凡派生值或可证明的高开销计算。
- Hook 和内部辅助函数使用 function 声明。
- 显式导入依赖，不依赖应用层的 auto-import。

### 同步清单

新增或修改公开 Hook 后，需要同步：

1. 平台无关 Hook 更新 `src/index.ts`；浏览器 Hook 更新 `src/web/index.ts`。
2. 添加或更新对应的针对性测试。
3. 更新本 README 的公开 API 和示例。
4. 更新 `docs/project-docs/content/docs/shared/hooks.mdx`。
