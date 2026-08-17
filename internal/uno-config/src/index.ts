import type { Preset, PresetWind3Theme, Rule } from 'unocss';
import { allShortcuts } from './shortcuts';

export { allShortcuts, flexShortcuts, positionShortcuts, textShortcuts } from './shortcuts';

/** Theme color keys */
const themeColorKeys = [
  'primary',
  'info',
  'success',
  'warning',
  'error',
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'gold',
  'lime'
] as const;

/** Color palette number scale */
const colorPaletteNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function buildAntdMainPalette(name: string) {
  return {
    50: `var(--${name}-50)`,
    100: `var(--${name}-100)`,
    200: `var(--${name}-200)`,
    300: `var(--${name}-300)`,
    400: `var(--${name}-400)`,
    500: `var(--${name}-500)`,
    600: `var(--${name}-600)`,
    700: `var(--${name}-700)`,
    800: `var(--${name}-800)`,
    900: `var(--${name}-900)`,
    950: `var(--${name}-950)`
  };
}
/**
 * Create color palette with semantic color variables for a single color
 *
 * 调色板阶层设计： - 50-200: 浅色区（背景、填充、装饰性边框） - 300-400: 过渡区（交互反馈、次要状态） - 500: 主色区（默认按钮、链接、图标） - 600-700: 深色区（激活状态、强调） -
 * 800-950: 极深区（深色模式适配） 语义化颜色映射： - bg (50): 背景色 - 极浅，不干扰内容 - bg-hover (100): 背景悬停色 - border (200): 边框色 - 可见但不抢眼 -
 * border-hover (300): 边框悬停色 - hover (400): 悬停色 - 比主色浅，表示"即将激活" - text (500): 文字色 - 使用主色 - active (600): 激活色 -
 * 比主色深，表示"已被按下" - text-active (700): 文字激活色
 *
 * @param name - Color name (e.g., 'primary', 'success')
 */
function createColorsPalette(name: string) {
  const colors = buildAntdMainPalette(name);
  return {
    ...colors,
    DEFAULT: `var(--${name})`,

    // 背景相关
    bg: `var(--${name}-50)`,
    'bg-hover': `var(--${name}-100)`,

    // 边框相关
    border: `var(--${name}-200)`,
    'border-hover': `var(--${name}-300)`,

    // 交互状态
    hover: `var(--${name}-400)`,
    active: `var(--${name}-600)`,

    // 语义别名，色值由浅到深：lightest(50) → lighter(100) → light(200)
    lightest: `var(--${name}-50)`, // 50 - 最浅
    lighter: `var(--${name}-100)`, // 100 - 次浅
    light: `var(--${name}-200)`, // 200 - 稍浅

    // 文字相关
    text: `var(--${name}-500)`,
    'text-hover': `var(--${name}-400)`,
    'text-active': `var(--${name}-700)`
  };
}

/**
 * Create color palette variables for all theme colors
 *
 * Generate nested color objects for each theme color: - primary: { DEFAULT, 50, 100, ..., foreground, hover, active,
 * ... } - success: { DEFAULT, 50, 100, ..., foreground, hover, active, ... } - etc. This allows using classes like
 * `text-primary-50`, `bg-success-100`, etc.
 */
function createColorPaletteVars() {
  const colorPaletteVar: Record<string, Record<string, string>> = {};

  themeColorKeys.forEach(color => {
    colorPaletteVar[color] = createColorsPalette(color);
  });

  return colorPaletteVar;
}

/** Generated color palette variables */
const colorPaletteVars = createColorPaletteVars();

const textVariants = [
  'base',
  'secondary',
  'tertiary',
  'quaternary',
  'placeholder',
  'disabled',
  'heading',
  'label',
  'description',
  'light-solid'
];

const radiusVariants = ['DEFAULT', 'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'] as const;

const radiusVariantsRules = radiusVariants.map(variant => {
  if (variant === 'md' || variant === 'DEFAULT') {
    return [`radius-${variant}`, { 'border-radius': `var(--radius)` }];
  }

  if (variant === 'none') {
    return [`radius-${variant}`, { 'border-radius': 0 }];
  }
  return [`radius-${variant}`, { 'border-radius': `var(--radius-${variant})` }];
}) as Rule[];

