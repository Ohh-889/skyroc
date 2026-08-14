import { describe, expect, it, vi } from 'vitest';

import { builtinColorMap, builtinColors, builtinRadiuses, skyrocUIPlugin } from '../src/index';

type PluginInstance = ReturnType<typeof skyrocUIPlugin>;

function getConfig(plugin: PluginInstance) {
  const config = plugin.config as Record<string, any>;
  return config.theme.extend as {
    borderRadius: Record<string, string>;
    colors: Record<string, any>;
    fontSize: Record<string, [string, string]>;
  };
}

describe('builtinColors / builtinColorMap / builtinRadiuses', () => {
  it('builtinColors 非空且包含 default', () => {
    expect(builtinColors.length).toBeGreaterThan(0);
    expect(builtinColors).toContain('default');
  });

  it('builtinColorMap 与 builtinColors 一一对应，值为 HSL 三元组字符串', () => {
    for (const name of builtinColors) {
      const value = builtinColorMap[name];
      expect(typeof value).toBe('string');
      expect(value).toMatch(/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/);
    }
  });

  it('builtinRadiuses 为预设档位 [0, 0.3, 0.5, 0.75, 1]', () => {
    expect(builtinRadiuses).toEqual([0, 0.3, 0.5, 0.75, 1]);
  });
});

describe('skyrocUIPlugin - config (web 模式默认)', () => {
  it('默认 radius=0.5：lg=0.5rem / md=0.375rem / sm=0.25rem / xl=0.75rem', () => {
    const { borderRadius } = getConfig(skyrocUIPlugin());

    expect(borderRadius.lg).toBe('0.5rem');
    expect(borderRadius.md).toBe('0.375rem');
    expect(borderRadius.sm).toBe('0.25rem');
    expect(borderRadius.xl).toBe('0.75rem');
  });

  it('指定 radius=1：派生 lg=1rem / md=0.875rem / sm=0.75rem / xl=1.25rem', () => {
    const { borderRadius } = getConfig(skyrocUIPlugin({ radius: 1 }));

    expect(borderRadius.lg).toBe('1rem');
    expect(borderRadius.md).toBe('0.875rem');
    expect(borderRadius.sm).toBe('0.75rem');
    expect(borderRadius.xl).toBe('1.25rem');
  });

  it('radius 非数字时回退到 0.5', () => {
    const { borderRadius } = getConfig(skyrocUIPlugin({ radius: undefined }));

    expect(borderRadius.lg).toBe('0.5rem');
  });

  it('radius 计算结果若小于 0 则被截断为 0rem', () => {
    const { borderRadius } = getConfig(skyrocUIPlugin({ radius: 0 }));

    expect(borderRadius.lg).toBe('0rem');
    expect(borderRadius.md).toBe('0rem');
    expect(borderRadius.sm).toBe('0rem');
    expect(borderRadius.xl).toBe('0.25rem');
  });

  it('web 模式下颜色变量包裹 hsl(var(--xxx))', () => {
    const { colors } = getConfig(skyrocUIPlugin());

    expect(colors.background).toBe('hsl(var(--background))');
    expect(colors.border).toBe('hsl(var(--border))');
    expect(colors.primary.DEFAULT).toBe('hsl(var(--primary))');
    expect(colors.primary[500]).toBe('hsl(var(--primary-500))');
    expect(colors.primary.foreground).toBe('hsl(var(--primary-foreground))');
  });

  it('colorScale 必须包含 50/100/.../950/DEFAULT/foreground', () => {
    const { colors } = getConfig(skyrocUIPlugin());

    const expectedKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 'DEFAULT', 'foreground'];
    for (const key of expectedKeys) {
      expect(colors.primary).toHaveProperty(String(key));
      expect(colors.destructive).toHaveProperty(String(key));
      expect(colors.success).toHaveProperty(String(key));
      expect(colors.warning).toHaveProperty(String(key));
      expect(colors.info).toHaveProperty(String(key));
      expect(colors.carbon).toHaveProperty(String(key));
    }
  });

  it('包含 sidebar 系列扁平颜色变量', () => {
    const { colors } = getConfig(skyrocUIPlugin());

    expect(colors['sidebar-background']).toBe('hsl(var(--sidebar-background))');
    expect(colors['sidebar-primary']).toBe('hsl(var(--sidebar-primary))');
    expect(colors['sidebar-accent-foreground']).toBe('hsl(var(--sidebar-accent-foreground))');
  });

  it('扩展 fontSize：2xs / 3xs / 4xs', () => {
    const { fontSize } = getConfig(skyrocUIPlugin());

    expect(fontSize['2xs'][0]).toBe('0.625rem');
    expect(fontSize['3xs'][0]).toBe('0.5rem');
    expect(fontSize['4xs'][0]).toBe('0.375rem');
  });
});

