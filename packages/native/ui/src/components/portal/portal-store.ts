import { Store } from '@skyroc/hooks';
import type { ReactNode } from 'react';
import type { PortalEntry, PortalOptions } from './types';

/** Portal 状态管理器，管理所有挂载到 PortalHost 的节点 */
class PortalStore extends Store<Map<string, PortalEntry>> {
  private idCounter = 0;

  /** 已挂载的 PortalHost 数量，仅用于开发期诊断，不参与渲染 */
  private hostCount = 0;

  /** 缺失 host 的检查只做一次，避免每次挂载都排一个定时器 */
  private missingHostChecked = false;

  constructor() {
    super(new Map());
  }

  /**
   * 清空所有 portal 节点，用于路由切换、测试用例之间的状态复位
   *
   * 注意这是一次性的强制清场：被清掉的节点不会因为后续 update 而复活，仍然挂载着的 Portal 组件需要重新挂载才能恢复显示。
   */
  clear() {
    this.setState(prev => (prev.size === 0 ? prev : new Map()));
  }

  /**
   * 指定 portal 节点是否仍在挂载中
   *
   * 供命令式调用方核对自己持有的句柄是否还有效：clear() 与 Fast Refresh 都会把节点清掉，只靠调用方自己的布尔标记会误判成「已挂载」。
   */
  has(id: string): boolean {
    return this.state.has(id);
  }

  /** 挂载一个 portal 节点，返回其 id */
  mount(node: ReactNode, options: PortalOptions = {}): string {
    const { zIndex = 0 } = options;

    const id = this.nextId();

    this.setState(prev => {
      const next = new Map(prev);
      next.set(id, { node, zIndex });
      return next;
    });

    this.checkHostMissing();

    return id;
  }

  /** 注册一个 PortalHost，返回注销函数 */
  registerHost() {
    this.hostCount += 1;

    if (__DEV__ && this.hostCount > 1) {
      console.warn('[Portal] 检测到多个 PortalHost，同一批节点会被重复渲染，请只在应用根节点保留一个。');
    }

    return () => {
      this.hostCount -= 1;
    };
  }

  /** 卸载指定 portal 节点 */
  unmount(id: string) {
    this.setState(prev => {
      if (!prev.has(id)) return prev;

      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }

  /**
   * 更新指定 portal 节点的内容与层级
   *
   * 节点已被卸载时直接忽略：异步回调（动画结束、请求返回）里迟到的 update 不应该让已经卸载的节点重新出现在屏幕上。
   */
  update(id: string, node: ReactNode, options: PortalOptions = {}) {
    this.setState(prev => {
      const entry = prev.get(id);

      if (!entry) return prev;

      const next = new Map(prev);
      next.set(id, { node, zIndex: options.zIndex ?? entry.zIndex });
      return next;
    });
  }

  /**
   * 没有 host 时挂载会静默失败，这里补一条开发期提示
   *
   * 检查延后到下一个 tick：effect 自下而上执行，子组件挂载 portal 时根节点的 PortalHost 往往还没注册，同步判断必然误报。
   */
  private checkHostMissing() {
    if (!__DEV__ || this.missingHostChecked || this.hostCount > 0) return;

    this.missingHostChecked = true;

    setTimeout(() => {
      if (this.hostCount > 0) return;

      console.warn(
        '[Portal] 挂载了 portal 节点但没有找到 PortalHost，内容不会被渲染，请在应用根节点放置 <PortalHost />。'
      );
    }, 0);
  }

  private nextId(): string {
    this.idCounter += 1;
    return `portal-${this.idCounter}`;
  }
}

export const portalStore = new PortalStore();
