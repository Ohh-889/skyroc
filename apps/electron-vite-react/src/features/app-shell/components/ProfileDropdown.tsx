import { AlertDialog, Avatar, DropdownMenu, Icon } from '@skyroc/web-ui';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

interface ProfileDropdownProps {
  /** 侧边栏是否处于仅显示图标的收起状态。 */
  isSidebarCollapsed: boolean;
}

const ProfileDropdown = (props: ProfileDropdownProps) => {
  const { isSidebarCollapsed } = props;

  const navigate = useNavigate();

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const menuItems = [
    {
      label: (
        <div className="flex min-w-0 items-center gap-2.5 py-1">
          <Avatar
            alt="本地模式"
            classNames={{
              fallback: 'rounded-lg bg-primary text-[11px] font-semibold text-primary-foreground',
              root: 'size-9 rounded-lg'
            }}
            fallback="WS"
            size="sm"
          />
          <div className="min-w-0 font-normal">
            <div className="truncate text-xs font-semibold text-foreground">本地模式</div>
            <div className="mt-1 truncate text-[10px] text-muted-foreground">设备数据已加密</div>
          </div>
        </div>
      ),
      type: 'label' as const
    },
    { type: 'separator' as const },
    {
      label: '工作台',
      leading: <Icon icon="lucide:layout-dashboard" />,
      onSelect: handleOpenWorkspace,
      shortcut: '⌘1',
      type: 'item' as const
    },
    {
      label: '应用设置',
      leading: <Icon icon="lucide:settings-2" />,
      onSelect: handleOpenSettings,
      shortcut: '⌘,',
      type: 'item' as const
    },
    { type: 'separator' as const },
    {
      className:
        'rounded-lg px-2.5 py-2 text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive',
      label: '返回登录',
      leading: <Icon icon="lucide:log-out" />,
      onSelect: handleRequestSignOut,
      type: 'item' as const
    }
  ];

  async function handleOpenWorkspace() {
    await navigate({ to: '/workspace' });
  }

  async function handleOpenSettings() {
    await navigate({ to: '/settings' });
  }

  function handleRequestSignOut() {
    setIsSignOutDialogOpen(true);
  }

  async function handleSignOut() {
    await window.desktopWindow?.setMode('auth');
    await navigate({ to: '/login' });
  }

  return (
    <>
      <DropdownMenu
        className="w-56 rounded-xl border-border bg-popover p-1.5 text-popover-foreground shadow-xl"
        classNames={{
          item: 'rounded-lg px-2.5 py-2 text-xs font-medium focus:bg-accent focus:text-accent-foreground',
          itemIcon: 'size-4 text-muted-foreground',
          label: 'px-2.5 py-1.5',
          separator: '-mx-1.5 my-1.5 bg-border',
          shortcut: 'text-[10px] text-muted-foreground'
        }}
        items={menuItems}
        contentProps={{ align: 'end', side: 'right', sideOffset: 8 }}
        modal={false}
      >
        <button
          aria-label="打开本地模式菜单"
          className={`flex w-full items-center rounded-xl border border-border bg-card/45 text-left transition hover:border-primary/20 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${
            isSidebarCollapsed ? 'justify-center p-1.5' : 'gap-3 p-2.5'
          }`}
          data-testid="profile-dropdown-trigger"
          title={isSidebarCollapsed ? '本地模式' : undefined}
          type="button"
        >
          <Avatar
            alt="本地模式"
            classNames={{
              fallback: 'rounded-lg bg-primary text-[11px] font-semibold text-primary-foreground',
              root: 'size-8 rounded-lg'
            }}
            fallback="WS"
            size="sm"
          />
          <div className={`min-w-0 flex-1 max-lg:hidden ${isSidebarCollapsed ? 'hidden' : ''}`}>
            <div className="truncate text-xs font-semibold text-foreground">本地模式</div>
            <div className="mt-0.5 truncate text-[10px] text-muted-foreground">设备数据已加密</div>
          </div>
          <Icon
            className={`shrink-0 text-muted-foreground max-lg:hidden ${isSidebarCollapsed ? 'hidden' : ''}`}
            height="14"
            icon="lucide:chevrons-up-down"
            width="14"
          />
        </button>
      </DropdownMenu>

      <AlertDialog
        cancelText="取消"
        className="max-w-sm px-6 py-6"
        description="返回登录页后，当前工作区仍会保留在本地。"
        okButtonProps={{ color: 'destructive' }}
        okText="返回登录"
        onOk={handleSignOut}
        onOpenChange={setIsSignOutDialogOpen}
        open={isSignOutDialogOpen}
        title="确认返回登录页？"
        type="destructive"
      />
    </>
  );
};

export default ProfileDropdown;
