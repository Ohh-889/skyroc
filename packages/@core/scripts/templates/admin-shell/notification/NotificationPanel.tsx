import { DarkModeContainer, SvgIcon } from '@shell/ui/compose';
import { Button, Divider, Empty, Flex, Typography } from 'antd';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { NotificationItem, NotificationType } from './types';

dayjs.extend(relativeTime);

const { Paragraph, Text } = Typography;

export interface NotificationPanelProps {
  /** Notifications rendered in the panel list. */
  notifications: NotificationItem[];
  /** Click handler for a single notification. */
  onItemClick: (id: string) => void;
  /** Mark-all-read command handler. */
  onMarkAllRead: () => void;
  /** Jump handler of the notification center entry. The footer is hidden when the host does not pass it. */
  onViewAll?: () => void;
  /** Current unread notification count. */
  unreadCount: number;
}

interface NotificationTypeConfig {
  /** 图标块的底色与图标色，取调色板的浅色档，明暗两套主题都跟着变。 */
  chipClassName: string;
  /** Iconify icon name for the category. */
  icon: string;
}

interface NotificationItemProps {
  /** Notification data rendered by the row. */
  item: NotificationItem;
  /** Click handler for the row. */
  onClick: (id: string) => void;
  /** Whether to show the divider below this notification. */
  showDivider: boolean;
}

const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  error: {
    chipClassName: 'bg-error-50 !text-error',
    icon: 'carbon:close-filled'
  },
  info: {
    chipClassName: 'bg-primary-50 !text-primary',
    icon: 'carbon:information-filled'
  },
  message: {
    chipClassName: 'bg-purple-50 !text-purple',
    icon: 'carbon:chat'
  },
  success: {
    chipClassName: 'bg-success-50 !text-success',
    icon: 'carbon:checkmark-filled'
  },
  warning: {
    chipClassName: 'bg-warning-50 !text-warning',
    icon: 'carbon:warning-filled'
  }
};

const NotificationItemComponentBase = (props: NotificationItemProps) => {
  const { item, onClick, showDivider } = props;

  const typeConfig = NOTIFICATION_TYPE_CONFIG[item.type];

  function handleClick() {
    onClick(item.id);
  }

  return (
    <>
      <div
        className="relative cursor-pointer bg-container px-16px py-12px transition-colors hover:bg-layout"
        onClick={handleClick}
      >
        <Flex
          align="flex-start"
          className="w-full"
          gap={10}
        >
          <div
            className={clsx('mt-1px h-28px w-28px shrink-0 flex-center rounded-md text-base', typeConfig.chipClassName)}
          >
            <SvgIcon icon={typeConfig.icon} />
          </div>

          <div className="min-w-0 flex-1">
            <Flex
              align="center"
              gap={6}
            >
              <Text
                ellipsis
                strong
                className="min-w-0 text-sm"
              >
                {item.title}
              </Text>

              {!item.read && <span className="h-5px w-5px shrink-0 rounded-full bg-primary" />}
            </Flex>

            <Paragraph
              className="mb-0! mt-3px! text-xs leading-18px"
              ellipsis={{ rows: 1 }}
              type="secondary"
            >
              {item.content} · {dayjs(item.timestamp).fromNow()}
            </Paragraph>
          </div>
        </Flex>
      </div>

      {showDivider && <Divider className="my-0" />}
    </>
  );
};

const NotificationItemComponent = memo(NotificationItemComponentBase);

const NotificationPanelBase = (props: NotificationPanelProps) => {
  const { notifications, onItemClick, onMarkAllRead, onViewAll, unreadCount } = props;

  const { t } = useTranslation();

  return (
    <DarkModeContainer className="w-360px overflow-hidden border border-border rounded-lg shadow-float">
      <Flex
        align="center"
        className="px-16px py-12px"
        justify="space-between"
      >
        <Text strong>{t('notification.reminder')}</Text>

        <Button
          color="primary"
          disabled={unreadCount === 0}
          size="small"
          variant="text"
          onClick={onMarkAllRead}
        >
          {t('notification.markAllRead')}
        </Button>
      </Flex>

      <Divider className="my-0" />

      <div className="admin-notification-panel-scroll max-h-380px overflow-y-auto">
        {notifications.length === 0 ? (
          <Empty
            className="py-32px"
            description={t('notification.empty')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          notifications.map((item, index) => (
            <NotificationItemComponent
              item={item}
              key={item.id}
              onClick={onItemClick}
              showDivider={index < notifications.length - 1}
            />
          ))
        )}
      </div>

      {onViewAll && (
        <div className="border-t border-border px-16px py-8px">
          <Button
            block
            color="primary"
            icon={<SvgIcon icon="carbon:arrow-right" />}
            iconPlacement="end"
            size="small"
            variant="link"
            onClick={onViewAll}
          >
            {t('notification.viewAll')}
          </Button>
        </div>
      )}
    </DarkModeContainer>
  );
};

const NotificationPanel = memo(NotificationPanelBase);

export default NotificationPanel;
