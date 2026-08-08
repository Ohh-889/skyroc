import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';

import type {
  AddNotificationInput,
  NotificationConfig,
  NotificationItem,
  NotificationShortcutOptions,
  UseNotificationOptions
} from './types';

/** 默认的通知运行时配置。 */
export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  browserNotificationEnabled: true,
  doNotDisturb: false,
  maxNotifications: 99,
  soundEnabled: true
};

/** 将调用方配置与默认配置合并。 */
function createNotificationConfig(defaultConfig?: Partial<NotificationConfig>) {
  return {
    ...DEFAULT_NOTIFICATION_CONFIG,
    ...defaultConfig
  };
}

/** 获取当前时间，格式为 HH:mm。 */
function getCurrentTimeText() {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}`;
}

/** 判断时间是否处于指定范围内，同时支持跨午夜的时间段。 */
function isWithinTimeRange(currentTime: string, start: string, end: string) {
  if (start <= end) {
    return currentTime >= start && currentTime <= end;
  }

  return currentTime >= start || currentTime <= end;
}

/** 管理后台通知状态，并处理浏览器通知和通知音效等副作用。 */
export function useNotification(options: UseNotificationOptions = {}) {
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const soundUrlRef = useRef<string | undefined>(undefined);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [config, setConfig] = useState<NotificationConfig>(() => createNotificationConfig(options.defaultConfig));

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const unreadCount = notifications.filter(item => !item.read).length;

  // 初始化浏览器通知权限；服务端渲染或浏览器不支持时保持默认状态。
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    setNotificationPermission(window.Notification.permission);
  }, []);

  /** 判断当前时间是否处于免打扰时段。 */
  function isDoNotDisturbTime() {
    if (!config.doNotDisturb || !config.doNotDisturbTime) {
      return false;
    }

    const currentTime = getCurrentTimeText();
    const { end, start } = config.doNotDisturbTime;

    return isWithinTimeRange(currentTime, start, end);
  }

  /** 获取并缓存通知音频实例，音频地址变化时重新创建。 */
  function getNotificationSound() {
    if (!options.soundUrl || typeof Audio === 'undefined') {
      return null;
    }

    if (!soundRef.current || soundUrlRef.current !== options.soundUrl) {
      soundRef.current = new Audio(options.soundUrl);
      soundUrlRef.current = options.soundUrl;
    }

    return soundRef.current;
  }

  /** 播放通知音效，并将播放失败交给宿主应用处理。 */
  function playNotificationSound() {
    if (!config.soundEnabled || isDoNotDisturbTime()) {
      return;
    }

    const notificationSound = getNotificationSound();

    if (!notificationSound) {
      return;
    }

    try {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(error => {
        options.onPlaySoundError?.(error);
      });
    } catch (error) {
      options.onPlaySoundError?.(error);
    }
  }

  /** 根据当前配置显示浏览器原生通知。 */
  function showBrowserNotification(notification: NotificationItem) {
    if (!config.browserNotificationEnabled || isDoNotDisturbTime()) {
      return;
    }

    if (notificationPermission !== 'granted') {
      return;
    }

    if (notification.silent || notification.showBrowserNotification === false) {
      return;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    try {
      const browserNotification = new window.Notification(notification.title, {
        body: notification.content,
        icon: notification.icon
      });

      browserNotification.addEventListener('click', () => {
        window.focus();

        if (notification.link) {
          if (options.onNavigate) {
            options.onNavigate(notification.link, notification);
          } else {
            window.location.href = notification.link;
          }
        }

        browserNotification.close();
      });
    } catch (error) {
      options.onBrowserNotificationError?.(error);
    }
  }

  /** 请求浏览器通知权限，并同步权限状态。 */
  async function requestNotificationPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      options.onBrowserNotificationUnsupported?.();
      return false;
    }

    try {
      const permission = await window.Notification.requestPermission();
      setNotificationPermission(permission);

      return permission === 'granted';
    } catch (error) {
      options.onRequestPermissionError?.(error);
      return false;
    }
  }

  /** 添加通知，生成缺省字段并触发音效及浏览器通知。 */
  function addNotification(notification: AddNotificationInput) {
    const newNotification: NotificationItem = {
      id: notification.id ?? nanoid(),
      read: notification.read ?? false,
      timestamp: notification.timestamp ?? Date.now(),
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];

      if (updated.length > config.maxNotifications) {
        return updated.slice(0, config.maxNotifications);
      }

      return updated;
    });

    if (!newNotification.silent) {
      playNotificationSound();
    }

    if (newNotification.showBrowserNotification !== false) {
      showBrowserNotification(newNotification);
    }

    return newNotification.id;
  }

  /** 添加信息类通知。 */
  function addInfoNotification(title: string, content: string, shortcutOptions: NotificationShortcutOptions = {}) {
    return addNotification({ ...shortcutOptions, content, title, type: 'info' });
  }

  /** 添加成功类通知。 */
  function addSuccessNotification(title: string, content: string, shortcutOptions: NotificationShortcutOptions = {}) {
    return addNotification({ ...shortcutOptions, content, title, type: 'success' });
  }

  /** 添加警告类通知。 */
  function addWarningNotification(title: string, content: string, shortcutOptions: NotificationShortcutOptions = {}) {
    return addNotification({ ...shortcutOptions, content, title, type: 'warning' });
  }

  /** 添加错误类通知。 */
  function addErrorNotification(title: string, content: string, shortcutOptions: NotificationShortcutOptions = {}) {
    return addNotification({ ...shortcutOptions, content, title, type: 'error' });
  }

  /** 添加普通消息类通知。 */
  function addMessageNotification(title: string, content: string, shortcutOptions: NotificationShortcutOptions = {}) {
    return addNotification({ ...shortcutOptions, content, title, type: 'message' });
  }

  /** 将指定通知标记为已读。 */
  function markAsRead(id: string) {
    setNotifications(prev => prev.map(item => (item.id === id ? { ...item, read: true } : item)));
  }

  /** 将所有通知标记为已读。 */
  function markAllAsRead() {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
  }

  /** 移除指定通知。 */
  function removeNotification(id: string) {
    setNotifications(prev => prev.filter(item => item.id !== id));
  }

  /** 清空全部通知。 */
  function clearAllNotifications() {
    setNotifications([]);
  }

  /** 仅清除已读通知，保留未读通知。 */
  function clearReadNotifications() {
    setNotifications(prev => prev.filter(item => !item.read));
  }

  /** 更新通知运行时配置，未传入的字段保持不变。 */
  function updateConfig(updates: Partial<NotificationConfig>) {
    setConfig(prev => ({ ...prev, ...updates }));
  }

  return {
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
    markAsRead,
    notificationPermission,
    notifications,
    removeNotification,
    requestNotificationPermission,
    unreadCount,
    updateConfig
  };
}
