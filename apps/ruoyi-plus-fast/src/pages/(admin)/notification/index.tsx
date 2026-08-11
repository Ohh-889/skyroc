import { useAdminState } from '@skyroc/web-admin-layouts';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { showSuccessMessage } from '@skyroc/web-admin-theme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  Pagination,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import {
  fetchAudiencePreview,
  fetchNotificationDetail,
  fetchNotificationList,
  fetchNotificationStats,
  fetchRevokeImpact,
  publishNotification,
  revokeNotification,
  saveNotification
} from '@/service/api/notification';
import type {
  NotificationAudience,
  NotificationCategory,
  NotificationIntent,
  NotificationItem,
  NotificationListParams,
  NotificationSavePayload,
  NotificationStatus
} from '@/service/api/notification';

const CATEGORY_OPTIONS: Array<{ label: string; value: NotificationCategory }> = [
  { label: '全部分类', value: '' as NotificationCategory },
  { label: '任务', value: 'task' },
  { label: '公告', value: 'announcement' },
  { label: '消息', value: 'message' },
  { label: '事件', value: 'event' },
  { label: '异常', value: 'alert' },
  { label: '安全', value: 'security' }
];

const STATUS_OPTIONS: Array<{ label: string; value: NotificationStatus }> = [
  { label: '全部状态', value: '' as NotificationStatus },
  { label: '草稿', value: 'draft' },
  { label: '已排期', value: 'scheduled' },
  { label: '已发布', value: 'published' },
  { label: '已撤回', value: 'revoked' }
];

interface NotificationFormValues {
  audience: NotificationAudience;
  body?: string;
  category: NotificationCategory;
  expireTime?: string;
  intent: NotificationIntent;
  priority: string;
  summary: string;
  title: string;
}

interface NotificationEditorProps {
  /** 是否显示编辑抽屉。 */
  open: boolean;
  /** 保存公告时的提交回调。 */
  onSubmit: (values: NotificationSavePayload) => Promise<void>;
  /** 关闭编辑抽屉。 */
  onClose: () => void;
  /** 保存请求是否进行中。 */
  loading: boolean;
}

interface NotificationDetailProps {
  /** 当前查看的通知 ID。 */
  notificationId?: string;
  /** 是否显示详情抽屉。 */
  open: boolean;
  /** 关闭详情抽屉。 */
  onClose: () => void;
}

interface NotificationManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const NotificationEditor = (props: NotificationEditorProps) => {
  const { loading, onClose, onSubmit, open } = props;
  const [form] = Form.useForm<NotificationFormValues>();
  const audience = Form.useWatch('audience', form);

  function getAudienceDescription() {
    if (audience?.kind === 'all') return '全体有效用户，采用全员公告读扩散';
    if (audience?.kind === 'roles') return '按角色选择收件人';
    if (audience?.kind === 'depts') return '按部门选择收件人，可包含子部门';
    return '指定用户 ID，以逗号分隔';
  }

