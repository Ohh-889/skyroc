import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  destroyMessage,
  destroyNotification,
  initAntdUI,
  showConfirmModal,
  showErrorMessage,
  showErrorModal,
  showErrorNotification,
  showInfoMessage,
  showInfoModal,
  showInfoNotification,
  showLoadingMessage,
  showMessage,
  showModal,
  showNotification,
  showSuccessMessage,
  showSuccessModal,
  showSuccessNotification,
  showWarningMessage,
  showWarningModal,
  showWarningNotification
} from '@shell/theme/antd/ui';

function makeMessageMock() {
  return {
    open: vi.fn(),
    destroy: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn()
  };
}

function makeNotificationMock() {
  return {
    open: vi.fn(),
    destroy: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  };
}

function makeModalMock() {
  return {
    confirm: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  };
}

let message: ReturnType<typeof makeMessageMock>;
let modal: ReturnType<typeof makeModalMock>;
let notification: ReturnType<typeof makeNotificationMock>;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('initAntdUI 之前调用 getter 抛错', () => {
  // 在隔离的 import scope 里执行，避免被其他测试初始化污染
  beforeEach(async () => {
    vi.resetModules();
  });

  it('未初始化时 showMessage 抛 "message is not initialized"', async () => {
    const mod = await import('@shell/theme/antd/ui');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mod.showMessage({ content: 'x' } as any)).toThrow('message is not initialized');
  });

  it('未初始化时 showNotification 抛 "notification is not initialized"', async () => {
    const mod = await import('@shell/theme/antd/ui');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mod.showNotification({ message: 'x' } as any)).toThrow('notification is not initialized');
  });

  it('未初始化时 showModal 抛 "modal is not initialized"', async () => {
    const mod = await import('@shell/theme/antd/ui');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => mod.showModal({ title: 'x' } as any)).toThrow('modal is not initialized');
  });
});

describe('initAntdUI 后转发到对应实例', () => {
  beforeEach(() => {
    message = makeMessageMock();
    modal = makeModalMock();
    notification = makeNotificationMock();

    initAntdUI(message as any, modal as any, notification as any);
  });

  it('message 系列调用对应方法', () => {
    showMessage({ content: 'open' } as any);
    showSuccessMessage('ok');
    showErrorMessage('err');
    showInfoMessage('info');
    showWarningMessage('warn');
    showLoadingMessage('loading');
    destroyMessage('k');

    expect(message.open).toHaveBeenCalledWith({ content: 'open' });
    expect(message.success).toHaveBeenCalledWith('ok');
    expect(message.error).toHaveBeenCalledWith('err');
    expect(message.info).toHaveBeenCalledWith('info');
    expect(message.warning).toHaveBeenCalledWith('warn');
    expect(message.loading).toHaveBeenCalledWith('loading');
    expect(message.destroy).toHaveBeenCalledWith('k');
  });

  it('notification 系列调用对应方法', () => {
    showNotification({ message: 'open' } as any);
    showSuccessNotification({ message: 'ok' } as any);
    showErrorNotification({ message: 'err' } as any);
    showInfoNotification({ message: 'info' } as any);
    showWarningNotification({ message: 'warn' } as any);
    destroyNotification('k');

    expect(notification.open).toHaveBeenCalledOnce();
    expect(notification.success).toHaveBeenCalledOnce();
    expect(notification.error).toHaveBeenCalledOnce();
    expect(notification.info).toHaveBeenCalledOnce();
    expect(notification.warning).toHaveBeenCalledOnce();
    expect(notification.destroy).toHaveBeenCalledWith('k');
  });

  it('modal：showModal / showConfirmModal 都走 confirm', () => {
    showModal({ title: 'a' } as any);
    showConfirmModal({ title: 'b' } as any);
    showInfoModal({ title: 'c' } as any);
    showSuccessModal({ title: 'd' } as any);
    showErrorModal({ title: 'e' } as any);
    showWarningModal({ title: 'f' } as any);

    expect(modal.confirm).toHaveBeenCalledTimes(2);
    expect(modal.info).toHaveBeenCalledOnce();
    expect(modal.success).toHaveBeenCalledOnce();
    expect(modal.error).toHaveBeenCalledOnce();
    expect(modal.warning).toHaveBeenCalledOnce();
  });
});
