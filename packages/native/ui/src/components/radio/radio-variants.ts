import type { ThemeSize } from '@skyroc/tailwind-plugin/ui';
import { tv } from 'tailwind-variants';

/** Maps size preset to control (circle/square) pixel size */
export const SIZE_CONTROL_MAP: Record<ThemeSize, number> = {
  '2xl': 32,
  lg: 24,
  md: 20,
  sm: 16,
  xl: 28,
  xs: 14
};

/** Maps size preset to inner icon (check) pixel size for square shape */
export const SIZE_INNER_ICON_MAP: Record<ThemeSize, number> = {
  '2xl': 20,
  lg: 16,
  md: 14,
  sm: 11,
  xl: 18,
  xs: 9
};

/** Maps size preset to inner dot pixel size for round shape */
export const SIZE_DOT_MAP: Record<ThemeSize, number> = {
  '2xl': 16,
  lg: 12,
  md: 10,
  sm: 8,
  xl: 14,
  xs: 6
};

/** 自定义 iconSize 时圆点相对外圈的比例 */
const DOT_RATIO = 0.5;

/** 自定义 iconSize 时勾选图标相对外圈的比例 */
const INNER_ICON_RATIO = 0.7;

export interface RadioSizes {
  /** 外圈容器边长（px） */
  control: number;

  /** 圆形选中态圆点边长（px） */
  dot: number;

  /** 方形选中态勾选图标边长（px） */
  innerIcon: number;
}

/**
 * 解析单选控件的像素尺寸。
 *
 * 未传 iconSize 时完全走设计预设；传了则按固定比例整体缩放， 避免只放大外圈、内部指示器仍是预设尺寸导致的比例失衡。
 */
export function resolveRadioSizes(size: ThemeSize, iconSize?: number): RadioSizes {
  if (iconSize === undefined) {
    return {
      control: SIZE_CONTROL_MAP[size],
      dot: SIZE_DOT_MAP[size],
      innerIcon: SIZE_INNER_ICON_MAP[size]
    };
  }

  return {
    control: iconSize,
    dot: Math.round(iconSize * DOT_RATIO),
    innerIcon: Math.round(iconSize * INNER_ICON_RATIO)
  };
}

/**
 * 单选控件样式。
 *
 * `indicator` 槽输出的是 Uniwind 的 `accent-*` 工具类，供 `colorClassName` 取色， 因此方形选中态的勾选颜色跟随主题 token，而非硬编码白色。
 */
export const radioVariants = tv({
  slots: {
    control: 'items-center justify-center',
    dot: 'rounded-full',
    indicator: '',
    label: 'text-base text-foreground',
    root: 'flex-row items-center'
  },
  variants: {
    active: {
      false: { control: 'border border-muted-foreground/50' },
      true: { control: '' }
    },
    color: {
      accent: {},
      carbon: {},
      destructive: {},
      info: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {}
    },
    disabled: {
      true: {
        label: 'text-muted-foreground',
        root: 'opacity-50'
      }
    },
    labelPosition: {
      left: { root: 'flex-row-reverse' },
      right: { root: '' }
    },
    shape: {
      round: { control: 'rounded-full' },
      square: { control: 'rounded' }
    },
    size: {
      '2xl': { label: 'text-lg', root: 'gap-3.5' },
      lg: { label: 'text-base', root: 'gap-2.5' },
      md: { label: 'text-base', root: 'gap-2' },
      sm: { label: 'text-sm', root: 'gap-1.5' },
      xl: { label: 'text-base', root: 'gap-3' },
      xs: { label: 'text-xs', root: 'gap-1' }
    }
  },
  compoundVariants: [
    // Round shape active: colored border + colored dot
    {
      active: true,
      class: { control: 'border border-primary', dot: 'bg-primary' },
      color: 'primary',
      shape: 'round'
    },
    {
      active: true,
      class: { control: 'border border-destructive', dot: 'bg-destructive' },
      color: 'destructive',
      shape: 'round'
    },
    {
      active: true,
      class: { control: 'border border-success', dot: 'bg-success' },
      color: 'success',
      shape: 'round'
    },
    {
      active: true,
      class: { control: 'border border-warning', dot: 'bg-warning' },
      color: 'warning',
      shape: 'round'
    },
    { active: true, class: { control: 'border border-info', dot: 'bg-info' }, color: 'info', shape: 'round' },
    { active: true, class: { control: 'border border-accent', dot: 'bg-accent' }, color: 'accent', shape: 'round' },
    { active: true, class: { control: 'border border-carbon', dot: 'bg-carbon' }, color: 'carbon', shape: 'round' },
    {
      active: true,
      class: { control: 'border border-secondary', dot: 'bg-secondary' },
      color: 'secondary',
      shape: 'round'
    },
    // Square shape active: filled background + foreground colored check (same as checkbox)
    {
      active: true,
      class: { control: 'bg-primary', indicator: 'accent-primary-foreground' },
      color: 'primary',
      shape: 'square'
    },
    {
      active: true,
      class: { control: 'bg-destructive', indicator: 'accent-destructive-foreground' },
      color: 'destructive',
      shape: 'square'
    },
    {
      active: true,
      class: { control: 'bg-success', indicator: 'accent-success-foreground' },
      color: 'success',
      shape: 'square'
    },
    {
      active: true,
      class: { control: 'bg-warning', indicator: 'accent-warning-foreground' },
      color: 'warning',
      shape: 'square'
    },
    {
      active: true,
      class: { control: 'bg-info', indicator: 'accent-info-foreground' },
      color: 'info',
      shape: 'square'
    },
    {
      active: true,
      class: { control: 'bg-accent', indicator: 'accent-accent-foreground' },
      color: 'accent',
      shape: 'square'
    },
    {
      active: true,
      class: { control: 'bg-carbon', indicator: 'accent-carbon-foreground' },
      color: 'carbon',
      shape: 'square'
    },
    {
      active: true,
      class: { control: 'bg-secondary', indicator: 'accent-secondary-foreground' },
      color: 'secondary',
      shape: 'square'
    }
  ],
  defaultVariants: {
    active: false,
    color: 'primary',
    disabled: false,
    labelPosition: 'right',
    shape: 'round',
    size: 'md'
  }
});

export const radioGroupVariants = tv({
  variants: {
    direction: {
      horizontal: 'flex-row flex-wrap',
      vertical: 'flex-col'
    },
    size: {
      '2xl': 'gap-x-4.5 gap-y-3.5',
      lg: 'gap-x-3.5 gap-y-2.5',
      md: 'gap-x-3 gap-y-2',
      sm: 'gap-x-2.5 gap-y-1.5',
      xl: 'gap-x-4 gap-y-3',
      xs: 'gap-x-2 gap-y-1'
    }
  },
  defaultVariants: {
    direction: 'vertical',
    size: 'md'
  }
});

export const radioCardVariants = tv({
  slots: {
    card: 'flex-row items-center gap-3 rounded-xl border border-border bg-card p-3 active:opacity-90',
    cardContent: 'flex-1 flex-row items-center gap-2.5',
    cardDescription: 'text-xs text-muted-foreground',
    cardLabel: 'text-sm font-medium text-foreground'
  },
  variants: {
    disabled: {
      true: {
        card: 'opacity-50'
      }
    }
  },
  defaultVariants: {
    disabled: false
  }
});
