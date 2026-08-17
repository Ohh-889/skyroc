import { createElement } from 'react';
import { mountPortal } from '../portal/mount-portal';
import { portalStore } from '../portal/portal-store';
import type { PortalHandle } from '../portal/types';
import { TOAST_PORTAL_Z_INDEX } from './toast-defaults';
import { toastManager } from './toast-manager';
import { ToastRenderer } from './ToastRenderer';
import type { ToastInstance, ToastOptions, ToastType } from './types';

/** ToastRenderer 的 Portal 句柄，未挂载时为 null */
let portalHandle: PortalHandle | null = null;

/**
 * 确保 ToastRenderer 已挂载到 PortalHost
 *
 * 不能只记一个布尔标记：portalStore.clear()、Fast Refresh 都会把已挂载的节点清掉，标记却仍停在 true， Toast 会从此静默失效。每次都向 store 核对真实挂载状态，重挂的成本也只是一次 Map
 * 查找。
 */
function ensurePortal() {
  if (portalHandle && portalStore.has(portalHandle.id)) return;

  portalHandle = mountPortal(createElement(ToastRenderer), { zIndex: TOAST_PORTAL_Z_INDEX });
}

/** 是否允许同时显示多个 Toast */
let allowMultiple = false;

/** 全局默认配置 */
let defaultOptions: ToastOptions = {};

/** 按类型的默认配置 */
const defaultOptionsMap = new Map<ToastType, ToastOptions>();

function parseOptions(options: ToastOptions | string): ToastOptions {
  if (typeof options === 'string') {
    return { message: options };
  }
  return options;
}

/** 显示 Toast */
function showToast(options: ToastOptions | string): ToastInstance {
  ensurePortal();
  const parsed = parseOptions(options);
  const type = parsed.type ?? 'text';
  const typeDefaults = defaultOptionsMap.get(type) ?? {};
  const merged: ToastOptions = { ...defaultOptions, ...typeDefaults, ...parsed };

  const id = allowMultiple ? toastManager.add(merged) : toastManager.solo(merged);

  return {
    close() {
      toastManager.remove(id);
    },
    update(newOptions: ToastOptions) {
      toastManager.update(id, newOptions);
    }
  };
}

/** 显示 Loading Toast，默认常驻，需要手动 close 或 update 成其他类型 */
function showLoadingToast(options: ToastOptions | string): ToastInstance {
  const parsed = parseOptions(options);
  return showToast({ ...parsed, type: 'loading' });
}

/** 显示成功 Toast */
function showSuccessToast(options: ToastOptions | string): ToastInstance {
  const parsed = parseOptions(options);
  return showToast({ ...parsed, type: 'success' });
}

/** 显示失败 Toast */
function showFailToast(options: ToastOptions | string): ToastInstance {
  const parsed = parseOptions(options);
  return showToast({ ...parsed, type: 'fail' });
}

/** 关闭 Toast */
function closeToast() {
  toastManager.closeAll();
}

/** 设置全局默认配置或按类型设置默认配置 */
function setToastDefaultOptions(options: ToastOptions): void;
function setToastDefaultOptions(type: ToastType, options: ToastOptions): void;
function setToastDefaultOptions(typeOrOptions: ToastOptions | ToastType, options?: ToastOptions) {
  if (typeof typeOrOptions === 'string') {
    defaultOptionsMap.set(typeOrOptions, options ?? {});
  } else {
    defaultOptions = typeOrOptions;
  }
}

/** 重置默认配置 */
function resetToastDefaultOptions(type?: ToastType) {
  if (type) {
    defaultOptionsMap.delete(type);
  } else {
    defaultOptions = {};
    defaultOptionsMap.clear();
  }
}

/** 允许同时显示多个 Toast */
function allowMultipleToast(value = true) {
  allowMultiple = value;
}

export {
  allowMultipleToast,
  closeToast,
  resetToastDefaultOptions,
  setToastDefaultOptions,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
  showToast
};
