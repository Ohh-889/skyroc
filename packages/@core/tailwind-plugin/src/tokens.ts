/**
 * 设计令牌单一数据源，三端（web / native / miniapp）共用。
 *
 * 原 `@skyroc/ui-tokens` 包并入于此：该包唯一的消费者就是本插件，而三端统一走 Tailwind， 本插件即唯一的翻译层，再没有第二个需要读裸 token 的地方。
 *
 * 下面的 scale 表（spacing / borderRadius / fontSize / fontWeight）当前没有代码消费——插件级的 圆角与字号扩展在 `index.ts` 里按 `radius`
 * 选项动态算，不读这里。保留它们是为了留下一份显式的 尺度基准：既作为写 className 时的参考，也给将来需要以 JS 形式读取尺度的场景（miniapp 主题、 设计稿对表、Figma 同步等）预留接口。
 */

/** 品牌语义色名，与插件生成的 CSS 变量键名一一对应。 */
export type SemanticColorName =
  | 'accent'
  | 'carbon'
  | 'destructive'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

/** 表面 / 结构色名，与品牌色板无关。 */
export type SurfaceColorName = 'background' | 'border' | 'card' | 'foreground' | 'input' | 'muted' | 'popover' | 'ring';

export type ColorTokenName = SemanticColorName | SurfaceColorName;

/**
 * 明暗两套品牌色的默认 hex 值，消费者可覆盖。
 *
 * 结构与 `defaultFeedbackColorsHsl` / `defaultSidebarColorsHsl` 对称。
 */
export const defaultBrandColors: { dark: Record<SemanticColorName, string>; light: Record<SemanticColorName, string> } =
  {
    dark: {
      accent: '#a78bfa',
      carbon: '#a1a1aa',
      destructive: '#f87171',
      info: '#60a5fa',
      primary: '#818cf8',
      secondary: '#94a3b8',
      success: '#4ade80',
      warning: '#fbbf24'
    },
    light: {
      accent: '#8b5cf6',
      carbon: '#71717a',
      destructive: '#ef4444',
      info: '#3b82f6',
      primary: '#6366f1',
      secondary: '#64748b',
      success: '#22c55e',
      warning: '#f59e0b'
    }
  };

/**
 * 反馈色的 HSL 字符串形式，供 CSS 变量生成使用。
 *
 * 与上面的 hex 值互为镜像，用于保持 Web 侧 CSS 变量与品牌色同步。
 */
export const defaultFeedbackColorsHsl = {
  dark: {
    carbon: '220 14.3% 95.9%',
    'carbon-foreground': '220.9 39.3% 11%',
    info: '215 100% 54%',
    'info-foreground': '0 0% 100%',
    success: '140 79% 45%',
    'success-foreground': '0 0% 100%',
    warning: '37 91% 55%',
    'warning-foreground': '0 0% 100%'
  },
  light: {
    carbon: '240 4% 16%',
    'carbon-foreground': '0 0% 98%',
    info: '215 100% 54%',
    'info-foreground': '0 0% 100%',
    success: '140 79% 45%',
    'success-foreground': '0 0% 100%',
    warning: '37 91% 55%',
    'warning-foreground': '0 0% 100%'
  }
} as const;

/**
 * 侧边栏色的 HSL 字符串形式。
 *
 * 结构与 `defaultFeedbackColorsHsl` 一致，消费者可通过插件的 `sidebar` 选项逐键覆盖。
 */
export const defaultSidebarColorsHsl = {
  dark: {
    'sidebar-accent': '240 3.7% 15.9%',
    'sidebar-accent-foreground': '240 4.8% 95.9%',
    'sidebar-background': '240 5.9% 10%',
    'sidebar-border': '240 3.7% 15.9%',
    'sidebar-foreground': '240 4.8% 95.9%',
    'sidebar-primary': '236.9 100% 69.61%',
    'sidebar-primary-foreground': '0 0% 100%',
    'sidebar-ring': '217.2 91.2% 59.8%'
  },
  light: {
    'sidebar-accent': '240 4.8% 95.9%',
    'sidebar-accent-foreground': '240 5.9% 10%',
    'sidebar-background': '0 0% 98%',
    'sidebar-border': '220 13% 91%',
    'sidebar-foreground': '240 5.3% 26.1%',
    'sidebar-primary': '236.9 100% 69.61%',
    'sidebar-primary-foreground': '0 0% 98%',
    'sidebar-ring': '217.2 91.2% 59.8%'
  }
} as const;

/**
 * 间距尺度，与 Tailwind 默认值对齐（4px 基准）。
 *
 * 跨端：web（Tailwind）消费 px 字符串，native（Uniwind）按同一批键消费数值像素。
 */
export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px'
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * 圆角尺度，三端（web / native / miniapp）共用。
 *
 * 值是 CSS px 字符串，native 侧需要数值时自行转换。注意这是**基准表**，插件实际注入的 `borderRadius` 由 `index.ts` 按 `radius` 选项动态计算，二者不是同一套值。
 */
export const borderRadius = {
  none: '0px',
  sm: '4px',
  DEFAULT: '8px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px'
} as const;

export type RadiusToken = keyof typeof borderRadius;

/**
 * 字号尺度。
 *
 * 元组形式 `[size, { lineHeight }]` 同时兼容 Tailwind 与 Uniwind。
 */
export const fontSize = {
  xs: ['12px', { lineHeight: '16px' }],
  sm: ['14px', { lineHeight: '20px' }],
  base: ['16px', { lineHeight: '24px' }],
  lg: ['18px', { lineHeight: '28px' }],
  xl: ['20px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
  '3xl': ['30px', { lineHeight: '36px' }],
  '4xl': ['36px', { lineHeight: '40px' }],
  '5xl': ['48px', { lineHeight: '1' }],
  '6xl': ['60px', { lineHeight: '1' }]
} as const;

export type FontSizeToken = keyof typeof fontSize;

/** 字重尺度，与 Tailwind 默认值对齐。 */
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900'
} as const;

export type FontWeightToken = keyof typeof fontWeight;
