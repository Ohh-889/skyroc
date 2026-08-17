import { createElement } from 'react';
import { mountPortal } from '../portal/mount-portal';
import { portalStore } from '../portal/portal-store';
import type { PortalHandle } from '../portal/types';
import { shareSheetManager } from './share-sheet-manager';
import { ShareSheetRenderer } from './ShareSheetRenderer';
import type { ShareSheetCallOptions, ShareSheetResult } from './types';

/** ShareSheetRenderer 的 Portal 句柄，未挂载时为 null */
let portalHandle: PortalHandle | null = null;

/**
 * 确保 ShareSheetRenderer 已挂载到 PortalHost
 *
 * 不能只记一个布尔标记：portalStore.clear()、Fast Refresh 都会把已挂载的节点清掉，标记却仍停在 true， ShareSheet 会从此静默失效。每次都向 store
 * 核对真实挂载状态，重挂的成本也只是一次 Map 查找。
 */
function ensurePortal() {
  if (portalHandle && portalStore.has(portalHandle.id)) return;

  portalHandle = mountPortal(createElement(ShareSheetRenderer));
}

/**
 * 命令式显示分享面板，返回 Promise：选中 resolve 结果对象，取消 / 遮罩关闭 resolve null
 *
 * 命令式调用没有外部状态承接选中项，所以 closeOnSelect 默认打开——否则点完一项面板会一直挂在那里。
 */
function showShareSheet(options: ShareSheetCallOptions): Promise<ShareSheetResult | null> {
  ensurePortal();

  const { callback, onCancel, onSelect, ...sheetOptions } = options;

  return new Promise<ShareSheetResult | null>(resolve => {
    /** 结算：用户回调与 Promise 都只在这里触发，由 shareSheetManager 保证恰好一次 */
    function settle(result: ShareSheetResult | null) {
      if (result) {
        onSelect?.(result.option, result.index, result.rowIndex);
      } else {
        onCancel?.();
      }

      callback?.(result);
      resolve(result);
    }

    shareSheetManager.open({ closeOnSelect: true, ...sheetOptions }, settle);
  });
}

/** 关闭当前分享面板，按取消结算：等待中的 Promise 会 resolve 成 null 而不是永远挂起 */
function closeShareSheet() {
  shareSheetManager.close(undefined, null);
}

export { closeShareSheet, showShareSheet };
