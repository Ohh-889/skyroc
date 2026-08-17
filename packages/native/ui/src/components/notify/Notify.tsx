import { useAutoClose } from '../../hooks/use-auto-close';
import { resolveDuration } from './notify-defaults';
import { NotifyView } from './NotifyView';
import type { NotifyProps } from './types';

/**
 * Notify 声明式组件
 *
 * 受控展示：show 决定是否挂载，到点后只通知 onUpdateShow / onClose，真正的隐藏仍由调用方改 show 完成。 需要命令式调用请用 showNotify，两者的 duration 默认值共用
 * resolveDuration，不会出现行为分叉。
 *
 * 不做贴边定位、也不补安全区：内联在页面里就是一条普通色块，贴边显示交给 NotifyRenderer。
 */
const Notify = (props: NotifyProps) => {
  const {
    background,
    className,
    classNames,
    color,
    duration,
    message,
    onClick,
    onClose,
    onUpdateShow,
    position = 'top',
    show = false,
    type = 'danger'
  } = props;

  function handleClose() {
    onUpdateShow?.(false);
    onClose?.();
  }

  useAutoClose(show, resolveDuration({ duration }), handleClose);

  if (!show) return null;

  return (
    <NotifyView
      background={background}
      className={className}
      classNames={classNames}
      color={color}
      message={message}
      position={position}
      type={type}
      onPress={onClick}
    />
  );
};

export { Notify };
