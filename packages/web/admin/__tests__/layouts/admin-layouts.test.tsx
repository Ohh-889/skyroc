// @vitest-environment jsdom
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  GLOBAL_HEADER_MENU_ID,
  GLOBAL_HEADER_MENU_SELECTOR,
  GLOBAL_SIDER_MENU_ID,
  GLOBAL_SIDER_MENU_SELECTOR
} from '@shell/layouts/constant';

const routerMocks = vi.hoisted(() => {
  const homeMatch = {
    fullPath: '/home',
    params: {},
    pathname: '/home',
    routeId: '/(admin)/home',
    search: {},
    staticData: {
      title: 'Home'
    }
  };
  const state = {
    location: {
      hash: '',
      href: '/home',
      pathname: '/home',
      search: {},
      searchStr: '',
      state: {}
    }
  };

  return {
    homeMatch,
    matches: [homeMatch] as any[],
    router: {
      __store: {
        get: () => state,
        state,
        subscribe: () => ({ unsubscribe() {} })
      },
      latestLocation: state.location,
      state
    }
  };
});

vi.mock('@tanstack/react-router', () => ({
  createLink: <T,>(Component: T) => Component,
  Link: (props: { children?: ReactNode; className?: string; style?: CSSProperties; to?: string }) => {
    const { children, className, style, to = '' } = props;

    return (
      <a className={className} href={to} style={style}>
        {children}
      </a>
    );
  },
  Outlet: () => null,
  RouterContextProvider: (props: { children?: ReactNode }) => {
    const { children } = props;

    return children;
  },
  useChildMatches: () => [],
  useMatches: (opts?: { select?: (matches: any[]) => unknown }) => {
    const matches = routerMocks.matches;

    return opts?.select ? opts.select(matches) : matches;
  },
  useNavigate: () => vi.fn(),
  useRouter: () => routerMocks.router
}));

interface MockStorage {
  data: Partial<StorageType.Local>;
  get: <K extends keyof StorageType.Local>(key: K) => StorageType.Local[K] | null;
  remove: (key: keyof StorageType.Local) => void;
  set: <K extends keyof StorageType.Local>(key: K, value: StorageType.Local[K]) => void;
}

function createStorage(): MockStorage {
  const data: Partial<StorageType.Local> = {};

  return {
    data,
    get: key => data[key] ?? null,
    remove: key => {
      delete data[key];
    },
    set: (key, value) => {
      data[key] = value;
    }
  };
}

function createBaseOptions() {
  return {
    defaultHome: '/home' as Router.RoutePath,
    defaultIcon: 'mdi:menu',
    menuCategories: {
      admin: {
        key: 'admin',
        layout: '/(admin)' as Router.RouteId
      }
    },
    routeMode: 'static' as const,
    routeTree: {
      children: []
    } as any,
    storage: createStorage()
  };
}

function renderCustomLogo(style: CSSProperties) {
  return (
    <div>
      <span>custom logo height {String(style.height)}</span>
    </div>
  );
}

const CustomExtra = () => <span>custom extra</span>;

const adminStateMocks = vi.hoisted(() => ({
  isMobile: false
}));

vi.mock('@shell/layouts/materials', () => ({
  AdminLayout: (props: { children?: ReactNode; Footer?: ReactNode; Header?: ReactNode; Sider?: ReactNode }) => {
    const { children, Footer, Header, Sider } = props;

    return (
      <div>
        <header>{Header}</header>
        <aside>{Sider}</aside>
        <main>{children}</main>
        <footer>{Footer}</footer>
      </div>
    );
  },
  LAYOUT_SCROLL_EL_ID: 'layout-scroll'
}));

vi.mock('@shell/theme', () => ({
  useSettingsTheme: () => ({
    fixedHeaderAndTab: false,
    footer: { fixed: false, height: 48, right: false, visible: true },
    header: { height: 56 },
    layout: { mode: 'vertical', scrollMode: 'wrapper' },
    sider: { collapsedWidth: 64, width: 240 },
    tab: { height: 40, visible: true }
  })
}));

