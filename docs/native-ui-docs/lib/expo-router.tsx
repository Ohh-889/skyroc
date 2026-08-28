'use client';

import type { ReactNode } from 'react';

/**
 * Expo-router 的本地替身，供文档站渲染 playground 的整页组件页时使用。
 *
 * 为什么必须换掉：真包会把 react-native-screens 整条原生导航栈拖进来 —— AppContainer.js 是 Flow 源码（`import type {ViewStyleProp}` 直接把 Turbopack
 * 的 TS 解析器打挂）、NativeScreensModule 要 react-native-web 没有的 TurboModuleRegistry、 gamma/tabs 那几个子模块在 web 上压根没发出来。做法与
 *
 * @expo/vector-icons 替身一致， 见 next.config.mjs 的 resolveAlias。
 *
 * 覆盖面：51 个 app/components/*.tsx 里只用到 `Stack`（仅 _layout）与 `useRouter().back()`。文档站没有导航栈，返回上一页无意义，一律 no-op。
 * 若将来页面用上真实路由能力（参数、跳转），这里会静默失效，需要同步补齐。
 */

function noop() {}

interface RouterShim {
  back: () => void;
  canGoBack: () => boolean;
  dismiss: () => void;
  navigate: () => void;
  push: () => void;
  replace: () => void;
  setParams: () => void;
}

const router: RouterShim = {
  back: noop,
  canGoBack: () => false,
  dismiss: noop,
  navigate: noop,
  push: noop,
  replace: noop,
  setParams: noop
};

export function useRouter(): RouterShim {
  return router;
}

export { router };

interface StackProps {
  children?: ReactNode;
}

/** 文档站里没有栈导航，直接透传 children */
export const Stack = (props: StackProps) => {
  const { children } = props;

  return <>{children ?? null}</>;
};

Stack.Screen = function StackScreen() {
  return null;
};
