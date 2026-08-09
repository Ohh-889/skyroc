/* eslint-disable no-nested-ternary, no-void, unicorn/consistent-function-scoping */
import { showSuccessMessage } from '@skyroc/web-admin-theme';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  App,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography
} from 'antd';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';

import {
  fetchAudiencePreview,
  publishNotification,
  saveNotification,
  updateNotification
} from '@/service/api/notification';
import type { NotificationAudience, NotificationItem, NotificationSavePayload } from '@/service/api/notification';

import { CATEGORY_OPTIONS, INTENT_OPTIONS } from './notification-ui';

interface NotificationPublisherProps {
  /** 页面在模块导航中被激活时是否显示。 */
  active: boolean;
}

interface NotificationPublishFormValues {
  /** 通知受众类型与目标 ID。 */
  audience: NotificationAudience;
  /** 完整正文内容。 */
  body?: string;
  /** 业务分类。 */
  category: NotificationSavePayload['category'];
  /** 同一业务对象消息的折叠键。 */
  collapseKey?: string;
  /** 消息过期时间。 */
  expireTime?: Dayjs;
  /** 通知意图。 */
  intent: NotificationSavePayload['intent'];
  /** 投递优先级。 */
  priority: string;
  /** 列表摘要。 */
  summary: string;
  /** 消息标题。 */
  title: string;
}

