import { resolveDuration } from './toast-defaults';
import { ToastView } from './ToastView';
import type { ToastProps } from './types';
import { useAutoClose } from './use-auto-close';

/**
 * Toast 声明式组件
 *
 * 受控展示：show 决定是否挂载，到点后只通知 onUpdateShow / onClose，真正的隐藏仍由调用方改 show 完成。 需要命令式调用请用 showToast 等函数，两者的 duration 默认值共用
 * resolveDuration，不会出现行为分叉。
 */
const Toast = (props: ToastProps) => {
  const { closeOnClick = false, duration, icon, message, onClose, onUpdateShow, show = false, type = 'text' } = props;

  function handleClose() {
    onUpdateShow?.(false);
    onClose?.();
  }

  useAutoClose(show, resolveDuration({ duration, type }), handleClose);

  if (!show) return null;

  return (
    <ToastView
      closeOnClick={closeOnClick}
      icon={icon}
      message={message}
      type={type}
      onPressClose={handleClose}
    />
  );
};

export { Toast };
