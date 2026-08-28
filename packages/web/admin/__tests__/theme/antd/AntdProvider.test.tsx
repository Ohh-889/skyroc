import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const themeUserNameAtomMock = {};

const themeState = vi.hoisted(() => ({
  darkMode: false,
  settings: {
    themeRadius: 8,
    themeTextSize: 14
  } as Partial<Theme.ThemeSetting>,
  themeColors: {
    error: '#ff0000',
    info: '#1677ff',
    primary: '#6366f1',
    success: '#00aa00',
    warning: '#ffaa00'
  },
  watermark: {
    settings: {
      gap: [24, 24] as [number, number]
    }
  },
  watermarkContent: 'Skyroc - Alice'
}));

const jotaiMocks = vi.hoisted(() => ({
  setUserName: vi.fn(),
  useSetAtom: vi.fn()
}));

const antdMocks = vi.hoisted(() => ({
  appProps: undefined as { children?: ReactNode; style?: React.CSSProperties } | undefined,
  configProviderProps: undefined as Record<string, unknown> | undefined,
  initInstances: {
    message: { success: vi.fn() },
    modal: { confirm: vi.fn() },
    notification: { success: vi.fn() }
  },
  watermarkProps: undefined as Record<string, unknown> | undefined
}));

const antdThemeMock = vi.hoisted(() => ({
  theme: {
    token: {
      colorPrimary: '#6366f1'
    }
  }
}));

const antdUiMocks = vi.hoisted(() => ({
  initAntdUI: vi.fn()
}));

vi.mock('jotai', () => ({
  useSetAtom: (atom: unknown) => {
    jotaiMocks.useSetAtom(atom);
    return jotaiMocks.setUserName;
  }
}));

vi.mock('antd', async () => {
  const React = await import('react');

  interface MockProviderProps {
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  interface MockAppProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }

  interface MockWatermarkProps {
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  const ConfigProvider = (props: MockProviderProps) => {
    antdMocks.configProviderProps = props;

    return React.createElement('section', { 'data-testid': 'config-provider' }, props.children);
  };

  const App = (props: MockAppProps) => {
    antdMocks.appProps = props;

    return React.createElement('main', { 'data-testid': 'antd-app' }, props.children);
  };

  App.useApp = () => antdMocks.initInstances;

  const Watermark = (props: MockWatermarkProps) => {
    antdMocks.watermarkProps = props;

    return React.createElement(
      'div',
      {
        className: props.className as string,
        'data-content': props.content as string,
        'data-testid': 'watermark'
      },
      props.children
    );
  };

  return { App, ConfigProvider, Watermark };
});

vi.mock('@shell/theme/hooks', () => ({
  themeUserNameAtom: themeUserNameAtomMock,
  useTheme: () => themeState
}));

vi.mock('@shell/theme/antd/shared', () => ({
  getAntdTheme: vi.fn(() => antdThemeMock.theme)
}));

vi.mock('@shell/theme/antd/ui', () => ({
  initAntdUI: antdUiMocks.initAntdUI
}));

const { getAntdTheme } = await import('@shell/theme/antd/shared');
const { default: AntdProvider } = await import('@shell/theme/antd/AntdProvider');

beforeEach(() => {
  themeState.darkMode = false;
  themeState.settings = {
    themeRadius: 8,
    themeTextSize: 14
  } as Partial<Theme.ThemeSetting>;
  themeState.themeColors = {
    error: '#ff0000',
    info: '#1677ff',
    primary: '#6366f1',
    success: '#00aa00',
    warning: '#ffaa00'
  };
  themeState.watermark = {
    settings: {
      gap: [24, 24] as [number, number]
    }
  };
  themeState.watermarkContent = 'Skyroc - Alice';
  antdMocks.appProps = undefined;
  antdMocks.configProviderProps = undefined;
  antdMocks.watermarkProps = undefined;
  jotaiMocks.setUserName.mockClear();
  jotaiMocks.useSetAtom.mockClear();
  antdUiMocks.initAntdUI.mockClear();
  vi.mocked(getAntdTheme).mockClear();
});

describe('AntdProvider', () => {
  it('渲染 children，并把主题、locale 和水印配置传给 Ant Design Provider', () => {
    const locale = { locale: 'zh-cn' };

    render(
      <AntdProvider
        locale={locale as never}
        userName="Alice"
      >
        <span>app content</span>
      </AntdProvider>
    );

    expect(screen.getByText('app content')).toBeInTheDocument();
    expect(getAntdTheme).toHaveBeenCalledWith(themeState.themeColors, false, themeState.settings);
    expect(antdMocks.configProviderProps?.theme).toBe(antdThemeMock.theme);
    expect(antdMocks.configProviderProps?.locale).toBe(locale);
    expect(antdMocks.configProviderProps?.drawer).toEqual({ closable: { placement: 'end' } });
    expect(antdMocks.configProviderProps?.form).toEqual({ classNames: { label: 'font-600 text-13px' } });
    expect(antdMocks.configProviderProps?.modal).toEqual({
      centered: true,
      mask: { enabled: true, blur: true },
      classNames: {
        body: 'text-secondary',
        footer: 'mt-0 py-13px px-22px',
        header: 'px-22px',
        container:
          '[&_.ant-modal-confirm-btns]:(mt-0 py-13px border-t-1px border-border-secondary mt-22px px-22px) [&_.ant-modal-confirm-body]:px-22px pt-22px px-0 pb-0'
      }
    });
    expect(antdMocks.appProps?.style).toEqual({ height: '100%' });
    expect(antdMocks.watermarkProps?.content).toBe('Skyroc - Alice');
    expect(antdMocks.watermarkProps?.gap).toEqual([24, 24]);
  });

  it('通过 ContextHolder 初始化 message / modal / notification 实例', () => {
    render(
      <AntdProvider>
        <span>app content</span>
      </AntdProvider>
    );

    expect(antdUiMocks.initAntdUI).toHaveBeenCalledWith(
      antdMocks.initInstances.message,
      antdMocks.initInstances.modal,
      antdMocks.initInstances.notification
    );
  });

  it('把 userName 写入 themeUserNameAtom，并在 prop 更新时同步', async () => {
    const { rerender } = render(
      <AntdProvider userName="Alice">
        <span>app content</span>
      </AntdProvider>
    );

    await waitFor(() => {
      expect(jotaiMocks.setUserName).toHaveBeenCalledWith('Alice');
    });

    rerender(
      <AntdProvider userName="Bob">
        <span>app content</span>
      </AntdProvider>
    );

    await waitFor(() => {
      expect(jotaiMocks.setUserName).toHaveBeenLastCalledWith('Bob');
    });

    expect(jotaiMocks.useSetAtom).toHaveBeenCalledWith(themeUserNameAtomMock);
  });
});
