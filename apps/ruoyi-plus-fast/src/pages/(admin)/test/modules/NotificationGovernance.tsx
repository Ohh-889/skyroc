/* eslint-disable complexity, no-nested-ternary, no-void */
import { showSuccessMessage } from '@skyroc/web-admin-theme';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  App,
  Button,
  Card,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  Pagination,
  Progress,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import {
  cancelNotificationSchedule,
  deleteNotificationDraft,
  fetchAudiencePreview,
  fetchNotificationCatalog,
  fetchNotificationDetail,
  fetchNotificationList,
  fetchNotificationRevisions,
  fetchNotificationStats,
  fetchRevokeImpact,
  publishNotification,
  reviseNotification,
  revokeNotification
} from '@/service/api/notification';
import type { NotificationItem, NotificationListParams, NotificationRevisePayload } from '@/service/api/notification';

import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  categoryColor,
  categoryLabel,
  formatNotificationTime,
  intentLabel,
  statusLabel
} from './notification-ui';

interface NotificationGovernanceProps {
  /** 页面在模块导航中被激活时是否显示。 */
  active: boolean;
}

interface NotificationRevisionValues {
  /** 修订后的正文。 */
  body?: string;
  /** 修订原因。 */
  changeNote: string;
  /** 是否重新提醒收件人。 */
  renotify: boolean;
  /** 修订后的摘要。 */
  summary: string;
  /** 修订后的标题。 */
  title: string;
}

const INITIAL_PARAMS: NotificationListParams = { current: 1, size: 10 };

