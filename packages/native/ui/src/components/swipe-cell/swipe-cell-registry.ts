/**
 * SwipeCell 的全局互斥表。
 *
 * 列表里同时展开多个 cell 几乎总是误操作，所以默认「同一时刻只有一个展开」。 需要并存的场景用 `exclusive={false}` 退出——退出的实例既不会挤掉别人，也不会被别人挤掉。
 */

/** 注册在互斥表里的 SwipeCell 句柄 */
interface SwipeCellEntry {
  /** 立即收起该实例，不经过 beforeClose */
  close: () => void;
}

/** 当前处于展开态且参与互斥的实例 */
const openCells = new Set<SwipeCellEntry>();

/**
 * 标记 entry 进入展开态，并收起其余参与互斥的实例。
 *
 * 收起动作刻意不走 `beforeClose`：被别的 cell 挤掉不是用户对该 cell 的主动操作，此时弹确认框只会打断手势。
 */
function registerOpenCell(entry: SwipeCellEntry) {
  // 先整体摘除再逐个回调，避免 close() 内部又去触碰正在遍历的集合
  const others = [...openCells].filter(item => item !== entry);

  openCells.clear();
  openCells.add(entry);

  for (const other of others) {
    other.close();
  }
}

/** 把 entry 移出互斥表；收起与卸载时都要调用 */
function unregisterOpenCell(entry: SwipeCellEntry) {
  openCells.delete(entry);
}

export { registerOpenCell, unregisterOpenCell };
export type { SwipeCellEntry };
