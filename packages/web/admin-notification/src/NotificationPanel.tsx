import { ButtonIcon } from '@skyroc/web-ui-antd';
import { DarkModeContainer, SvgIcon } from '@skyroc/web-ui-compose';
import { Badge, Button, Empty, Flex, Segmented, Tag, Typography } from 'antd';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { memo, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { NotificationItem, NotificationPriority, NotificationType } from './types';

dayjs.extend(relativeTime);

const { Paragraph, Text } = Typography;

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
  /** Jump handler of the notification center entry. The footer is hidden when the host does not pass it. */
  onViewAll?: () => void;
  /** Current unread notification count. */
  unreadCount: number;
}

/** 面板顶部的筛选，只分全部和未读，更细的分类留给通知中心页面。 */
type PanelFilter = 'all' | 'unread';

interface NotificationTypeConfig {
  /** 图标块的底色与图标色，取调色板的浅色档，明暗两套主题都跟着变。 */
  chipClassName: string;
  /** Iconify icon name for the category. */
  icon: string;
}

interface PriorityTagConfig {
  /** Ant Design 语义色名。 */
  color: string;
  /** 优先级文案的翻译键。 */
  labelKey: 'notification.priority.high' | 'notification.priority.urgent';
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
    chipClassName: 'bg-error-50 text-error',
    icon: 'carbon:close-filled'
  },
  info: {
    chipClassName: 'bg-info-50 text-info',
    icon: 'carbon:information-filled'
  },
  message: {
    chipClassName: 'bg-purple-50 text-purple',
    icon: 'carbon:chat'
  },
  success: {
    chipClassName: 'bg-success-50 text-success',
    icon: 'carbon:checkmark-filled'
  },
  warning: {
    chipClassName: 'bg-warning-50 text-warning',
    icon: 'carbon:warning-filled'
  }
};

/** 只有紧急和高优先级值得占一个标签，普通和低优先级留白反而更清爽。 */
const PRIORITY_TAG_CONFIG: Partial<Record<NotificationPriority, PriorityTagConfig>> = {
  high: {
    color: 'warning',
    labelKey: 'notification.priority.high'
  },
  urgent: {
    color: 'error',
    labelKey: 'notification.priority.urgent'
  }
};

const NotificationItemComponentBase = (props: NotificationItemProps) => {
  const { item, onClick, onDelete } = props;

  const { t } = useTranslation();

  const typeConfig = NOTIFICATION_TYPE_CONFIG[item.type];
  const priorityTag = item.priority ? PRIORITY_TAG_CONFIG[item.priority] : undefined;

  function handleClick() {
    onClick(item.id);
  }

  function handleDelete(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    onDelete(item.id);
  }

  return (
    <div
      className={clsx(
        'group relative cursor-pointer border-b border-border px-16px py-12px transition-colors last:border-b-0',
        item.read ? 'hover:bg-layout' : 'bg-primary-50 hover:bg-primary-100'
      )}
      onClick={handleClick}
    >
      {!item.read && <span className="absolute-lt h-full w-2px bg-primary" />}

      <Flex
        align="flex-start"
        className="w-full"
        gap={12}
      >
        <div className={clsx('h-32px w-32px shrink-0 flex-center rounded-lg text-lg', typeConfig.chipClassName)}>
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

            {!item.read && <span className="h-6px w-6px shrink-0 rounded-full bg-primary" />}
          </Flex>

          <Paragraph
            className="mb-0! mt-4px! text-xs"
            ellipsis={{ rows: 2 }}
            type="secondary"
          >
            {item.content}
          </Paragraph>

          <Flex
            align="center"
            className="mt-8px"
            gap={8}
          >
            <Text
              className="text-xs"
              type="secondary"
            >
              {dayjs(item.timestamp).fromNow()}
            </Text>

            {priorityTag && (
              <Tag
                className="m-0!"
                color={priorityTag.color}
                variant="filled"
              >
                {t(priorityTag.labelKey)}
              </Tag>
            )}
          </Flex>
        </div>

        <ButtonIcon
          className="h-24px! w-24px! opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
          hoverAnimation="rotate"
          icon="carbon:close"
          onClick={handleDelete}
        />
      </Flex>
    </div>
  );
};

const NotificationItemComponent = memo(NotificationItemComponentBase);

const NotificationPanelBase = (props: NotificationPanelProps) => {
  const { notifications, onClearAll, onDelete, onItemClick, onMarkAllRead, onViewAll, unreadCount } = props;

  const { t } = useTranslation();

  const [filter, setFilter] = useState<PanelFilter>('all');

  const visibleNotifications = useMemo(
    () => (filter === 'unread' ? notifications.filter(item => !item.read) : notifications),
    [filter, notifications]
  );

  const filterOptions: { label: string; value: PanelFilter }[] = [
    { label: `${t('notification.all')} ${notifications.length}`, value: 'all' },
    { label: `${t('notification.unread')} ${unreadCount}`, value: 'unread' }
  ];

  return (
    <DarkModeContainer className="w-390px overflow-hidden border border-border rounded-lg shadow-float">
      <Flex
        align="center"
        className="border-b border-border px-16px py-12px"
        justify="space-between"
      >
        <Flex
          align="center"
          gap={8}
        >
          <Text
            strong
            className="text-md"
          >
            {t('notification.title')}
          </Text>

          <Badge
            count={unreadCount}
            overflowCount={99}
            showZero={false}
          />
        </Flex>

        <Button
          color="primary"
          disabled={unreadCount === 0}
          icon={<SvgIcon icon="carbon:checkmark" />}
          size="small"
          variant="link"
          onClick={onMarkAllRead}
        >
          {t('notification.markAllRead')}
        </Button>
      </Flex>

      <Flex
        align="center"
        className="border-b border-border bg-layout px-16px py-8px"
        justify="space-between"
      >
        <Segmented
          options={filterOptions}
          size="small"
          value={filter}
          onChange={setFilter}
        />

        <Button
          danger
          disabled={notifications.length === 0}
          size="small"
          type="text"
          onClick={onClearAll}
        >
          {t('notification.clearAll')}
        </Button>
      </Flex>

      <div className="admin-notification-panel-scroll max-h-420px overflow-y-auto">
        {visibleNotifications.length === 0 ? (
          <Empty
            className="py-40px"
            description={t('notification.empty')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          visibleNotifications.map(item => (
            <NotificationItemComponent
              item={item}
              key={item.id}
              onClick={onItemClick}
              onDelete={onDelete}
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
            iconPosition="end"
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