/** 管理端通知生命周期与审计治理页面。 */
const NotificationGovernance = (props: NotificationGovernanceProps) => {
  const { active } = props;

  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const [searchForm] = Form.useForm<NotificationListParams>();
  const [reviseForm] = Form.useForm<NotificationRevisionValues>();
  const [params, setParams] = useState<NotificationListParams>(INITIAL_PARAMS);
  const [detailId, setDetailId] = useState<string>();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [reviseOpen, setReviseOpen] = useState(false);
  const listQuery = useQuery({
    enabled: active,
    placeholderData: previous => previous,
    queryFn: () => fetchNotificationList(params),
    queryKey: ['notification-test', 'management', params]
  });
  const detailQuery = useQuery({
    enabled: active && Boolean(detailId),
    queryFn: () => fetchNotificationDetail(detailId as string),
    queryKey: ['notification-test', 'management-detail', detailId]
  });
  const statsQuery = useQuery({
    enabled: active && Boolean(detailId),
    queryFn: () => fetchNotificationStats(detailId as string),
    queryKey: ['notification-test', 'stats', detailId]
  });
  const revisionsQuery = useQuery({
    enabled: active && Boolean(detailId),
    queryFn: () => fetchNotificationRevisions(detailId as string),
    queryKey: ['notification-test', 'revisions', detailId]
  });
  const catalogQuery = useQuery({
    enabled: active && catalogOpen,
    queryFn: fetchNotificationCatalog,
    queryKey: ['notification-test', 'catalog']
  });
  const actionMutation = useMutation({
    mutationFn: async (action: {
      item: NotificationItem;
      reason?: string;
      type: 'cancel' | 'delete' | 'publish' | 'revoke';
    }) => {
      if (action.type === 'delete') return deleteNotificationDraft(action.item.msgId);
      if (action.type === 'cancel') return cancelNotificationSchedule(action.item.msgId);
      if (action.type === 'revoke') return revokeNotification(action.item.msgId, action.reason || '管理员撤回');
      return publishNotification(action.item.msgId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-test', 'management'] });
      if (detailId)
        await queryClient.invalidateQueries({ queryKey: ['notification-test', 'management-detail', detailId] });
      showSuccessMessage('消息状态已更新');
    }
  });
  const reviseMutation = useMutation({
    mutationFn: (payload: NotificationRevisePayload) => reviseNotification(detailId as string, payload),
    onSuccess: async () => {
      setReviseOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['notification-test', 'management'] }),
        queryClient.invalidateQueries({ queryKey: ['notification-test', 'management-detail', detailId] }),
        queryClient.invalidateQueries({ queryKey: ['notification-test', 'revisions', detailId] })
      ]);
      showSuccessMessage('修订已保存');
    }
  });
  const detail = detailQuery.data;

  function handleSearch(values: NotificationListParams) {
    setParams({
      category: values.category,
      current: 1,
      size: params.size,
      status: values.status,
      title: values.title?.trim() || undefined
    });
  }

  function handleReset() {
    searchForm.resetFields();
    setParams({ ...INITIAL_PARAMS, size: params.size });
  }

  async function handlePublish(item: NotificationItem) {
    const preview = await fetchAudiencePreview(item.msgId);
    modal.confirm({
      content:
        preview.count < 0 ? '该消息将作为全员公告发送给全部有效用户。' : `服务端预览受众为 ${preview.count} 人。`,
      okButtonProps: { disabled: preview.exceedsLimit },
      okText: '确认发布',
      title: `发布“${item.title}”`,
      onOk: () => actionMutation.mutateAsync({ item, type: 'publish' })
    });
  }

  async function handleRevoke(item: NotificationItem) {
    const impact = await fetchRevokeImpact(item.msgId);
    const irreversible =
      Object.entries(impact.alreadySent)
        .map(([channel, count]) => `${channel} ${count} 条`)
        .join('、') || '无';
    modal.confirm({
      content: (
        <Alert
          showIcon
          title={`已发送且无法撤回：${irreversible}`}
          description={`站内收件人 ${impact.inboxRecipients} 人，尚未发送的 ${impact.cancelledDeliveries} 条投递会被取消。`}
          type="warning"
        />
      ),
      okButtonProps: { danger: true },
      okText: '确认撤回',
      title: `撤回“${item.title}”`,
      onOk: () => actionMutation.mutateAsync({ item, type: 'revoke' })
    });
  }

  function handleDelete(item: NotificationItem) {
    modal.confirm({
      content: '只有草稿会被删除，此操作不会影响任何已发布消息。',
      okButtonProps: { danger: true },
      okText: '删除草稿',
      title: `删除“${item.title}”`,
      onOk: () => actionMutation.mutateAsync({ item, type: 'delete' })
    });
  }

  function handleCancel(item: NotificationItem) {
    modal.confirm({
      content: '取消后消息回到草稿状态，可以继续编辑并重新排期。',
      okText: '取消排期',
      title: `取消“${item.title}”的排期`,
      onOk: () => actionMutation.mutateAsync({ item, type: 'cancel' })
    });
  }

  function handleOpenRevision() {
    if (!detail) return;
    reviseForm.setFieldsValue({
      body: detail.body || undefined,
      changeNote: '',
      renotify: false,
      summary: detail.summary,
      title: detail.title
    });
    setReviseOpen(true);
  }

  async function handleRevise() {
    if (!detail) return;
    const values = await reviseForm.validateFields();
    await reviseMutation.mutateAsync({
      audience: detail.audience,
      body: values.body?.trim() || null,
      category: detail.category,
      changeNote: values.changeNote.trim(),
      expireTime: detail.expireTime,
      expectedRevision: detail.revision,
      intent: detail.intent,
      priority: detail.priority,
      renotify: values.renotify,
      summary: values.summary.trim(),
      title: values.title.trim()
    });
  }

  function createColumns(): ColumnsType<NotificationItem> {
    return [
      {
        dataIndex: 'title',
        fixed: 'left',
        title: '消息',
        width: 360,
        render: (value: string, item) => (
          <Flex
            align="center"
            gap={10}
          >
            <span className="size-36px grid shrink-0 place-items-center rounded-10px bg-primary-1 text-primary">
              <SvgIcon icon={item.priority === 'urgent' ? 'ph:warning' : 'ph:bell-ringing'} />
            </span>
            <div className="min-w-0">
              <Typography.Text
                className="block max-w-280px truncate"
                strong
              >
                {value}
              </Typography.Text>
              <Typography.Text
                className="block max-w-300px truncate text-12px"
                type="secondary"
              >
                {item.summary}
              </Typography.Text>
            </div>
          </Flex>
        )
      },
      {
        dataIndex: 'category',
        title: '分类',
        width: 115,
        render: value => <Tag color={categoryColor(value)}>{categoryLabel(value)}</Tag>
      },
      {
        dataIndex: 'audienceSize',
        title: '受众',
        width: 120,
        render: value => (value === null ? '全员公告' : `${value} 人`)
      },
      { dataIndex: 'revision', title: '版本', width: 80, render: value => `v${value}` },
      {
        dataIndex: 'status',
        title: '状态',
        width: 110,
        render: value => (
          <Tag
            color={
              value === 'published'
                ? 'success'
                : value === 'revoked'
                  ? 'error'
                  : value === 'scheduled'
                    ? 'processing'
                    : 'default'
            }
          >
            {statusLabel(value)}
          </Tag>
        )
      },
      { dataIndex: 'publishTime', title: '发布时间', width: 180, render: formatNotificationTime },
      {
        fixed: 'right',
        title: '操作',
        width: 240,
        render: (_value, item) => (
          <Space size={2}>
            <Button
              size="small"
              onClick={() => setDetailId(item.msgId)}
            >
              详情
            </Button>
            {item.status === 'draft' ? (
              <>
                <Button
                  size="small"
                  type="link"
                  onClick={() => void handlePublish(item)}
                >
                  发布
                </Button>
                <Button
                  danger
                  size="small"
                  type="link"
                  onClick={() => handleDelete(item)}
                >
                  删除
                </Button>
              </>
            ) : null}
            {item.status === 'scheduled' ? (
              <Button
                size="small"
                type="link"
                onClick={() => handleCancel(item)}
              >
                取消排期
              </Button>
            ) : null}
            {item.status === 'published' ? (
              <Button
                danger
                size="small"
                type="link"
                onClick={() => void handleRevoke(item)}
              >
                撤回
              </Button>
            ) : null}
          </Space>
        )
      }
    ];
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
            消息治理
          </Typography.Title>
          <Typography.Text type="secondary">管理草稿、排期、发布、修订、撤回与审计记录。</Typography.Text>
        </div>
        <Space>
          <Button
            icon={<SvgIcon icon="ph:book-open-text" />}
            onClick={() => setCatalogOpen(true)}
          >
            通知目录
          </Button>
          <Button
            icon={<SvgIcon icon="ph:arrows-clockwise" />}
            loading={listQuery.isFetching}
            onClick={() => void listQuery.refetch()}
          >
            刷新
          </Button>
        </Space>
      </Flex>
      <Card
        bordered={false}
        className="card-wrapper"
      >
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item
            label="标题"
            name="title"
          >
            <Input
              allowClear
              placeholder="搜索标题"
            />
          </Form.Item>
          <Form.Item
            label="分类"
            name="category"
          >
            <Select
              allowClear
              className="w-150px"
              options={CATEGORY_OPTIONS.map(item => ({ label: item.label, value: item.value }))}
              placeholder="全部分类"
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
          >
            <Select
              allowClear
              className="w-130px"
              options={STATUS_OPTIONS}
              placeholder="全部状态"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button
                htmlType="submit"
                type="primary"
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
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
      >
        {listQuery.isError ? (
          <Alert
            action={<Button onClick={() => void listQuery.refetch()}>重试</Button>}
            className="mb-12px"
            showIcon
            title="管理端消息加载失败"
            type="error"
          />
        ) : null}
        <Table
          columns={createColumns()}
          dataSource={listQuery.data?.records || []}
          loading={listQuery.isLoading}
          locale={{ emptyText: <Empty description="暂无消息" /> }}
          pagination={false}
          rowKey={item => item.msgId}
          scroll={{ x: 1200 }}
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

      <Drawer
        open={Boolean(detailId)}
        title="消息详情与投递结果"
        width={680}
        onClose={() => setDetailId(undefined)}
      >
        {detailQuery.isError ? (
          <Alert
            showIcon
            title="详情加载失败"
            type="error"
          />
        ) : detail ? (
          <Tabs
            items={[
              {
                key: 'content',
                label: '内容',
                children: (
                  <Space
                    className="w-full"
                    direction="vertical"
                    size={16}
                  >
                    <Flex gap={8}>
                      <Tag color={categoryColor(detail.category)}>{categoryLabel(detail.category)}</Tag>
                      <Tag>{intentLabel(detail.intent)}</Tag>
                      <Tag>{statusLabel(detail.status)}</Tag>
                    </Flex>
                    <Typography.Title
                      className="m-0"
                      level={4}
                    >
                      {detail.title}
                    </Typography.Title>
                    <Typography.Paragraph type="secondary">{detail.summary}</Typography.Paragraph>
                    <Card size="small">
                      <Typography.Paragraph className="mb-0 whitespace-pre-wrap">
                        {detail.body || '暂无正文'}
                      </Typography.Paragraph>
                    </Card>
                    <Descriptions
                      bordered
                      column={1}
                      size="small"
                    >
                      <Descriptions.Item label="消息 ID">{detail.msgId}</Descriptions.Item>
                      <Descriptions.Item label="受众">
                        {detail.audience.kind === 'all'
                          ? '全部用户'
                          : `${detail.audience.kind} · ${detail.audienceSize || 0} 人`}
                      </Descriptions.Item>
                      <Descriptions.Item label="版本">v{detail.revision}</Descriptions.Item>
                      <Descriptions.Item label="发布时间">
                        {formatNotificationTime(detail.publishTime)}
                      </Descriptions.Item>
                    </Descriptions>
                    {detail.status === 'published' ? (
                      <Button
                        type="primary"
                        onClick={handleOpenRevision}
                      >
                        修订内容
                      </Button>
                    ) : null}
                  </Space>
                )
              },
              {
                key: 'stats',
                label: '送达统计',
                children: statsQuery.data?.isBroadcast ? (
                  <Alert
                    showIcon
                    title="全员公告采用读扩散，不统计送达人数"
                    type="info"
                  />
                ) : statsQuery.data ? (
                  <Space
                    className="w-full"
                    direction="vertical"
                    size={14}
                  >
                    <div className="grid grid-cols-3 gap-12px">
                      <Card size="small">
                        <Typography.Text type="secondary">送达</Typography.Text>
                        <div className="text-24px font-700">{statsQuery.data.delivered}</div>
                      </Card>
                      <Card size="small">
                        <Typography.Text type="secondary">已读</Typography.Text>
                        <div className="text-24px font-700">{statsQuery.data.read}</div>
                      </Card>
                      <Card size="small">
                        <Typography.Text type="secondary">已处理</Typography.Text>
                        <div className="text-24px font-700">{statsQuery.data.actioned}</div>
                      </Card>
                    </div>
                    {Object.entries(statsQuery.data.channels).map(([key, value]) => (
                      <div key={key}>
                        <Flex justify="space-between">
                          <span>{key}</span>
                          <span>{value}</span>
                        </Flex>
                        <Progress
                          percent={
                            statsQuery.data.delivered ? Math.round((value / statsQuery.data.delivered) * 100) : 0
                          }
                          size="small"
                        />
                      </div>
                    ))}
                  </Space>
                ) : (
                  <Empty description="暂无统计数据" />
                )
              },
              {
                key: 'history',
                label: `修订历史 ${revisionsQuery.data?.length || 0}`,
                children: revisionsQuery.data?.length ? (
                  <Timeline
                    items={revisionsQuery.data.map(item => ({
                      children: (
                        <div>
                          <Flex
                            align="center"
                            gap={8}
                          >
                            <Typography.Text strong>第 {item.revision} 版</Typography.Text>
                            {item.renotified ? <Tag color="orange">重新提醒</Tag> : <Tag>静默修订</Tag>}
                          </Flex>
                          <Typography.Paragraph
                            className="mb-4px"
                            type="secondary"
                          >
                            {item.changeNote || '未填写修订说明'}
                          </Typography.Paragraph>
                          <Typography.Text
                            className="text-12px"
                            type="secondary"
                          >
                            {formatNotificationTime(item.createTime)}
                          </Typography.Text>
                        </div>
                      )
                    }))}
                  />
                ) : (
                  <Empty description="暂无修订记录" />
                )
              }
            ]}
          />
        ) : (
          <Empty description="正在加载详情" />
        )}
      </Drawer>

      <Drawer
        open={catalogOpen}
        title="通知事件目录"
        width={760}
        onClose={() => setCatalogOpen(false)}
      >
        <Alert
          className="mb-16px"
          showIcon
          title="目录由后端规则注册表实时生成"
          description="这里展示系统何时通知、消息分类以及建议渠道，不在前端维护第二份清单。"
          type="info"
        />
        <Table
          dataSource={catalogQuery.data || []}
          loading={catalogQuery.isLoading}
          pagination={false}
          rowKey="eventType"
          columns={[
            { dataIndex: 'eventType', title: '事件类型', width: 230 },
            {
              dataIndex: 'category',
              title: '分类',
              width: 110,
              render: value => <Tag color={categoryColor(value)}>{categoryLabel(value)}</Tag>
            },
            { dataIndex: 'priority', title: '优先级', width: 90 },
            {
              dataIndex: 'channels',
              title: '渠道策略',
              render: value =>
                Object.entries(value as Record<string, string[]>).map(([reason, channels]) => (
                  <div
                    key={reason}
                    className="mb-4px"
                  >
                    <Typography.Text type="secondary">{reason}：</Typography.Text>
                    {channels.map(channel => (
                      <Tag key={channel}>{channel}</Tag>
                    ))}
                  </div>
                ))
            }
          ]}
        />
      </Drawer>

      <Drawer
        open={reviseOpen}
        title="修订已发布消息"
        width={620}
        extra={
          <Button
            loading={reviseMutation.isPending}
            type="primary"
            onClick={() => void handleRevise()}
          >
            保存修订
          </Button>
        }
        onClose={() => setReviseOpen(false)}
      >
        <Alert
          className="mb-16px"
          showIcon
          title="分类、意图和优先级不可修改"
          description="重要信息发生变化时可选择重新提醒；普通错别字修正应保持默认的静默修订。"
          type="warning"
        />
        <Form
          form={reviseForm}
          layout="vertical"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="摘要"
            name="summary"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="正文"
            name="body"
          >
            <Input.TextArea rows={9} />
          </Form.Item>
          <Form.Item
            label="修订说明"
            name="changeNote"
            rules={[{ message: '请说明本次修改原因', required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="提醒策略"
            name="renotify"
          >
            <Select
              options={[
                { label: '静默修订，保持已读态', value: false },
                { label: '重要修改，重新提醒收件人', value: true }
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default NotificationGovernance;
