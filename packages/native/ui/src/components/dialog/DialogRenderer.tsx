import { useStore } from '@skyroc/hooks';
import { Dialog } from './Dialog';
import { dialogManager } from './dialog-manager';

/** Dialog 渲染器，通过 Portal 自动挂载，订阅 dialogManager 渲染当前对话框 */
const DialogRenderer = () => {
  const entry = useStore(dialogManager);

  function handleCancel(inputValue?: string) {
    dialogManager.close(entry?.id, 'cancel', inputValue);
  }

  function handleConfirm(inputValue?: string) {
    dialogManager.close(entry?.id, 'confirm', inputValue);
  }

  function handleUpdateShow(show: boolean) {
    // 确定 / 取消已经先一步结算过，这里兜住的是遮罩点击、返回键这类没有动作的关闭
    if (show) return;

    handleCancel();
  }

  function handleClosed() {
    if (!entry) return;

    dialogManager.destroy(entry.id);
  }

  if (!entry) return null;

  // Key 落在 entry.id 上：换一个对话框时走卸载 + 重挂，输入框内容与 loading 状态不会串到下一条
  return (
    <Dialog
      {...entry.options}
      key={entry.id}
      show={entry.visible}
      onCancel={handleCancel}
      onClosed={handleClosed}
      onConfirm={handleConfirm}
      onUpdateShow={handleUpdateShow}
    />
  );
};

export { DialogRenderer };
