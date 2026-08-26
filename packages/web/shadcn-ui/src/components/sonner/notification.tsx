import type { ReactNode } from 'react';
import type { Action, ExternalToast, ToastT } from 'sonner';
import { toast } from 'sonner';

export type NotificationType = 'error' | 'info' | 'success' | 'warning';

/**
 * Notification configuration options
 * Toast notification with title, description, icon, and optional buttons
 */
export interface NotificationConfig {
  /** Primary action button config */
  action?: ActionConfig | ReactNode;
  /** Cancel button config */
  cancel?: ActionConfig | ReactNode;
  /** Custom class name */
  className?: string;
  /** Whether to show close button */
  closeButton?: boolean;
  /** Notification description/content */
  description?: ReactNode;
  /** Auto close delay in milliseconds. Set to 0 to disable auto close. Default: 4500ms */
  duration?: number;
  /** Custom icon */
  icon?: ReactNode;
  /** Unique key for the notification */
  key?: string | number;
  /** Callback when notification closes */
  onClose?: () => void;
  /** Display position. Default: top-right */
  position?: ToastT['position'];
  /** Custom inline style */
  style?: React.CSSProperties;
  /** Notification title */
  title?: ReactNode;
  /** Notification type */
  type?: NotificationType;
}

/**
 * Action button configuration
 */
export interface ActionConfig {
  /** Button label */
  label: ReactNode;
  /** Click callback */
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** Button style */
  style?: React.CSSProperties;
}

/**
 * Global configuration options
 */
export interface NotificationGlobalConfig {
  /** Whether to show close button by default. Default: false */
  closeButton?: boolean;
  /** Default auto close delay in milliseconds. Default: 4500ms */
  duration?: number;
  /** Max notification count. Oldest notification will be closed when exceeded */
  maxCount?: number;
  /** Default position */
  position?: ToastT['position'];
}

// Notification style class - wider and more prominent
// Use flex-wrap to let buttons flow to new line, content takes full width
// First button (cancel or action) gets ml-auto to push right, action gets ml-2 when after cancel
const notificationClassName = `
  !min-w-[320px] !max-w-[420px] !px-6 !py-5 !items-start
  !flex-wrap
  [&>[data-content]]:!w-[calc(100%-32px)]
  [&>[data-button]]:!mt-1
  [&>[data-cancel]]:!ml-auto
  [&>[data-cancel]+[data-action]]:!ml-2
  [&:not(:has([data-cancel]))>[data-action]]:!ml-auto
`.replace(/\s+/g, ' ').trim();

// Global config
let globalConfig: NotificationGlobalConfig = {
  duration: 4500,
  maxCount: undefined,
  closeButton: true,
  position: 'top-right'
};

// Active notifications tracking
const activeNotifications = new Set<string | number>();

/**
 * Convert ActionConfig to sonner Action
 */
function convertAction(action: ActionConfig | ReactNode | undefined): Action | ReactNode | undefined {
  if (!action)
    return undefined;

  if (typeof action === 'object' && 'label' in action && 'onClick' in action) {
    const actionConfig = action as ActionConfig;
    return {
      label: actionConfig.label,
      onClick: actionConfig.onClick,
      actionButtonStyle: actionConfig.style
    };
  }

  return action as ReactNode;
}

/**
 * Show notification toast
 */
function showNotification(
  type: NotificationType | 'default',
  config: NotificationConfig
): string | number {
  const {
    action,
    cancel,
    className,
    closeButton = globalConfig.closeButton,
    description,
    duration = globalConfig.duration,
    icon,
    key,
    onClose,
    position = globalConfig.position,
    style,
    title,
    ...rest
  } = config;

  // Check if max count exceeded
  if (globalConfig.maxCount && activeNotifications.size >= globalConfig.maxCount) {
    // Close oldest notification
    const firstKey = activeNotifications.values().next().value;
    if (firstKey !== undefined) {
      toast.dismiss(firstKey);
      activeNotifications.delete(firstKey);
    }
  }

  const toastOptions: ExternalToast = {
    id: key,
    description,
    duration,
    icon,
    style,
    className: `${notificationClassName} ${className || ''}`.trim(),
    action: convertAction(action),
    cancel: convertAction(cancel),
    closeButton,
    position,
    classNames: {
      title: '!text-base',
      description: '!mt-1.5',
      icon: '!mt-1'
    },
    onDismiss: () => {
      if (key) {
        activeNotifications.delete(key);
      }
      onClose?.();
    },
    onAutoClose: () => {
      if (key) {
        activeNotifications.delete(key);
      }
      onClose?.();
    },
    ...rest
  };

  let id: string | number;

  switch (type) {
    case 'success':
      id = toast.success(title, toastOptions);
      break;
    case 'error':
      id = toast.error(title, toastOptions);
      break;
    case 'warning':
      id = toast.warning(title, toastOptions);
      break;
    case 'info':
      id = toast.info(title, toastOptions);
      break;
    default:
      id = toast(title, toastOptions);
  }

  activeNotifications.add(id);

  return id;
}

/**
 * Notification API
 *
 * Display rich notification toasts with title, description, and optional actions.
 *
 * @example
 * ```tsx
 * // Basic usage
 * notification.success({
 *   title: 'Operation successful',
 *   description: 'Your changes have been saved'
 * });
 *
 * // With action buttons
 * notification.info({
 *   title: 'New message',
 *   description: 'You have a new message',
 *   action: {
 *     label: 'View',
 *     onClick: () => console.log('View')
 *   },
 *   cancel: {
 *     label: 'Ignore',
 *     onClick: () => console.log('Ignore')
 *   }
 * });
 *
 * // Custom duration (ms)
 * notification.warning({
 *   title: 'Warning',
 *   description: 'This notification shows for 10s',
 *   duration: 10000
 * });
 *
 * // Manual dismiss
 * const id = notification.info({ title: 'Notification' });
 * notification.dismiss(id);
 *
 * // With close button
 * notification.info({
 *   title: 'Notification',
 *   description: 'Click the close button to dismiss',
 *   closeButton: true
 * });
 *
 * // Global config
 * notification.config({ duration: 5000, maxCount: 3 });
 * ```
 */
export const notification = {
  /**
   * Show success notification
   */
  success(config: NotificationConfig) {
    return showNotification('success', config);
  },

  /**
   * Show error notification
   */
  error(config: NotificationConfig) {
    return showNotification('error', config);
  },

  /**
   * Show warning notification
   */
  warning(config: NotificationConfig) {
    return showNotification('warning', config);
  },

  /**
   * Show info notification
   */
  info(config: NotificationConfig) {
    return showNotification('info', config);
  },

  /**
   * Open notification with config
   */
  open(config: NotificationConfig & { type?: NotificationType }) {
    const { type = 'info', ...rest } = config;
    return showNotification(type, rest);
  },

  /**
   * Dismiss specific notification or all notifications
   */
  dismiss(id?: string | number) {
    if (id !== undefined) {
      activeNotifications.delete(id);
    }
    else {
      activeNotifications.clear();
    }
    return toast.dismiss(id);
  },

  /**
   * Alias for dismiss
   */
  destroy(id?: string | number) {
    return this.dismiss(id);
  },

  /**
   * Set global configuration
   */
  config(options: NotificationGlobalConfig) {
    globalConfig = { ...globalConfig, ...options };
  }
};

export default notification;
