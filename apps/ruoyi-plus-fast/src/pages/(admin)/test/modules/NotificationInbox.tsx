/* eslint-disable complexity, no-nested-ternary, no-void, unicorn/consistent-function-scoping */
import { showSuccessMessage } from '@skyroc/web-admin-theme';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Badge,
  Button,
  Card,
  Empty,
  Flex,
  List,
  Pagination,
  Radio,
  Segmented,
  Space,
  Tag,
  Typography
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useState } from 'react';

import {
  dismissNotifications,
  fetchNotificationCounts,
  fetchNotificationInbox,
  fetchNotificationInboxDetail,
  markAllNotificationsRead,
  markNotificationsRead,
  markNotificationsUnread
} from '@/service/api/notification';
import type { NotificationCategory, NotificationInboxItem, NotificationInboxParams } from '@/service/api/notification';

import {
  CATEGORY_OPTIONS,
  actionStateLabel,
  categoryColor,
  categoryIcon,
  categoryLabel,
  categorySurfaceClass,
  formatNotificationTime
} from './notification-ui';

interface NotificationInboxProps {
  /** 页面在模块导航中被激活时是否显示。 */
  active: boolean;
}

const INITIAL_PARAMS: NotificationInboxParams = { current: 1, size: 10 };

/** 当前用户的服务端通知收件箱。 */
const NotificationInbox = (props: NotificationInboxProps) => {
  const { active } = props;

  const queryClient = useQueryClient();
  const [params, setParams] = useState<NotificationInboxParams>(INITIAL_PARAMS);
  const [selectedId, setSelectedId] = useState<string>();
  const countsQuery = useQuery({
    enabled: active,
    queryFn: fetchNotificationCounts,
    queryKey: ['notification-test', 'counts']
  });
  const listQuery = useQuery({
    enabled: active,
    placeholderData: previous => previous,
    queryFn: () => fetchNotificationInbox(params),
    queryKey: ['notification-test', 'inbox', params]
  });
  const detailQuery = useQuery({
    enabled: active && Boolean(selectedId),
    queryFn: () => fetchNotificationInboxDetail(selectedId as string),
    queryKey: ['notification-test', 'inbox-detail', selectedId]
  });
  const writeMutation = useMutation({
    mutationFn: async (action: { id?: string; type: 'all-read' | 'dismiss' | 'read' | 'unread' }) => {
      if (action.type === 'all-read') return markAllNotificationsRead();
      if (!action.id) throw new Error('缺少消息 ID');
      if (action.type === 'dismiss') return dismissNotifications([action.id]);
      if (action.type === 'unread') return markNotificationsUnread([action.id]);
      return markNotificationsRead([action.id]);
    },
    onSuccess: async result => {
      queryClient.setQueryData(['notification-test', 'counts'], result.counts);
      await queryClient.invalidateQueries({ queryKey: ['notification-test', 'inbox'] });
      if (selectedId)
        await queryClient.invalidateQueries({ queryKey: ['notification-test', 'inbox-detail', selectedId] });
      showSuccessMessage('通知状态已同步');
    }
  });
  const counts = countsQuery.data;
  const records = listQuery.data?.records || [];
  const detail = detailQuery.data;

  function handleCategory(value: string | number) {
    setParams({ ...params, category: value === 'all' ? undefined : (value as NotificationCategory), current: 1 });
    setSelectedId(undefined);
  }

  function handleReadFilter(event: RadioChangeEvent) {
    const value = event.target.value as 'all' | 'read' | 'unread';
    setParams({ ...params, current: 1, unread: value === 'all' ? undefined : value === 'unread' });
  }

  function handleSelect(item: NotificationInboxItem) {
    setSelectedId(item.msgId);
  }

  function handleAction(target?: string) {
    if (!target) return;
    window.location.assign(target);
  }

  return (
    <div className={active ? 'flex flex-col gap-16px' : 'hidden'}>
      <Flex
        align="flex-start"
        justify="space-between"
        gap={16}
        wrap
      >
        <div>
          <Typography.Title
            className="m-0"
            level={3}
          >
            通知中心
          </Typography.Title>
          <Typography.Text type="secondary">集中查看、标记和处理属于你的消息，阅读态与处理态彼此独立。</Typography.Text>
        </div>
        <Space>
          <Button
            loading={writeMutation.isPending}
            onClick={() => writeMutation.mutate({ type: 'all-read' })}
          >
            全部已读
          </Button>
          <Button
            icon={<SvgIcon icon="ph:arrows-clockwise" />}
            loading={listQuery.isFetching}
            type="primary"
            onClick={() => void Promise.all([listQuery.refetch(), countsQuery.refetch()])}
          >
            刷新
          </Button>
        </Space>
      </Flex>

      <div className="grid grid-cols-1 gap-12px md:grid-cols-3">
        <Card
          bordered={false}
          className="card-wrapper"
        >
          <Flex
            align="center"
            justify="space-between"
          >
            <div>
              <Typography.Text type="secondary">未读会话</Typography.Text>
              <div className="mt-4px text-26px font-700">{counts?.unreadThreads ?? '—'}</div>
            </div>
            <Badge count={counts?.unreadThreads || 0}>
              <span className="size-42px grid place-items-center rounded-12px bg-primary-50 text-primary">
                <SvgIcon icon="ph:chat-circle-dots" />
              </span>
            </Badge>
          </Flex>
        </Card>
        <Card
          bordered={false}
          className="card-wrapper"
        >
          <Flex
            align="center"
            justify="space-between"
          >
            <div>
              <Typography.Text type="secondary">未读消息</Typography.Text>
              <div className="mt-4px text-26px font-700">{counts?.unread ?? '—'}</div>
            </div>
            <span className="size-42px grid place-items-center rounded-12px bg-info-50 text-info">
              <SvgIcon icon="ph:envelope-simple" />
            </span>
          </Flex>
        </Card>
        <Card
          bordered={false}
          className="card-wrapper"
        >
          <Flex
            align="center"
            justify="space-between"
          >
            <div>
              <Typography.Text type="secondary">待处理事项</Typography.Text>
              <div className="mt-4px text-26px font-700">{counts?.pending ?? '—'}</div>
            </div>
            <span className="size-42px grid place-items-center rounded-12px bg-warning-50 text-warning">
              <SvgIcon icon="ph:timer" />
            </span>
          </Flex>
        </Card>
      </div>

      <Card
        bordered={false}
        className="card-wrapper"
      >
        <Segmented
          block
          options={[
            { label: `全部 ${counts?.unread || 0}`, value: 'all' },
            ...CATEGORY_OPTIONS.map(item => ({
              label: `${item.label} ${counts?.byCategory[item.value] || 0}`,
              value: item.value
            }))
          ]}
          value={params.category || 'all'}
          onChange={handleCategory}
        />
      </Card>

      <div className="grid min-h-560px grid-cols-1 gap-16px xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card
          bordered={false}
          className="card-wrapper min-w-0"
          title={
            <Flex
              align="center"
              gap={8}
            >
              <span>消息列表</span>
              <Tag color="blue">{listQuery.data?.total || 0} 条</Tag>
            </Flex>
          }
          extra={
            <Radio.Group
              optionType="button"
              size="small"
              value={params.unread === undefined ? 'all' : params.unread ? 'unread' : 'read'}
              options={[
                { label: '全部', value: 'all' },
                { label: '未读', value: 'unread' },
                { label: '已读', value: 'read' }
              ]}
              onChange={handleReadFilter}
            />
          }
        >
          {listQuery.isError ? (
            <Alert
              action={<Button onClick={() => void listQuery.refetch()}>重试</Button>}
              className="mb-12px"
              showIcon
              title="收件箱加载失败"
              type="error"
            />
          ) : null}
          <List<NotificationInboxItem>
            dataSource={records}
            loading={listQuery.isLoading}
            locale={{ emptyText: <Empty description="当前筛选下没有通知" /> }}
            renderItem={item => (
              <List.Item
                className={`cursor-pointer rounded-10px px-12px transition-colors ${selectedId === item.msgId ? 'bg-primary-50' : item.readTime ? '' : 'bg-layout'}`}
                onClick={() => handleSelect(item)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.readTime}>
                      <span
                        className={`size-38px grid place-items-center rounded-10px ${categorySurfaceClass(item.category)}`}
                      >
                        {categoryIcon(item.category)}
                      </span>
                    </Badge>
                  }
                  title={
                    <Flex
                      align="center"
                      gap={7}
                      wrap
                    >
                      <Typography.Text
                        strong={!item.readTime}
                        delete={item.retracted}
                      >
                        {item.retracted ? '该消息已撤回' : item.title}
                      </Typography.Text>
                      <Tag color={categoryColor(item.category)}>{categoryLabel(item.category)}</Tag>
                      {item.priority === 'urgent' ? <Tag color="red">紧急</Tag> : null}
                      {item.actionState !== 'none' ? (
                        <Tag color={item.actionState === 'pending' ? 'purple' : 'default'}>
                          {actionStateLabel(item.actionState)}
                        </Tag>
                      ) : null}
                    </Flex>
                  }
                  description={
                    <>
                      <Typography.Paragraph
                        className="mb-5px line-clamp-2"
                        type="secondary"
                      >
                        {item.retracted ? '发布者已撤回内容，保留此记录用于避免误解。' : item.summary}
                      </Typography.Paragraph>
                      <Typography.Text
                        className="text-12px"
                        type="secondary"
                      >
                        {formatNotificationTime(item.publishTime)} · 第 {item.revision} 版
                      </Typography.Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
          <Flex
            className="mt-16px"
            justify="flex-end"
          >
            <Pagination
              current={params.current}
              pageSize={params.size}
              showSizeChanger
              total={listQuery.data?.total || 0}
              onChange={(current, size) => setParams({ ...params, current, size })}
            />
          </Flex>
        </Card>

        <Card
          bordered={false}
          className="card-wrapper"
          title="通知详情"
        >
          {detailQuery.isError ? (
            <Alert
              showIcon
              title="详情加载失败"
              type="error"
            />
          ) : null}
          {!selectedId ? (
            <Empty description="选择一条通知查看完整内容" />
          ) : detailQuery.isLoading ? (
            <Typography.Text type="secondary">正在加载详情…</Typography.Text>
          ) : detail ? (
            <Space
              className="w-full"
              direction="vertical"
              size={18}
            >
              <Flex
                align="center"
                gap={8}
                wrap
              >
                <Tag color={categoryColor(detail.category)}>{categoryLabel(detail.category)}</Tag>
                <Tag>{detail.readTime ? '已读' : '未读'}</Tag>
                {detail.actionState !== 'none' ? (
                  <Tag color="purple">{actionStateLabel(detail.actionState)}</Tag>
                ) : null}
              </Flex>
              <div>
                <Typography.Title
                  className="mb-8px"
                  level={4}
                >
                  {detail.retracted ? '该消息已撤回' : detail.title}
                </Typography.Title>
                <Typography.Paragraph type="secondary">{detail.summary}</Typography.Paragraph>
              </div>
              <div className="rounded-10px bg-layout p-14px">
                <Typography.Paragraph className="mb-0 whitespace-pre-wrap">
                  {detail.retracted ? '发布者已撤回这条通知。历史记录仍会保留。' : detail.body || '暂无正文'}
                </Typography.Paragraph>
              </div>
              <div className="grid grid-cols-[88px_1fr] gap-x-12px gap-y-9px text-13px">
                <Typography.Text type="secondary">发布时间</Typography.Text>
                <span>{formatNotificationTime(detail.publishTime)}</span>
                <Typography.Text type="secondary">消息 ID</Typography.Text>
                <Typography.Text copyable>{detail.msgId}</Typography.Text>
                <Typography.Text type="secondary">关联对象</Typography.Text>
                <span>{detail.refType ? `${detail.refType} · ${detail.refId || '—'}` : '无'}</span>
              </div>
              <Flex
                gap={8}
                wrap
              >
                <Button
                  loading={writeMutation.isPending}
                  onClick={() => writeMutation.mutate({ id: detail.msgId, type: detail.readTime ? 'unread' : 'read' })}
                >
                  {detail.readTime ? '标为未读' : '标为已读'}
                </Button>
                <Button
                  danger
                  loading={writeMutation.isPending}
                  onClick={() => writeMutation.mutate({ id: detail.msgId, type: 'dismiss' })}
                >
                  移出列表
                </Button>
                {detail.actionState === 'pending' && detail.action?.target ? (
                  <Button
                    type="primary"
                    onClick={() => handleAction(detail.action?.target)}
                  >
                    {detail.action.label || '去处理'}
                  </Button>
                ) : null}
              </Flex>
            </Space>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default NotificationInbox;
