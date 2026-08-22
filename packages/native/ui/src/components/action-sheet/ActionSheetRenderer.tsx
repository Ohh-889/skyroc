import { useStore } from '@skyroc/hooks';
import { actionSheetManager } from './action-sheet-manager';
import { ActionSheet } from './ActionSheet';
import type { ActionSheetAction, ActionSheetResult } from './types';

/** ActionSheet 渲染器，通过 Portal 自动挂载，订阅 actionSheetManager 渲染当前面板 */
const ActionSheetRenderer = () => {
  const entry = useStore(actionSheetManager);

  /** 所有出口的唯一收口：结算的同时把条目摘掉，节点跟着卸载，不留正在退场的那一帧 */
  function handleAction(result: ActionSheetResult | null) {
    actionSheetManager.close(entry?.id, result);
  }

  function handleSelect(action: ActionSheetAction, index: number) {
    handleAction({ action, index });
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
  // 选中值不会串到下一条
  return (
    <ActionSheet
      {...entry.options}
      key={entry.id}
      show
      onCancel={handleCancel}
      onSelect={handleSelect}
      onUpdateShow={handleUpdateShow}
    />
  );
};

export { ActionSheetRenderer };
