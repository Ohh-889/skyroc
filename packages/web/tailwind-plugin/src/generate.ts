import { colord, getColorPalette } from '@skyroc/color';
import { defaultFeedbackColorsHsl, defaultSidebarColorsHsl } from '@skyroc/ui-tokens';
import { mergeDeep } from '@unocss/core';
// Hand-picked shadcn-style design presets (13 themes). Surface colors (background/card/foreground/...) are
// chosen per theme by designers and CANNOT be derived from `primary` — keep this file manually maintained.
// See README "关于 theme.json" for details.
import themes from './theme.json';
import type {
  ColorOptions,
  CssInJsLike,
  FeedbackColorOfThemeCssVarKey,
  FeedbackColorOfThemeCssVars,
  FeedbackColorOfThemeCssVarsVariant,
  SidebarColorOfThemeCssVarKey,
  SidebarColorOfThemeCssVarsVariant,
  ThemeCSSVarKey,
  ThemeCSSVars,
  ThemeCSSVarsVariant,
  ThemeConfig,
  ThemeOptions
} from './types';

const builtinThemes = themes as ThemeConfig[];

type CSSVarKey = ThemeCSSVarKey | FeedbackColorOfThemeCssVarKey | SidebarColorOfThemeCssVarKey;

const themeCSSVarKeys: CSSVarKey[] = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'info',
  'info-foreground',
  'secondary',
  'secondary-foreground',
  'carbon',
  'carbon-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'border',
  'input',
  'ring',
  'sidebar-background',
  'sidebar-foreground',
  'sidebar-border',
  'sidebar-ring',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground'
];

const themeColorKeys: CSSVarKey[] = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon'];

function getRadiusCSSVars(radius: number) {
  return `--radius: ${radius}rem;`;
}

function getRadiusCSSVarsStyles(radius: number) {
  const radiusCSS = getRadiusCSSVars(radius);

  return radiusCSS;
}

export function generateGlobalStyles(native = false) {
  const c = (name: string) => (native ? `var(--${name})` : `hsl(var(--${name}))`);

  return {
    '*': {
      borderColor: c('border')
    },
    '.lucide': {
      height: '1.25em',
      width: '1.25em'
    },
    body: {
      background: c('background'),
      color: c('foreground')
    }
  };
}

function getBuiltInTheme(name: string): ThemeCSSVarsVariant {
  const theme = builtinThemes.find(t => t.name === name);

  if (!theme) {
    throw new Error(`Unknown color: ${name}`);
  }

  return {
    name,
    ...theme.cssVars
  };
}

function getColorTheme(color: ColorOptions): ThemeCSSVarsVariant {
  let light: ThemeCSSVars;
  let dark: ThemeCSSVars;
  let name: string;

  if (typeof color === 'string') {
    name = color;
    ({ dark, light } = getBuiltInTheme(color));
  } else if ('base' in color) {
    name = color.base;
    ({ dark, light } = mergeDeep(getBuiltInTheme(color.base), color));
  } else {
    name = color.name;
    ({ dark, light } = color);
  }
  return { dark, light, name };
}

function createBuiltinFeedbackColorTheme(): FeedbackColorOfThemeCssVarsVariant {
  return defaultFeedbackColorsHsl as FeedbackColorOfThemeCssVarsVariant;
}

function hslToHex(hslValue: string) {
  return colord(`hsl(${hslValue.split(' ').join(', ')})`).toHex();
}

function getColorCSSVars(color: FeedbackColorOfThemeCssVars, native = false): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [item, value] of Object.entries(color)) {
    const key = item as CSSVarKey;

    if (!themeCSSVarKeys.includes(key)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    result[`--${key}`] = native ? hslToHex(value) : value;

    if (themeColorKeys.includes(key)) {
      const hsl = `hsl(${value.split(' ').join(', ')})`;

      const colorPalette = getColorPalette(hsl);

      for (const [num, hex] of colorPalette) {
        if (native) {
          result[`--${key}-${num}`] = hex;
        } else {
          const { h, l, s } = colord(hex).toHsl();
          result[`--${key}-${num}`] = `${h} ${s}% ${l}%`;
        }
      }
    }
  }

  return result;
}

function createBuiltinSidebarColorTheme(): SidebarColorOfThemeCssVarsVariant {
  return defaultSidebarColorsHsl as SidebarColorOfThemeCssVarsVariant;
}

export function generateCSSVars(theme: ThemeOptions, onlyOne = true, native = false): CssInJsLike {
  const {
    color = 'default',
    darkSelector = '.dark',
    feedbackColor = createBuiltinFeedbackColorTheme(),
    radius = 0.5,
    sidebar = createBuiltinSidebarColorTheme()
  } = theme;

  if (!color) {
    if (radius) {
      return {
        root: getRadiusCSSVarsStyles(radius)
      };
    }
  } else {
    const { dark, light, name } = getColorTheme(color);

    const themeName = !onlyOne && name;

    const addThemeName = themeName && themeName !== 'default';

    const themeSelector = addThemeName ? `.theme-${themeName}` : ':root';

    const darkThemeSelector = addThemeName ? `.theme-${themeName}${darkSelector}` : darkSelector;

    const darkThemeCSSVars = getColorCSSVars({ ...feedbackColor.dark, ...dark, ...sidebar.dark }, native);

    const lightThemeCSSVars = getColorCSSVars({ ...feedbackColor.light, ...light, ...sidebar.light }, native);

    if (native) {
      // Uniwind 的原生端不解析 class 选择器：`.dark { --xxx }` 会被当成一条普通规则，
      // 且紧跟在 `:root` 之后时会继承 root 标记，把暗色变量直接写进全局变量表，
      // 导致 App 无视系统外观恒为暗色。原生端主题必须用 @variant 声明，
      // Uniwind 才会把它们收集成 scopedVars 并按当前主题切换。
      return {
        ':root': {
          '--radius': `${radius}rem`
        },
        '@variant light': {
          ...lightThemeCSSVars
        },
        '@variant dark': {
          ...darkThemeCSSVars
        }
      };
    }

    return {
      [themeSelector]: {
        ...lightThemeCSSVars,
        '--radius': `${radius}rem`
      },
      [darkThemeSelector]: {
        ...darkThemeCSSVars
      }
    };
  }

  return {};
}
