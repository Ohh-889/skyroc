import { generateCSSVars, generateGlobalStyles } from './generate';
import type { SkyrocUIPluginOptions } from './types';

export function skyrocUITheme(options: SkyrocUIPluginOptions) {
  const { globals = true, platform = 'web', ...theme } = options;

  const isNative = platform === 'native';

  const cssVars = generateCSSVars(theme || {}, true, isNative);

  // 原生端只需要主题变量：`.lucide`、`body`、`html.size-*`、@keyframes 都是 DOM 概念，
  // Uniwind 解析到 `.lucide` 这类 class 规则时还会把它的声明混进全局变量表。
  if (isNative) {
    return cssVars;
  }

  const baseStyles = globals ? generateGlobalStyles(isNative) : '';

  return {
    ...cssVars,
    ...baseStyles,
    '@keyframes shadcn-collapsible-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-collapsible-content-height)' }
    },
    '@keyframes shadcn-collapsible-up': {
      from: { height: 'var(--radix-collapsible-content-height)' },
      to: { height: '0' }
    },
    '@keyframes shadcn-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' }
    },
    '@keyframes shadcn-up': {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' }
    },
    'html.size-2xl': {
      fontSize: '24px'
    },
    'html.size-lg': {
      fontSize: '18px'
    },
    'html.size-md': {
      fontSize: '16px'
    },
    'html.size-sm': {
      fontSize: '14px'
    },
    'html.size-xl': {
      fontSize: '20px'
    },
    'html.size-xs': {
      fontSize: '12px'
    }
  };
}
