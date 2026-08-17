import { useStore } from '@skyroc/hooks';
import { actionSheetManager } from './action-sheet-manager';
import { ActionSheet } from './ActionSheet';
import type { ActionSheetAction } from './types';

/** ActionSheet 渲染器，通过 Portal 自动挂载，订阅 actionSheetManager 渲染当前面板 */
const ActionSheetRenderer = () => {
  const entry = useStore(actionSheetManager);

  function handleSelect(action: ActionSheetAction, index: number) {
    actionSheetManager.close(entry?.id, { action, index });
  }

  function handleCancel() {
    actionSheetManager.close(entry?.id, null);
  }

  function handleUpdateShow(show: boolean) {
    // 选中 / 取消已经先一步结算过，这里兜住的是点遮罩、下拉、返回键这类没有动作的关闭
    if (show) return;

    handleCancel();
  }

  function handleClosed() {
    if (!entry) return;

    actionSheetManager.destroy(entry.id);
  }

  if (!entry) return null;

  // Key 落在 entry.id 上：换一条面板时走卸载 + 重挂，选中值不会串到下一条
  return (
    <ActionSheet
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

export { ActionSheetRenderer };
