import { showSuccessMessage } from '@skyroc/web-admin-theme';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Card, Empty, Flex, Select, Space, Table, Tag, Typography } from 'antd';

import { fetchNotificationPreference, updateNotificationPreference } from '@/service/api/notification';
import type {
  NotificationChannel,
  NotificationIntent,
  NotificationPreferenceItem,
  NotificationPreferenceState
} from '@/service/api/notification';

import { INTENT_OPTIONS, intentLabel, preferenceStateLabel } from './notification-ui';

interface NotificationSettingsProps {
  /** 页面在模块导航中被激活时是否显示。 */
  active: boolean;
}

interface PreferenceRow {
  /** 通知意图。 */
  intent: NotificationIntent;
  /** 后端返回的各渠道偏好。 */
  preferences: Partial<Record<NotificationChannel, NotificationPreferenceItem>>;
}

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  email: '邮件',
  inapp: '站内',
  sms: '短信'
};

/** 当前用户的外部通知渠道偏好矩阵。 */
const NotificationSettings = (props: NotificationSettingsProps) => {
  const { active } = props;

  const queryClient = useQueryClient();
  const preferenceQuery = useQuery({
    enabled: active,
    queryFn: fetchNotificationPreference,
    queryKey: ['notification-test', 'preference']
  });
  const updateMutation = useMutation({
    mutationFn: updateNotificationPreference,
    onSuccess: response => {
      queryClient.setQueryData(['notification-test', 'preference'], response);
      showSuccessMessage('通知偏好已保存');
    }
  });
  const channels = Array.from(new Set((preferenceQuery.data?.items || []).map(item => item.channel)));
  const rows: PreferenceRow[] = INTENT_OPTIONS.map(option => ({
    intent: option.value,
    preferences: Object.fromEntries(
      (preferenceQuery.data?.items || []).filter(item => item.intent === option.value).map(item => [item.channel, item])
    )
  }));

  function handleChange(item: NotificationPreferenceItem, state: NotificationPreferenceState) {
    updateMutation.mutate({ channel: item.channel, intent: item.intent, state });
  }

  function renderPreference(item?: NotificationPreferenceItem) {
    if (!item) return <Typography.Text type="secondary">—</Typography.Text>;
    return (
      <Space
        direction="vertical"
        size={3}
      >
        <Select
          className="w-130px"
          disabled={item.locked}
          loading={
            updateMutation.isPending &&
            updateMutation.variables?.channel === item.channel &&
            updateMutation.variables.intent === item.intent
          }
          options={(['on', 'digest', 'off'] as NotificationPreferenceState[]).map(value => ({
            label: preferenceStateLabel(value),
            value
          }))}
          value={item.state}
          onChange={value => handleChange(item, value)}
        />
        {item.locked ? (
          <Tag
            className="m-0"
            color="gold"
            icon={<SvgIcon icon="ph:lock-key" />}
          >
            系统策略锁定
          </Tag>
        ) : null}
      </Space>
    );
  }

  return (
    <div className={active ? 'flex flex-col gap-16px' : 'hidden'}>
      <div>
        <Typography.Title
          className="m-0"
          level={3}
        >
          通知设置
        </Typography.Title>
        <Typography.Text type="secondary">
          按通知意图控制外部渠道；每次修改立即保存，锁定规则由服务端决定。
        </Typography.Text>
      </div>
      <Alert
        showIcon
        title="站内通知始终开启"
        description="站内收件箱是跨设备同步与已读状态的唯一真相，因此不会出现在可关闭的偏好矩阵里。"
        type="info"
      />
      <Card
        bordered={false}
        className="card-wrapper"
        title="渠道偏好矩阵"
      >
        {preferenceQuery.isError ? (
          <Alert
            showIcon
            title="偏好设置加载失败"
            type="error"
          />
        ) : (
          <Table<PreferenceRow>
            dataSource={rows}
            loading={preferenceQuery.isLoading}
            locale={{ emptyText: <Empty description="服务端暂未配置可选渠道" /> }}
            pagination={false}
            rowKey="intent"
            scroll={{ x: 720 }}
            columns={[
              {
                dataIndex: 'intent',
                fixed: 'left',
                title: '通知意图',
                width: 210,
                render: value => (
                  <div>
                    <Typography.Text strong>{intentLabel(value)}</Typography.Text>
                    <Typography.Paragraph
                      className="mb-0 text-12px"
                      type="secondary"
                    >
                      {
                        {
                          actionable: '需要你完成一项业务操作',
                          alerting: '异常、安全和紧急事件',
                          informational: '公告、动态和低频信息',
                          transactional: '审批、任务和状态变化'
                        }[value as NotificationIntent]
                      }
                    </Typography.Paragraph>
                  </div>
                )
              },
              {
                title: '站内',
                width: 140,
                align: 'center',
                render: () => (
                  <Tag
                    color="success"
                    icon={<SvgIcon icon="ph:check-circle" />}
                  >
                    始终开启
                  </Tag>
                )
              },
              ...channels.map(channel => ({
                align: 'center' as const,
                key: channel,
                title: CHANNEL_LABELS[channel],
                width: 170,
                render: (_value: unknown, row: PreferenceRow) => renderPreference(row.preferences[channel])
              }))
            ]}
          />
        )}
      </Card>
      <div className="grid grid-cols-1 gap-12px md:grid-cols-3">
        <Card
          bordered={false}
          className="card-wrapper"
        >
          <Flex gap={10}>
            <span className="size-38px grid place-items-center rounded-10px bg-primary-50 text-primary">
              <SvgIcon icon="ph:devices" />
            </span>
            <div>
              <Typography.Text strong>跨设备一致</Typography.Text>
              <Typography.Paragraph
                className="mb-0 text-12px"
                type="secondary"
              >
                设置保存在服务端，所有浏览器与设备统一生效。
              </Typography.Paragraph>
            </div>
          </Flex>
        </Card>
        <Card
          bordered={false}
          className="card-wrapper"
        >
          <Flex gap={10}>
            <span className="size-38px grid place-items-center rounded-10px bg-warning-50 text-warning">
              <SvgIcon icon="ph:shield-check" />
            </span>
            <div>
              <Typography.Text strong>安全策略优先</Typography.Text>
              <Typography.Paragraph
                className="mb-0 text-12px"
                type="secondary"
              >
                关键告警渠道不可关闭，前后端会同时校验。
              </Typography.Paragraph>
            </div>
          </Flex>
        </Card>
        <Card
          bordered={false}
          className="card-wrapper"
        >
          <Flex gap={10}>
            <span className="size-38px grid place-items-center rounded-10px bg-success-50 text-success">
              <SvgIcon icon="ph:calendar-dots" />
            </span>
            <div>
              <Typography.Text strong>支持摘要</Typography.Text>
              <Typography.Paragraph
                className="mb-0 text-12px"
                type="secondary"
              >
                低频内容可以聚合为每日摘要，减少即时打扰。
              </Typography.Paragraph>
            </div>
          </Flex>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
