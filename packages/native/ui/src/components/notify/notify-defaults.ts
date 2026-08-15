import type { NotifyOptions } from './types';

/** 默认自动关闭延时（毫秒） */
const DEFAULT_DURATION = 3000;

/**
 * NotifyRenderer 在 PortalHost 中的层级
 *
 * 高于 Toast（1000）：Notify 承载的多是系统级消息（断网、版本更新），且贴屏幕边缘显示、不会压住居中的 Toast， 即便与 Toast 的遮罩同时存在也应保持可见可点。
 */
const NOTIFY_PORTAL_Z_INDEX = 1100;

/**
 * 解析最终生效的自动关闭延时，返回 0 表示常驻
 *
 * 默认值只在这一处落地：声明式 `<Notify />` 与命令式 showNotify 共用同一份规则，不会出现两条路径默认时长不一致的分叉。
 *
 * 这里必须用 `!== undefined` 而不是真值判断：duration 为 0 表示常驻，是有意义的取值，不能被当成"没传"而回落到默认值。
 */
function resolveDuration(options: Pick<NotifyOptions, 'duration'>): number {
  const { duration } = options;

  if (duration !== undefined) return duration;

  return DEFAULT_DURATION;
}

export { NOTIFY_PORTAL_Z_INDEX, resolveDuration };
