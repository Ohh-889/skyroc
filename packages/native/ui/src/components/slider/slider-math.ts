import type { SliderBounds } from './types';

/**
 * 以下函数全部标了 `'worklet'`，既能在手势回调里跑在 UI 线程，也能在渲染期直接调。
 *
 * 换算逻辑只此一份：拖拽（UI 线程）和归一化入参（JS 线程）用的必须是同一套取整与夹边界规则， 否则受控回写的值会和手指停下的位置差一个 step。
 */

/** 把数值夹进闭区间 */
export function clamp(value: number, min: number, max: number) {
  'worklet';

  return Math.min(Math.max(value, min), max);
}

/** 值 → 轨道比例。`min === max` 时退化为 0，避免除零把 NaN 传进布局 */
export function valueToRatio(value: number, bounds: SliderBounds) {
  'worklet';

  const span = bounds.max - bounds.min;

  return span > 0 ? clamp((value - bounds.min) / span, 0, 1) : 0;
}

/** 轨道上的像素位置 → 对齐到 step 并夹进边界的值 */
export function positionToValue(position: number, trackSize: number, bounds: SliderBounds) {
  'worklet';

  if (trackSize <= 0) return bounds.min;

  const ratio = clamp(position / trackSize, 0, 1);
  const raw = bounds.min + ratio * (bounds.max - bounds.min);
  const snapped = Math.round((raw - bounds.min) / bounds.step) * bounds.step + bounds.min;

  return clamp(snapped, bounds.min, bounds.max);
}
