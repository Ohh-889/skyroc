import { describe, expect, it } from 'vitest';

import { generateCSSVars, generateGlobalStyles } from '../src/generate';
import type {
  FeedbackColorOfThemeCssVarsVariant,
  SidebarColorOfThemeCssVarsVariant,
  ThemeCSSVars
} from '../src/types';

const sampleLight: ThemeCSSVars = {
  accent: '0 0% 0%',
  'accent-foreground': '0 0% 100%',
  background: '0 0% 100%',
  border: '0 0% 90%',
  card: '0 0% 100%',
  'card-foreground': '0 0% 0%',
  destructive: '0 80% 50%',
  'destructive-foreground': '0 0% 100%',
  foreground: '0 0% 0%',
  input: '0 0% 90%',
  muted: '0 0% 95%',
  'muted-foreground': '0 0% 40%',
  popover: '0 0% 100%',
  'popover-foreground': '0 0% 0%',
  primary: '210 100% 50%',
  'primary-foreground': '0 0% 100%',
  ring: '210 100% 50%',
  secondary: '0 0% 95%',
  'secondary-foreground': '0 0% 10%'
};

const sampleDark: ThemeCSSVars = {
  ...sampleLight,
  background: '0 0% 0%',
  foreground: '0 0% 100%'
};

describe('generateGlobalStyles', () => {
  it('返回包含 *、body、.lucide 的全局样式', () => {
    const styles = generateGlobalStyles() as Record<string, Record<string, string>>;

    expect(styles['*'].borderColor).toBe('hsl(var(--border))');
    expect(styles.body.background).toBe('hsl(var(--background))');
    expect(styles.body.color).toBe('hsl(var(--foreground))');
    expect(styles['.lucide']).toEqual({ height: '1.25em', width: '1.25em' });
  });
});

describe('generateCSSVars - 默认参数', () => {
  it('使用 builtin default 主题生成 :root 与 .dark 选择器', () => {
    const result = generateCSSVars({}) as Record<string, Record<string, string>>;

    expect(Object.keys(result)).toEqual(expect.arrayContaining([':root', '.dark']));
    expect(result[':root']['--primary']).toBe('236.9 100% 69.61%');
    expect(result[':root']['--background']).toBe('0 0% 100%');
    expect(result[':root']['--radius']).toBe('0.5rem');
    expect(result['.dark']['--background']).toBe('224 71.4% 4.1%');
  });

  it(':root 中应注入内置 sidebar 与 feedback 变量', () => {
    const result = generateCSSVars({}) as Record<string, Record<string, string>>;

    expect(result[':root']['--sidebar-background']).toBe('0 0% 98%');
    expect(result[':root']['--sidebar-primary']).toBe('236.9 100% 69.61%');
    expect(result[':root']['--info']).toBe('215 100% 54%');
    expect(result[':root']['--success']).toBe('140 79% 45%');
    expect(result[':root']['--warning']).toBe('37 91% 55%');
    expect(result[':root']['--carbon']).toBe('240 4% 16%');
  });

  it('支持自定义 radius', () => {
    const result = generateCSSVars({ radius: 1 }) as Record<string, Record<string, string>>;

    expect(result[':root']['--radius']).toBe('1rem');
  });
});

describe('generateCSSVars - color = false', () => {
  it('color=false 且 radius 为数字时仅返回 root radius 字符串', () => {
    const result = generateCSSVars({ color: false, radius: 0.75 }) as { root: string };

    expect(result).toEqual({ root: '--radius: 0.75rem;' });
  });

  it('color=false 且 radius=false 时返回空对象', () => {
    const result = generateCSSVars({ color: false, radius: false });

    expect(result).toEqual({});
  });
});

describe('generateCSSVars - 字符串形式 color', () => {
  it('支持 builtin color 字符串（如 "blue"）', () => {
    const result = generateCSSVars({ color: 'blue' }) as Record<string, Record<string, string>>;

    expect(result[':root']).toBeDefined();
    expect(result['.dark']).toBeDefined();
    expect(result[':root']['--primary']).toBeDefined();
  });

  it('未知 color 抛出 "Unknown color"', () => {
    expect(() => generateCSSVars({ color: 'not-a-color' as never })).toThrow('Unknown color: not-a-color');
  });
});

describe('generateCSSVars - 对象形式 color', () => {
  it('{ base, light } 形式：基于 base 主题深合并覆盖项', () => {
    const result = generateCSSVars({
      color: {
        base: 'default',
        light: { primary: '120 50% 50%' }
      } as never
    }) as Record<string, Record<string, string>>;

    expect(result[':root']['--primary']).toBe('120 50% 50%');
    expect(result[':root']['--background']).toBe('0 0% 100%');
  });

  it('{ name, light, dark } 形式：使用内联主题', () => {
    const result = generateCSSVars({
      color: { dark: sampleDark, light: sampleLight, name: 'custom' }
    }) as Record<string, Record<string, string>>;

    expect(result[':root']['--primary']).toBe('210 100% 50%');
    expect(result['.dark']['--background']).toBe('0 0% 0%');
  });
});

