import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 默认笔画宽度（px） */
export const DEFAULT_SIGNATURE_LINE_WIDTH = 3;

/** PNG 无损，JPEG 取 80 —— 签名是大片纯色，再高只是白白撑大 base64 */
export const SIGNATURE_QUALITY_MAP = {
  jpeg: 80,
  png: 100
} as const;

/**
 * 两次采样点的最小间距（px），低于它的移动事件直接丢弃。
 *
 * 触摸流每秒能吐上百个几乎重合的点，全部入 path 既让曲线抖动，又把 path 的点数（以及每帧 copy 的成本）推高一个量级。
 */
export const SIGNATURE_MIN_SAMPLE_DISTANCE = 1.5;

/**
 * 点按落墨时补的线段长度（px）。
 *
 * Skia 的描边不渲染零长度轮廓，只有 moveTo 的 path 点下去是没有墨的。 补一段肉眼不可见的极短线段，配合 round 端帽正好画出一个圆点。
 */
export const SIGNATURE_DOT_LENGTH = 0.01;

/**
 * Signature 样式变体。
 *
 * `pen` / `background` 两个槽不对应任何渲染节点，只是**色源**：Skia 的 Canvas 不吃 className， 用 `useResolveClassNames` 把这两个槽解析成真实色值再喂给
 * `<Path>` / `<Fill>`。 这样笔色和底色依然跟随主题 token 与深浅模式，而不是硬编码 hex —— 与 Rate 用 `accent-*` 槽给矢量图标取色是同一套做法。
 *
 * `color` 默认取 `carbon`：它在浅色主题下是近黑、深色主题下是近白，正好是「墨」该有的行为。 写死 `#000` 会在深色模式下与深色画布糊成一片。
 */
export const signatureVariants = tv({
  slots: {
    background: 'bg-background',
    canvas: 'overflow-hidden rounded-lg border border-dashed border-border bg-background',
    footer: 'mt-3 flex-row gap-2',
    pen: '',
    root: '',
    tips: 'absolute inset-0 items-center justify-center',
    tipsText: 'text-sm text-muted-foreground'
  },
  variants: {
    color: {
      accent: { pen: 'text-accent' },
      carbon: { pen: 'text-carbon' },
      destructive: { pen: 'text-destructive' },
      info: { pen: 'text-info' },
      primary: { pen: 'text-primary' },
      // secondary 是浅底色，直接当笔色几乎不可见，取前景色保证可读（与 Rate 同一处理）
      secondary: { pen: 'text-foreground' },
      success: { pen: 'text-success' },
      warning: { pen: 'text-warning' }
    },
    disabled: {
      true: { root: 'opacity-50' }
    },
    size: {
      lg: { canvas: 'h-[280px]' },
      md: { canvas: 'h-[200px]' },
      sm: { canvas: 'h-[140px]' }
    }
  },
  defaultVariants: {
    color: 'carbon',
    disabled: false,
    size: 'md'
  }
});

export type SignatureSlots = keyof typeof signatureVariants.slots;
export type SignatureVariantProps = VariantProps<typeof signatureVariants>;
