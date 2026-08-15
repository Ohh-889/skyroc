import { Fragment } from 'react';
import { View } from 'react-native';
import { useStore } from '@skyroc/hooks';
import { portalStore } from './portal-store';

/** Portal 宿主组件，挂载在应用根节点，负责渲染所有 portal 节点 */
const PortalHost = () => {
  const portals = useStore(portalStore);

  if (portals.size === 0) return null;

  return (
    <View
      className="absolute inset-0 z-50"
      pointerEvents="box-none"
    >
      {Array.from(portals.entries()).map(([id, node]) => (
        <Fragment key={id}>{node}</Fragment>
      ))}
    </View>
  );
};

export { PortalHost };
