import { Button, Command, CommandDialog, Icon, KeyboardKey } from '@skyroc/web-ui';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

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
  to?: '/settings' | '/workspace';
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { icon: 'lucide:layout-dashboard', id: 'workspace', label: '工作台', ready: true, to: '/workspace' },
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
          label: '前往工作台',
          leading: <Icon icon="lucide:layout-dashboard" />,
          onSelect: () => runNavigationCommand('/workspace', '已打开工作台'),
          shortcut: ['command', '1']
        },
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

  async function runNavigationCommand(to: '/settings' | '/workspace', message: string) {
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
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="h-screen min-h-[560px] min-w-[760px] overflow-hidden bg-[#e9e8e2] text-[#20231e]">
      <header
        className={`app-drag relative z-40 flex h-13 items-center border-b border-black/[0.08] bg-[#f5f3ec]/95 pr-0 backdrop-blur-xl ${isMac ? 'pl-21' : 'pl-3'}`}
      >
        <div className="app-no-drag flex min-w-0 items-center gap-2.5">
          <button
            aria-label={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
            className="grid size-8 place-items-center rounded-lg text-[#6a6d64] transition hover:bg-black/[0.055] hover:text-[#20231e]"
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
          <div className="grid size-7 place-items-center rounded-[9px] bg-[#242821] text-[10px] font-black text-[#d9f99d] shadow-[0_5px_14px_rgba(36,40,33,0.18)]">
            S
          </div>
          <strong className="text-[12px] tracking-[0.15em] text-[#30342d]">SKYROC</strong>
          <span className="mx-1 h-4 w-px bg-black/10" />
          <button
            className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1 text-xs text-[#555a50] transition hover:bg-black/[0.045]"
            onClick={() => setIsCommandOpen(true)}
            type="button"
          >
            <span className="max-w-48 truncate">Desktop Kit</span>
            <Icon
              className="text-[#989b92]"
              height="13"
              icon="lucide:chevrons-up-down"
              width="13"
            />
          </button>
        </div>

        <button
          className="app-no-drag absolute left-1/2 flex h-8 w-[min(360px,34vw)] -translate-x-1/2 items-center gap-2 rounded-lg border border-black/[0.08] bg-white/55 px-3 text-left text-xs text-[#858980] shadow-[0_1px_0_rgba(255,255,255,0.75)] transition hover:border-black/[0.13] hover:bg-white/80"
          onClick={() => setIsCommandOpen(true)}
          type="button"
        >
          <Icon
            height="14"
            icon="lucide:search"
            width="14"
          />
          <span className="truncate">搜索页面、文件和操作</span>
          <KeyboardKey
            className="ml-auto border-black/10 bg-black/[0.035] text-[#73776e] shadow-none"
            size="xs"
            value={['command', 'K']}
          />
        </button>

        {!isMac ? (
          <div className="app-no-drag ml-auto flex h-full items-stretch">
            <button
              aria-label="最小化窗口"
              className="grid w-11 place-items-center text-[#72766d] transition hover:bg-black/[0.06]"
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
              className="grid w-11 place-items-center text-[#72766d] transition hover:bg-black/[0.06]"
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
              className="grid w-11 place-items-center text-[#72766d] transition hover:bg-[#d95044] hover:text-white"
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
          className={`row-span-1 flex flex-col border-r border-black/[0.08] bg-[#efeee8] px-2.5 py-3 transition-[width] duration-300 max-lg:w-[72px] ${isSidebarCollapsed ? 'w-[72px]' : 'w-[220px]'}`}
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
                      ? 'bg-[#dce9c6] text-[#29311f] shadow-[inset_0_0_0_1px_rgba(83,108,48,0.08)]'
                      : 'text-[#6f736a] hover:bg-black/[0.045] hover:text-[#292d27]'
                  }`}
                  key={item.id}
                  data-testid={`nav-${item.id}`}
                  onClick={() => handleNavigation(item)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  type="button"
                >
                  <Icon
                    className={isActive ? 'text-[#5f783f]' : 'text-[#858980]'}
                    height="18"
                    icon={item.icon}
                    width="18"
                  />
                  <span className={`truncate max-lg:hidden ${isSidebarCollapsed ? 'hidden' : ''}`}>{item.label}</span>
                  {item.id === 'notifications' ? (
                    <span
                      className={`ml-auto size-1.5 rounded-full bg-[#d97745] max-lg:absolute max-lg:right-2.5 max-lg:top-2.5 ${isSidebarCollapsed ? 'absolute right-2.5 top-2.5' : ''}`}
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-2">
            <button
              className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] text-[#6f736a] transition hover:bg-black/[0.045] hover:text-[#292d27]"
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
            <div className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white/45 p-2.5">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#272b25] text-[11px] font-semibold text-[#e8f6d4]">
                WS
              </div>
              <div className={`min-w-0 max-lg:hidden ${isSidebarCollapsed ? 'hidden' : ''}`}>
                <div className="truncate text-xs font-semibold text-[#343831]">本地模式</div>
                <div className="mt-0.5 truncate text-[10px] text-[#8c9087]">设备数据已加密</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 overflow-y-auto bg-[#f8f7f2]">{children}</main>

        <footer className="col-span-2 flex items-center border-t border-black/[0.08] bg-[#edebe5] px-3 text-[10px] text-[#74786f]">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#6c9a42] shadow-[0_0_0_3px_rgba(108,154,66,0.12)]" />
            网络正常
          </div>
          <span className="mx-2.5 h-3 w-px bg-black/10" />
          <div className="flex items-center gap-1.5">
            <Icon
              height="12"
              icon="lucide:cloud-check"
              width="12"
            />
            已同步
          </div>
          <span className="mx-2.5 h-3 w-px bg-black/10" />
          <div
            aria-live="polite"
            className="min-w-0 truncate"
          >
            {activityMessage}
          </div>
          <div className="ml-auto flex items-center gap-3 pl-4">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-[#d68a45]" />1 个后台任务
            </span>
            <Button
              className="h-5 rounded-md border-[#cfcfc7] bg-white/45 px-2 text-[10px] text-[#666a61] shadow-none hover:bg-white"
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
        className="max-w-[640px] overflow-hidden rounded-2xl border-black/10 bg-[#f8f7f2] p-0 shadow-[0_30px_90px_rgba(28,31,26,0.28)]"
        classNames={{
          close: 'right-3 top-3 text-[#767a71]',
          description: 'sr-only',
          header: 'sr-only',
          overlay: 'bg-[#1b1f19]/45 backdrop-blur-sm',
          title: 'sr-only'
        }}
        description="搜索应用页面、最近文件和常用操作"
        onOpenChange={setIsCommandOpen}
        open={isCommandOpen}
        title="全局命令面板"
      >
        <Command
          className="bg-transparent text-[#30342d]"
          classNames={{
            empty: 'py-10 text-sm text-[#8a8e85]',
            groupLabel: 'px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#969a91]',
            input: 'h-12 text-sm placeholder:text-[#999d94]',
            inputIcon: 'text-[#777b72]',
            inputWrapper: 'border-black/[0.08] px-4 py-1',
            item: 'mx-2 rounded-xl px-3 py-2.5 text-[13px] data-[selected=true]:bg-[#dfe9ce] data-[selected=true]:text-[#27321f]',
            list: 'max-h-[360px] py-2',
            shortcut: 'text-[#989c93]'
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
