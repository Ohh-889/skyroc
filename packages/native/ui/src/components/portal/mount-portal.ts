import type { ReactNode } from 'react';
import { portalStore } from './portal-store';
import type { PortalHandle, PortalOptions } from './types';

/**
 * 命令式挂载一个 ReactNode 到 PortalHost，返回控制句柄
 *
 * 传入的是节点快照而不是组件：闭包里的 state 定格在挂载那一刻，内容变化必须显式调用 update。需要跟随 React 渲染自动同步时，请改用声明式的 Portal 组件。
 *
 * 只能在 effect、事件回调等提交阶段调用；渲染期间调用会触发 React 的跨组件更新警告。
 */
function mountPortal(node: ReactNode, options?: PortalOptions): PortalHandle {
  const id = portalStore.mount(node, options);

  return {
    id,
    unmount() {
      portalStore.unmount(id);
    },
    update(nextNode: ReactNode, nextOptions?: PortalOptions) {
      portalStore.update(id, nextNode, nextOptions);
    }
  };
}

export { mountPortal };
