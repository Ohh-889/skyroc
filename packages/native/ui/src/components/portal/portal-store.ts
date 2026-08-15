import type { ReactNode } from 'react';
import { Store } from '@skyroc/hooks';

/** Portal 状态管理器，管理所有通过 mountPortal 挂载的节点 */
class PortalStore extends Store<Map<string, ReactNode>> {
  private idCounter = 0;

  constructor() {
    super(new Map());
  }

  /** 挂载一个 portal 节点，返回其 id */
  mount(node: ReactNode): string {
    const id = this.nextId();
    this.setState(prev => {
      const next = new Map(prev);
      next.set(id, node);
      return next;
    });
    return id;
  }

  /** 卸载指定 portal 节点 */
  unmount(id: string) {
    this.setState(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }

  /** 更新指定 portal 节点的内容 */
  update(id: string, node: ReactNode) {
    this.setState(prev => {
      const next = new Map(prev);
      next.set(id, node);
      return next;
    });
  }

  private nextId(): string {
    this.idCounter += 1;
    return `portal-${this.idCounter}`;
  }
}

export const portalStore = new PortalStore();
