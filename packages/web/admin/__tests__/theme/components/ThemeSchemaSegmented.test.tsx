import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const themeState = vi.hoisted(() => ({
  setThemeScheme: vi.fn(),
  themeScheme: 'dark' as Theme.ThemeMode
}));

vi.mock('@shell/ui/compose', async () => {
  const React = await import('react');

  return {
    SvgIcon: (props: { icon: string }) => React.createElement('span', { 'data-icon': props.icon })
  };
});

vi.mock('antd/es/segmented', async () => {
  const React = await import('react');

  interface MockSegmentedOption {
    label: React.ReactNode;
    value: Theme.ThemeMode;
  }

  interface MockSegmentedProps {
    className?: string;
    onChange?: (value: Theme.ThemeMode) => void;
    options: MockSegmentedOption[];
    value: Theme.ThemeMode;
  }

  const Segmented = (props: MockSegmentedProps) => {
    const { className, onChange, options, value } = props;

    return React.createElement(
      'div',
      { className, 'data-testid': 'theme-schema-segmented', 'data-value': value },
      options.map(option =>
        React.createElement(
          'button',
          {
            key: option.value,
            type: 'button',
            onClick: () => onChange?.(option.value)
          },
          option.value,
          option.label
        )
      )
    );
  };

  return { default: Segmented };
});

vi.mock('@shell/theme/hooks/use-theme', () => ({
  useTheme: () => themeState
}));

const { default: ThemeSchemaSegmented } = await import('@shell/theme/components/ThemeSchemaSegmented');

beforeEach(() => {
  themeState.setThemeScheme.mockClear();
  themeState.themeScheme = 'dark';
});

describe('ThemeSchemaSegmented', () => {
  it('按 auto / dark / light 顺序渲染主题选项，并绑定当前主题值', () => {
    render(<ThemeSchemaSegmented />);

    expect(screen.getByTestId('theme-schema-segmented')).toHaveAttribute('data-value', 'dark');
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['auto', 'dark', 'light']);
  });

  it('点击选项时转发到 setThemeScheme', () => {
    render(<ThemeSchemaSegmented />);

    fireEvent.click(screen.getByRole('button', { name: /light/i }));

    expect(themeState.setThemeScheme).toHaveBeenCalledWith('light');
  });
});