vi.mock('@shell/layouts/state/use-admin-state', () => ({
  useAdminState: () => ({
    contentXScrollable: false,
    fullContent: false,
    isMobile: adminStateMocks.isMobile,
    mixSiderFixed: false,
    siderCollapse: false,
    toggleSiderCollapse: vi.fn()
  })
}));

vi.mock('@shell/layouts/state/menus/use-admin-menus', () => ({
  useAdminMenus: () => ({
    childLevelMenus: [],
    isActiveFirstLevelMenuHasChildren: false,
    secondLevelMenus: []
  })
}));

vi.mock('@shell/layouts/modules/admin-header/AdminHeader', async () => {
  const actual = await vi.importActual<typeof import('@shell/layouts/context')>('@shell/layouts/context');

  return {
    default: () => {
      const { headerLeftActions, headerMiddleActions, headerRightActions, logo, logoTitle } =
        actual.useAdminLayoutContext();

      return (
        <div>
          {logo}
          {logoTitle}
          {headerLeftActions}
          {headerMiddleActions}
          {headerRightActions}
        </div>
      );
    }
  };
});

vi.mock('@shell/layouts/modules/admin-menu/AdminMenu', () => ({
  default: () => null
}));

vi.mock('@shell/layouts/modules/admin-tab/AdminTab', () => ({
  default: () => null
}));

describe('admin layouts setup', () => {
  it('throws before setup is called', async () => {
    vi.resetModules();

    const { getAdminLayoutsOptions } = await import('@shell/layouts/setup');

    expect(() => getAdminLayoutsOptions()).toThrow(/setupAdminLayouts/);
  });
});

describe('route state', () => {
  it('reads the active route from the full match list when called inside a leaf page', async () => {
    vi.resetModules();

    routerMocks.matches = [
      {
        fullPath: '/',
        params: {},
        pathname: '/',
        routeId: '__root__',
        search: {},
        staticData: {
          title: 'Root'
        }
      },
      {
        fullPath: '/function/tab',
        params: {},
        pathname: '/function/tab',
        routeId: '/(admin)/function/tab',
        search: {
          a: '1'
        },
        staticData: {
          title: 'function_tab'
        }
      }
    ];

    const { useRoute } = await import('@shell/layouts/features/use-route');
    const { result } = renderHook(() => useRoute());

    expect(result.current).toMatchObject({
      fullPath: '/function/tab?a=1',
      originPath: '/function/tab',
      pathname: '/function/tab',
      routeId: '/(admin)/function/tab',
      search: {
        a: '1'
      },
      searchStr: '?a=1'
    });

    routerMocks.matches = [routerMocks.homeMatch];
  });
});

