import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 轨道粗细默认值（px）：水平模式是高，垂直模式是宽 */
export const DEFAULT_SLIDER_BAR_SIZE = 2;

/** 滑块直径默认值（px） */
export const DEFAULT_SLIDER_THUMB_SIZE = 24;

/**
 * 触摸层在交叉轴上的最小跨度（pt）。
 *
 * 轨道本身只有 2px，直接挂手势等于没有命中区。外面套一层同宽的透明区把可点面积抬到系统建议的 44pt， 视觉上仍然只看得到那条细轨。
 */
export const SLIDER_MIN_HIT_SIZE = 44;

/**
 * 滑块样式。
 *
 * 颜色全部走语义色 token：激活段用实色，圆钮用同色描边加 `bg-background` 底，暗色模式下自动跟随， 不需要在 worklet 里插值色值。
 *
 * 尺寸不做成 variant：轨道、圆钮、触摸区是像素级联动（居中偏移、位移距离都由三者算出）， 走 `barSize` / `thumbSize` 数值属性比枚举档位直接。
 *
 * `disabled` 声明在 `color` 之后，整体降透明由 `root` 一处承担，避免只给激活段加透明度导致圆钮仍然是亮的。
 */
export const sliderVariants = tv({
  slots: {
    activeBar: 'absolute rounded-full',
    hitArea: 'relative',
    root: '',
    thumb: 'absolute items-center justify-center',
    thumbInner: 'h-full w-full rounded-full border-2 bg-background shadow-sm',
    track: 'absolute overflow-hidden rounded-full bg-muted-foreground/20'
  },
  variants: {
    color: {
      accent: { activeBar: 'bg-accent', thumbInner: 'border-accent' },
      carbon: { activeBar: 'bg-carbon', thumbInner: 'border-carbon' },
      destructive: { activeBar: 'bg-destructive', thumbInner: 'border-destructive' },
      info: { activeBar: 'bg-info', thumbInner: 'border-info' },
      primary: { activeBar: 'bg-primary', thumbInner: 'border-primary' },
      secondary: { activeBar: 'bg-secondary', thumbInner: 'border-secondary' },
      success: { activeBar: 'bg-success', thumbInner: 'border-success' },
      warning: { activeBar: 'bg-warning', thumbInner: 'border-warning' }
    },
    disabled: {
      true: { root: 'opacity-50' }
    },
    // 主轴撑满、交叉轴由 style 给运行时尺寸；垂直模式需要父级有确定高度
    vertical: {
      false: { hitArea: 'w-full', root: 'w-full' },
      true: { hitArea: 'flex-1', root: 'h-full items-center' }
    }
  },
  defaultVariants: {
    color: 'primary',
    disabled: false,
    vertical: false
  }
});

export type SliderVariantProps = VariantProps<typeof sliderVariants>;
