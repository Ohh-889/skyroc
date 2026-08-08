import { ButtonIcon } from '@skyroc/web-ui-antd';
import { DarkModeContainer } from '@skyroc/web-ui-compose';
import { Badge, Button, Empty, List, Tag } from 'antd';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { memo } from 'react';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { NotificationItem, NotificationType } from './types';

dayjs.extend(relativeTime);

export interface NotificationPanelProps {
  /** Notifications rendered in the panel list. */
  notifications: NotificationItem[];
  /** Clear-all command handler. */
  onClearAll: () => void;
  /** Delete command handler for a single notification. */
  onDelete: (id: string) => void;
  /** Click handler for a single notification. */
  onItemClick: (id: string) => void;
  /** Mark-all-read command handler. */
  onMarkAllRead: () => void;
  /** Current unread notification count. */
  unreadCount: number;
}

interface NotificationTypeConfig {
  /** Static UnoCSS text color class for the category icon. */
  colorClassName: string;
  /** Iconify icon name for the category. */
  icon: string;
}

interface NotificationItemProps {
  /** Notification data rendered by the row. */
  item: NotificationItem;
  /** Click handler for the row. */
  onClick: (id: string) => void;
  /** Delete handler for the row. */
  onDelete: (id: string) => void;
}

const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  error: {
    colorClassName: 'text-red',
    icon: 'carbon:close-filled'
  },
  info: {
    colorClassName: 'text-blue',
    icon: 'carbon:information-filled'
  },
  message: {
    colorClassName: 'text-purple',
    icon: 'carbon:chat'
  },
  success: {
    colorClassName: 'text-green',
    icon: 'carbon:checkmark-filled'
  },
  warning: {
    colorClassName: 'text-orange',
    icon: 'carbon:warning-filled'
  }
};

function getPriorityColor(priority: NotificationItem['priority']) {
  if (priority === 'urgent') {
    return 'red';
  }

  if (priority === 'high') {
    return 'orange';
  }

  return 'default';
}

const NotificationItemComponentBase = (props: NotificationItemProps) => {
  const { item, onClick, onDelete } = props;

  const config = NOTIFICATION_TYPE_CONFIG[item.type];
  const priorityColor = getPriorityColor(item.priority);

  function handleClick() {
    onClick(item.id);
  }

  function handleDelete(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    onDelete(item.id);
  }

  return (
    <List.Item
      className={clsx('cursor-pointer transition-all hover:bg-layout px-16px! py-12px!', !item.read && 'bg-primary-50')}
      onClick={handleClick}
    >
      <div className="w-full flex gap-12px">
        <div className="shrink-0 pt-2px">
          <span className={clsx(config.colorClassName, 'text-24px')}>
            <span className={config.icon} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4px flex-y-center gap-8px">
            <h4 className="m-0 flex-1 truncate text-14px font-semibold">{item.title}</h4>
            {!item.read && (
              <div
                className="h-8px w-8px shrink-0 rounded-full bg-primary"
                title="unread"
              />
            )}
          </div>

          <p className="line-clamp-2 m-0 text-13px text-secondary">{item.content}</p>

          <div className="mt-8px flex-y-center justify-between">
            <span className="text-12px text-tertiary">{dayjs(item.timestamp).fromNow()}</span>

            {item.priority && item.priority !== 'normal' && (
              <Tag
                variant="filled"
                color={priorityColor}
              >
                {item.priority}
              </Tag>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <ButtonIcon
            className="h-24px! w-24px!"
            hoverAnimation="rotate"
            icon="carbon:close"
            onClick={handleDelete}
          />
        </div>
      </div>
    </List.Item>
  );
};

const NotificationItemComponent = memo(NotificationItemComponentBase);

const NotificationPanelBase = (props: NotificationPanelProps) => {
  const { notifications, onClearAll, onDelete, onItemClick, onMarkAllRead, unreadCount } = props;

  const { t } = useTranslation();

  function renderNotificationItem(item: NotificationItem) {
    return (
      <NotificationItemComponent
        item={item}
        onClick={onItemClick}
        onDelete={onDelete}
      />
    );
  }

  return (
    <DarkModeContainer className="w-400px rounded-8px shadow-md">
      <div className="flex-y-center justify-between border-b border-border px-16px py-12px">
        <div className="flex-y-center gap-8px">
          <h3 className="m-0 text-16px font-semibold">{t('notification.title')}</h3>
          {unreadCount > 0 && (
            <Badge
              count={unreadCount}
              overflowCount={99}
              showZero={false}
            />
          )}
        </div>

        <div className="flex-y-center gap-8px">
          {unreadCount > 0 && (
            <Button
              size="small"
              type="text"
              onClick={onMarkAllRead}
            >
              {t('notification.markAllRead')}
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              danger
              size="small"
              type="text"
              onClick={onClearAll}
            >
              {t('notification.clearAll')}
            </Button>
          )}
        </div>
      </div>

      <div className="admin-notification-panel-scroll max-h-500px overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-40px">
            <Empty
              description={t('notification.empty')}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <List
            dataSource={notifications}
            renderItem={renderNotificationItem}
            size="small"
          />
        )}
      </div>
    </DarkModeContainer>
  );
};

const NotificationPanel = memo(NotificationPanelBase);

export default NotificationPanel;
