import { createElement } from 'react';
import { mountPortal } from '../portal/mount-portal';
import { notifyManager } from './notify-manager';
import { NotifyRenderer } from './NotifyRenderer';
import type { NotifyOptions } from './types';

/** 是否已通过 Portal 自动挂载 NotifyRenderer */
let portalMounted = false;

/** 确保 NotifyRenderer 已挂载到 PortalHost */
function ensurePortal() {
  if (!portalMounted) {
    mountPortal(createElement(NotifyRenderer));
    portalMounted = true;
  }
}

/** 全局默认配置 */
let defaultOptions: NotifyOptions = {};

function parseOptions(options: NotifyOptions | string): NotifyOptions {
  if (typeof options === 'string') {
    return { message: options };
  }
  return options;
}

/** 显示 Notify */
function showNotify(options: NotifyOptions | string) {
  ensurePortal();
  const parsed = parseOptions(options);
  const merged: NotifyOptions = { ...defaultOptions, ...parsed };
  notifyManager.show(merged);
}

/** 关闭 Notify */
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
