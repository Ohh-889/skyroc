import { useStore } from '@skyroc/hooks';
import { View } from 'react-native';
import { notifyManager } from './notify-manager';
import { notifyPositionVariants } from './notify-variants';
import { NotifyView } from './NotifyView';
import type { NotifyPosition } from './types';

/** 渲染顺序固定，保证两侧分组不会因为 Notify 增删而重挂 */
const POSITIONS: NotifyPosition[] = ['top', 'bottom'];

/** 容器类名集中一处，避免 JSX 里散落类名 */
function resolveSlotClassNames() {
  return {
    root: 'absolute inset-0'
  };
}

/** Notify 渲染器，通过 Portal 自动挂载 */
const NotifyRenderer = () => {
  const entry = useStore(notifyManager);

  const slotClassNames = resolveSlotClassNames();

  function renderGroup(position: NotifyPosition) {
    const current = entry && (entry.position ?? 'top') === position ? entry : null;

    return (
      <View
        className={notifyPositionVariants({ position })}
        key={position}
        pointerEvents="box-none"
      >
        {/* Key 落在 entry.id 上：换一条消息时走卸载 + 重挂，退场与进场动画都能完整播完，而不是内容被静默替换 */}
        {current ? (
          <NotifyView
            background={current.background}
            className={current.className}
            classNames={current.classNames}
            color={current.color}
            key={current.id}
            message={current.message}
            position={position}
            safeAreaInset
            type={current.type}
            onPress={current.onClick}
          />
        ) : null}
      </View>
    );
  }

  // 分组容器常驻不做空判断：Notify 关闭时若父节点跟着卸载，Reanimated 的退场动画会被连根拔掉
  return (
    <View
      className={slotClassNames.root}
      pointerEvents="box-none"
    >
      {POSITIONS.map(renderGroup)}
    </View>
  );
};

export { NotifyRenderer };
