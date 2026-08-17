import { createElement } from 'react';
import type { PortalHandle } from '../portal/types';
import { mountPortal } from '../portal/mount-portal';
import { ShareSheet } from './ShareSheet';
import type { ShareSheetCallOptions, ShareSheetOption, ShareSheetResult } from './types';

/** 当前活跃的 ShareSheet portal 句柄 */
let activeHandle: PortalHandle | null = null;

/** 命令式显示分享面板，返回 Promise，选中 resolve 结果对象，取消 resolve null */
function showShareSheet(options: ShareSheetCallOptions): Promise<ShareSheetResult | null> {
  if (activeHandle) {
    activeHandle.unmount();
    activeHandle = null;
  }

  return new Promise<ShareSheetResult | null>(resolve => {
    function handleResult(result: ShareSheetResult | null) {
      options.callback?.(result);
      resolve(result);

      activeHandle?.unmount();
      activeHandle = null;
    }

    const element = createElement(ShareSheet, {
      ...options,
      show: true,
      onSelect(option: ShareSheetOption, index: number) {
        options.onSelect?.(option, index);
        handleResult({ index, option });
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

/** 关闭当前分享面板 */
function closeShareSheet() {
  if (activeHandle) {
    activeHandle.unmount();
    activeHandle = null;
  }
}

export { closeShareSheet, showShareSheet };
