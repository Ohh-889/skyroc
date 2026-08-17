/**
 * Web 专属类型出口（依赖 DOM lib）。
 *
 * 从 `@skyroc/type-utils/web` 导入。根出口 `@skyroc/type-utils` 保持平台中立， 不会把 `HTMLElement` 之类的全局类型带进 React Native 等无 DOM 环境。
 */
export type * from './form';
