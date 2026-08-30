import { Button, Command, CommandDialog, Icon, KeyboardKey, ScrollArea } from '@skyroc/web-ui';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import ProfileDropdown from './ProfileDropdown';

interface AppShellProps {
  /** 当前路由渲染的业务页面。 */
  children: ReactNode;
}

interface NavigationItem {
  /** 用于界面显示的图标名称。 */
  icon: string;
  /** 导航项的稳定标识。 */
  id: string;
  /** 导航项文字。 */
  label: string;
  /** 当前模板是否已经提供对应页面。 */
  ready: boolean;
  /** 导航项对应的应用路由。 */
  to?: '/settings';
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { icon: 'lucide:folder-open', id: 'files', label: '文件', ready: false },
  { icon: 'lucide:list-checks', id: 'tasks', label: '任务', ready: false },
  { icon: 'lucide:bell', id: 'notifications', label: '通知', ready: false },
  { icon: 'lucide:settings-2', id: 'settings', label: '设置', ready: true, to: '/settings' }
];

function handleMinimize() {
  window.desktopWindow?.minimize();
}

function handleToggleMaximize() {
  window.desktopWindow?.toggleMaximize();
}

function handleClose() {
  window.desktopWindow?.close();
}

const AppShell = (props: AppShellProps) => {
  const { children } = props;

  const navigate = useNavigate();
  const pathname = useRouterState({ select: state => state.location.pathname });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activityMessage, setActivityMessage] = useState('所有本地更改均已保存');

  const platform = window.desktopWindow?.platform;
  const isMac = platform === 'darwin';
  const commandItems = [
    {
      children: [
        {
          label: '打开设置',
          leading: <Icon icon="lucide:settings-2" />,
          onSelect: () => runNavigationCommand('/settings', '已打开设置')
        },
        {
          label: '浏览最近文件',
          leading: <Icon icon="lucide:file-clock" />,
          onSelect: () => runCommand('最近文件已显示在工作台')
        }
      ],
      label: '页面与文件',
      type: 'group' as const
    },
    {
      children: [
        {
          label: '创建工作区',
          leading: <Icon icon="lucide:folder-plus" />,
          onSelect: () => runCommand('可在工作台使用“创建工作区”')
        },
        {
          label: '打开本地目录',
          leading: <Icon icon="lucide:folder-search" />,
          onSelect: () => runCommand('可在工作台使用“打开目录”')
        },
        {
          label: '导入文件',
          leading: <Icon icon="lucide:file-up" />,
          onSelect: () => runCommand('可在工作台使用“导入文件”')
        },
        {
          label: '检查应用更新',
          leading: <Icon icon="lucide:refresh-cw" />,
          onSelect: () => runCommand('当前版本 2.3.0，发现 2.4.0 可用')
        }
      ],
      label: '常用操作',
      type: 'group' as const
    }
  ];

  function runCommand(message: string) {
    setActivityMessage(message);
    setIsCommandOpen(false);
  }

  async function runNavigationCommand(to: '/settings', message: string) {
    runCommand(message);
    await navigate({ to });
  }

  function handleGlobalKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setIsCommandOpen(current => !current);
    }
  }

  async function handleNavigation(item: NavigationItem) {
    if (item.ready && item.to) {
      setActivityMessage(`${item.label}已打开`);
      await navigate({ to: item.to });
      return;
    }

    setActivityMessage(`${item.label}模块已预留，将在对应路由中接入`);
  }

  function handleSidebarToggle() {
    setIsSidebarCollapsed(current => !current);
  }

  useEffect(() => {
    window.desktopWindow?.setMode('workspace');
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="h-screen min-h-[560px] min-w-[760px] overflow-hidden bg-background text-foreground">
      <header
        className={`app-drag relative z-40 flex h-13 items-center border-b border-border bg-card/95 backdrop-blur-xl ${isMac ? 'pl-21 pr-2.5' : 'pl-3 pr-0'}`}
      >
        <div className="app-no-drag flex min-w-0 items-center">
          <button
            aria-label={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            data-testid="sidebar-toggle"
            onClick={handleSidebarToggle}
            type="button"
          >
            <Icon
              height="17"
              icon="lucide:panel-left"
              width="17"
            />
          </button>
        </div>

        <button
          aria-label="搜索或输入命令"
          className="app-no-drag absolute left-1/2 flex h-8 w-[min(348px,36vw)] -translate-x-1/2 items-center gap-2 rounded-lg border border-border bg-background/60 px-3 text-left text-xs text-muted-foreground shadow-sm transition hover:border-primary/20 hover:bg-accent/60 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
          onClick={() => setIsCommandOpen(true)}
          type="button"
        >
          <Icon
            height="14"
            icon="lucide:search"
            width="14"
          />
          <span className="truncate">搜索或输入命令</span>
          <KeyboardKey
            className="ml-auto border-border bg-muted text-muted-foreground shadow-none"
            size="xs"
            value={['command', 'K']}
          />
        </button>

        <div className="app-no-drag ml-auto flex items-center">
          <ProfileDropdown
            isSidebarCollapsed={false}
            placement="header"
          />
        </div>

        {!isMac ? (
          <div className="app-no-drag ml-2 flex h-full items-stretch">
            <button
              aria-label="最小化窗口"
              className="grid w-11 place-items-center text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              onClick={handleMinimize}
              type="button"
            >
              <Icon
                height="15"
                icon="lucide:minus"
                width="15"
              />
            </button>
            <button
              aria-label="最大化或恢复窗口"
              className="grid w-11 place-items-center text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              onClick={handleToggleMaximize}
              type="button"
            >
              <Icon
                height="13"
                icon="lucide:square"
                width="13"
              />
            </button>
            <button
              aria-label="关闭窗口"
              className="grid w-11 place-items-center text-muted-foreground transition hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleClose}
              type="button"
            >
              <Icon
                height="16"
                icon="lucide:x"
                width="16"
              />
            </button>
          </div>
        ) : null}
      </header>

      <div className="grid h-[calc(100vh-3.25rem)] grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_28px]">
        <aside
          className={`row-span-1 flex flex-col border-r border-sidebar-border bg-sidebar-background px-2.5 py-3 text-sidebar-foreground transition-[width] duration-300 max-lg:w-[72px] ${isSidebarCollapsed ? 'w-[72px]' : 'w-[220px]'}`}
        >
          <nav
            aria-label="主导航"
            className="space-y-1"
          >
            {NAVIGATION_ITEMS.map(item => {
              const isActive = item.to ? pathname.startsWith(item.to) : false;

              return (
                <button
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-medium transition ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-inset ring-sidebar-ring/10'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                  key={item.id}
                  data-testid={`nav-${item.id}`}
                  onClick={() => handleNavigation(item)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  type="button"
                >
                  <Icon
                    className={isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/60'}
                    height="18"
                    icon={item.icon}
                    width="18"
                  />
                  <span className={`truncate max-lg:hidden ${isSidebarCollapsed ? 'hidden' : ''}`}>{item.label}</span>
                  {item.id === 'notifications' ? (
                    <span
                      className={`ml-auto size-1.5 rounded-full bg-warning max-lg:absolute max-lg:right-2.5 max-lg:top-2.5 ${isSidebarCollapsed ? 'absolute right-2.5 top-2.5' : ''}`}
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-2">
            <button
              className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => setIsCommandOpen(true)}
              title="打开命令面板"
              type="button"
            >
              <Icon
                height="18"
                icon="lucide:command"
                width="18"
              />
              <span className={`truncate max-lg:hidden ${isSidebarCollapsed ? 'hidden' : ''}`}>命令面板</span>
            </button>
          </div>
        </aside>

        <ScrollArea
          className="min-h-0 min-w-0 bg-background"
          size="sm"
        >
          <main>{children}</main>
        </ScrollArea>

        <footer className="col-span-2 flex items-center border-t border-border bg-muted px-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success ring-3 ring-success/10" />
            网络正常
          </div>
          <span className="mx-2.5 h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Icon
              height="12"
              icon="lucide:cloud-check"
              width="12"
            />
            已同步
          </div>
          <span className="mx-2.5 h-3 w-px bg-border" />
          <div
            aria-live="polite"
            className="min-w-0 truncate"
          >
            {activityMessage}
          </div>
          <div className="ml-auto flex items-center gap-3 pl-4">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-warning" />1 个后台任务
            </span>
            <Button
              className="h-5 rounded-md border-border bg-background/60 px-2 text-[10px] text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => setActivityMessage('更新 2.4.0 已准备好下载')}
              size="xs"
              type="button"
              variant="outline"
            >
              v2.4.0 可用
            </Button>
          </div>
        </footer>
      </div>

      <CommandDialog
        className="max-w-[640px] overflow-hidden rounded-2xl border-border bg-popover p-0 shadow-2xl"
        classNames={{
          close: 'right-3 top-3 text-muted-foreground',
          description: 'sr-only',
          header: 'sr-only',
          overlay: 'bg-foreground/45 backdrop-blur-sm',
          title: 'sr-only'
        }}
        description="搜索应用页面、最近文件和常用操作"
        onOpenChange={setIsCommandOpen}
        open={isCommandOpen}
        title="全局命令面板"
      >
        <Command
          className="bg-transparent text-popover-foreground"
          classNames={{
            empty: 'py-10 text-sm text-muted-foreground',
            groupLabel: 'px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground',
            input: 'h-12 text-sm placeholder:text-muted-foreground',
            inputIcon: 'text-muted-foreground',
            inputWrapper: 'border-border px-4 py-1',
            item: 'mx-2 rounded-xl px-3 py-2.5 text-[13px] data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
            list: 'max-h-[360px] py-2',
            shortcut: 'text-muted-foreground'
          }}
          empty="没有找到匹配的页面、文件或操作"
          inputProps={{ placeholder: '输入命令或搜索内容…' }}
          items={commandItems}
        />
      </CommandDialog>
    </div>
  );
};

export default AppShell;
