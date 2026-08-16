import { createElement } from 'react';
import type { PortalHandle } from '../portal/types';
import { mountPortal } from '../portal/mount-portal';
import { ActionSheet } from './ActionSheet';
import type { ActionSheetAction, ActionSheetOptions, ActionSheetResult } from './types';

/** 当前活跃的 ActionSheet portal 句柄 */
let activeHandle: PortalHandle | null = null;

/** 命令式显示操作面板，返回 Promise，选中 resolve 结果对象，取消 resolve null */
function showActionSheet(options: ActionSheetOptions): Promise<ActionSheetResult | null> {
  // 关闭已有面板
  if (activeHandle) {
    activeHandle.unmount();
    activeHandle = null;
  }

  return new Promise<ActionSheetResult | null>(resolve => {
    function handleResult(result: ActionSheetResult | null) {
      options.callback?.(result);
      resolve(result);

      activeHandle?.unmount();
      activeHandle = null;
    }

    const element = createElement(ActionSheet, {
      ...options,
      show: true,
      closeOnClickAction: options.closeOnClickAction ?? true,
      onSelect(action: ActionSheetAction, index: number) {
        options.onSelect?.(action, index);
        handleResult({ action, index });
      },
      onCancel() {
        options.onCancel?.();
        handleResult(null);
      },
      onUpdateShow(show: boolean) {
        if (!show) {
          handleResult(null);
        }
      }
    });

    activeHandle = mountPortal(element);
  });
}

/** 关闭当前操作面板 */
function closeActionSheet() {
  if (activeHandle) {
    activeHandle.unmount();
    activeHandle = null;
  }
}

export { closeActionSheet, showActionSheet };
