import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Card, Divider, Form, Input, InputNumber, Select, Space, Switch, Typography } from 'antd';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';

interface KeepAliveFormValues {
  /** 表单内需要跨路由切换保留的启用状态。 */
  enabled?: boolean;

  /** 表单内需要跨路由切换保留的优先级。 */
  priority?: number;

  /** 表单内需要跨路由切换保留的项目名称。 */
  projectName?: string;

  /** 表单内需要跨路由切换保留的处理状态。 */
  status?: string;
}

interface KeepAliveFormVerifyProps {
  /** 计数器初始值，用于观察缓存恢复时组件 state 是否复位。 */
  initialCount?: number;
}

const initialFormValues: KeepAliveFormValues = {
  enabled: true,
  priority: 2,
  projectName: '',
  status: 'draft'
};

const KeepAliveFormVerify = (props: KeepAliveFormVerifyProps) => {
  const { initialCount = 0 } = props;

  const navigate = useNavigate();
  const [form] = Form.useForm<KeepAliveFormValues>();
  const mountIdRef = useRef(`form-${Date.now().toString(36)}`);
  const [counter, setCounter] = useState(initialCount);
  const [nickname, setNickname] = useState('');

  function handleNicknameChange(event: ChangeEvent<HTMLInputElement>) {
    setNickname(event.target.value);
  }

  function handleIncreaseCounter() {
    setCounter(counter + 1);
  }

  function handleGoAbout() {
    navigate({ to: '/about' });
  }

  function handleGoHome() {
    navigate({ to: '/home' });
  }

  function handleReset() {
    form.resetFields();
    setCounter(initialCount);
    setNickname('');
  }

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <Card variant="borderless">
        <div className="flex flex-wrap items-center justify-between gap-16px">
          <div>
            <Typography.Title
              className="m-0!"
              level={4}
            >
              Keep Alive Form
            </Typography.Title>
            <Typography.Text type="secondary">实例 ID：{mountIdRef.current}</Typography.Text>
          </div>

          <Space wrap>
            <Button onClick={handleGoHome}>切到首页</Button>
            <Button onClick={handleGoAbout}>切到关于</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>

        <Divider />

        <Space
          size={24}
          wrap
        >
          <Typography.Text>受控输入：{nickname || '-'}</Typography.Text>
          <Typography.Text data-testid="keep-alive-counter">计数器：{counter}</Typography.Text>
          <Button
            type="primary"
            onClick={handleIncreaseCounter}
          >
            加一
          </Button>
        </Space>
      </Card>

      <Card
        title="缓存验证表单"
        variant="borderless"
      >
        <Form
          form={form}
          initialValues={initialFormValues}
          layout="vertical"
        >
          <Form.Item
            label="项目名称"
            name="projectName"
          >
            <Input
              data-testid="keep-alive-project-name"
              placeholder="输入后切换页面再回来"
            />
          </Form.Item>

          <Form.Item label="处理人">
            <Input
              data-testid="keep-alive-assignee"
              value={nickname}
              onChange={handleNicknameChange}
            />
          </Form.Item>

          <Form.Item
            label="优先级"
            name="priority"
          >
            <InputNumber
              className="w-full"
              max={5}
              min={1}
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
          >
            <Select
              options={[
                { label: '草稿', value: 'draft' },
                { label: '进行中', value: 'processing' },
                { label: '已完成', value: 'done' }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="启用缓存项"
            name="enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="原生草稿">
            <textarea
              className="min-h-96px w-full resize-y border border-border rounded-6px bg-container px-12px py-8px outline-none transition-colors focus:border-primary"
              data-testid="keep-alive-native-draft"
              placeholder="这里是非受控 DOM 状态"
            />
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/keep-alive-form')({
  component: KeepAliveFormVerify,
  staticData: {
    i18nKey: 'route.keep-alive-form',
    keepAlive: true,
    menu: {
      icon: 'mdi:form-select',
      order: 23
    },
    title: 'keep_alive_form'
  }
});
