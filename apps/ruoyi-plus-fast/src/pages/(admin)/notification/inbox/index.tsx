import { createFileRoute } from '@tanstack/react-router';
import { Badge, Button, Card, Empty, Flex, List, Segmented, Space, Tag, Typography } from 'antd';

const items = [
  { category: '待办', color: 'purple', title: '审批待办：Q3 预算调整', summary: '财务部提交了一项预算调整申请，等待你审批。', time: '今天 09:42', unread: true },
  { category: '安全', color: 'red', title: '角色权限发生变化', summary: '你的报表查看权限已由管理员更新。', time: '昨天 17:45', unread: true },
  { category: '公告', color: 'gold', title: '系统维护通知', summary: '平台将于今晚 22:00 进行例行维护。', time: '今天 09:12', unread: false },
  { category: '消息', color: 'blue', title: '数据同步已完成', summary: '客户主数据已完成全量同步，共更新 2,438 条记录。', time: '8 月 7 日 20:16', unread: false }
];

const NotificationInboxPage = () => (
  <div className="h-full overflow-auto p-16px">
    <Flex align="center" justify="space-between" className="mb-16px">
      <div><Typography.Title level={3} className="m-0">通知中心</Typography.Title><Typography.Text type="secondary">未读会话 3 · 未读消息 14 · 待处理 2</Typography.Text></div>
      <Space><Button>全部已读</Button><Button type="primary">刷新</Button></Space>
    </Flex>
    <Card bordered={false} className="card-wrapper">
      <Flex align="center" justify="space-between" className="mb-12px"><Segmented defaultValue="全部" options={['全部', '待办', '公告', '消息', '异常', '安全']} /><Badge count={3} /></Flex>
      <List dataSource={items} locale={{ emptyText: <Empty description="暂无通知" /> }} renderItem={item => <List.Item actions={[<Button key="open" type={item.unread ? 'primary' : 'link'}>查看详情</Button>]}><List.Item.Meta avatar={<Badge dot={item.unread}><span className="size-36px grid place-items-center rounded-10px bg-primary-50 text-primary">◉</span></Badge>} title={<Flex gap={8}><span>{item.title}</span><Tag color={item.color}>{item.category}</Tag></Flex>} description={<><div>{item.summary}</div><Typography.Text type="secondary" className="text-12px">{item.time}{item.unread ? ' · 未读' : ' · 已读'}</Typography.Text></>} /></List.Item>} />
    </Card>
  </div>
);

export const Route = createFileRoute('/(admin)/notification/inbox/')({ component: NotificationInboxPage, staticData: { title: '通知中心' } });
