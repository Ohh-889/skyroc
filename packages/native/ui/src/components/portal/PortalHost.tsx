import { useStore } from '@skyroc/hooks';
import { cn } from '@skyroc/utils';
import { Fragment, useEffect } from 'react';
import { View } from 'react-native';
import { portalStore } from './portal-store';
import type { PortalHostProps } from './types';

/** Portal 宿主组件，挂载在应用根节点，负责渲染所有 portal 节点 */
const PortalHost = (props: PortalHostProps) => {
  const { className, style, ...rest } = props;

  const portals = useStore(portalStore);

  // 注册自身，供 store 在开发期识别「节点挂了但没有 host」和「存在多个 host」
  useEffect(() => portalStore.registerHost(), []);

  /** 内置类与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn('absolute inset-0 z-50', className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderPortals() {
    // Array.from 已经产出副本，就地 sort 不会动到 store 里的 Map；
    // 不用 toSorted 是因为 Hermes 和旧版 JSC 都还没实现 ES2023 的 change-array-by-copy
    const entries = Array.from(portals.entries());

    // 按 zIndex 升序渲染；sort 是稳定排序，同层级维持挂载先后
    entries.sort(([, a], [, b]) => a.zIndex - b.zIndex);

    return entries.map(([id, entry]) => <Fragment key={id}>{entry.node}</Fragment>);
  }

  if (portals.size === 0) return null;

  return (
    <View
      className={slotClassNames.root}
      style={[{ pointerEvents: 'box-none' }, style]}
      {...rest}
    >
      {renderPortals()}
    </View>
  );
};

export { PortalHost };
