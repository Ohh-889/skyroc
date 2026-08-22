import { useStore } from '@skyroc/hooks';
import { Dialog } from './Dialog';
import { dialogManager } from './dialog-manager';
import type { DialogAction } from './types';

/** Dialog 渲染器，通过 Portal 自动挂载，订阅 dialogManager 渲染当前对话框 */
const DialogRenderer = () => {
  const entry = useStore(dialogManager);

  /** 所有出口的唯一收口：结算的同时把条目摘掉，节点跟着卸载，不留正在退场的那一帧 */
  function handleAction(action: DialogAction, inputValue?: string) {
    dialogManager.close(entry?.id, action, inputValue);
  }

  function handleCancel(inputValue?: string) {
    handleAction('cancel', inputValue);
  }

  function handleConfirm(inputValue?: string) {
    handleAction('confirm', inputValue);
  }

  function handleUpdateShow(show: boolean) {
    // 确定 / 取消已经先一步结算过，这里兜住的是遮罩点击、返回键这类没有动作的关闭
    if (show) return;

    handleCancel();
  }

  if (!entry) return null;

  // 条目存在就一定是展示中，show 恒为 true；Key 落在 entry.id 上：换一个对话框时走卸载 + 重挂，
  // 输入框内容与 loading 状态不会串到下一条
  return (
    <Dialog
      {...entry.options}
      key={entry.id}
      show
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      onUpdateShow={handleUpdateShow}
    />
  );
};

export { DialogRenderer };
