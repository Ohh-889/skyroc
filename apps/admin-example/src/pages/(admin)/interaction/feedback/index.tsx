/* eslint-disable unocss/order, react/jsx-sort-props, prettier/prettier */
import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Space } from 'antd';

import {
  destroyMessage,
  destroyNotification,
  showConfirmModal,
  showErrorMessage,
  showErrorModal,
  showErrorNotification,
  showInfoMessage,
  showInfoModal,
  showInfoNotification,
  showLoadingMessage,
  showMessage,
  showModal,
  showSuccessMessage,
  showSuccessModal,
  showSuccessNotification,
  showWarningMessage,
  showWarningModal,
  showWarningNotification
} from '@/config';

export const Route = createFileRoute('/(admin)/interaction/feedback/')({
  component: RouteComponent,
  staticData: {
    i18nKey: 'route.interaction_feedback',
    menu: {
      icon: 'ant-design:message-outlined',
      order: 3
    },
    permissions: ['R_ADMIN'],
    title: 'feedback'
  }
});

function RouteComponent() {
  // Message 测试函数
  const handleShowMessage = () => {
    showMessage({
      content: '这是一条普通消息',
      duration: 3
    });
  };

  const handleSuccessMessage = () => {
    showSuccessMessage('操作成功！');
  };

  const handleErrorMessage = () => {
    showErrorMessage('操作失败！');
  };

  const handleInfoMessage = () => {
    showInfoMessage('这是一条信息提示');
  };

  const handleWarningMessage = () => {
    showWarningMessage('这是一条警告信息');
  };

  const handleLoadingMessage = () => {
    const hide = showLoadingMessage('加载中...', 0);
    setTimeout(() => {
      hide();
      showSuccessMessage('加载完成！');
    }, 2000);
  };

  const handleDestroyMessage = () => {
    destroyMessage();
    showInfoMessage('所有消息已清除');
  };

  // Notification 测试函数
  const handleShowNotification = () => {
    showSuccessNotification({
      message: '通知标题',
      description: '这是通知的详细内容描述',
      duration: 4.5
    });
  };

  const handleSuccessNotification = () => {
    showSuccessNotification({
      message: '成功通知',
      description: '您的操作已成功完成！',
      placement: 'topRight'
    });
  };

  const handleErrorNotification = () => {
    showErrorNotification({
      message: '错误通知',
      description: '操作失败，请稍后重试！',
      placement: 'topRight'
    });
  };

  const handleInfoNotification = () => {
    showInfoNotification({
      message: '信息通知',
      description: '这是一条重要的信息提示',
      placement: 'topRight',
      duration: 0
    });
  };

  const handleWarningNotification = () => {
    showWarningNotification({
      message: '警告通知',
      description: '请注意！这可能会影响系统运行',
      placement: 'topRight'
    });
  };

  const handleDestroyNotification = () => {
    destroyNotification();
    showInfoMessage('所有通知已清除');
  };

  // Modal 测试函数
  const handleShowModal = () => {
    showModal({
      title: '确认对话框',
      content: '这是一个确认对话框',
      onOk: () => {
        showSuccessMessage('您点击了确认');
      },
      onCancel: () => {
        showInfoMessage('您点击了取消');
      }
    });
  };

  const handleConfirmModal = () => {
    showConfirmModal({
      title: '确认操作',
      content: '您确定要执行此操作吗？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            showSuccessMessage('操作已确认');
            resolve(null);
          }, 1000);
        });
      }
    });
  };

  const handleInfoModal = () => {
    showInfoModal({
      title: '信息提示',
      content: '这是一条重要信息，请仔细阅读。'
    });
  };

  const handleSuccessModal = () => {
    showSuccessModal({
      title: '操作成功',
      content: '您的操作已成功完成！'
    });
  };

  const handleErrorModal = () => {
    showErrorModal({
      title: '操作失败',
      content: '操作失败，请检查您的输入或稍后重试。'
    });
  };

  const handleWarningModal = () => {
    showWarningModal({
      title: '警告',
      content: '此操作可能会导致数据丢失，请谨慎操作！'
    });
  };

  // 综合测试
  const handleComprehensiveTest = () => {
    showLoadingMessage('正在处理...', 0);

    setTimeout(() => {
      destroyMessage();
      showSuccessMessage('第一步完成');

      setTimeout(() => {
        showInfoNotification({
          message: '进度更新',
          description: '已完成 50%'
        });

        setTimeout(() => {
          showConfirmModal({
            title: '确认继续',
            content: '是否继续执行剩余步骤？',
            onOk: () => {
              showSuccessNotification({
                message: '全部完成',
                description: '所有步骤已成功执行！'
              });
            }
          });
        }, 1000);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-layout p-6 space-y-6">
      <div className="enter-y:nth-child(1)">
        <h1 className="mb-4 text-2xl text-foreground font-bold">UI 组件测试页面</h1>
        <p className="text-secondary">测试 Antd 的 Message、Notification 和 Modal 组件</p>
      </div>

      {/* Message 测试 */}
      <Card
        className="enter-y:nth-child(2)"
        title={
          <div className="flex items-center gap-2">
            <span className="i-ant-design:message-outlined text-primary text-icon" />
            <span className="font-semibold text-lg">Message 消息提示</span>
          </div>
        }
      >
        <Space
          size="middle"
          wrap
        >
          <Button onClick={handleShowMessage}>普通消息</Button>
          <Button
            type="primary"
            onClick={handleSuccessMessage}
          >
            成功消息
          </Button>
          <Button
            danger
            onClick={handleErrorMessage}
          >
            错误消息
          </Button>
          <Button onClick={handleInfoMessage}>信息消息</Button>
          <Button onClick={handleWarningMessage}>警告消息</Button>
          <Button
            type="default"
            onClick={handleLoadingMessage}
          >
            加载消息
          </Button>
          <Button
            type="dashed"
            onClick={handleDestroyMessage}
          >
            清除所有消息
          </Button>
        </Space>
        <div className="mt-4 p-3 text-sm bg-blue-50  rounded-md text-blue-800 ">
          <strong>提示：</strong>Message 组件用于轻量级的反馈信息，会在顶部居中显示，3 秒后自动消失。
        </div>
      </Card>

      {/* Notification 测试 */}
      <Card
        className="enter-y:nth-child(3)"
        title={
          <div className="flex items-center gap-2">
            <span className="i-ant-design:notification-outlined text-success text-icon" />
            <span className="font-semibold text-lg">Notification 通知提醒</span>
          </div>
        }
      >
        <Space
          size="middle"
          wrap
        >
          <Button onClick={handleShowNotification}>显示通知</Button>
          <Button
            type="primary"
            onClick={handleSuccessNotification}
          >
            成功通知
          </Button>
          <Button
            danger
            onClick={handleErrorNotification}
          >
            错误通知
          </Button>
          <Button onClick={handleInfoNotification}>信息通知</Button>
          <Button onClick={handleWarningNotification}>警告通知</Button>
          <Button
            type="dashed"
            onClick={handleDestroyNotification}
          >
            清除所有通知
          </Button>
        </Space>
        <div className="mt-4 p-3 text-sm bg-green-50  rounded-md text-green-800 ">
          <strong>提示：</strong>Notification 组件用于较为复杂的通知内容，默认在右上角显示，包含标题和描述，4.5
          秒后自动消失。
        </div>
      </Card>

      {/* Modal 测试 */}
      <Card
        className="enter-y:nth-child(4)"
        title={
          <div className="flex items-center gap-2">
            <span className="i-ant-design:exclamation-circle-outlined text-warning text-icon" />
            <span className="font-semibold text-lg">Modal 对话框</span>
          </div>
        }
      >
        <Space
          size="middle"
          wrap
        >
          <Button onClick={handleShowModal}>显示对话框</Button>
          <Button
            type="primary"
            onClick={handleConfirmModal}
          >
            确认对话框
          </Button>
          <Button onClick={handleInfoModal}>信息对话框</Button>
          <Button onClick={handleSuccessModal}>成功对话框</Button>
          <Button
            danger
            onClick={handleErrorModal}
          >
            错误对话框
          </Button>
          <Button onClick={handleWarningModal}>警告对话框</Button>
        </Space>
        <div className="mt-4 p-3 text-sm bg-orange-50 rounded-md text-orange-800 ">
          <strong>提示：</strong>Modal 组件用于需要用户确认或交互的场景，会阻止页面交互直到用户关闭对话框。
        </div>
      </Card>

      {/* 综合测试 */}
      <Card
        className="enter-y:nth-child(5)"
        title={
          <div className="flex items-center gap-2">
            <span className="i-ant-design:rocket-outlined text-error text-icon" />
            <span className="font-semibold text-lg">综合测试</span>
          </div>
        }
      >
        <Button
          size="large"
          type="primary"
          onClick={handleComprehensiveTest}
        >
          🚀 执行综合测试流程
        </Button>
        <div className="mt-4 p-3 text-sm bg-purple-50  rounded-md text-purple-800 ">
          <strong>说明：</strong>
          综合测试会依次展示多个组件的组合使用场景，模拟真实的业务流程。点击按钮后请注意观察各个组件的展示顺序和交互效果。
        </div>
      </Card>

      {/* API 文档 */}
      <Card
        className="enter-y:nth-child(6)"
        title={
          <div className="flex items-center gap-2">
            <span className="i-ant-design:book-outlined text-icon" />
            <span className="font-semibold text-lg">API 方法列表</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-base text-foreground">Message 方法</h3>
            <div className="space-y-1 font-mono text-sm text-secondary">
              <div>• showMessage(config) - 显示普通消息</div>
              <div>• showSuccessMessage(content) - 显示成功消息</div>
              <div>• showErrorMessage(content) - 显示错误消息</div>
              <div>• showInfoMessage(content) - 显示信息消息</div>
              <div>• showWarningMessage(content) - 显示警告消息</div>
              <div>• showLoadingMessage(content) - 显示加载消息</div>
              <div>• destroyMessage(key?) - 销毁消息</div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-base text-foreground">Notification 方法</h3>
            <div className="space-y-1 font-mono text-sm text-secondary">
              <div>• showNotification(config) - 显示通知</div>
              <div>• showSuccessNotification(config) - 显示成功通知</div>
              <div>• showErrorNotification(config) - 显示错误通知</div>
              <div>• showInfoNotification(config) - 显示信息通知</div>
              <div>• showWarningNotification(config) - 显示警告通知</div>
              <div>• destroyNotification(key?) - 销毁通知</div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-base text-foreground">Modal 方法</h3>
            <div className="space-y-1 font-mono text-sm text-secondary">
              <div>• showModal(config) - 显示对话框</div>
              <div>• showConfirmModal(config) - 显示确认对话框</div>
              <div>• showInfoModal(config) - 显示信息对话框</div>
              <div>• showSuccessModal(config) - 显示成功对话框</div>
              <div>• showErrorModal(config) - 显示错误对话框</div>
              <div>• showWarningModal(config) - 显示警告对话框</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
