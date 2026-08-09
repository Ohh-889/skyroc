import { SvgIcon } from '@skyroc/web-ui-compose';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, Card, Flex, Segmented, Typography } from 'antd';
import { useState } from 'react';

import NotificationGovernance from './modules/NotificationGovernance';
import NotificationInbox from './modules/NotificationInbox';
import NotificationPublisher from './modules/NotificationPublisher';
import NotificationSettings from './modules/NotificationSettings';

type NotificationWorkspaceView = 'governance' | 'inbox' | 'publish' | 'settings';

interface NotificationWorkspaceProps {
  /** 首次进入验收页时展示的页面。 */
  initialView?: NotificationWorkspaceView;
}

const VIEW_OPTIONS: Array<{ icon: React.ReactNode; label: string; value: NotificationWorkspaceView }> = [
  { icon: <SvgIcon icon="ph:inbox" />, label: '通知中心', value: 'inbox' },
  { icon: <SvgIcon icon="ph:paper-plane-tilt" />, label: '发布工作台', value: 'publish' },
  { icon: <SvgIcon icon="ph:shield-check" />, label: '消息治理', value: 'governance' },
  { icon: <SvgIcon icon="ph:sliders-horizontal" />, label: '通知设置', value: 'settings' }
];

const NotificationWorkspace = (props: NotificationWorkspaceProps) => {
  const { initialView = 'inbox' } = props;

  const [view, setView] = useState<NotificationWorkspaceView>(initialView);

  return (
    <div className="h-full min-h-600px overflow-auto p-16px">
      <div className="mx-auto max-w-1680px flex flex-col gap-16px">
        <Card
          bordered={false}
          className="card-wrapper"
        >
          <Flex
            align="center"
            justify="space-between"
            gap={16}
            wrap
          >
            <div>
              <Flex
                align="center"
                gap={9}
              >
                <span className="size-38px grid place-items-center rounded-11px bg-primary text-white">
                  <SvgIcon icon="ph:bell-ringing-fill" />
                </span>
                <div>
                  <Typography.Title
                    className="m-0"
                    level={4}
                  >
                    通知模块设计验收台
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    4 个主页面 · 详情留在当前任务上下文 · 已连接真实后端接口
                  </Typography.Text>
                </div>
              </Flex>
            </div>
            <Segmented
              options={VIEW_OPTIONS}
              value={view}
              onChange={value => setView(value as NotificationWorkspaceView)}
            />
          </Flex>
        </Card>
        <Alert
          banner
          closable
          showIcon
          title="此页面位于 /test，用于集中查看通知模块完整交互；接口操作会作用于当前登录环境的真实数据。"
          type="warning"
        />
        <NotificationInbox active={view === 'inbox'} />
        <NotificationPublisher active={view === 'publish'} />
        <NotificationGovernance active={view === 'governance'} />
        <NotificationSettings active={view === 'settings'} />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/(admin)/test/')({
  component: NotificationWorkspace,
  staticData: { keepAlive: true, title: '通知模块设计验收' }
});
