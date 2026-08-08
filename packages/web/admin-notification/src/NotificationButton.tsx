// oxlint-disable import/no-unassigned-import
import { ButtonIcon } from '@skyroc/web-ui-antd';
import { Badge, Dropdown } from 'antd';
import { clsx } from 'clsx';
import { memo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import NotificationPanel from './NotificationPanel';
import './notification.css';
import { useNotificationContext } from './useNotificationContext';

export interface NotificationButtonProps {
  /** Extra class name applied to the icon button. */
  className?: string;
  /** Jump handler of the notification center entry. The panel footer is hidden when the host does not pass it. */
  onViewAll?: () => void;
  /** Inline style forwarded to the icon button. */
  style?: CSSProperties;
}

const NotificationButtonBase = (props: NotificationButtonProps) => {
  const { className, onViewAll, style } = props;

  const { t } = useTranslation();
  const { clearAllNotifications, markAllAsRead, markAsRead, notifications, removeNotification, unreadCount } =
    useNotificationContext();
  const [open, setOpen] = useState(false);

  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;
  const hoverAnimation = hasUnread ? 'swing' : 'scale';

  function handleOpenChange(visible: boolean) {
    setOpen(visible);
  }

  function handleNotificationClick(id: string) {
    markAsRead(id);
  }

  function handleDelete(id: string) {
    removeNotification(id);
  }

  function handleMarkAllRead() {
    markAllAsRead();
  }

  function handleClearAll() {
    clearAllNotifications();
    setOpen(false);
  }

  function handleViewAll() {
    setOpen(false);
    onViewAll?.();
  }

  return (
    <Dropdown
      open={open}
      placement="bottomRight"
      popupRender={() => (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onClearAll={handleClearAll}
          onDelete={handleDelete}
          onItemClick={handleNotificationClick}
          onMarkAllRead={handleMarkAllRead}
          onViewAll={onViewAll && handleViewAll}
        />
      )}
      trigger={['click']}
      onOpenChange={handleOpenChange}
    >
      <Badge
        count={displayCount}
        offset={[-4, 4]}
        overflowCount={99}
        size="small"
        styles={{
          indicator: {
            boxShadow: hasUnread ? '0 0 0 1px var(--ant-color-bg-container)' : undefined
          }
        }}
      >
        <ButtonIcon
          className={clsx(hasUnread ? 'admin-notification-button-unread' : '', className)}
          hoverAnimation={hoverAnimation}
          icon="carbon:notification"
          style={style}
          tooltipContent={t('notification.title')}
        />
      </Badge>
    </Dropdown>
  );
};

const NotificationButton = memo(NotificationButtonBase);

export default NotificationButton;
