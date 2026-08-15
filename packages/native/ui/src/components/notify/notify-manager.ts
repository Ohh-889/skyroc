import { Store } from '@skyroc/hooks';
import type { NotifyOptions } from './types';

/** 带唯一标识的 Notify 条目 */
interface NotifyEntry extends NotifyOptions {
  /** 唯一标识 */
  id: string;
}

/** Notify 状态管理器（单例模式，同时只显示一条） */
class NotifyManager extends Store<NotifyEntry | null> {
  private idCounter = 0;

  constructor() {
    super(null);
  }

  /** 关闭当前 Notify */
  close() {
    this.setState(null);
  }

  /** 显示一条 Notify，返回其 id */
  show(options: NotifyOptions): string {
    this.idCounter += 1;
    const id = `notify-${this.idCounter}`;
    this.setState({ ...options, id });
    return id;
  }
}

const notifyManager = new NotifyManager();

export { notifyManager };
export type { NotifyEntry };
