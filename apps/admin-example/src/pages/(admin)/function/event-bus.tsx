import { SvgIcon } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';

interface EventBusMessage {
  /** 接收方展示的消息内容。 */
  message: string;

  /** 发送消息时记录的本地时间。 */
  time: string;
}

interface SenderProps {
  /** 点击发送按钮时广播的消息文本。 */
  message: string;
}

interface ReceiverProps {
  /** 尚未收到消息时展示的占位文案。 */
  emptyText: string;
}

type EventBusListener = (payload: EventBusMessage) => void;

const messageListeners = new Set<EventBusListener>();

function emitMessage(payload: EventBusMessage) {
  messageListeners.forEach(listener => {
    listener(payload);
  });
}

function subscribeMessage(listener: EventBusListener) {
  messageListeners.add(listener);

  return () => {
    messageListeners.delete(listener);
  };
}

const Sender = (props: SenderProps) => {
  const { message } = props;

  function sendMessage() {
    emitMessage({
      message,
      time: new Date().toLocaleTimeString()
    });
  }

  return (
    <ACard
      className="shadow-sm transition-shadow duration-300 hover:shadow-md"
      title={
        <ASpace>
          <SvgIcon
            className="text-blue-500"
            icon="ant-design:send-outlined"
          />
          <Typography.Text strong>Sender Component</Typography.Text>
        </ASpace>
      }
    >
      <AButton
        className="w-full"
        icon={<SvgIcon icon="ant-design:send-outlined" />}
        size="large"
        type="primary"
        onClick={sendMessage}
      >
        Send Message
      </AButton>
    </ACard>
  );
};

const Receiver = (props: ReceiverProps) => {
  const { emptyText } = props;

  const [messageState, setMessageState] = useState<EventBusMessage>({
    message: '',
    time: ''
  });

  useEffect(() => {
    return subscribeMessage(setMessageState);
  }, []);

  function renderMessage() {
    return (
      <ASpace
        className="w-full"
        direction="vertical"
      >
        <div className="rounded-lg">
          <Typography.Text type="secondary">Message:</Typography.Text>
          <Typography.Text
            strong
            className="block"
          >
            {messageState.message}
          </Typography.Text>
          <ADivider className="my-2" />
          <Typography.Text type="secondary">Received at:</Typography.Text>
          <Typography.Text className="block">{messageState.time}</Typography.Text>
        </div>
      </ASpace>
    );
  }

  function renderEmpty() {
    return (
      <div className="py-4 text-center text-gray-400">
        <div className="mb-2 text-2xl">
          <SvgIcon icon="ant-design:inbox-outlined" />
        </div>
        <Typography.Text type="secondary">{emptyText}</Typography.Text>
      </div>
    );
  }

  return (
    <ACard
      className="shadow-sm transition-shadow duration-300 hover:shadow-md"
      title={
        <ASpace>
          <SvgIcon
            className="text-green-500"
            icon="ant-design:inbox-outlined"
          />
          <Typography.Text strong>Receiver Component</Typography.Text>
        </ASpace>
      }
    >
      {messageState.message ? renderMessage() : renderEmpty()}
    </ACard>
  );
};

const EventBusDemo = () => {
  return (
    <ACard
      className="h-full card-wrapper"
      size="small"
      variant="borderless"
    >
      <Typography.Title
        className="mb-8 text-center"
        level={2}
      >
        Event Bus Example: Sibling Communication
      </Typography.Title>
      <ASpace
        className="w-full"
        direction="vertical"
        size="large"
      >
        <Sender message="Hello from Sender!" />
        <Receiver emptyText="No message received." />
      </ASpace>
    </ACard>
  );
};

export const Route = createFileRoute('/(admin)/function/event-bus')({
  component: EventBusDemo,
  staticData: {
    i18nKey: 'route.function_event-bus',
    menu: {
      icon: 'ant-design:send-outlined'
    },
    title: 'function_event-bus'
  }
});
