import { Store } from '@skyroc/hooks';
import { resolveDuration } from './toast-defaults';
import type { ToastOptions } from './types';

/** 带唯一标识的 Toast 条目 */
export interface ToastEntry extends ToastOptions {
  /** 唯一标识 */
  id: string;
}

/**
 * Toast 状态管理器，继承 Store 基类获得订阅能力
 *
 * 同时持有自动关闭的定时器：自动关闭属于生命周期而不是渲染，放在视图里会让「谁来卸载自己」这件事永远说不清， 也会让命令式 close() 与超时关闭走上两条行为不一致的路径。这里把关闭统一收口，onClose 也因此只可能触发一次。
 */
class ToastManager extends Store<ToastEntry[]> {
  private idCounter = 0;

  /** 各 Toast 的自动关闭定时器，key 为 Toast id */
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    super([]);
  }

  /** 添加一个 Toast，返回其 id */
  add(options: ToastOptions): string {
    const entry: ToastEntry = { ...options, id: this.nextId() };

    this.setState(prev => [...prev, entry]);
    this.schedule(entry);

    return entry.id;
  }

  /** 关闭所有 Toast */
  closeAll() {
    const closed = this.state;

    if (closed.length === 0) return;

    closed.forEach(entry => this.clearTimer(entry.id));
    this.setState([]);

    // 回调统一放在状态提交之后：回调里再调 showToast 时看到的应当是已经清空的状态
    closed.forEach(entry => entry.onClose?.());
  }

  /** 移除指定 Toast */
  remove(id: string) {
    const entry = this.state.find(item => item.id === id);

    if (!entry) return;

    this.clearTimer(id);
    this.setState(prev => prev.filter(item => item.id !== id));

    entry.onClose?.();
  }

  /** 清除所有已有 Toast 并创建一个新的，返回其 id */
  solo(options: ToastOptions): string {
    const closed = this.state;
    const entry: ToastEntry = { ...options, id: this.nextId() };

    closed.forEach(item => this.clearTimer(item.id));
    this.setState([entry]);
    this.schedule(entry);

    closed.forEach(item => item.onClose?.());

    return entry.id;
  }

  /** 原地更新指定 Toast 的内容（保持同一实例），并按新的 type / duration 重新计时 */
  update(id: string, options: ToastOptions) {
    const current = this.state.find(item => item.id === id);

    if (!current) return;

    const next: ToastEntry = { ...current, ...options };

    this.setState(prev => prev.map(item => (item.id === id ? next : item)));
    this.clearTimer(id);
    this.schedule(next);
  }

  private clearTimer(id: string) {
    const timer = this.timers.get(id);

    if (!timer) return;

    clearTimeout(timer);
    this.timers.delete(id);
  }

  private nextId(): string {
    this.idCounter += 1;
    return `toast-${this.idCounter}`;
  }

  /** 按 entry 解析出的延时排定自动关闭 */
  private schedule(entry: ToastEntry) {
    const duration = resolveDuration(entry);

    if (duration <= 0) return;

    this.timers.set(
      entry.id,
      setTimeout(() => this.remove(entry.id), duration)
    );
  }
}

export const toastManager = new ToastManager();