describe('menu generation', () => {
  it('generates static menus from injected routeTree', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { menuGenerator } = await import('@shell/layouts/features/menus/menu-generator');

    setupAdminLayouts({
      ...createBaseOptions(),
      routeTree: {
        children: [
          {
            id: '/(admin)',
            children: [
              {
                fullPath: '/home',
                id: '/(admin)/home',
                options: {
                  staticData: {
                    menu: {
                      badge: {
                        type: 'normal',
                        value: 25,
                        variant: 'primary'
                      },
                      icon: 'mdi:home',
                      order: 1
                    },
                    href: 'https://example.com/home',
                    title: 'Home',
                    url: 'https://example.com/embed-home'
                  }
                }
              }
            ]
          }
        ]
      } as any
    });

    const result = menuGenerator.generate({
      userInfo: {
        buttons: [],
        nickname: 'Admin',
        roles: [],
        userId: '1',
        userName: 'Admin'
      }
    });

    expect(result.home).toBe('/home');
    expect(result.allMenus.get('admin')?.[0]).toMatchObject({
      badge: {
        type: 'normal',
        value: 25,
        variant: 'primary'
      },
      icon: 'mdi:home',
      href: 'https://example.com/home',
      key: '/home',
      title: 'Home',
      url: 'https://example.com/embed-home'
    });
    expect(result.quickReferenceMenus.get('admin')?.get('/home')).toMatchObject({
      href: 'https://example.com/home',
      title: 'Home',
      url: 'https://example.com/embed-home'
    });
  });

  it('generates dynamic menus with badge metadata', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { menuGenerator } = await import('@shell/layouts/features/menus/menu-generator');

    setupAdminLayouts({
      ...createBaseOptions(),
      routeMode: 'dynamic'
    });

    const result = menuGenerator.generate({
      backendRoutes: [
        {
          id: 'dynamic-home',
          href: 'https://example.com/dynamic',
          menu: {
            badge: {
              type: 'dot',
              variant: 'success'
            },
            icon: 'mdi:home'
          },
          path: '/dynamic',
          title: 'Dynamic',
          url: 'https://example.com/embed-dynamic'
        } as Api.Route.BackendRoute
      ]
    });

    expect(result.allMenus.get('admin')?.[0]).toMatchObject({
      badge: {
        type: 'dot',
        variant: 'success'
      },
      href: 'https://example.com/dynamic',
      key: '/dynamic',
      title: 'Dynamic',
      url: 'https://example.com/embed-dynamic'
    });
  });

  it('normalizes backend route payloads with the consuming route tree', async () => {
    vi.resetModules();

    const { createAdminDynamicRouteLoader } = await import('@shell/layouts/features/menus/dynamic-routes');
    const backendRouteResponse: Api.Route.BackendRouteResponse = {
      home: '/dashboard',
      routes: [
        {
          children: [
            {
              handle: {
                activeMenu: '/dashboard',
                fixedIndexInTab: 2,
                i18nKey: 'route.manage_user',
                multiTab: true,
                query: [
                  {
                    key: 'mode',
                    value: 'detail'
                  }
                ],
                roles: ['R_ADMIN']
              },
              id: 11,
              parentId: 10,
              path: '/users/:id'
            },
            {
              id: 'missing-child',
              path: '/missing-child'
            }
          ],
          handle: {
            badge: {
              type: 'dot',
              variant: 'success'
            },
            extra: 'CustomExtra',
            hideInMenu: false,
            icon: 'mdi:view-dashboard',
            keepAlive: true,
            order: 1,
            title: 'Dashboard',
            url: 'https://example.com/dashboard'
          },
          id: 10,
          layout: 'admin',
          path: '/dashboard'
        },
        {
          id: 'missing',
          path: '/missing'
        }
      ]
    };
    const loadBackendRoutes = vi.fn(async () => backendRouteResponse);

    const loadDynamicRoutes = createAdminDynamicRouteLoader({
      loadBackendRoutes,
      routeTree: {
        children: [
          {
            fullPath: '/dashboard',
            children: [
              {
                fullPath: '/users/$id'
              }
            ]
          }
        ]
      } as any
    });

    const result = await loadDynamicRoutes();

    expect(result.home).toBe('/dashboard');
    expect(result.routes).toHaveLength(1);
    expect(result.routes[0]).toMatchObject({
      id: '10',
      keepAlive: true,
      layout: 'admin',
      menu: {
        badge: {
          type: 'dot',
          variant: 'success'
        },
        extra: 'CustomExtra',
        icon: 'mdi:view-dashboard',
        order: 1
      },
      path: '/dashboard',
      title: 'Dashboard',
      url: 'https://example.com/dashboard'
    });
    expect(result.routes[0]?.children).toHaveLength(1);
    expect(result.routes[0]?.children?.[0]).toMatchObject({
      id: '11',
      i18nKey: 'route.manage_user',
      menu: {
        activeMenu: '/dashboard'
      },
      parentId: '10',
      path: '/users/$id',
      permissions: ['R_ADMIN'],
      query: [
        {
          key: 'mode',
          value: 'detail'
        }
      ],
      tab: {
        fixedIndex: 2,
        multi: true
      }
    });
    expect(loadBackendRoutes).toHaveBeenCalledOnce();
  });

  it('generates menuNodeCallback menus with badge metadata', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { menuGenerator } = await import('@shell/layouts/features/menus/menu-generator');

    setupAdminLayouts({
      ...createBaseOptions(),
      menuNodeCallback: routeId => {
        if (routeId !== '/(admin)') return [];

        return [
          {
            id: 'extra-menu',
            menu: {
              badge: {
                type: 'normal',
                value: 'new',
                variant: 'info'
              },
              icon: 'mdi:star',
              order: 1
            },
            path: '/extra' as Router.RoutePath,
            title: 'Extra'
          }
        ];
      },
      routeTree: {
        children: [
          {
            children: [],
            id: '/(admin)'
          }
        ]
      } as any
    });

    const result = menuGenerator.generate();

    expect(result.allMenus.get('admin')?.[0]).toMatchObject({
      badge: {
        type: 'normal',
        value: 'new',
        variant: 'info'
      },
      key: '/extra',
      title: 'Extra'
    });
  });
});

