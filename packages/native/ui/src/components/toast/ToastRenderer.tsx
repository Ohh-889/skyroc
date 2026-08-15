import { useStore } from '@skyroc/hooks';
import { View } from 'react-native';
import { toastManager } from './toast-manager';
import { toastPositionVariants } from './toast-variants';
import { ToastView } from './ToastView';
import type { ToastPosition } from './types';

/** 渲染顺序固定，保证不同位置的分组不会因为 Toast 增删而重挂 */
const POSITIONS: ToastPosition[] = ['top', 'middle', 'bottom'];

/** 容器类名集中一处，避免 JSX 里散落类名 */
function resolveSlotClassNames() {
  return {
    mask: 'absolute inset-0',
    root: 'absolute inset-0'
  };
}

/** 分组容器的类名由所在位置决定，只能逐组解析 */
function resolveGroupClassName(position: ToastPosition) {
  return toastPositionVariants({ position });
}

/** Toast 内部渲染逻辑，通过 Portal 自动挂载 */
const ToastRenderer = () => {
  const entries = useStore(toastManager);

  // 遮罩单独成层：定位容器本身高度自适应（top / bottom 只占一条），拿它来拦截触摸挡不住整屏
  const hasForbidClick = entries.some(entry => entry.forbidClick ?? false);

  const slotClassNames = resolveSlotClassNames();

  function renderGroup(position: ToastPosition) {
    const group = entries.filter(entry => (entry.position ?? 'middle') === position);

    return (
      <View
        className={resolveGroupClassName(position)}
        key={position}
        pointerEvents="box-none"
      >
        {group.map(entry => (
          <ToastView
            closeOnClick={entry.closeOnClick}
            icon={entry.icon}
            key={entry.id}
            message={entry.message}
            type={entry.type}
            onPressClose={() => toastManager.remove(entry.id)}
          />
        ))}
      </View>
    );
  }

  // 分组容器常驻不做空判断：最后一个 Toast 移除时若父节点跟着卸载，Reanimated 的退场动画会被连根拔掉
  return (
    <View
      className={slotClassNames.root}
      pointerEvents="box-none"
    >
      {hasForbidClick ? (
        <View
          className={slotClassNames.mask}
          pointerEvents="auto"
        />
      ) : null}

      {POSITIONS.map(renderGroup)}
    </View>
  );
};

export { ToastRenderer };
