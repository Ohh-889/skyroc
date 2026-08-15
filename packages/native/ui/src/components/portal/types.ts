import type { ReactNode } from 'react';

/** Portal 句柄，用于更新或卸载已挂载的 portal 节点 */
export interface PortalHandle {
  /** 卸载此 portal 节点 */
  unmount: () => void;
  /** 更新此 portal 节点的内容 */
  update: (node: ReactNode) => void;
}
