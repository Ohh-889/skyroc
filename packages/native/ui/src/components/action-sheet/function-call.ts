import { createElement } from 'react';
import { mountPortal } from '../portal/mount-portal';
import { portalStore } from '../portal/portal-store';
import type { PortalHandle } from '../portal/types';
import { actionSheetManager } from './action-sheet-manager';
import { ActionSheetRenderer } from './ActionSheetRenderer';
import type { ActionSheetOptions, ActionSheetResult } from './types';

/** ActionSheetRenderer 的 Portal 句柄，未挂载时为 null */
let portalHandle: PortalHandle | null = null;

/**
 * 确保 ActionSheetRenderer 已挂载到 PortalHost
 *
 * 不能只记一个布尔标记：portalStore.clear()、Fast Refresh 都会把已挂载的节点清掉，标记却仍停在 true， ActionSheet 会从此静默失效。每次都向 store
 * 核对真实挂载状态，重挂的成本也只是一次 Map 查找。
 */
function ensurePortal() {
  if (portalHandle && portalStore.has(portalHandle.id)) return;

  portalHandle = mountPortal(createElement(ActionSheetRenderer));
}

/**
 * 命令式显示操作面板，返回 Promise：选中 resolve 结果对象，取消 / 遮罩关闭 resolve null
 *
 * 命令式调用没有外部状态承接选中值，所以 closeOnClickAction 默认打开——否则点完一项面板会一直挂在那里。
 */
function showActionSheet(options: ActionSheetOptions): Promise<ActionSheetResult | null> {
  ensurePortal();

  const { callback, onCancel, onSelect, ...sheetOptions } = options;

  return new Promise<ActionSheetResult | null>(resolve => {
    /** 结算：用户回调与 Promise 都只在这里触发，由 actionSheetManager 保证恰好一次 */
    function settle(result: ActionSheetResult | null) {
      if (result) {
        onSelect?.(result.action, result.index);
      } else {
        onCancel?.();
      }

      callback?.(result);
      resolve(result);
    }

    actionSheetManager.open({ closeOnClickAction: true, ...sheetOptions }, settle);
  });
}

/** 关闭当前操作面板，按取消结算：等待中的 Promise 会 resolve 成 null 而不是永远挂起 */
function closeActionSheet() {
  actionSheetManager.close(undefined, null);
}

export { closeActionSheet, showActionSheet };