  async function handleFinish(values: NotificationFormValues) {
    await onSubmit({
      audience: values.audience,
      body: values.body?.trim() || null,
      category: values.category,
      expireTime: values.expireTime || null,
      intent: values.intent,
      priority: values.priority,
      summary: values.summary.trim(),
      title: values.title.trim()
    });
    form.resetFields();
  }

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex justify="flex-end" gap={8}>
          <Button disabled={loading} onClick={onClose}>
            取消
          </Button>
          <Button loading={loading} type="primary" onClick={() => form.submit()}>
            保存草稿
          </Button>
        </Flex>
      }
      open={open}
      title="新建通知公告"
      width={720}
      onClose={onClose}
    >
      <Alert
        className="mb-16px"
        description="发布前会强制校验受众数量；高优先级和安全通知建议二次确认。"
        showIcon
        type="info"
      />
      <Form<NotificationFormValues>
        form={form}
        initialValues={{
          audience: { kind: 'all' },
          category: 'announcement',
          intent: 'informational',
          priority: 'normal'
        }}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item label="标题" name="title" rules={[{ message: '请输入标题', required: true }]}>
              <Input showCount maxLength={255} placeholder="例如：系统维护通知" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="分类" name="category" rules={[{ required: true }]}>
              <Select options={CATEGORY_OPTIONS.slice(1)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="通知意图" name="intent" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: '事务型', value: 'transactional' },
                  { label: '可操作', value: 'actionable' },
                  { label: '信息型', value: 'informational' },
                  { label: '告警型', value: 'alerting' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="优先级" name="priority">
              <Radio.Group
                optionType="button"
                options={[
                  { label: '普通', value: 'normal' },
                  { label: '高', value: 'high' },
                  { label: '紧急', value: 'urgent' }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="摘要" name="summary" rules={[{ message: '请输入摘要', required: true }]}>
          <Input showCount maxLength={500} placeholder="列表中显示的一句话摘要" />
        </Form.Item>
        <Form.Item label="正文" name="body">
          <Input.TextArea placeholder="请输入正文，P0 支持纯文本或安全 Markdown" rows={7} />
        </Form.Item>
        <Divider plain>
          受众范围
        </Divider>
        <Form.Item name={['audience', 'kind']} rules={[{ required: true }]}>
          <Radio.Group
            optionType="button"
            options={[
              { label: '全体用户', value: 'all' },
              { label: '按角色', value: 'roles' },
              { label: '按部门', value: 'depts' },
              { label: '指定用户', value: 'users' }
            ]}
          />
        </Form.Item>
        <Typography.Text type="secondary">{getAudienceDescription()}</Typography.Text>
        {audience?.kind !== 'all' ? (
          <Form.Item
            className="mt-12px"
            label={audience?.kind === 'users' ? '用户 ID' : audience?.kind === 'roles' ? '角色 ID' : '部门 ID'}
            name={['audience', audience?.kind === 'users' ? 'userIds' : audience?.kind === 'roles' ? 'roleIds' : 'deptIds']}
            rules={[{ message: '至少填写一个目标', required: true }]}
          >
            <Select mode="tags" placeholder="输入 ID 后回车" />
          </Form.Item>
        ) : null}
        <Form.Item label="过期时间" name="expireTime">
          <Input placeholder="可选，例如 2026-08-31 23:59:59" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

const NotificationDetail = (props: NotificationDetailProps) => {
  const { notificationId, onClose, open } = props;
  const detailQuery = useQuery({
    enabled: open && Boolean(notificationId),
    queryFn: () => fetchNotificationDetail(notificationId as string),
    queryKey: ['notification', 'detail', notificationId]
  });
  const statsQuery = useQuery({
    enabled: open && Boolean(notificationId),
    queryFn: () => fetchNotificationStats(notificationId as string),
    queryKey: ['notification', 'stats', notificationId]
  });
  const detail = detailQuery.data;

  return (
    <Drawer destroyOnHidden open={open} title="通知详情" width={620} onClose={onClose}>
      {detailQuery.isError ? <Alert showIcon title="详情加载失败" type="error" /> : null}
      {detail ? (
        <Tabs
          items={[
            {
              key: 'content',
              label: '消息内容',
              children: (
                <Space direction="vertical" size={16} className="w-full">
                  <Flex align="center" gap={8} wrap>
                    <Tag color={categoryColor(detail.category)}>{categoryLabel(detail.category)}</Tag>
                    <Tag color={priorityColor(detail.priority)}>{detail.priority}</Tag>
                    <Tag>{statusLabel(detail.status)}</Tag>
                  </Flex>
                  <Typography.Title level={4} className="m-0">
                    {detail.title}
                  </Typography.Title>
                  <Typography.Paragraph type="secondary">{detail.summary}</Typography.Paragraph>
                  <Card size="small" className="bg-layout">
                    <Typography.Paragraph className="whitespace-pre-wrap mb-0">{detail.body || '暂无正文'}</Typography.Paragraph>
                  </Card>
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="消息 ID">{String(detail.msgId)}</Descriptions.Item>
                    <Descriptions.Item label="受众">{audienceLabel(detail.audience, detail.audienceSize)}</Descriptions.Item>
                    <Descriptions.Item label="版本">第 {detail.revision} 版</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{detail.createTime || '—'}</Descriptions.Item>
                  </Descriptions>
                </Space>
              )
            },
            {
              key: 'stats',
              label: '送达统计',
              children: statsQuery.data ? (
                <Row gutter={[16, 16]}>
                  <Col span={8}><Card><Statistic title="送达" value={statsQuery.data.delivered} /></Card></Col>
                  <Col span={8}><Card><Statistic title="已读" value={statsQuery.data.read} /></Card></Col>
                  <Col span={8}><Card><Statistic title="已处理" value={statsQuery.data.actioned} /></Card></Col>
                  <Col span={24}><Card title="渠道状态">{Object.entries(statsQuery.data.channels).map(([key, value]) => <Flex key={key} justify="space-between" className="mb-8px"><span>{key}</span><Progress percent={Math.min(100, value)} size="small" /></Flex>)}</Card></Col>
                </Row>
              ) : <Empty description="暂无统计数据" />
            }
          ]}
        />
      ) : <Empty description={detailQuery.isLoading ? '加载中…' : '选择一条通知查看详情'} />}
    </Drawer>
  );
};

const NotificationManagement = (props: NotificationManagementProps) => {
  const { initialPageSize = 10 } = props;
  const { isMobile } = useAdminState();
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<NotificationListParams>();
  const [params, setParams] = useState<NotificationListParams>({ current: 1, size: initialPageSize });
  const [editorOpen, setEditorOpen] = useState(false);
  const [detailId, setDetailId] = useState<string>();

  const listQuery = useQuery({
    placeholderData: previous => previous,
    queryFn: () => fetchNotificationList(params),
    queryKey: ['notification', 'list', params]
  });
  const saveMutation = useMutation({ mutationFn: saveNotification });
  const publishMutation = useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt?: null | string }) => publishNotification(id, { scheduledAt })
  });
  const revokeMutation = useMutation({ mutationFn: ({ id, reason }: { id: string; reason: string }) => revokeNotification(id, reason) });
  const records = listQuery.data?.records || [];

  function handleSearch(values: NotificationListParams) {
    setParams({ current: 1, size: params.size, category: values.category, status: values.status, title: values.title?.trim() || undefined });
  }

  async function handleSave(values: NotificationSavePayload) {
    await saveMutation.mutateAsync(values);
    setEditorOpen(false);
    await queryClient.invalidateQueries({ queryKey: ['notification', 'list'] });
    showSuccessMessage('通知草稿已保存');
  }

  async function handlePublish(item: NotificationItem) {
    const preview = await fetchAudiencePreview(String(item.msgId));
    const audienceText = preview.count < 0 ? '全体用户' : `${preview.count} 人`;
    modal.confirm({
      content: `本次预计发送给 ${audienceText}。发布前会按当前受众预览做最终校验，确认立即发布这条通知吗？`,
      okText: '确认发布',
      title: `发布“${item.title}”？`,
      onOk: async () => {
        await publishMutation.mutateAsync({ id: String(item.msgId) });
        await queryClient.invalidateQueries({ queryKey: ['notification', 'list'] });
        showSuccessMessage('通知已发布');
      }
    });
  }

  async function handleRevoke(item: NotificationItem) {
    const impact = await fetchRevokeImpact(String(item.msgId));
    const sentEmail = impact.alreadySent.email || 0;
    modal.confirm({
      content: `撤回后将取消 ${impact.cancelledDeliveries} 条未发送投递；已发送的 ${sentEmail} 封邮件无法撤回。`,
      okButtonProps: { danger: true },
      okText: '确认撤回',
      title: `撤回“${item.title}”？`,
      onOk: async () => {
        await revokeMutation.mutateAsync({ id: String(item.msgId), reason: '管理员撤回' });
        await queryClient.invalidateQueries({ queryKey: ['notification', 'list'] });
        showSuccessMessage('通知已撤回');
      }
    });
  }

  function createColumns(): ColumnsType<NotificationItem> {
    return [
      {
        dataIndex: 'title',
        fixed: 'left',
        render: (value: string, record) => (
          <Flex align="center" gap={10}>
            <span className="size-36px grid shrink-0 place-items-center rounded-10px bg-primary-50 text-primary">
              <SvgIcon icon={record.priority === 'urgent' ? 'ph:warning' : 'ph:bell-ringing'} />
            </span>
            <div className="min-w-0">
              <Typography.Text strong className="block truncate max-w-320px">{value}</Typography.Text>
              <Typography.Text type="secondary" className="block max-w-360px truncate text-12px">{record.summary}</Typography.Text>
            </div>
          </Flex>
        ),
        title: '通知标题',
        width: 380
      },
      { dataIndex: 'category', render: value => <Tag color={categoryColor(value)}>{categoryLabel(value)}</Tag>, title: '分类', width: 110 },
      { dataIndex: 'audienceSize', render: value => value === null ? '全员公告' : `${value} 人`, title: '受众', width: 110 },
      { dataIndex: 'publishTime', render: value => value || '—', title: '发布时间', width: 180 },
      { dataIndex: 'status', render: value => <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>, title: '状态', width: 110 },
      {
        fixed: 'right',
        render: (_value, record) => (
          <Space size={4}>
            <Tooltip title="查看消息内容和送达统计"><Button size="small" onClick={() => setDetailId(String(record.msgId))}>详情</Button></Tooltip>
            {record.status === 'draft' ? <Button size="small" type="link" onClick={() => void handlePublish(record)}>发布</Button> : null}
            {record.status === 'published' ? <Button danger size="small" type="link" onClick={() => void handleRevoke(record)}>撤回</Button> : null}
          </Space>
        ),
        title: '操作',
        width: 160
      }
    ];
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-auto">
      <Card className="card-wrapper" bordered={false}>
        <Flex align="center" justify="space-between" wrap gap={16}>
          <div><Typography.Title level={4} className="m-0">通知中心</Typography.Title><Typography.Text type="secondary">管理公告发布、受众预览与通知生命周期</Typography.Text></div>
          <Button icon={<SvgIcon icon="ph:plus" />} type="primary" onClick={() => setEditorOpen(true)}>新建通知</Button>
        </Flex>
      </Card>
      <Card className="card-wrapper" bordered={false}>
        <Form form={form} layout={isMobile ? 'vertical' : 'inline'} onFinish={handleSearch}>
          <Form.Item label="标题" name="title"><Input allowClear placeholder="搜索通知标题" /></Form.Item>
          <Form.Item label="分类" name="category"><Select allowClear options={CATEGORY_OPTIONS.slice(1)} placeholder="全部分类" className="w-160px" /></Form.Item>
          <Form.Item label="状态" name="status"><Select allowClear options={STATUS_OPTIONS.slice(1)} placeholder="全部状态" className="w-140px" /></Form.Item>
          <Form.Item><Space><Button onClick={() => { form.resetFields(); setParams({ current: 1, size: params.size }); }}>重置</Button><Button htmlType="submit" type="primary">查询</Button></Space></Form.Item>
        </Form>
      </Card>
      <Card className="card-wrapper min-h-0 flex-1" bordered={false} title={<Flex align="center" gap={8}><span>通知列表</span><Tag color="blue">{listQuery.data?.total || 0} 条</Tag></Flex>} extra={<Button loading={listQuery.isFetching} onClick={() => void listQuery.refetch()}>刷新</Button>}>
        {listQuery.isError ? <Alert action={<Button onClick={() => void listQuery.refetch()}>重试</Button>} className="mb-12px" showIcon title="通知列表加载失败" type="error" /> : null}
        <Table<NotificationItem>
          columns={createColumns()}
          dataSource={records}
          loading={listQuery.isLoading}
          locale={{ emptyText: <Empty description={params.title || params.category || params.status ? '没有符合条件的通知' : '当前还没有通知'} /> }}
          pagination={false}
          rowKey={record => String(record.msgId)}
          scroll={{ x: 1100 }}
          size="middle"
        />
        <Flex justify="flex-end" className="mt-16px"><Pagination current={params.current} pageSize={params.size} showSizeChanger={!isMobile} showTotal={total => `共 ${total} 条`} total={listQuery.data?.total || 0} onChange={(current, size) => setParams({ ...params, current, size })} /></Flex>
      </Card>
      <NotificationEditor loading={saveMutation.isPending} open={editorOpen} onClose={() => setEditorOpen(false)} onSubmit={handleSave} />
      <NotificationDetail notificationId={detailId} open={Boolean(detailId)} onClose={() => setDetailId(undefined)} />
    </div>
  );
};

function categoryLabel(value: string) { return { alert: '异常', announcement: '公告', event: '事件', message: '消息', security: '安全', task: '任务' }[value] || value; }
function categoryColor(value: string) { return { alert: 'red', announcement: 'gold', event: 'blue', message: 'cyan', security: 'volcano', task: 'purple' }[value] || 'default'; }
function priorityColor(value: string) { return value === 'urgent' ? 'red' : value === 'high' ? 'orange' : 'default'; }
function statusLabel(value: string) { return { draft: '草稿', published: '已发布', revoked: '已撤回', scheduled: '已排期' }[value] || value; }
function statusColor(value: string) { return value === 'published' ? 'success' : value === 'revoked' ? 'error' : value === 'scheduled' ? 'processing' : 'default'; }
function audienceLabel(audience: NotificationAudience, size: number | null) { if (audience.kind === 'all') return '全体用户'; return `${audience.kind} · ${size ?? 0} 人`; }

export const Route = createFileRoute('/(admin)/notification/')({
  component: NotificationManagement,
  staticData: { keepAlive: true, menu: { icon: 'ph:bell-ringing', order: 5 }, title: '通知中心' }
});
