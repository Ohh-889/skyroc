import { createFileRoute } from '@tanstack/react-router';
import { Alert, Button, Card, Flex, Switch, Table, Tag, Typography } from 'antd';

const rows = [
  { key: 'transactional', name: '事务型', desc: '审批、任务、状态变化', realtime: true, email: true },
  { key: 'actionable', name: '可操作', desc: '需要你完成某项操作', realtime: true, email: false },
  { key: 'informational', name: '信息型', desc: '公告、动态、摘要', realtime: false, email: 'digest' },
  { key: 'alerting', name: '告警型', desc: '异常、安全、紧急事件', realtime: true, email: true }
];

const NotificationSettingsPage = () => (
  <div className="h-full overflow-auto p-16px">
    <Flex align="center" justify="space-between" className="mb-16px"><div><Typography.Title level={3} className="m-0">通知设置</Typography.Title><Typography.Text type="secondary">服务端返回完整偏好矩阵，锁定项不可关闭</Typography.Text></div><Button type="primary">保存设置</Button></Flex>
    <Alert className="mb-16px" showIcon message="站内通知始终开启" description="站内通知是跨设备同步的唯一真相；安全和紧急通知的关键渠道由系统策略锁定。" type="info" />
    <Card bordered={false} className="card-wrapper"><Table pagination={false} dataSource={rows} columns={[{ title: '通知意图', dataIndex: 'name', render: (v, r) => <><strong>{v}</strong><div className="text-12px text-tertiary">{r.desc}</div></> }, { title: '站内', render: () => <Switch checked disabled />, align: 'center' }, { title: '实时信号', dataIndex: 'realtime', render: v => <Switch defaultChecked={v} />, align: 'center' }, { title: '邮件', dataIndex: 'email', render: v => v === 'digest' ? <Tag color="gold">每日摘要</Tag> : <Switch defaultChecked={v} />, align: 'center' }]} /></Card>
  </div>
);

export const Route = createFileRoute('/(admin)/notification/settings/')({ component: NotificationSettingsPage, staticData: { title: '通知设置' } });