describe('route authorization index', () => {
  it('does not require quick reference route membership in static mode', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { hasAuthorizedRoutePath } = await import('@shell/layouts/features/menus/use-menus');

    setupAdminLayouts(createBaseOptions());

    expect(hasAuthorizedRoutePath('/missing' as Router.RoutePath)).toBe(true);
  });

  it('checks dynamic route membership and backend route permissions', async () => {
    vi.resetModules();

    // 与 resetModules 后的模块实例保持同一个 globalStore，因此 Provider 也要在这批 import 里取
    const { JotaiProvider } = await import('@skyroc/core-state');
    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { hasAuthorizedRoutePath, useMenus } = await import('@shell/layouts/features/menus/use-menus');

    const userInfo: Api.Auth.UserInfo = {
      buttons: [],
      nickname: 'User',
      roles: ['R_USER'],
      userId: '1',
      userName: 'User'
    };

    setupAdminLayouts({
      ...createBaseOptions(),
      permissionSuperRole: 'R_SUPER',
      routeMode: 'dynamic',
      loadDynamicRoutes: async () => ({
        home: '/dynamic' as Router.RoutePath,
        routes: [
          {
            id: 'dynamic-home',
            path: '/dynamic' as Router.RoutePath,
            title: 'Dynamic'
          },
          {
            id: 'admin-only',
            path: '/admin-only' as Router.RoutePath,
            permissions: ['R_ADMIN'],
            title: 'Admin Only'
          }
        ]
      })
    });

    const { result } = renderHook(() => useMenus(), { wrapper: JotaiProvider });

    await act(async () => {
      await result.current.initMenus(userInfo);
    });

    expect(result.current.menus.get('admin')?.map(menu => menu.key)).toEqual(['/dynamic']);
    expect(hasAuthorizedRoutePath('/dynamic' as Router.RoutePath, userInfo)).toBe(true);
    expect(hasAuthorizedRoutePath('/missing' as Router.RoutePath, userInfo)).toBe(false);
    expect(hasAuthorizedRoutePath('/admin-only' as Router.RoutePath, userInfo)).toBe(false);

    const superUserInfo = {
      ...userInfo,
      roles: ['R_SUPER']
    };

    await act(async () => {
      await result.current.initMenus(superUserInfo);
    });

    expect(result.current.menus.get('admin')?.map(menu => menu.key)).toEqual(['/dynamic', '/admin-only']);
    expect(hasAuthorizedRoutePath('/admin-only' as Router.RoutePath, superUserInfo)).toBe(true);
  });
});

