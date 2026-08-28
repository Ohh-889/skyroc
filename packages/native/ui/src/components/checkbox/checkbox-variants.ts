import type { ThemeSize } from '@skyroc/tailwind-plugin/ui';
import { tv } from 'tailwind-variants';

/** Maps size preset to control (box/circle) pixel size */
export const SIZE_CONTROL_MAP: Record<ThemeSize, number> = {
  '2xl': 32,
  lg: 24,
  md: 20,
  sm: 16,
  xl: 28,
  xs: 14
};

/**
 * Maps size preset to label line-height (px)
 *
 * 控件所在行的高度取「控件尺寸」与「label 首行行高」的较大值：label 比控件高时把控件撑到首行中线， 控件比 label 高时以控件自身为准，避免被裁切。多行 label 下控件始终贴着首行而不是整块垂直居中。
 *
 * Values follow Tailwind CSS v4 line-height defaults: text-xs → 16px, text-sm → 20px, text-base → 24px, text-lg → 28px
 */
export const SIZE_LABEL_LINE_HEIGHT_MAP: Record<ThemeSize, number> = {
  '2xl': 28,
  lg: 24,
  md: 24,
  sm: 20,
  xl: 24,
  xs: 16
};

/** Maps size preset to inner icon (check/minus) pixel size */
export const SIZE_INNER_ICON_MAP: Record<ThemeSize, number> = {
  '2xl': 20,
  lg: 16,
  md: 14,
  sm: 11,
  xl: 18,
  xs: 9
};

/** 自定义 iconSize 时勾选图标相对控件的比例 */
const INNER_ICON_RATIO = 0.7;

export interface CheckboxSizes {
  /** 控件边长（px） */
  control: number;

  /** 控件所在行的高度（px），用于与 label 首行对齐 */
  controlRow: number;

  /** 勾选 / 半选图标边长（px） */
  innerIcon: number;
}

/**
 * 解析复选控件的像素尺寸。
 *
 * 未传 iconSize 时完全走设计预设；传了则按固定比例整体缩放，避免只放大控件、内部图标仍是预设尺寸导致的比例失衡。
 */
export function resolveCheckboxSizes(size: ThemeSize, iconSize?: number): CheckboxSizes {
  const control = iconSize ?? SIZE_CONTROL_MAP[size];
  const innerIcon = iconSize === undefined ? SIZE_INNER_ICON_MAP[size] : Math.round(iconSize * INNER_ICON_RATIO);

  return {
    control,
    controlRow: Math.max(control, SIZE_LABEL_LINE_HEIGHT_MAP[size]),
    innerIcon
  };
}

/**
 * 复选控件样式。
 *
 * `indicator` 槽输出的是 Uniwind 的 `accent-*` 工具类，供 `colorClassName` 取色， 因此勾选颜色跟随主题 token，而非硬编码白色。
 */
export const checkboxVariants = tv({
  slots: {
    control: 'items-center justify-center',
    indicator: '',
    label: 'text-base text-foreground',
    root: 'flex-row items-start'
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
    // Active: filled background + foreground colored check/minus
    { active: true, class: { control: 'bg-primary', indicator: 'accent-primary-foreground' }, color: 'primary' },
    {
      active: true,
      class: { control: 'bg-destructive', indicator: 'accent-destructive-foreground' },
      color: 'destructive'
    },
    { active: true, class: { control: 'bg-success', indicator: 'accent-success-foreground' }, color: 'success' },
    { active: true, class: { control: 'bg-warning', indicator: 'accent-warning-foreground' }, color: 'warning' },
    { active: true, class: { control: 'bg-info', indicator: 'accent-info-foreground' }, color: 'info' },
    { active: true, class: { control: 'bg-accent', indicator: 'accent-accent-foreground' }, color: 'accent' },
    { active: true, class: { control: 'bg-carbon', indicator: 'accent-carbon-foreground' }, color: 'carbon' },
    { active: true, class: { control: 'bg-secondary', indicator: 'accent-secondary-foreground' }, color: 'secondary' }
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

export const checkboxGroupVariants = tv({
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

export const checkboxCardVariants = tv({
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
