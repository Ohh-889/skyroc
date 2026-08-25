import type { AddNotificationInput } from './types';

const mockNotifications: AddNotificationInput[] = [
  {
    content: '系统将于今晚 22:00 进行维护，预计耗时 2 小时',
    priority: 'urgent',
    title: '系统维护通知',
    type: 'warning'
  },
  {
    content: '您的个人资料已成功更新',
    priority: 'normal',
    title: '资料更新成功',
    type: 'success'
  },
  {
    content: 'John Doe 给您发送了一条新消息',
    priority: 'high',
    title: '新消息',
    type: 'message'
  },
  {
    content: '您有 3 个待处理的审批任务',
    priority: 'high',
    title: '待办提醒',
    type: 'info'
  },
  {
    content: '文件上传失败，请检查网络连接',
    priority: 'normal',
    title: '上传失败',
    type: 'error'
  },
  {
    content: '您的账户登录地点异常，请及时修改密码',
    priority: 'urgent',
    title: '安全警告',
    type: 'warning'
  },
  {
    content: '数据备份已完成',
    priority: 'low',
    title: '备份完成',
    type: 'success'
  },
  {
    content: 'Sarah 评论了您的文章',
    priority: 'normal',
    title: '新评论',
    type: 'message'
  }
];

/** Demo notification data for local admin examples. */
export function useMockNotifications() {
  return {
    mockNotifications
  };
}
