import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const themeState = vi.hoisted(() => ({
  themeScheme: 'light' as Theme.ThemeMode,
  toggleThemeScheme: vi.fn()
}));

vi.mock('@shell/ui/antd', async () => {
  const React = await import('react');

  interface MockButtonIconProps {
    className?: string;
    hoverAnimation?: string;
    icon?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    style?: React.CSSProperties;
    tooltipContent?: string;
    tooltipPlacement?: string;
  }

  const ButtonIcon = (props: MockButtonIconProps) => {
    const { className, hoverAnimation, icon, onClick, style, tooltipContent, tooltipPlacement } = props;

    return React.createElement(
      'button',
      {
        className,
        'data-hover-animation': hoverAnimation,
        'data-icon': icon,
        'data-tooltip-content': tooltipContent,
        'data-tooltip-placement': tooltipPlacement,
        style,
        type: 'button',
        onClick
      },
      'theme schema switch'
    );
  };

  return { ButtonIcon };
});

vi.mock('@shell/theme/hooks/use-theme', () => ({
  useTheme: () => themeState
}));

const { default: ThemeSchemaSwitch } = await import('@shell/theme/components/ThemeSchemaSwitch');

const originalStartViewTransition = document.startViewTransition;

function mockMotionPreference(matches: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches }));
}

function mockViewTransition() {
  const startViewTransition = vi.fn<Document['startViewTransition']>(callbackOptions => {
    if (typeof callbackOptions === 'function') {
      callbackOptions();
    } else {
      callbackOptions?.update?.();
    }

    const resolved = Promise.resolve();

    return {
      finished: resolved,
      ready: resolved,
      skipTransition: vi.fn(),
      types: new Set<string>() as ViewTransitionTypeSet,
      updateCallbackDone: resolved
    };
  });

  Object.defineProperty(document, 'startViewTransition', {
    configurable: true,
    value: startViewTransition
  });
  document.documentElement.animate = vi.fn();

  return startViewTransition;
}

beforeEach(() => {
  themeState.themeScheme = 'light';
  themeState.toggleThemeScheme.mockClear();
  vi.stubGlobal('innerWidth', 200);
  vi.stubGlobal('innerHeight', 100);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();

  if (originalStartViewTransition) {
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: originalStartViewTransition
    });
    return;
  }

  Reflect.deleteProperty(document, 'startViewTransition');
});

describe('ThemeSchemaSwitch', () => {
  it('根据当前主题传递图标、hover 动效和 tooltip 配置', () => {
    render(
      <ThemeSchemaSwitch
        className="custom-class"
        style={{ color: 'red' }}
        tooltipContent="切换主题"
        tooltipPlacement="top"
      />
    );

    const button = screen.getByRole('button', { name: 'theme schema switch' });

    expect(button).toHaveClass('custom-class');
    expect(button).toHaveStyle({ color: 'red' });
    expect(button).toHaveAttribute('data-icon', 'material-symbols:sunny');
    expect(button).toHaveAttribute('data-hover-animation', 'rotate');
    expect(button).toHaveAttribute('data-tooltip-content', '切换主题');
    expect(button).toHaveAttribute('data-tooltip-placement', 'top');
  });

  it('showTooltip=false 时传入空 tooltip 内容', () => {
    render(<ThemeSchemaSwitch showTooltip={false} />);

    expect(screen.getByRole('button')).toHaveAttribute('data-tooltip-content', '');
  });

  it('偏好减少动画时直接切换主题，不启动 view transition', () => {
    const startViewTransition = mockViewTransition();
    mockMotionPreference(true);

    render(<ThemeSchemaSwitch />);
    fireEvent.click(screen.getByRole('button'), { clientX: 20, clientY: 30 });

    expect(themeState.toggleThemeScheme).toHaveBeenCalledOnce();
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(document.documentElement.animate).not.toHaveBeenCalled();
  });

  it('支持 view transition 时先切换主题，再播放点击扩散动画', async () => {
    const startViewTransition = mockViewTransition();
    mockMotionPreference(false);

    render(<ThemeSchemaSwitch />);
    fireEvent.click(screen.getByRole('button'), { clientX: 20, clientY: 30 });

    await waitFor(() => {
      expect(document.documentElement.animate).toHaveBeenCalledOnce();
    });

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(themeState.toggleThemeScheme).toHaveBeenCalledOnce();
    const expectedEndRadius = Math.hypot(180, 70);

    expect(document.documentElement.animate).toHaveBeenCalledWith(
      {
        clipPath: ['circle(0px at 20px 30px)', `circle(${expectedEndRadius}px at 20px 30px)`]
      },
      {
        duration: 400,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)'
      }
    );
  });

  it('themeScheme=auto 时只执行切换，不播放扩散动画', async () => {
    const startViewTransition = mockViewTransition();
    mockMotionPreference(false);
    themeState.themeScheme = 'auto';

    render(<ThemeSchemaSwitch />);
    fireEvent.click(screen.getByRole('button'), { clientX: 20, clientY: 30 });

    await waitFor(() => {
      expect(startViewTransition).toHaveBeenCalledOnce();
    });

    expect(themeState.toggleThemeScheme).toHaveBeenCalledOnce();
    expect(document.documentElement.animate).not.toHaveBeenCalled();
  });
});
