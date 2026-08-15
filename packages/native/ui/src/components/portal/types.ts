import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

/** Portal 节点在 store 中的记录 */
export interface PortalEntry {
  /** 渲染内容 */
  node: ReactNode;

  /** 层级，决定在 PortalHost 中的渲染顺序 */
  zIndex: number;
}

/** Portal 句柄，用于更新或卸载已挂载的 portal 节点 */
export interface PortalHandle {
  /** 此 portal 节点的唯一标识，可配合 portalStore.has 判断节点是否仍然挂载 */
  id: string;

  /** 卸载此 portal 节点，重复调用安全 */
  unmount: () => void;

  /** 更新此 portal 节点的内容，节点已卸载时不做任何事 */
  update: (node: ReactNode, options?: PortalOptions) => void;
}

/** PortalHost 组件属性 */
export interface PortalHostProps extends Omit<ViewProps, 'children'> {
  /** 自定义类名，用于覆盖默认的定位与层级（默认 absolute inset-0 z-50） */
  className?: string;
}

/** Portal 节点的挂载选项 */
export interface PortalOptions {
  /** 层级，数值越大越靠上；相同层级按挂载先后叠放，默认 0 */
  zIndex?: number;
}

/** Portal 组件属性 */
export interface PortalProps extends PortalOptions {
  /** 需要渲染到 PortalHost 上的内容 */
  children: ReactNode;
}
