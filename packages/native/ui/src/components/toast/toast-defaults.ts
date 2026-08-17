import type { ToastOptions } from './types';

/** 非 loading 类型的默认自动关闭延时（毫秒） */
const DEFAULT_DURATION = 2000;

/** ToastRenderer 在 PortalHost 中的层级，保证 Toast 盖在其他 portal 节点之上 */
export const TOAST_PORTAL_Z_INDEX = 1000;

/**
 * 解析最终生效的自动关闭延时，返回 0 表示常驻
 *
 * 默认值只在这一处落地：声明式 `<Toast />` 与命令式 toastManager 共用同一份规则， 避免出现「showLoadingToast 常驻、<Toast type="loading" /> 却 2
 * 秒后消失」这类分叉。
 *
 * 也正因为 loading 的常驻是从 type 推导而来、而不是写死一个 duration: 0， loading 被 update 成 success 后无需任何特判就会自然恢复成 2000 毫秒自动关闭。
 */
export function resolveDuration(options: Pick<ToastOptions, 'duration' | 'type'>): number {
  const { duration, type } = options;

  if (duration !== undefined) return duration;

  return type === 'loading' ? 0 : DEFAULT_DURATION;
}
