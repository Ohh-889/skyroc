import { createElement } from 'react';
import { mountPortal } from '../portal/mount-portal';
import { portalStore } from '../portal/portal-store';
import type { PortalHandle } from '../portal/types';
import { dialogManager } from './dialog-manager';
import { DialogRenderer } from './DialogRenderer';
import type { DialogAction, DialogOptions } from './types';

/** DialogRenderer 的 Portal 句柄，未挂载时为 null */
let portalHandle: PortalHandle | null = null;

/**
 * 确保 DialogRenderer 已挂载到 PortalHost
 *
 * 不能只记一个布尔标记：portalStore.clear()、Fast Refresh 都会把已挂载的节点清掉，标记却仍停在 true， Dialog 会从此静默失效。每次都向 store 核对真实挂载状态，重挂的成本也只是一次
 * Map 查找。
 */
function ensurePortal() {
  if (portalHandle && portalStore.has(portalHandle.id)) return;

  portalHandle = mountPortal(createElement(DialogRenderer));
}

function parseOptions(options: DialogOptions | string): DialogOptions {
  if (typeof options === 'string') {
    return { message: options };
  }
  return options;
}

/** 命令式显示对话框，返回 Promise，resolve 值为用户操作类型 */
function showDialog(options: DialogOptions | string): Promise<DialogAction> {
  ensurePortal();

  const { callback, onCancel, onConfirm, ...dialogOptions } = parseOptions(options);

  return new Promise<DialogAction>(resolve => {
    /** 结算：用户回调与 Promise 都只在这里触发，由 dialogManager 保证恰好一次 */
    function settle(action: DialogAction, inputValue?: string) {
      if (action === 'confirm') {
        onConfirm?.(inputValue);
      } else {
        onCancel?.(inputValue);
      }

      callback?.(action, inputValue);
      resolve(action);
    }

    dialogManager.open(dialogOptions, settle);
  });
}

/** 命令式显示确认对话框（自动显示取消按钮） */
function showConfirmDialog(options: DialogOptions | string): Promise<DialogAction> {
  const parsed = parseOptions(options);
  return showDialog({ showCancelButton: true, ...parsed });
}

/** 关闭当前对话框，按取消结算：等待中的 Promise 会 resolve 成 'cancel' 而不是永远挂起 */
function closeDialog() {
  dialogManager.close(undefined, 'cancel');
}

export { closeDialog, showConfirmDialog, showDialog };
