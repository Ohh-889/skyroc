import { useStore } from '@skyroc/hooks';
import { View } from 'react-native';
import { Notify } from './Notify';
import { notifyManager } from './notify-manager';

/** 容器类名集中一处，避免 JSX 里散落类名 */
function resolveSlotClassNames() {
  return {
    root: 'absolute inset-x-0 z-50'
  };
}

/** Notify 渲染器，通过 Portal 自动挂载 */
const NotifyRenderer = () => {
  const entry = useStore(notifyManager);

  const slotClassNames = resolveSlotClassNames();

  if (!entry) return null;

  function handleClose() {
    notifyManager.close();
    entry?.onClose?.();
  }

  return (
    <View
      className={slotClassNames.root}
      pointerEvents="box-none"
      style={entry.position === 'bottom' ? { bottom: 0 } : { top: 0 }}
    >
      <Notify
        {...entry}
        show
        onUpdateShow={() => handleClose()}
      />
    </View>
  );
};

export { NotifyRenderer };
