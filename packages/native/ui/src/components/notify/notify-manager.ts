import { Store } from '@skyroc/hooks';
import { resolveDuration } from './notify-defaults';
import type { NotifyOptions } from './types';

/** 带唯一标识的 Notify 条目 */
interface NotifyEntry extends NotifyOptions {
  /** 唯一标识 */
  id: string;
}

/**
 * Notify 状态管理器，继承 Store 基类获得订阅能力（单例，同时只显示一条）
 *
 * 同时持有自动关闭的定时器：自动关闭属于生命周期而不是渲染，放在视图里会让「谁来卸载自己」这件事永远说不清， 也会让超时关闭、命令式关闭、被顶替三条路径走上行为不一致的分支。这里把关闭统一收口，onClose 因此对每条 Notify
 * 恰好触发一次。
 */
class NotifyManager extends Store<NotifyEntry | null> {
  private idCounter = 0;

  /** 当前 Notify 的自动关闭定时器 */
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    super(null);
  }

  /**
   * 关闭 Notify
   *
   * 传 id 时只关闭仍在展示的那一条：命令式句柄可能在被顶替之后才调用 close()，此时它指向的 Notify 早已关闭并回调过 onClose， 再关一次会误伤当前这条。
   */
  close(id?: string) {
    const closed = this.state;

    if (!closed) return;
    if (id && closed.id !== id) return;

    this.clearTimer();
    this.setState(null);

    // 回调放在状态提交之后：回调里再调 showNotify 时看到的应当是已经清空的状态
    closed.onClose?.();
  }

  /** 显示一条 Notify（顶替当前这条），返回其 id */
  show(options: NotifyOptions): string {
    const replaced = this.state;
    const entry: NotifyEntry = { ...options, id: this.nextId() };

    this.clearTimer();
    this.setState(entry);
    this.schedule(entry);

    // 被顶替的那条同样算关闭，否则它的 onClose 会永久丢失
    replaced?.onClose?.();

    return entry.id;
  }

  /** 原地更新指定 Notify 的内容（保持同一实例），并按新的 duration 重新计时 */
  update(id: string, options: NotifyOptions) {
    const current = this.state;

    if (!current || current.id !== id) return;

    const next: NotifyEntry = { ...current, ...options };

    this.setState(next);
    this.clearTimer();
    this.schedule(next);
  }

  private clearTimer() {
    if (!this.timer) return;

    clearTimeout(this.timer);
    this.timer = null;
  }

  private nextId(): string {
    this.idCounter += 1;
    return `notify-${this.idCounter}`;
  }

  /** 按 entry 解析出的延时排定自动关闭 */
  private schedule(entry: NotifyEntry) {
    const duration = resolveDuration(entry);

    if (duration <= 0) return;

    this.timer = setTimeout(() => this.close(entry.id), duration);
  }
}

const notifyManager = new NotifyManager();

export { notifyManager };
export type { NotifyEntry };
