import { useStore } from '@skyroc/hooks';
import { shareSheetManager } from './share-sheet-manager';
import { ShareSheet } from './ShareSheet';
import type { ShareSheetOption, ShareSheetResult } from './types';

/** ShareSheet 渲染器，通过 Portal 自动挂载，订阅 shareSheetManager 渲染当前面板 */
const ShareSheetRenderer = () => {
  const entry = useStore(shareSheetManager);

  /** 所有出口的唯一收口：结算的同时把条目摘掉，节点跟着卸载，不留正在退场的那一帧 */
  function handleAction(result: ShareSheetResult | null) {
    shareSheetManager.close(entry?.id, result);
  }

  function handleSelect(option: ShareSheetOption, index: number, rowIndex: number) {
    handleAction({ index, option, rowIndex });
  }

  function handleCancel() {
    handleAction(null);
  }

  function handleUpdateShow(show: boolean) {
    // 选中 / 取消已经先一步结算过，这里兜住的是点遮罩、下拉、返回键这类没有动作的关闭
    if (show) return;

    handleCancel();
  }

  if (!entry) return null;

  // 条目存在就一定是展示中，show 恒为 true；Key 落在 entry.id 上：换一条面板时走卸载 + 重挂，
  // 不会把上一条的展开状态串下去
  return (
    <ShareSheet
      {...entry.options}
      key={entry.id}
      show
      onCancel={handleCancel}
      onSelect={handleSelect}
      onUpdateShow={handleUpdateShow}
    />
  );
};

export { ShareSheetRenderer };
