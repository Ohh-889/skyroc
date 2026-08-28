import plugin, { type Config, type PluginCreator } from 'tailwindcss/plugin';
import { generateCSSVars } from './generate';
import { presetSkyrocUI } from './presets';
import themes from './theme.json';
import { skyrocUITheme } from './themePresets';
import type { SkyrocUIPluginOptions, ThemeColorKey, ThemeConfig, ThemeConfigColor, ThemeOptions } from './types';

type SkyrocUIPlugin = {
  (options?: SkyrocUIPluginOptions): { config?: Partial<Config>; handler: PluginCreator };
  __isOptionsFunction: true;
};

function toRem(value: number) {
  return `${Number.parseFloat(Math.max(0, value).toFixed(3))}rem`;
}

/**
 * 设计令牌（原 `@skyroc/ui-tokens`）。
 *
 * 色值由本插件自己消费；spacing / borderRadius / fontSize / fontWeight 是尺度基准表， 供需要以 JS 形式读取尺度的场景使用（miniapp 主题、设计稿对表等）。
 */
export {
  borderRadius,
  defaultBrandColors,
  defaultFeedbackColorsHsl,
  defaultSidebarColorsHsl,
  fontSize,
  fontWeight,
  spacing
} from './tokens';

export type {
  ColorTokenName,
  FontSizeToken,
  FontWeightToken,
  RadiusToken,
  SemanticColorName,
  SpacingToken,
  SurfaceColorName
} from './tokens';

export const builtinColors = themes.map(theme => theme.name) as ThemeConfigColor[];

export const builtinColorMap = themes.reduce(
  (acc, theme) => {
    acc[theme.name as ThemeConfigColor] = theme.cssVars.light.primary;
    return acc;
  },
  {} as Record<ThemeConfigColor, string>
);

export const builtinRadiuses = [0, 0.3, 0.5, 0.75, 1] as const;

/**
 * The UnoCSS preset for Skyroc UI.
 *
 * @param options - The options for the preset.
 * @param globals - Whether to generate global variables, like *.border-color, body.color, body.background.
 */
export const skyrocUIPlugin: SkyrocUIPlugin = plugin.withOptions(
  (options: SkyrocUIPluginOptions = {}) =>
    ({ addBase, addUtilities }) => {
      addUtilities(presetSkyrocUI());

      addBase(skyrocUITheme(options));
    },
  (options: SkyrocUIPluginOptions = {}) => {
    const r = typeof options.radius === 'number' ? options.radius : 0.5;
    const isNative = options.platform === 'native';

    /** Web: hsl(var(--xxx))，native: var(--xxx) */
    function c(name: string) {
      return isNative ? `var(--${name})` : `hsl(var(--${name}))`;
    }

    function colorScale(name: string) {
      return {
        50: c(`${name}-50`),
        100: c(`${name}-100`),
        200: c(`${name}-200`),
        300: c(`${name}-300`),
        400: c(`${name}-400`),
        500: c(`${name}-500`),
        600: c(`${name}-600`),
        700: c(`${name}-700`),
        800: c(`${name}-800`),
        900: c(`${name}-900`),
        950: c(`${name}-950`),
        DEFAULT: c(name),
        foreground: c(`${name}-foreground`)
      };
    }

    return {
      theme: {
        extend: {
          borderRadius: {
            lg: toRem(r),
            md: toRem(r - 0.125),
            sm: toRem(r - 0.25),
            xl: toRem(r + 0.25)
          },
          colors: {
            accent: c('accent'),
            'accent-foreground': c('accent-foreground'),
            background: c('background'),
            border: c('border'),
            carbon: colorScale('carbon'),
            card: c('card'),
            'card-foreground': c('card-foreground'),
            destructive: colorScale('destructive'),
            foreground: c('foreground'),
            info: colorScale('info'),
            input: c('input'),
            muted: c('muted'),
            'muted-foreground': c('muted-foreground'),
            popover: c('popover'),
            'popover-foreground': c('popover-foreground'),
            primary: colorScale('primary'),
            ring: c('ring'),
            secondary: c('secondary'),
            'secondary-foreground': c('secondary-foreground'),
            'sidebar-accent': c('sidebar-accent'),
            'sidebar-accent-foreground': c('sidebar-accent-foreground'),
            'sidebar-background': c('sidebar-background'),
            'sidebar-border': c('sidebar-border'),
            'sidebar-foreground': c('sidebar-foreground'),
            'sidebar-primary': c('sidebar-primary'),
            'sidebar-primary-foreground': c('sidebar-primary-foreground'),
            'sidebar-ring': c('sidebar-ring'),
            success: colorScale('success'),
            warning: colorScale('warning')
          },
          fontSize: {
            '2xs': ['0.625rem', 'calc(0.75 / 0.625)'],
            '3xs': ['0.5rem', 'calc(0.625 / 0.5)'],
            '4xs': ['0.375rem', 'calc(0.5 / 0.375)']
          }
        }
      }
    };
  }
);

export { generateCSSVars, presetSkyrocUI, skyrocUITheme };

export type { ThemeColorKey, ThemeConfig, ThemeConfigColor, ThemeOptions };

export default skyrocUIPlugin;
