import type { ThemeColor } from '@skyroc/ui-types';
import type { ReactNode, Ref } from 'react';
import type { View } from 'react-native';
import type { SlotClassNames } from '../../types';

/**
 * Slider 组件可覆盖的 slot 名称。
 *
 * `hitArea` 是包住轨道的透明命中层，`track` 是底轨，`activeBar` 是激活段， `thumb` 是滑块定位框，`thumbInner` 是缺省圆钮本体（传了自定义滑块时不渲染）。
 */
export type SliderSlots = 'activeBar' | 'hitArea' | 'root' | 'thumb' | 'thumbInner' | 'track';

/** 单值与区间两种形态共用的属性 */
interface SliderBaseProps {
  /** 轨道粗细（px）：水平模式是高，垂直模式是宽 */
  barSize?: number;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<SliderSlots>;

  /** 激活段与圆钮描边的主题色 */
  color?: ThemeColor;

  /** 是否禁用，禁用后整体置灰且不响应手势 */
  disabled?: boolean;

  /** 最大值 */
  max?: number;

  /** 最小值 */
  min?: number;

  /** 是否只读，不响应手势但不置灰 */
  readonly?: boolean;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** 步长，取值会对齐到 `min + n * step`；非正数按 1 处理 */
  step?: number;

  /** 测试标识，挂在根节点上 */
  testID?: string;

  /** 滑块直径（px），同时决定轨道两端的内缩量 */
  thumbSize?: number;

  /** 是否垂直方向；垂直模式下父级必须有确定高度 */
  vertical?: boolean;
}

/** 单值滑块属性 */
export interface SingleSliderProps extends SliderBaseProps {
  /** 默认值（非受控），缺省为 `min` */
  defaultValue?: number;

  /** 值变化回调，拖拽过程中实时触发 */
  onChange?: (value: number) => void;

  /** 值稳定后的回调：松手、点击轨道、无障碍步进各触发一次，适合用来发请求 */
  onChangeAfterDrag?: (value: number) => void;

  /** 单值模式 */
  range?: false;

  /** 自定义滑块内容，缺省渲染主题色描边的圆钮 */
  thumb?: ReactNode;

  /** 当前值（受控） */
  value?: number;
}

/** 区间滑块属性 */
export interface RangeSliderProps extends SliderBaseProps {
  /** 默认值（非受控），缺省为 `[min, min]` */
  defaultValue?: [number, number];

  /** 自定义右侧（垂直模式为上侧）滑块内容 */
  endThumb?: ReactNode;

  /** 值变化回调，拖拽过程中实时触发 */
  onChange?: (value: [number, number]) => void;

  /** 值稳定后的回调：松手、点击轨道、无障碍步进各触发一次，适合用来发请求 */
  onChangeAfterDrag?: (value: [number, number]) => void;

  /** 区间模式，两端互为边界、不允许穿越 */
  range: true;

  /** 自定义左侧（垂直模式为下侧）滑块内容 */
  startThumb?: ReactNode;

  /** 当前值（受控） */
  value?: [number, number];
}

/** 滑块组件属性，`range` 决定值是标量还是二元组 */
export type SliderProps = RangeSliderProps | SingleSliderProps;

/**
 * 组件内部使用的宽类型。
 *
 * `range` 与值形状的对应关系已经由对外的 `SliderProps` 判别联合保证，内部再逐处 narrow 只会把同一个判断重复十遍， 因此在解构处一次性放宽，后续统一按 `[start, end]` 处理。
 */
export type SliderInternalProps = SliderBaseProps & {
  defaultValue?: number | [number, number];
  endThumb?: ReactNode;
  onChange?: (value: number | [number, number]) => void;
  onChangeAfterDrag?: (value: number | [number, number]) => void;
  range?: boolean;
  startThumb?: ReactNode;
  thumb?: ReactNode;
  value?: number | [number, number];
};

/** 取值边界，worklet 与 JS 两侧共用同一份换算参数 */
export interface SliderBounds {
  /** 最大值 */
  max: number;
  /** 最小值 */
  min: number;
  /** 步长，已保证为正数 */
  step: number;
}