describe('menu rendering', () => {
  it('strips runtime metadata before passing items to Ant Design Menu', async () => {
    vi.resetModules();

    const { renderAntdMenuItems } = await import('@shell/layouts/features/menus/menu-renderer');

    const items = renderAntdMenuItems([
      {
        children: [
          {
            i18nKey: 'route.manage_user' as I18n.I18nKey,
            key: '/manage/user',
            label: <span>User</span>,
            title: 'User'
          }
        ],
        i18nKey: 'route.manage' as I18n.I18nKey,
        key: '/manage',
        label: <span>Manage</span>,
        title: 'Manage'
      }
    ]);

    const [item] = items as unknown as Array<Record<string, unknown> & { children?: Array<Record<string, unknown>> }>;

    expect(item).not.toHaveProperty('i18nKey');
    expect(item.children?.[0]).not.toHaveProperty('i18nKey');
    expect(item.children?.[0]).toMatchObject({
      key: '/manage/user',
      title: 'User'
    });
  });

  it('moves submenu extras into the label rendered by Ant Design Menu', async () => {
    vi.resetModules();

    const { Menu: AMenu } = await import('antd');
    const { renderAntdMenuItems } = await import('@shell/layouts/features/menus/menu-renderer');

    const items = renderAntdMenuItems([
      {
        children: [
          {
            key: '/plugin/icon',
            label: <span>Icon</span>,
            title: 'Icon'
          }
        ],
        extra: <span>submenu extra</span>,
        key: '/plugin',
        label: <span>Plugin</span>,
        title: 'Plugin'
      }
    ]);

    const [item] = items as unknown as Array<Record<string, unknown> & { label: ReactNode }>;

    expect(item).not.toHaveProperty('extra');

    await act(async () => {
      render(<AMenu items={items} mode="inline" />);
    });

    expect(screen.getByText('Plugin')).toBeInTheDocument();
    expect(screen.getByText('submenu extra')).toBeInTheDocument();
    expect(screen.getByText('submenu extra').closest('[data-menu-submenu-label]')).toHaveClass('pr-28px');
  });

  it('uses compact label layout for horizontal submenu extras', async () => {
    vi.resetModules();

    const { renderAntdMenuItems } = await import('@shell/layouts/features/menus/menu-renderer');

    const items = renderAntdMenuItems(
      [
        {
          children: [
            {
              extra: <span>child extra</span>,
              key: '/plugin/icon',
              label: <span>Icon</span>,
              title: 'Icon'
            }
          ],
          extra: <span>NEW</span>,
          key: '/plugin',
          label: <span>Plugin</span>,
          title: 'Plugin'
        }
      ],
      { mode: 'horizontal' }
    );

    const [item] = items as unknown as Array<
      Record<string, unknown> & { children?: Array<Record<string, unknown>>; label: ReactElement }
    >;
    const labelProps = item.label.props as Record<string, unknown>;

    expect(item).not.toHaveProperty('extra');
    expect(item.children?.[0]).toHaveProperty('extra');
    expect(labelProps['data-menu-horizontal-label']).toBe('with-extra');
    expect(labelProps.className).toContain('inline-flex');
    expect(labelProps.className).not.toContain('pr-28px');
  });

  it('moves horizontal item extras into the label instead of Ant Design extra', async () => {
    vi.resetModules();

    const { renderAntdMenuItems } = await import('@shell/layouts/features/menus/menu-renderer');

    const items = renderAntdMenuItems(
      [
        {
          extra: <span>NEW</span>,
          key: '/plugin',
          label: <span>Plugin</span>,
          title: 'Plugin'
        }
      ],
      { mode: 'horizontal' }
    );

    const [item] = items as unknown as Array<Record<string, unknown> & { label: ReactElement }>;
    const labelProps = item.label.props as Record<string, unknown>;

    expect(item).not.toHaveProperty('extra');
    expect(labelProps['data-menu-horizontal-label']).toBe('with-extra');
    expect(labelProps.className).toContain('inline-flex');
    expect(labelProps.className).not.toContain('pr-28px');
  });

  it('renders static badges with custom extras', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { renderCommonMenus } = await import('@shell/layouts/features/menus/menu-renderer');

    setupAdminLayouts({
      ...createBaseOptions(),
      extras: {
        CustomExtra
      }
    });

    const [menu] = renderCommonMenus([
      {
        badge: {
          type: 'normal',
          value: 'new',
          variant: 'primary'
        },
        extra: 'CustomExtra',
        icon: 'mdi:home',
        key: '/home',
        title: 'Home'
      }
    ]);

    render(<span>{menu.extra}</span>);

    const badgeRoot = screen.getByText('new').closest('[data-menu-badge="normal"]');

    expect(badgeRoot).toHaveClass('ant-badge');
    expect(screen.getByText('custom extra')).toBeInTheDocument();
  });

  it('updates rendered badge value from valueKey', async () => {
    vi.resetModules();

    // 与 resetModules 后的模块实例保持同一个 globalStore，因此 Provider 也要在这批 import 里取
    const { JotaiProvider } = await import('@skyroc/core-state');
    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { renderCommonMenus } = await import('@shell/layouts/features/menus/menu-renderer');
    const { useAdminMenuBadges } = await import('@shell/layouts/state/menus/use-admin-menu-badges');

    setupAdminLayouts(createBaseOptions());

    const BadgeUpdater = () => {
      const { setMenuBadgeValue } = useAdminMenuBadges();

      function handleUpdate() {
        setMenuBadgeValue('todo-count', 7);
      }

      return (
        <button type="button" onClick={handleUpdate}>
          update badge
        </button>
      );
    };

    const [menu] = renderCommonMenus([
      {
        badge: {
          type: 'normal',
          value: 1,
          valueKey: 'todo-count',
          variant: 'warning'
        },
        icon: 'mdi:home',
        key: '/home',
        title: 'Home'
      }
    ]);

    render(
      <>
        {menu.extra}
        <BadgeUpdater />
      </>,
      { wrapper: JotaiProvider }
    );

    expect(screen.getByText('1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('update badge'));

    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('respects showZero when rendering badge values', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { renderCommonMenus } = await import('@shell/layouts/features/menus/menu-renderer');

    setupAdminLayouts(createBaseOptions());

    const menus = renderCommonMenus([
      {
        badge: {
          type: 'normal',
          value: 0
        },
        icon: 'mdi:home',
        key: '/hidden-zero',
        title: 'Hidden Zero'
      },
      {
        badge: {
          showZero: true,
          type: 'normal',
          value: 0
        },
        icon: 'mdi:home',
        key: '/visible-zero',
        title: 'Visible Zero'
      }
    ]);

    render(
      <span>
        {menus.map(menu => (
          <span key={menu.key}>{menu.extra}</span>
        ))}
      </span>
    );

    expect(screen.queryAllByText('0')).toHaveLength(1);
  });
});

describe('tab helpers', () => {
  it('builds tab ids with multi-tab routes', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { getTabByMenuInfo } = await import('@shell/layouts/state/tabs/shared');

    setupAdminLayouts(createBaseOptions());

    const tab = getTabByMenuInfo(
      {
        id: '/(admin)/detail',
        key: '/detail',
        menu: { icon: 'mdi:file' },
        path: '/detail',
        tab: { multi: true },
        title: 'Detail'
      } as Menu.QuickReferenceMenu,
      '/detail',
      '/detail?id=1'
    );

    expect(tab).toMatchObject({
      fullPath: '/detail?id=1',
      icon: 'mdi:file',
      id: '/detail?id=1',
      label: 'Detail'
    });
  });
});

describe('layout menu target constants', () => {
  it('keeps DOM ids separate from Portal selectors', () => {
    expect(GLOBAL_HEADER_MENU_ID).toBe('__GLOBAL_HEADER_MENU__');
    expect(GLOBAL_HEADER_MENU_SELECTOR).toBe('#__GLOBAL_HEADER_MENU__');
    expect(GLOBAL_SIDER_MENU_ID).toBe('__GLOBAL_SIDER_MENU__');
    expect(GLOBAL_SIDER_MENU_SELECTOR).toBe('#__GLOBAL_SIDER_MENU__');
  });
});

describe('AdminLayout', () => {
  it('remounts menu portal content after switching from mobile back to desktop', async () => {
    adminStateMocks.isMobile = false;

    const { default: MenuPortal } = await import('@shell/layouts/modules/admin-menu/components/MenuPortal');

    const firstTarget = document.createElement('div');
    firstTarget.id = GLOBAL_SIDER_MENU_ID;
    document.body.appendChild(firstTarget);

    const { rerender } = render(
      <MenuPortal container={GLOBAL_SIDER_MENU_SELECTOR}>
        <span>menu content</span>
      </MenuPortal>
    );

    await waitFor(() => {
      expect(firstTarget).toHaveTextContent('menu content');
    });

    firstTarget.remove();

    adminStateMocks.isMobile = true;

    rerender(
      <MenuPortal container={GLOBAL_SIDER_MENU_SELECTOR}>
        <span>menu content</span>
      </MenuPortal>
    );

    const nextTarget = document.createElement('div');
    nextTarget.id = GLOBAL_SIDER_MENU_ID;
    document.body.appendChild(nextTarget);

    adminStateMocks.isMobile = false;

    rerender(
      <MenuPortal container={GLOBAL_SIDER_MENU_SELECTOR}>
        <span>menu content</span>
      </MenuPortal>
    );

    await waitFor(() => {
      expect(nextTarget).toHaveTextContent('menu content');
    });
  });

  it('renders app-provided slots', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { default: AdminLayout } = await import('@shell/layouts/AdminLayout');

    setupAdminLayouts(createBaseOptions());

    render(
      <AdminLayout
        content={<div>content slot</div>}
        footer={<div>footer slot</div>}
        headerLeftActions={<button type="button">left slot</button>}
        headerMiddleActions={<button type="button">middle slot</button>}
        headerRightActions={<button type="button">right slot</button>}
        logo={<div>logo mark slot</div>}
        logoTitle={<div>logo title slot</div>}
      />
    );

    expect(screen.getAllByText('logo mark slot').length).toBeGreaterThan(0);
    expect(screen.getAllByText('logo title slot').length).toBeGreaterThan(0);
    expect(screen.getByText('left slot')).toBeInTheDocument();
    expect(screen.getByText('middle slot')).toBeInTheDocument();
    expect(screen.getByText('right slot')).toBeInTheDocument();
    expect(screen.getByText('content slot')).toBeInTheDocument();
    expect(screen.getByText('footer slot')).toBeInTheDocument();
    expect(document.getElementById(GLOBAL_SIDER_MENU_ID)).toBeInTheDocument();
    expect(document.querySelector(GLOBAL_SIDER_MENU_SELECTOR)).toBe(document.getElementById(GLOBAL_SIDER_MENU_ID));
  });

  it('allows replacing the default logo with a render function', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { default: AdminLayout } = await import('@shell/layouts/AdminLayout');

    setupAdminLayouts(createBaseOptions());

    render(<AdminLayout logoComponent={renderCustomLogo} />);

    expect(screen.getAllByText('custom logo height 56px').length).toBeGreaterThan(0);
  });

  it('allows replacing the default logo with a React node', async () => {
    vi.resetModules();

    const { setupAdminLayouts } = await import('@shell/layouts/setup');
    const { default: AdminLayout } = await import('@shell/layouts/AdminLayout');

    setupAdminLayouts(createBaseOptions());

    render(<AdminLayout logoComponent={<span>custom logo node</span>} />);

    expect(screen.getAllByText('custom logo node').length).toBeGreaterThan(0);
  });
});
