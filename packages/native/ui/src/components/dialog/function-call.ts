import { createElement } from 'react';
import type { PortalHandle } from '../portal/types';
import { mountPortal } from '../portal/mount-portal';
import { Dialog } from './Dialog';
import type { DialogAction, DialogOptions } from './types';

/** 当前活跃的 Dialog portal 句柄 */
let activeHandle: PortalHandle | null = null;

function parseOptions(options: DialogOptions | string): DialogOptions {
  if (typeof options === 'string') {
    return { message: options };
  }
  return options;
}

/** 命令式显示对话框，返回 Promise，resolve 值为用户操作类型 */
function showDialog(options: DialogOptions | string): Promise<DialogAction> {
  const parsed = parseOptions(options);

  // 关闭已有对话框
  if (activeHandle) {
    activeHandle.unmount();
    activeHandle = null;
  }

  return new Promise<DialogAction>(resolve => {
    function handleAction(action: DialogAction, inputValue?: string) {
      parsed.callback?.(action, inputValue);
      resolve(action);

      activeHandle?.unmount();
      activeHandle = null;
    }

    const element = createElement(Dialog, {
      ...parsed,
      show: true,
      onConfirm(inputValue?: string) {
        parsed.onConfirm?.(inputValue);
        handleAction('confirm', inputValue);
      },
      onCancel(inputValue?: string) {
        parsed.onCancel?.(inputValue);
        handleAction('cancel', inputValue);
      },
      onUpdateShow(show: boolean) {
        if (!show) {
          handleAction('cancel');
        }
      }
    });

    activeHandle = mountPortal(element);
  });
}

/** 命令式显示确认对话框（自动显示取消按钮） */
function showConfirmDialog(options: DialogOptions | string): Promise<DialogAction> {
  const parsed = parseOptions(options);
  return showDialog({ showCancelButton: true, ...parsed });
}

/** 关闭当前对话框 */
function closeDialog() {
  if (activeHandle) {
    activeHandle.unmount();
    activeHandle = null;
  }
}

export { closeDialog, showConfirmDialog, showDialog };
