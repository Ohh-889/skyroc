import type { RouterConfig } from './index';

/**
 * - 路由实例引用
 * - 用于在非组件模块（如请求适配器 adapter.ts）中惰性访问 router
 * - 目的：避免这些模块静态 import `./index`，从而切断
 *   `request → adapter → router → routeTree.gen → 路由模块` 的加载期循环依赖
 * - 仅做运行时引用存取，本模块无任何运行时依赖
 */
let routerRef: RouterConfig | null = null;

/** 在 router 创建完成后注册实例（由 ./index 调用）。 */
export function setRouter(router: RouterConfig) {
  routerRef = router;
}

/** 运行时获取 router 实例，未初始化时抛错以便尽早发现问题。 */
export function getRouter(): RouterConfig {
  if (!routerRef) {
    throw new Error('[router-ref] router 尚未初始化，请确认在使用前已加载 @/features/router');
  }

  return routerRef;
}
