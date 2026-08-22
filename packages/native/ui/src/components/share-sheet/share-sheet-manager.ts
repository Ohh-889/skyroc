import { Store } from '@skyroc/hooks';
import type { ShareSheetCallOptions, ShareSheetResult } from './types';

/** ShareSheet 的展示配置，用户回调由 onSettle 统一收口，不再随配置下发给组件 */
type ShareSheetEntryOptions = Omit<ShareSheetCallOptions, 'callback' | 'onCancel' | 'onSelect'>;

/** 结算回调，对每个 ShareSheet 恰好触发一次；取消 / 遮罩关闭结算为 null */
type ShareSheetSettle = (result: ShareSheetResult | null) => void;

/** 当前 ShareSheet 条目 */
interface ShareSheetEntry {
  /** 唯一标识 */
  id: string;
  /** 结算回调 */
  onSettle: ShareSheetSettle;
  /** 展示配置 */
  options: ShareSheetEntryOptions;
}

/**
 * ShareSheet 状态管理器，继承 Store 基类获得订阅能力（单例，同时只显示一个面板）
 *
 * 关闭一步到位：结算的同时把条目从 store 摘掉。早先拆成 close / destroy 两步是想让退场动画播完再卸载，代价是 visible 已经置 false 的那一帧还挂在树上，会先闪一下结算完的旧内容——比没有动画更难看。
 *
 * 条目一关就置空，因此不再需要 settled 标记：选中一项会依次触发 onSelect 与 onUpdateShow(false)，两条路径都会走到 close， 第二次进来时 state 已经是
 * null，天然只结算一次，不会把一次「选中」记成「选中 + 取消」两次回调。
 */
class ShareSheetManager extends Store<ShareSheetEntry | null> {
  private idCounter = 0;

  constructor() {
    super(null);
  }

  /**
   * 结算并销毁当前面板
   *
   * 传 id 时只关闭仍在展示的那一条：命令式句柄可能在被顶替之后才调用，此时它指向的面板早已关闭。
   */
  close(id: string | undefined, result: ShareSheetResult | null) {
    const current = this.state;

    if (!current) return;
    if (id && current.id !== id) return;

    this.setState(null);

    // 回调放在状态提交之后：回调里再调 showShareSheet 时看到的应当是已经关闭的状态
    current.onSettle(result);
  }

  /** 打开一个面板（顶替当前这条），返回其 id */
  open(options: ShareSheetEntryOptions, onSettle: ShareSheetSettle): string {
    const replaced = this.state;
    const entry: ShareSheetEntry = { id: this.nextId(), onSettle, options };

    this.setState(entry);

    // 被顶替的那条按取消结算，否则它的 Promise 会永远挂起；能留在 store 里就说明还没结算过
    if (replaced) {
      replaced.onSettle(null);
    }

    return entry.id;
  }

  private nextId(): string {
    this.idCounter += 1;
    return `share-sheet-${this.idCounter}`;
  }
}

const shareSheetManager = new ShareSheetManager();

export { shareSheetManager };
export type { ShareSheetEntry, ShareSheetEntryOptions, ShareSheetSettle };