/** 通知草稿编辑与安全发布工作台。 */
const NotificationPublisher = (props: NotificationPublisherProps) => {
  const { active } = props;

  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<NotificationPublishFormValues>();
  const [draft, setDraft] = useState<NotificationItem>();
  const [publishMode, setPublishMode] = useState<'now' | 'scheduled'>('now');
  const [scheduledAt, setScheduledAt] = useState<Dayjs | null>(null);
  const audienceKind = Form.useWatch(['audience', 'kind'], form);
  const previewTitle = Form.useWatch('title', form);
  const previewSummary = Form.useWatch('summary', form);
  const saveMutation = useMutation({
    mutationFn: async (payload: NotificationSavePayload) =>
      draft ? updateNotification(draft.msgId, payload) : saveNotification(payload),
    onSuccess: item => {
      setDraft(item);
      showSuccessMessage('草稿已保存');
    }
  });
  const publishMutation = useMutation({
    mutationFn: (payload: { id: string; scheduledAt: null | string }) =>
      publishNotification(payload.id, { scheduledAt: payload.scheduledAt }),
    onSuccess: async item => {
      setDraft(item);
      await queryClient.invalidateQueries({ queryKey: ['notification-test', 'management'] });
      showSuccessMessage(publishMode === 'scheduled' ? '通知已排期' : '通知已发布');
    }
  });
  const previewQuery = useQuery({
    enabled: active && Boolean(draft?.msgId),
    queryFn: () => fetchAudiencePreview(draft?.msgId as string),
    queryKey: ['notification-test', 'audience-preview', draft?.msgId]
  });

  function normalizeIds(values?: number[]) {
    return (values || []).map(Number).filter(Boolean);
  }

  function createPayload(values: NotificationPublishFormValues): NotificationSavePayload {
    return {
      audience: {
        deptIds: normalizeIds(values.audience.deptIds),
        includeChildren: values.audience.includeChildren ?? true,
        kind: values.audience.kind,
        roleIds: normalizeIds(values.audience.roleIds),
        userIds: normalizeIds(values.audience.userIds)
      },
      body: values.body?.trim() || null,
      category: values.category,
      collapseKey: values.collapseKey?.trim() || null,
      expireTime: values.expireTime?.toISOString() || null,
      intent: values.intent,
      priority: values.priority,
      summary: values.summary.trim(),
      title: values.title.trim()
    };
  }

  async function handleSave() {
    const values = await form.validateFields();
    return saveMutation.mutateAsync(createPayload(values));
  }

  async function handlePublish() {
    const savedDraft = await handleSave();
    if (publishMode === 'scheduled' && !scheduledAt) {
      modal.warning({ content: '请选择定时发布时间。', title: '缺少发布时间' });
      return;
    }
    const preview = await fetchAudiencePreview(savedDraft.msgId);
    const audienceText = preview.count < 0 ? '全部有效用户' : `${preview.count} 位用户`;
    modal.confirm({
      content:
        publishMode === 'scheduled' && scheduledAt
          ? `预计发送给 ${audienceText}，将在 ${scheduledAt.format('YYYY-MM-DD HH:mm')} 发布。`
          : `预计立即发送给 ${audienceText}。发布后内容只能通过修订流程修改。`,
      okButtonProps: { disabled: preview.exceedsLimit },
      okText: publishMode === 'scheduled' ? '确认排期' : '确认发布',
      title: '确认受众与发布时间',
      onOk: () =>
        publishMutation.mutateAsync({
          id: savedDraft.msgId,
          scheduledAt: publishMode === 'scheduled' ? scheduledAt?.toISOString() || null : null
        })
    });
  }

  function handleNewDraft() {
    form.resetFields();
    setDraft(undefined);
    setPublishMode('now');
    setScheduledAt(null);
  }

  function renderAudienceTargets() {
    if (!audienceKind || audienceKind === 'all') return null;
    const name = audienceKind === 'users' ? 'userIds' : audienceKind === 'roles' ? 'roleIds' : 'deptIds';
    const label = audienceKind === 'users' ? '用户 ID' : audienceKind === 'roles' ? '角色 ID' : '部门 ID';
    return (
      <Form.Item
        label={label}
        name={['audience', name]}
        rules={[{ message: `请至少输入一个${label}`, required: true }]}
      >
        <Select
          mode="tags"
          placeholder="输入 ID 后回车，可添加多个"
          tokenSeparators={[',', '，']}
        />
      </Form.Item>
    );
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
            发布工作台
          </Typography.Title>
          <Typography.Text type="secondary">先保存草稿，再基于服务端受众预览安全发布或定时排期。</Typography.Text>
        </div>
        <Space>
          <Button onClick={handleNewDraft}>新建草稿</Button>
          <Button
            loading={saveMutation.isPending}
            onClick={() => void handleSave()}
          >
            保存草稿
          </Button>
          <Button
            icon={<SvgIcon icon="ph:paper-plane-tilt" />}
            loading={publishMutation.isPending}
            type="primary"
            onClick={() => void handlePublish()}
          >
            预览并发布
          </Button>
        </Space>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          xl={16}
        >
          <Card
            bordered={false}
            className="card-wrapper"
            title={
              <Flex
                align="center"
                gap={8}
              >
                <span>通知内容</span>
                {draft ? <Tag color="blue">草稿 #{draft.msgId}</Tag> : <Tag>未保存</Tag>}
              </Flex>
            }
          >
            <Form<NotificationPublishFormValues>
              form={form}
              initialValues={{
                audience: { includeChildren: true, kind: 'all' },
                category: 'announcement',
                intent: 'informational',
                priority: 'normal'
              }}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col
                  xs={24}
                  md={16}
                >
                  <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ message: '请输入通知标题', required: true }]}
                  >
                    <Input
                      showCount
                      maxLength={255}
                      placeholder="例如：系统维护通知"
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  md={8}
                >
                  <Form.Item
                    label="分类"
                    name="category"
                    rules={[{ required: true }]}
                  >
                    <Select options={CATEGORY_OPTIONS.map(item => ({ label: item.label, value: item.value }))} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col
                  xs={24}
                  md={12}
                >
                  <Form.Item
                    label="通知意图"
                    name="intent"
                    rules={[{ required: true }]}
                  >
                    <Select options={INTENT_OPTIONS} />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  md={12}
                >
                  <Form.Item
                    label="优先级"
                    name="priority"
                    rules={[{ required: true }]}
                  >
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
              <Form.Item
                label="摘要"
                name="summary"
                rules={[{ message: '请输入列表摘要', required: true }]}
              >
                <Input
                  showCount
                  maxLength={500}
                  placeholder="列表中展示的一句话摘要"
                />
              </Form.Item>
              <Form.Item
                label="正文"
                name="body"
              >
                <Input.TextArea
                  showCount
                  maxLength={20_000}
                  placeholder="请输入完整正文，当前接口支持纯文本"
                  rows={10}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col
                  xs={24}
                  md={12}
                >
                  <Form.Item
                    label="折叠键"
                    name="collapseKey"
                    tooltip="同一业务对象的多条通知可用相同键聚合"
                  >
                    <Input placeholder="可选，例如 order:20260809" />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  md={12}
                >
                  <Form.Item
                    label="过期时间"
                    name="expireTime"
                  >
                    <DatePicker
                      className="w-full"
                      showTime
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col
          xs={24}
          xl={8}
        >
          <Space
            className="w-full"
            direction="vertical"
            size={16}
          >
            <Card
              bordered={false}
              className="card-wrapper"
              title="受众范围"
            >
              <Form
                form={form}
                layout="vertical"
              >
                <Form.Item name={['audience', 'kind']}>
                  <Radio.Group
                    className="grid grid-cols-2 gap-8px"
                    optionType="button"
                    options={[
                      { label: '全体用户', value: 'all' },
                      { label: '按角色', value: 'roles' },
                      { label: '按部门', value: 'depts' },
                      { label: '指定用户', value: 'users' }
                    ]}
                  />
                </Form.Item>
                {renderAudienceTargets()}
                {audienceKind === 'depts' ? (
                  <Form.Item
                    name={['audience', 'includeChildren']}
                    valuePropName="checked"
                  >
                    <Checkbox>包含子部门</Checkbox>
                  </Form.Item>
                ) : null}
              </Form>
              <Divider />
              <Flex
                align="end"
                justify="space-between"
              >
                <Statistic
                  title="服务端预览"
                  value={previewQuery.data?.count === -1 ? '全部用户' : (previewQuery.data?.count ?? '保存后可见')}
                />
                <Button
                  disabled={!draft}
                  loading={previewQuery.isFetching}
                  size="small"
                  onClick={() => void previewQuery.refetch()}
                >
                  重新校验
                </Button>
              </Flex>
              {previewQuery.data?.exceedsLimit ? (
                <Alert
                  className="mt-12px"
                  showIcon
                  title={`受众超过 ${previewQuery.data.limit} 人上限，请改用全员公告`}
                  type="error"
                />
              ) : null}
            </Card>
            <Card
              bordered={false}
              className="card-wrapper"
              title="发布方式"
            >
              <Radio.Group
                className="mb-12px"
                value={publishMode}
                options={[
                  { label: '立即发布', value: 'now' },
                  { label: '定时发布', value: 'scheduled' }
                ]}
                onChange={event => setPublishMode(event.target.value)}
              />
              <DatePicker
                className="w-full"
                disabled={publishMode !== 'scheduled'}
                showTime
                value={scheduledAt}
                placeholder="选择发布时间"
                onChange={setScheduledAt}
              />
            </Card>
            <Alert
              showIcon
              title="发布保护"
              description="受众数量由后端在发布前重新计算；已发布消息不允许直接修改分类、意图和优先级。"
              type="warning"
            />
            <Card
              bordered={false}
              className="card-wrapper"
              title="预计视觉"
            >
              <Flex
                align="center"
                gap={10}
              >
                <span className="size-40px grid place-items-center rounded-10px bg-primary-1 text-primary">
                  <SvgIcon icon="ph:bell-ringing" />
                </span>
                <div>
                  <Typography.Text strong>{previewTitle || '通知标题预览'}</Typography.Text>
                  <Typography.Paragraph
                    className="mb-0 line-clamp-2 text-12px"
                    type="secondary"
                  >
                    {previewSummary || '摘要将显示在通知中心列表中。'}
                  </Typography.Paragraph>
                </div>
              </Flex>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationPublisher;