describe('generateCSSVars - onlyOne 与 selector', () => {
  it('onlyOne=true 时使用 :root / .dark 选择器（即使非 default）', () => {
    const result = generateCSSVars({ color: 'blue' }, true) as Record<string, unknown>;

    expect(Object.keys(result)).toEqual(expect.arrayContaining([':root', '.dark']));
  });

  it('onlyOne=false 且非 default 时使用 .theme-xxx 命名空间', () => {
    const result = generateCSSVars({ color: 'blue' }, false) as Record<string, unknown>;
    const keys = Object.keys(result);

    expect(keys).toContain('.theme-blue');
    expect(keys).toContain('.theme-blue.dark');
    expect(keys).not.toContain(':root');
  });

  it('onlyOne=false 但 color=default 时仍使用 :root', () => {
    const result = generateCSSVars({ color: 'default' }, false) as Record<string, unknown>;

    expect(Object.keys(result)).toEqual(expect.arrayContaining([':root', '.dark']));
  });

  it('支持自定义 darkSelector', () => {
    const result = generateCSSVars({ darkSelector: '[data-theme="dark"]' }) as Record<string, unknown>;

    expect(Object.keys(result)).toEqual(expect.arrayContaining([':root', '[data-theme="dark"]']));
  });

  it('onlyOne=false 且自定义 darkSelector 时 dark 选择器需拼接 theme 命名空间', () => {
    const result = generateCSSVars({ color: 'blue', darkSelector: '.night' }, false) as Record<string, unknown>;

    expect(Object.keys(result)).toContain('.theme-blue.night');
  });
});

describe('generateCSSVars - native 模式', () => {
  it('native=true 时颜色变量输出 hex，并按 @variant 分组', () => {
    const result = generateCSSVars({}, true, true) as Record<string, Record<string, string>>;

    expect(result['@variant light']['--background']).toMatch(/^#[0-9a-f]{6}$/i);
    expect(result['@variant light']['--primary']).toMatch(/^#[0-9a-f]{6}$/i);
    expect(result['@variant dark']['--background']).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('native=true 时不输出 .dark class 选择器（Uniwind 原生端不解析 class）', () => {
    const result = generateCSSVars({}, true, true) as Record<string, unknown>;

    expect(result['.dark']).toBeUndefined();
    expect(Object.keys(result[':root'] as object)).toEqual(['--radius']);
  });

  it('native=true 时 light / dark 变量集合完全一致（Uniwind 要求各主题变量对齐）', () => {
    const result = generateCSSVars({}, true, true) as Record<string, Record<string, string>>;

    expect(Object.keys(result['@variant light']).toSorted()).toEqual(Object.keys(result['@variant dark']).toSorted());
  });

  it('native=false（默认）时输出 HSL 三元组', () => {
    const result = generateCSSVars({}) as Record<string, Record<string, string>>;

    expect(result[':root']['--background']).toMatch(/^\d/);
    expect(result[':root']['--background']).not.toMatch(/^#/);
  });
});

describe('generateCSSVars - 自定义 feedback / sidebar', () => {
  it('feedback 自定义时覆盖内置 success/warning/info/carbon', () => {
    const customFeedback: FeedbackColorOfThemeCssVarsVariant = {
      dark: {
        carbon: '0 0% 10%',
        'carbon-foreground': '0 0% 90%',
        info: '200 100% 50%',
        'info-foreground': '0 0% 100%',
        success: '120 100% 50%',
        'success-foreground': '0 0% 100%',
        warning: '50 100% 50%',
        'warning-foreground': '0 0% 0%'
      },
      light: {
        carbon: '0 0% 20%',
        'carbon-foreground': '0 0% 80%',
        info: '200 100% 40%',
        'info-foreground': '0 0% 100%',
        success: '120 100% 40%',
        'success-foreground': '0 0% 100%',
        warning: '50 100% 40%',
        'warning-foreground': '0 0% 0%'
      }
    };

    const result = generateCSSVars({ feedbackColor: customFeedback }) as Record<string, Record<string, string>>;

    expect(result[':root']['--success']).toBe('120 100% 40%');
    expect(result[':root']['--info']).toBe('200 100% 40%');
    expect(result['.dark']['--warning']).toBe('50 100% 50%');
  });

  it('sidebar 自定义时覆盖内置 sidebar 变量', () => {
    const customSidebar: SidebarColorOfThemeCssVarsVariant = {
      dark: {
        'sidebar-accent': '0 0% 10%',
        'sidebar-accent-foreground': '0 0% 90%',
        'sidebar-background': '0 0% 5%',
        'sidebar-border': '0 0% 15%',
        'sidebar-foreground': '0 0% 95%',
        'sidebar-primary': '300 100% 50%',
        'sidebar-primary-foreground': '0 0% 100%',
        'sidebar-ring': '300 100% 50%'
      },
      light: {
        'sidebar-accent': '0 0% 90%',
        'sidebar-accent-foreground': '0 0% 10%',
        'sidebar-background': '0 0% 99%',
        'sidebar-border': '0 0% 85%',
        'sidebar-foreground': '0 0% 5%',
        'sidebar-primary': '300 100% 40%',
        'sidebar-primary-foreground': '0 0% 100%',
        'sidebar-ring': '300 100% 40%'
      }
    };

    const result = generateCSSVars({ sidebar: customSidebar }) as Record<string, Record<string, string>>;

    expect(result[':root']['--sidebar-primary']).toBe('300 100% 40%');
    expect(result['.dark']['--sidebar-background']).toBe('0 0% 5%');
  });
});