describe('skyrocUIPlugin - config (native 模式)', () => {
  it('platform=native 时颜色变量输出 var(--xxx) 而非 hsl(var(--xxx))', () => {
    const { colors } = getConfig(skyrocUIPlugin({ platform: 'native' }));

    expect(colors.background).toBe('var(--background)');
    expect(colors.primary.DEFAULT).toBe('var(--primary)');
    expect(colors.primary[300]).toBe('var(--primary-300)');
    expect(colors['sidebar-ring']).toBe('var(--sidebar-ring)');
  });
});

describe('skyrocUIPlugin - handler', () => {
  it('调用 addUtilities 注入 preset，调用 addBase 注入主题', () => {
    const addUtilities = vi.fn();
    const addBase = vi.fn();

    const ctx = { addBase, addUtilities } as any;
    (skyrocUIPlugin().handler as (api: any) => void)(ctx);

    expect(addUtilities).toHaveBeenCalledOnce();
    expect(addBase).toHaveBeenCalledOnce();

    const utilities = addUtilities.mock.calls[0][0] as Record<string, unknown>;
    expect(utilities['.flex-center']).toBeDefined();
    expect(utilities['.animate-accordion-down']).toBeDefined();

    const base = addBase.mock.calls[0][0] as Record<string, unknown>;
    expect(base[':root']).toBeDefined();
    expect(base['.dark']).toBeDefined();
  });

  it('handler 透传 options：自定义 darkSelector 出现在 addBase 中', () => {
    const addUtilities = vi.fn();
    const addBase = vi.fn();

    const ctx = { addBase, addUtilities } as any;
    (skyrocUIPlugin({ darkSelector: '[data-mode="dark"]' }).handler as (api: any) => void)(ctx);

    const base = addBase.mock.calls[0][0] as Record<string, unknown>;
    expect(base['[data-mode="dark"]']).toBeDefined();
  });

  it('platform=native 时 addBase 中的颜色变量为 hex 且挂在 @variant 上', () => {
    const addUtilities = vi.fn();
    const addBase = vi.fn();

    const ctx = { addBase, addUtilities } as any;
    (skyrocUIPlugin({ platform: 'native' }).handler as (api: any) => void)(ctx);

    const base = addBase.mock.calls[0][0] as Record<string, Record<string, string>>;
    expect(base['@variant light']['--primary']).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('platform=native 时不注入 DOM 专属基础样式（body / .lucide / html.size-*）', () => {
    const addUtilities = vi.fn();
    const addBase = vi.fn();

    const ctx = { addBase, addUtilities } as any;
    (skyrocUIPlugin({ platform: 'native' }).handler as (api: any) => void)(ctx);

    const base = addBase.mock.calls[0][0] as Record<string, unknown>;
    expect(Object.keys(base)).toEqual([':root', '@variant light', '@variant dark']);
  });

  it('globals=false 时不注入全局样式（无 body / *）', () => {
    const addUtilities = vi.fn();
    const addBase = vi.fn();

    const ctx = { addBase, addUtilities } as any;
    (skyrocUIPlugin({ globals: false }).handler as (api: any) => void)(ctx);

    const base = addBase.mock.calls[0][0] as Record<string, unknown>;
    expect(base['*']).toBeUndefined();
    expect(base.body).toBeUndefined();
    expect(base[':root']).toBeDefined();
  });
});
