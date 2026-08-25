import { useMockNotifications } from '@shell/notification/mock';
import { useNotificationContext } from '@shell/notification';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Space, Tag } from 'antd';

const NotificationDemo = () => {
  const {
    addErrorNotification,
    addInfoNotification,
    addMessageNotification,
    addNotification,
    addSuccessNotification,
    addWarningNotification,
    clearAllNotifications,
    clearReadNotifications,
    config,
    markAllAsRead,
    notificationPermission,
    notifications,
    requestNotificationPermission,
    unreadCount,
    updateConfig
  } = useNotificationContext();
  const { mockNotifications } = useMockNotifications();

  function getPermissionColor() {
    if (notificationPermission === 'granted') return 'success';
    if (notificationPermission === 'denied') return 'warning';

    return 'processing';
  }

  function getPermissionText() {
    if (notificationPermission === 'granted') return '已授权';
    if (notificationPermission === 'denied') return '已拒绝';

    return '未请求';
  }

  function addInfo() {
    addInfoNotification('信息通知', '这是一条普通的信息通知', {
      priority: 'normal'
    });
  }

  function addSuccess() {
    addSuccessNotification('操作成功', '您的数据已成功保存到系统中', {
      priority: 'normal'
    });
  }

  function addWarning() {
    addWarningNotification('警告提示', '您的密码将在 7 天后过期，请及时修改', {
      priority: 'high'
    });
  }

  function addError() {
    addErrorNotification('操作失败', '网络连接失败，请检查您的网络设置', {
      priority: 'high'
    });
  }

  function addMessage() {
    addMessageNotification('新消息', 'Sarah 给您发送了一条新消息：你好，最近怎么样？', {
      priority: 'high'
    });
  }

  function addUrgent() {
    addNotification({
      content: '检测到异常登录行为，请立即检查您的账户安全。',
      priority: 'urgent',
      title: '安全警报',
      type: 'error'
    });
  }

  function addLowPriority() {
    addNotification({
      content: '系统已自动完成数据备份。',
      priority: 'low',
      title: '备份完成',
      type: 'success'
    });
  }

  function addSilent() {
    addNotification({
      content: '这是一条静音通知，不会播放声音。',
      silent: true,
      title: '静音通知',
      type: 'info'
    });
  }

  function addNoBrowserNotification() {
    addNotification({
      content: '这条通知不会显示浏览器原生通知。',
      showBrowserNotification: false,
      title: '仅应用内通知',
      type: 'info'
    });
  }

  function addLinkedNotification() {
    addNotification({
      content: '点击此通知可跳转到首页。',
      link: '/home',
      title: '带链接的通知',
      type: 'message'
    });
  }

  function addMockNotifications() {
    mockNotifications.forEach((mock, index) => {
      setTimeout(() => {
        addNotification(mock);
      }, index * 300);
    });
  }

  async function requestPermission() {
    const granted = await requestNotificationPermission();

    if (granted) {
      addSuccessNotification('权限已授予', '现在您可以接收浏览器通知了。');
    }
  }

  function toggleSound() {
    updateConfig({ soundEnabled: !config.soundEnabled });
    addInfoNotification('设置已更新', config.soundEnabled ? '通知声音已关闭' : '通知声音已开启');
  }

  function toggleBrowserNotification() {
    updateConfig({ browserNotificationEnabled: !config.browserNotificationEnabled });
    addInfoNotification('设置已更新', config.browserNotificationEnabled ? '浏览器通知已关闭' : '浏览器通知已开启');
  }

  function toggleDoNotDisturb() {
    updateConfig({ doNotDisturb: !config.doNotDisturb });
    addInfoNotification('设置已更新', config.doNotDisturb ? '勿扰模式已关闭' : '勿扰模式已开启');
  }

  return (
    <div className="min-h-full p-24px">
      <div className="mb-24px">
        <h1 className="m-0 mb-8px text-24px font-bold">通知系统演示</h1>
        <p className="m-0 text-secondary">
          完整展示通知系统的类型、优先级、浏览器通知权限和批量管理能力。
        </p>
      </div>

      <Card className="mb-24px" title="当前状态" variant="borderless">
        <Space orientation="vertical" size="middle">
          <div className="flex-y-center gap-16px">
            <span className="text-secondary">总通知数：</span>
            <Tag color="processing">{notifications.length}</Tag>
          </div>
          <div className="flex-y-center gap-16px">
            <span className="text-secondary">未读数量：</span>
            <Tag color="error">{unreadCount}</Tag>
          </div>
          <div className="flex-y-center gap-16px">
            <span className="text-secondary">浏览器通知权限：</span>
            <Tag color={getPermissionColor()}>{getPermissionText()}</Tag>
          </div>
          <div className="flex-y-center gap-16px">
            <span className="text-secondary">通知声音：</span>
            <Tag color={config.soundEnabled ? 'success' : 'default'}>{config.soundEnabled ? '开启' : '关闭'}</Tag>
          </div>
          <div className="flex-y-center gap-16px">
            <span className="text-secondary">浏览器通知：</span>
            <Tag color={config.browserNotificationEnabled ? 'success' : 'default'}>
              {config.browserNotificationEnabled ? '开启' : '关闭'}
            </Tag>
          </div>
          <div className="flex-y-center gap-16px">
            <span className="text-secondary">勿扰模式：</span>
            <Tag color={config.doNotDisturb ? 'warning' : 'default'}>{config.doNotDisturb ? '开启' : '关闭'}</Tag>
          </div>
        </Space>
      </Card>

      <Card className="mb-24px" title="基础通知类型" variant="borderless">
        <Space wrap>
          <Button type="primary" onClick={addInfo}>
            信息通知
          </Button>
          <Button type="primary" onClick={addSuccess}>
            成功通知
          </Button>
          <Button onClick={addWarning}>警告通知</Button>
          <Button danger onClick={addError}>
            错误通知
          </Button>
          <Button type="dashed" onClick={addMessage}>
            消息通知
          </Button>
        </Space>
      </Card>

      <Card className="mb-24px" title="优先级和特殊能力" variant="borderless">
        <Space wrap>
          <Button onClick={addLowPriority}>低优先级</Button>
          <Button type="primary" onClick={addWarning}>
            高优先级
          </Button>
          <Button danger type="primary" onClick={addUrgent}>
            紧急通知
          </Button>
          <Button onClick={addSilent}>静音通知</Button>
          <Button onClick={addNoBrowserNotification}>仅应用内通知</Button>
          <Button type="dashed" onClick={addLinkedNotification}>
            带跳转链接
          </Button>
        </Space>
      </Card>

      <Card className="mb-24px" title="批量管理" variant="borderless">
        <Space wrap>
          <Button type="primary" onClick={addMockNotifications}>
            批量添加模拟通知
          </Button>
          <Button disabled={unreadCount === 0} onClick={markAllAsRead}>
            全部标记已读
          </Button>
          <Button disabled={notifications.every(item => !item.read)} onClick={clearReadNotifications}>
            清除已读通知
          </Button>
          <Button danger disabled={notifications.length === 0} onClick={clearAllNotifications}>
            清空所有通知
          </Button>
        </Space>
      </Card>

      <Card title="设置控制" variant="borderless">
        <Space wrap>
          {notificationPermission !== 'granted' && (
            <Button type="primary" onClick={requestPermission}>
              请求浏览器通知权限
            </Button>
          )}
          <Button onClick={toggleSound}>{config.soundEnabled ? '关闭声音' : '开启声音'}</Button>
          <Button onClick={toggleBrowserNotification}>
            {config.browserNotificationEnabled ? '关闭浏览器通知' : '开启浏览器通知'}
          </Button>
          <Button onClick={toggleDoNotDisturb}>{config.doNotDisturb ? '关闭勿扰模式' : '开启勿扰模式'}</Button>
        </Space>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/(admin)/interaction/notification/')({
  component: NotificationDemo,
  staticData: {
    i18nKey: 'route.interaction_notification',
    menu: {
      icon: 'carbon:notification',
      order: 1
    },
    permissions: ['R_ADMIN'],
    title: 'notification'
  }
});
