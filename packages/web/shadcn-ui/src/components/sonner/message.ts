import type { ExternalToast, ToastT } from 'sonner';
import { toast } from 'sonner';

/**
 * Promise data configuration for message.promise()
 */
export interface MessagePromiseData<T = unknown> {
  /** Error state message or function that receives error */
  error?: React.ReactNode | ((error: unknown) => React.ReactNode);
  /** Callback when promise settles (success or error) */
  finally?: () => void | Promise<void>;
  /** Loading state message */
  loading?: React.ReactNode;
  /** Success state message or function that receives resolved data */
  success?: React.ReactNode | ((data: T) => React.ReactNode);
}

/**
 * Message configuration options
 * Lightweight global toast with icon and text only
 */
export interface MessageConfig {
  /** Custom class name */
  className?: string;
  /** Message content */
  content?: React.ReactNode;
  /** Auto close delay in milliseconds. Set to 0 to disable auto close. Default: 3000ms */
  duration?: number;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Unique key for the message */
  key?: string | number;
  /** Callback when message closes */
  onClose?: () => void;
  /** Display position. Default: top-center */
  position?: ToastT['position'];
  /** Custom inline style */
  style?: React.CSSProperties;
}

export type MessageType = 'error' | 'info' | 'loading' | 'success' | 'warning';

/**
 * Global configuration options
 */
export interface MessageGlobalConfig {
  /** Default auto close delay in milliseconds. Default: 3000ms */
  duration?: number;
  /** Max message count. Oldest message will be closed when exceeded */
  maxCount?: number;
  /** Default position */
  position?: ToastT['position'];
}

// Message style class - compact
const messageClassName = '!py-2 !px-3 !min-h-0 !w-auto !max-w-md';

// Global config
let globalConfig: MessageGlobalConfig = {
  duration: 3000,
  position: 'top-center'
};

// Active messages tracking
const activeMessages = new Set<string | number>();

/**
 * Check if value is MessageConfig object
 */
function isMessageConfig(value: unknown): value is MessageConfig {
  return typeof value === 'object' && value !== null && 'content' in value;
}

/**
 * Show message toast
 */
// eslint-disable-next-line max-params
function showMessage(
  type: MessageType,
  content: React.ReactNode | MessageConfig,
  duration?: number,
  onClose?: () => void
): string | number {
  // Support two calling methods:
  // 1. message.success('content', duration, onClose)
  // 2. message.success({ content: 'content', duration, onClose })
  let config: MessageConfig;

  if (isMessageConfig(content)) {
    config = content;
  }
  else {
    config = {
      content,
      duration,
      onClose
    };
  }

  const {
    className,
    content: messageContent,
    duration: msgDuration = globalConfig.duration,
    icon,
    key,
    onClose: msgOnClose,
    position = globalConfig.position,
    style
  } = config;

  // Check if max count exceeded
  if (globalConfig.maxCount && activeMessages.size >= globalConfig.maxCount) {
    // Close oldest message
    const firstKey = activeMessages.values().next().value;
    if (firstKey !== undefined) {
      toast.dismiss(firstKey);
      activeMessages.delete(firstKey);
    }
  }

  const toastOptions: ExternalToast = {
    id: key,
    duration: msgDuration,
    icon,
    style,
    className: `${messageClassName} ${className || ''}`.trim(),
    classNames: {
      title: '!font-normal'
    },
    position,
    onDismiss: () => {
      if (key) {
        activeMessages.delete(key);
      }
      msgOnClose?.();
    },
    onAutoClose: () => {
      if (key) {
        activeMessages.delete(key);
      }
      msgOnClose?.();
    }
  };

  let id: string | number;

  switch (type) {
    case 'success':
      id = toast.success(messageContent, toastOptions);
      break;
    case 'error':
      id = toast.error(messageContent, toastOptions);
      break;
    case 'warning':
      id = toast.warning(messageContent, toastOptions);
      break;
    case 'info':
      id = toast.info(messageContent, toastOptions);
      break;
    case 'loading':
      id = toast.loading(messageContent, toastOptions);
      break;
    default:
      id = toast(messageContent, toastOptions);
  }

  activeMessages.add(id);

  return id;
}

/**
 * Message API
 *
 * Display lightweight global feedback messages without interrupting user operations.
 *
 * @example
 * ```tsx
 * // Basic usage
 * message.success('Operation successful');
 * message.error('Operation failed');
 * message.warning('Warning message');
 * message.info('Info message');
 * message.loading('Loading...');
 *
 * // Custom duration (ms)
 * message.success('This message shows for 10s', 10000);
 *
 * // Using config object
 * message.success({
 *   content: 'Operation successful',
 *   duration: 5000,
 *   key: 'unique-key',
 *   onClose: () => console.log('closed')
 * });
 *
 * // Promise usage
 * message.promise(fetchData(), {
 *   loading: 'Loading...',
 *   success: 'Data loaded',
 *   error: 'Failed to load'
 * });
 *
 * // Manual dismiss
 * const id = message.loading('Loading...');
 * // ... async operation
 * message.dismiss(id);
 *
 * // Global config
 * message.config({ duration: 5000, maxCount: 3 });
 * ```
 */
export const message = {
  /**
   * Show success message
   */
  success(content: React.ReactNode | MessageConfig, duration?: number, onClose?: () => void) {
    return showMessage('success', content, duration, onClose);
  },

  /**
   * Show error message
   */
  error(content: React.ReactNode | MessageConfig, duration?: number, onClose?: () => void) {
    return showMessage('error', content, duration, onClose);
  },

  /**
   * Show warning message
   */
  warning(content: React.ReactNode | MessageConfig, duration?: number, onClose?: () => void) {
    return showMessage('warning', content, duration, onClose);
  },

  /**
   * Show info message
   */
  info(content: React.ReactNode | MessageConfig, duration?: number, onClose?: () => void) {
    return showMessage('info', content, duration, onClose);
  },

  /**
   * Show loading message
   */
  loading(content: React.ReactNode | MessageConfig, duration?: number, onClose?: () => void) {
    return showMessage('loading', content, duration, onClose);
  },

  /**
   * Show promise-based message with loading/success/error states
   */
  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    data: MessagePromiseData<T>,
    options?: Omit<MessageConfig, 'content'>
  ) {
    const { className, icon, key, position = globalConfig.position, style } = options || {};

    const toastOptions: ExternalToast = {
      id: key,
      icon,
      style,
      className: `${messageClassName} ${className || ''}`.trim(),
      classNames: {
        title: '!font-normal'
      },
      position
    };

    const result = toast.promise(promise, {
      loading: data.loading,
      success: data.success as string | React.ReactNode,
      error: data.error as string | React.ReactNode,
      finally: data.finally,
      ...toastOptions
    });

    return result;
  },

  /**
   * Open message with config
   */
  open(config: MessageConfig & { type?: MessageType }) {
    const { type = 'info', ...rest } = config;
    return showMessage(type, rest);
  },

  /**
   * Dismiss specific message or all messages
   */
  dismiss(id?: string | number) {
    if (id !== undefined) {
      activeMessages.delete(id);
    }
    else {
      activeMessages.clear();
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
  config(options: MessageGlobalConfig) {
    globalConfig = { ...globalConfig, ...options };
  }
};

export default message;
