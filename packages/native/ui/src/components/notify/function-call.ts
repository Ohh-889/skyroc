import { createElement } from 'react';
import { mountPortal } from '../portal/mount-portal';
import { portalStore } from '../portal/portal-store';
import type { PortalHandle } from '../portal/types';
import { NOTIFY_PORTAL_Z_INDEX } from './notify-defaults';
import { notifyManager } from './notify-manager';
import { NotifyRenderer } from './NotifyRenderer';
import type { NotifyInstance, NotifyOptions } from './types';

/** NotifyRenderer 的 Portal 句柄，未挂载时为 null */
let portalHandle: PortalHandle | null = null;

/**
 * 确保 NotifyRenderer 已挂载到 PortalHost
 *
 * 不能只记一个布尔标记：portalStore.clear()、Fast Refresh 都会把已挂载的节点清掉，标记却仍停在 true， Notify 会从此静默失效。每次都向 store 核对真实挂载状态，重挂的成本也只是一次
 * Map 查找。
 */
function ensurePortal() {
  if (portalHandle && portalStore.has(portalHandle.id)) return;

  portalHandle = mountPortal(createElement(NotifyRenderer), { zIndex: NOTIFY_PORTAL_Z_INDEX });
}

/** 全局默认配置 */
let defaultOptions: NotifyOptions = {};

function parseOptions(options: NotifyOptions | string): NotifyOptions {
  if (typeof options === 'string') {
    return { message: options };
  }
  return options;
}

/** 显示 Notify，返回可关闭 / 更新此条的实例句柄 */
function showNotify(options: NotifyOptions | string): NotifyInstance {
  ensurePortal();

  const parsed = parseOptions(options);
  const merged: NotifyOptions = { ...defaultOptions, ...parsed };
  const id = notifyManager.show(merged);

  return {
    close() {
      notifyManager.close(id);
    },
    update(newOptions: NotifyOptions) {
      notifyManager.update(id, newOptions);
    }
  };
}

/** 关闭当前 Notify */
function closeNotify() {
  notifyManager.close();
}

/** 设置全局默认配置 */
function setNotifyDefaultOptions(options: NotifyOptions) {
  defaultOptions = { ...defaultOptions, ...options };
}

/** 重置全局默认配置 */
function resetNotifyDefaultOptions() {
  defaultOptions = {};
}

export { closeNotify, resetNotifyDefaultOptions, setNotifyDefaultOptions, showNotify };
