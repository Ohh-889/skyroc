import { SvgIcon } from '@skyroc/web-ui-compose';
import { Alert, Badge, Button, Card, Descriptions, Drawer, Flex, Spin, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useClientDetailQuery } from '@/service/api/system-client';
import type { ClientId } from '@/service/api/system-client';
import { formatClientDuration, getClientOptionLabel } from './client-utils';
import type { ClientOption } from './client-utils';

interface ClientDetailDrawerProps {
  /** 当前查看的客户端主键。 */
  clientRecordId?: ClientId;
  /** 设备类型文案选项。 */
  deviceOptions: ClientOption[];
  /** 授权方式文案选项。 */
  grantOptions: ClientOption[];
  /** 关闭详情抽屉。 */
  onClose: () => void;
  /** 编辑当前客户端。 */
  onEdit: () => void;
  /** 抽屉是否打开。 */
  open: boolean;
}

const ClientDetailDrawer = (props: ClientDetailDrawerProps) => {
  const { clientRecordId, deviceOptions, grantOptions, onClose, onEdit, open } = props;
  const [secretVisible, setSecretVisible] = useState(false);
  const detailQuery = useClientDetailQuery(clientRecordId, open);
  const client = detailQuery.data;

  useEffect(() => {
    if (!open) setSecretVisible(false);
  }, [open]);

  useEffect(() => {
    if (!secretVisible) return;
    const timer = window.setTimeout(() => setSecretVisible(false), 10000);
    return () => window.clearTimeout(timer);
  }, [secretVisible]);

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex
          gap={8}
          justify="flex-end"
        >
          <Button onClick={onClose}>关闭</Button>
          <Button
            disabled={!client}
            type="primary"
            onClick={onEdit}
          >
            编辑客户端
          </Button>
        </Flex>
      }
      open={open}
      size={620}
      title="客户端详情"
      onClose={onClose}
    >
      {detailQuery.isError ? (
        <Alert
          action={<Button onClick={() => detailQuery.refetch()}>重试</Button>}
          className="mb-16px"
          showIcon
          title="客户端详情加载失败"
          type="error"
        />
      ) : null}
      <Spin spinning={detailQuery.isLoading}>
        {client ? (
          <div className="grid gap-16px">
            <Flex
              align="center"
              gap={12}
            >
              <span className="size-48px grid place-items-center rounded-8px bg-primary-1 text-18px text-primary font-700">
                <SvgIcon icon="ph:devices" />
              </span>
              <div>
                <Typography.Title
                  className="mb-2px!"
                  level={4}
                >
                  {client.clientKey || '未命名客户端'}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {getClientOptionLabel(deviceOptions, client.deviceType)}
                </Typography.Text>
              </div>
              <Badge
                className="ml-auto"
                status={client.status === '0' ? 'success' : 'error'}
                text={client.status === '0' ? '正常' : '停用'}
              />
            </Flex>
            <Card
              size="small"
              title="基本标识"
            >
              <Descriptions
                column={1}
                items={[
                  {
                    children: <Typography.Text copyable>{client.clientKey || '—'}</Typography.Text>,
                    key: 'clientKey',
                    label: '客户端 Key'
                  },
                  {
                    children: (
                      <Typography.Text
                        code
                        copyable={client.clientId ? { text: client.clientId } : undefined}
                      >
                        {client.clientId || '—'}
                      </Typography.Text>
                    ),
                    key: 'clientId',
                    label: '客户端 ID'
                  },
                  {
                    children: (
                      <Flex
                        align="center"
                        gap={8}
                        wrap="wrap"
                      >
                        <Typography.Text code>
                          {secretVisible ? client.clientSecret || '—' : '••••••••••••'}
                        </Typography.Text>
                        <Button
                          size="small"
                          type="link"
                          onClick={() => setSecretVisible(value => !value)}
                        >
                          {secretVisible ? '隐藏' : '显示 10 秒'}
                        </Button>
                        {secretVisible && client.clientSecret ? (
                          <Typography.Text copyable={{ text: client.clientSecret }}>复制密钥</Typography.Text>
                        ) : null}
                      </Flex>
                    ),
                    key: 'clientSecret',
                    label: '客户端密钥'
                  }
                ]}
                size="small"
              />
            </Card>
            <Card
              size="small"
              title="授权能力"
            >
              <Descriptions
                column={1}
                items={[
                  {
                    children: (
                      <Flex
                        gap={6}
                        wrap="wrap"
                      >
                        {client.grantTypeList.map(grantType => (
                          <Tag
                            key={grantType}
                            color="blue"
                          >
                            {getClientOptionLabel(grantOptions, grantType)}
                          </Tag>
                        ))}
                      </Flex>
                    ),
                    key: 'grantTypes',
                    label: '授权方式'
                  },
                  {
                    children: getClientOptionLabel(deviceOptions, client.deviceType),
                    key: 'deviceType',
                    label: '设备类型'
                  }
                ]}
                size="small"
              />
            </Card>
            <Card
              size="small"
              title="令牌策略"
            >
              <Descriptions
                column={1}
                items={[
                  {
                    children: `${client.activeTimeout} 秒（${formatClientDuration(client.activeTimeout)}）`,
                    key: 'activeTimeout',
                    label: 'Token 活跃超时'
                  },
                  {
                    children: `${client.timeout} 秒（${formatClientDuration(client.timeout)}）`,
                    key: 'timeout',
                    label: 'Token 固定超时'
                  }
                ]}
                size="small"
              />
            </Card>
            <Alert
              description="停用或删除客户端只会阻止新的登录，现有会话不会立即下线。"
              showIcon
              type="warning"
            />
          </div>
        ) : null}
      </Spin>
    </Drawer>
  );
};

export default ClientDetailDrawer;
