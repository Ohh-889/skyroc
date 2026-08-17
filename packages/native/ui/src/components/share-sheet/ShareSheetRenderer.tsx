import { useStore } from '@skyroc/hooks';
import { shareSheetManager } from './share-sheet-manager';
import { ShareSheet } from './ShareSheet';
import type { ShareSheetOption } from './types';

/** ShareSheet 渲染器，通过 Portal 自动挂载，订阅 shareSheetManager 渲染当前面板 */
const ShareSheetRenderer = () => {
  const entry = useStore(shareSheetManager);

  function handleSelect(option: ShareSheetOption, index: number, rowIndex: number) {
    shareSheetManager.close(entry?.id, { index, option, rowIndex });
  }

  function handleCancel() {
    shareSheetManager.close(entry?.id, null);
  }

  function handleUpdateShow(show: boolean) {
    // 选中 / 取消已经先一步结算过，这里兜住的是点遮罩、下拉、返回键这类没有动作的关闭
    if (show) return;

    handleCancel();
  }

  function handleClosed() {
    if (!entry) return;

    shareSheetManager.destroy(entry.id);
  }

  if (!entry) return null;

  // Key 落在 entry.id 上：换一条面板时走卸载 + 重挂，不会把上一条的展开状态串下去
  return (
    <ShareSheet
      {...entry.options}
      key={entry.id}
      show={entry.visible}
      onCancel={handleCancel}
      onClosed={handleClosed}
      onSelect={handleSelect}
      onUpdateShow={handleUpdateShow}
    />
  );
};

export { ShareSheetRenderer };