const textVariantsRules = textVariants.map(variant => {
  if (variant === 'base') {
    return [`text-${variant}`, { color: `var(--color-text)` }];
  }
  return [`text-${variant}`, { color: `var(--color-text-${variant})` }];
}) as Rule[];

export const builtinRadiuses = [0, 0.3, 0.5, 0.75, 1] as const;

/**
 * The UnoCSS preset for Soybean Admin.
 *
 * @param options - The options for the preset.
 * @param globals - Whether to generate global variables, like *.border-color, body.color, body.background.
 */
export function presetSoybeanAdmin(): Preset<PresetWind3Theme> {
  return {
    name: 'unocss-preset-skyroc-admin',
    preflights: [
      {
        getCSS: () => `
          @keyframes shadcn-down { from{ height: 0 } to { height: var(--radix-accordion-content-height)} }
          @keyframes shadcn-up { from{ height: var(--radix-accordion-content-height)} to { height: 0 } }
          @keyframes shadcn-collapsible-down { from{ height: 0 } to { height: var(--radix-collapsible-content-height)} }
          @keyframes shadcn-collapsible-up { from{ height: var(--radix-collapsible-content-height)} to { height: 0 } }
          @keyframes enter-x-animation { to { opacity: 1; transform: translateX(0); } }
          @keyframes enter-y-animation { to { opacity: 1; transform: translateY(0); } }
        `
      },
      {
        getCSS: () => `
          html.size-xs {
            font-size: 12px;
          }
          html.size-sm {
            font-size: 14px;
          }
          html.size-md {
            font-size: 16px;
          }
          html.size-lg {
            font-size: 18px;
          }
          html.size-xl {
            font-size: 20px;
          }
          html.size-2xl {
            font-size: 24px;
          }
        `
      }
    ],
    shortcuts: allShortcuts,
    rules: [
      ...textVariantsRules,
      ...radiusVariantsRules,
      ['radius', { 'border-radius': `var(--border-radius)` }],
      // Accordion animations
      [
        'animate-accordion-down',
        {
          animation: 'shadcn-down 0.2s ease-out'
        }
      ],
      [
        'animate-accordion-up',
        {
          animation: 'shadcn-up 0.2s ease-out'
        }
      ],
      [
        'animate-collapsible-down',
        {
          animation: 'shadcn-collapsible-down 0.2s ease-out'
        }
      ],
      [
        'animate-collapsible-up',
        {
          animation: 'shadcn-collapsible-up 0.2s ease-out'
        }
      ],
      // Enter animations
      [
        /^enter-x:nth-child\((\d+)\)$/,
        ([, n]) => ({
          animation: `enter-x-animation 0.3s ease-in-out ${0.1 * Number(n)}s forwards`,
          opacity: '0',
          transform: 'translateX(50px)'
        })
      ],
      [
        /^enter-y:nth-child\((\d+)\)$/,
        ([, n]) => ({
          animation: `enter-y-animation 0.3s ease-in-out ${0.1 * Number(n)}s forwards`,
          opacity: '0',
          transform: 'translateY(50px)'
        })
      ],
      [
        /^-enter-x:nth-child\((\d+)\)$/,
        ([, n]) => ({
          animation: `enter-x-animation 0.3s ease-in-out ${0.1 * Number(n)}s forwards`,
          opacity: '0',
          transform: 'translateX(-50px)'
        })
      ],
      [
        /^-enter-y:nth-child\((\d+)\)$/,
        ([, n]) => ({
          animation: `enter-y-animation 0.3s ease-in-out ${0.1 * Number(n)}s forwards`,
          opacity: '0',
          transform: 'translateY(-50px)'
        })
      ]
    ],
    theme: {
      colors: {
        ...colorPaletteVars,
        // Layout colors (for admin layout)
        'base-text': 'var(--color-text-base)',
        'base-bg': 'var(--color-bg-base)',
        mask: 'var(--color-bg-mask)',
        link: {
          DEFAULT: 'var(--color-link)',
          hover: 'var(--color-link-hover)',
          active: 'var(--color-link-active)'
        },
        border: {
          DEFAULT: 'var(--color-border)',
          secondary: 'var(--color-border-secondary)',
          disabled: 'var(--color-border-disabled)'
        },
        container: {
          DEFAULT: 'var(--color-bg-container)',
          disabled: 'var(--color-bg-container-disabled)'
        },
        blur: 'var(--color-bg-blur)',
        inverted: 'var(--color-inverted)',
        layout: 'var(--color-bg-layout)',
        nprogress: 'var(--color-nprogress)'
      },
      fontSize: {
        xs: ['var(--text-xs)', 'var(--line-height-xs)'], // 12px / 18px
        sm: ['var(--text-sm)', 'var(--line-height-sm)'], // 14px / 22px
        md: ['var(--text-base)', 'var(--line-height-base)'], // 16px / 24px
        lg: ['var(--text-lg)', 'var(--line-height-lg)'], // 18px / 26px
        xl: ['var(--text-xl)', 'var(--line-height-xl)'], // 20px / 28px
        '2xl': ['var(--text-2xl)', 'var(--line-height-2xl)'], // 24px / 32px
        '3xl': ['var(--text-3xl)', 'var(--line-height-3xl)'], // 30px / 38px
        '4xl': ['var(--text-4xl)', 'var(--line-height-4xl)'], // 36px / 44px
        '5xl': ['var(--text-5xl)', 'var(--line-height-5xl)'], // 48px / 56px
        '6xl': ['var(--text-6xl)', 'var(--line-height-6xl)'], // 60px / 68px
        '7xl': ['var(--text-7xl)', 'var(--line-height-7xl)'], // 72px / 80px
        '8xl': ['var(--text-8xl)', 'var(--line-height-8xl)'], // 96px / 104px
        '9xl': [' var(--text-9xl)', 'var(--line-height-9xl)'] // 128px / 136px
      },
      lineHeight: {
        xs: '1.125rem', // 18px
        sm: '1.375rem', // 22px
        base: '1.5rem', // 24px
        lg: '1.625rem', // 26px
        xl: '1.75rem', // 28px
        '2xl': '2rem', // 32px
        '3xl': '2.375rem', // 38px
        '4xl': '2.75rem', // 44px
        '5xl': '3.5rem', // 56px
        '6xl': '4.25rem', // 68px
        '7xl': '5rem', // 80px
        '8xl': '6.5rem', // 104px
        '9xl': '8.5rem' // 136px
      },
      width: {
        DEFAULT: '0.25rem',
        '3xs': '0.25rem',
        '2xs': '0.5rem',
        xs: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        '7xl': '6rem',
        '8xl': '8rem',
        '9xl': '9rem'
      },
      height: {
        DEFAULT: '0.25rem',
        '3xs': '0.25rem',
        '2xs': '0.5rem',
        xs: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        '7xl': '6rem',
        '8xl': '8rem',
        '9xl': '9rem'
      },
      maxWidth: {
        DEFAULT: '0.25rem',
        '3xs': '0.25rem',
        '2xs': '0.5rem',
        xs: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        '7xl': '6rem',
        '8xl': '8rem',
        '9xl': '9rem'
      },

      maxHeight: {
        DEFAULT: '0.25rem',
        '3xs': '0.25rem',
        '2xs': '0.5rem',
        xs: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        '7xl': '6rem',
        '8xl': '8rem',
        '9xl': '9rem'
      },
      minWidth: {
        DEFAULT: '0.25rem',
        '3xs': '0.25rem',
        '2xs': '0.5rem',
        xs: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        '7xl': '6rem',
        '8xl': '8rem',
        '9xl': '9rem'
      },
      minHeight: {
        DEFAULT: '0.25rem',
        '3xs': '0.25rem',
        '2xs': '0.5rem',
        xs: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        '7xl': '6rem',
        '8xl': '8rem',
        '9xl': '9rem'
      },
      spacing: {
        DEFAULT: '0.25rem',
        '3xs': '0.25rem',
        '2xs': '0.5rem',
        xs: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        '7xl': '6rem',
        '8xl': '8rem',
        '9xl': '9rem'
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        none: '0',
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        full: '9999px'
      },
      boxShadow: {
        float: `0 6px 16px 0 rgb(0 0 0 / 8%),
          0 3px 6px -4px rgb(0 0 0 / 12%),
          0 9px 28px 8px rgb(0 0 0 / 5%)`,
        header: 'var(--header-box-shadow)',
        sider: 'var(--sider-box-shadow)',
        tab: 'var(--tab-box-shadow)'
      }
    }
  };
}

export { colorPaletteNumbers, colorPaletteVars, createColorPaletteVars, createColorsPalette, themeColorKeys };

export { textVariants };

export default presetSoybeanAdmin;
