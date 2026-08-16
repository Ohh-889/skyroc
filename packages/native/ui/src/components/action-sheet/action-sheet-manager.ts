import { Store } from '@skyroc/hooks';
import type { ActionSheetOptions, ActionSheetResult } from './types';

/** ActionSheet 的展示配置，用户回调由 onSettle 统一收口，不再随配置下发给组件 */
type ActionSheetEntryOptions = Omit<ActionSheetOptions, 'callback' | 'onCancel' | 'onSelect'>;

/** 结算回调，对每个 ActionSheet 恰好触发一次；取消 / 遮罩关闭结算为 null */
type ActionSheetSettle = (result: ActionSheetResult | null) => void;

/** 当前 ActionSheet 条目 */
interface ActionSheetEntry {
  /** 唯一标识 */
  id: string;
  /** 结算回调 */
  onSettle: ActionSheetSettle;
  /** 展示配置 */
  options: ActionSheetEntryOptions;
  /** 是否已结算，结算后所有关闭路径都不再触发回调 */
  settled: boolean;
  /** 是否可见，false 表示正在播放退场动画、尚未卸载 */
  visible: boolean;
}

/**
 * ActionSheet 状态管理器，继承 Store 基类获得订阅能力（单例，同时只显示一个面板）
 *
 * 结算（回调 + resolve）与卸载被拆成 close / destroy 两步：命令式面板挂在 Portal 上， 关闭时若直接把节点摘掉，Sheet 的 show 从来不会变成 false，gorhom 的退场动画也就无从播放，
 * 面板会硬闪消失。这里先把 visible 置 false 让动画跑完，等 Sheet 的 onClosed 回来再真正移除条目。
 *
 * 结算只认第一次：选中一项会依次触发 onSelect 与 onUpdateShow(false)，两条路径都会走到 close， 没有 settled 标记就会把一次「选中」记成「选中 + 取消」两次回调。
 */
class ActionSheetManager extends Store<ActionSheetEntry | null> {
  private idCounter = 0;

  constructor() {
    super(null);
  }

  /**
   * 结算并开始关闭当前面板
   *
   * 传 id 时只关闭仍在展示的那一条：命令式句柄可能在被顶替之后才调用，此时它指向的面板早已结算。
   */
  close(id: string | undefined, result: ActionSheetResult | null) {
    const current = this.state;

    if (!current || current.settled) return;
    if (id && current.id !== id) return;

    this.setState({ ...current, settled: true, visible: false });

    // 回调放在状态提交之后：回调里再调 showActionSheet 时看到的应当是已经结算的状态
    current.onSettle(result);
  }

  /** 退场动画播放完毕后移除条目 */
  destroy(id: string) {
    const current = this.state;

    if (!current || current.id !== id) return;

    this.setState(null);
  }

  /** 打开一个面板（顶替当前这条），返回其 id */
  open(options: ActionSheetEntryOptions, onSettle: ActionSheetSettle): string {
    const replaced = this.state;
    const entry: ActionSheetEntry = { id: this.nextId(), onSettle, options, settled: false, visible: true };

    this.setState(entry);

    // 被顶替的那条按取消结算，否则它的 Promise 会永远挂起
    if (replaced && !replaced.settled) {
      replaced.onSettle(null);
    }

    return entry.id;
  }

  private nextId(): string {
    this.idCounter += 1;
    return `action-sheet-${this.idCounter}`;
  }
}

const actionSheetManager = new ActionSheetManager();

export { actionSheetManager };
export type { ActionSheetEntry, ActionSheetEntryOptions, ActionSheetSettle };
