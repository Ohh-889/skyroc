import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Descriptions, Divider, Flex, Space, Tag, Typography } from 'antd';

const NotificationDetailPage = () => (
  <div className="h-full overflow-auto p-16px">
    <Flex align="center" justify="space-between" className="mb-16px"><div><Typography.Title level={3} className="m-0">通知详情</Typography.Title><Typography.Text type="secondary">查看完整正文与业务关联</Typography.Text></div><Space><Button>标记未读</Button><Button type="primary">去处理</Button></Space></Flex>
    <Card bordered={false} className="card-wrapper">
      <Flex gap={8} className="mb-12px"><Tag color="purple">待办</Tag><Tag color="red">高优先级</Tag><Tag>未读 · 待处理</Tag></Flex>
      <Typography.Title level={2}>审批待办：Q3 预算调整</Typography.Title>
      <Typography.Paragraph type="secondary">财务部提交了一项预算调整申请，等待你审批后才能继续执行。</Typography.Paragraph>
      <Divider />
      <Typography.Paragraph className="whitespace-pre-wrap text-15px leading-2">预算申请单 BDG-2026-0812 已提交至你的审批节点。{`\n\n`}本次调整涉及华东区域第三季度市场费用，申请金额为 ¥280,000，预计影响 4 个成本中心。{`\n\n`}请在 2026 年 8 月 10 日 18:00 前完成处理，逾期后将自动退回申请人。</Typography.Paragraph>
      <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small"><Descriptions.Item label="来源模块">预算中心</Descriptions.Item><Descriptions.Item label="发生时间">2026-08-08 09:42</Descriptions.Item><Descriptions.Item label="关联对象">BDG-2026-0812</Descriptions.Item><Descriptions.Item label="通知编号">79600019719872512</Descriptions.Item></Descriptions>
    </Card>
  </div>
);

export const Route = createFileRoute('/(admin)/notification/detail/')({ component: NotificationDetailPage, staticData: { title: '通知详情' } });
