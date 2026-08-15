import { Store } from '@skyroc/hooks';
import type { DialogAction, DialogOptions } from './types';

/** Dialog 的展示配置，用户回调由 onSettle 统一收口，不再随配置下发给组件 */
type DialogEntryOptions = Omit<DialogOptions, 'callback' | 'onCancel' | 'onConfirm'>;

/** 结算回调，对每个 Dialog 恰好触发一次 */
type DialogSettle = (action: DialogAction, inputValue?: string) => void;

/** 当前 Dialog 条目 */
interface DialogEntry {
  /** 唯一标识 */
  id: string;
  /** 结算回调 */
  onSettle: DialogSettle;
  /** 展示配置 */
  options: DialogEntryOptions;
  /** 是否已结算，结算后所有关闭路径都不再触发回调 */
  settled: boolean;
  /** 是否可见，false 表示正在播放退场动画、尚未卸载 */
  visible: boolean;
}

/**
 * Dialog 状态管理器，继承 Store 基类获得订阅能力（单例，同时只显示一个对话框）
 *
 * 结算（回调 + resolve）与卸载被拆成 close / destroy 两步：命令式 Dialog 挂在 Portal 上， 关闭时若直接把节点摘掉，Popup 的 isVisible 从来不会变成
 * false，react-native-modal 的退场动画也就无从播放， 对话框会硬闪消失。这里先把 visible 置 false 让动画跑完，等 onClosed 回来再真正移除条目。
 *
 * 结算只认第一次：Dialog 关闭时会依次触发 onConfirm 与 onUpdateShow(false)，两条路径都会走到 close， 没有 settled 标记就会把一次「确定」记成「确定 + 取消」两次操作。
 */
class DialogManager extends Store<DialogEntry | null> {
  private idCounter = 0;

  constructor() {
    super(null);
  }

  /**
   * 结算并开始关闭当前 Dialog
   *
   * 传 id 时只关闭仍在展示的那一条：命令式句柄可能在被顶替之后才调用，此时它指向的对话框早已结算。
   */
  close(id: string | undefined, action: DialogAction, inputValue?: string) {
    const current = this.state;

    if (!current || current.settled) return;
    if (id && current.id !== id) return;

    this.setState({ ...current, settled: true, visible: false });

    // 回调放在状态提交之后：回调里再调 showDialog 时看到的应当是已经结算的状态
    current.onSettle(action, inputValue);
  }

  /** 退场动画播放完毕后移除条目 */
  destroy(id: string) {
    const current = this.state;

    if (!current || current.id !== id) return;

    this.setState(null);
  }

  /** 打开一个 Dialog（顶替当前这条），返回其 id */
  open(options: DialogEntryOptions, onSettle: DialogSettle): string {
    const replaced = this.state;
    const entry: DialogEntry = { id: this.nextId(), onSettle, options, settled: false, visible: true };

    this.setState(entry);

    // 被顶替的那条按取消结算，否则它的 Promise 会永远挂起
    if (replaced && !replaced.settled) {
      replaced.onSettle('cancel');
    }

    return entry.id;
  }

  private nextId(): string {
    this.idCounter += 1;
    return `dialog-${this.idCounter}`;
  }
}

const dialogManager = new DialogManager();

export { dialogManager };
export type { DialogEntry, DialogEntryOptions, DialogSettle };
