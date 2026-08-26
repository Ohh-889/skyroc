import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Sonner, message, notification } from '../src/preset/sonner';
import { render, screen } from './helpers/render';

interface ToastOptions {
  action?: unknown;
  cancel?: unknown;
  className?: string;
  classNames?: Record<string, string>;
  closeButton?: boolean;
  description?: ReactNode;
  duration?: number;
  id?: string | number;
  onAutoClose?: () => void;
  onDismiss?: () => void;
  position?: string;
}

const themeMock = vi.hoisted(() => ({
  useTheme: vi.fn(() => ({ theme: 'dark' }))
}));

function requestDone() {
  return Promise.resolve('done');
}

const sonnerMock = vi.hoisted(() => {
  function createToastMethod(fallbackId: string) {
    return vi.fn((_content: unknown, options?: { id?: string | number }) => options?.id ?? fallbackId);
  }

  const toast = Object.assign(createToastMethod('toast-id'), {
    dismiss: vi.fn((id?: string | number) => id),
    error: createToastMethod('error-id'),
    info: createToastMethod('info-id'),
    loading: createToastMethod('loading-id'),
    promise: vi.fn(() => 'promise-id'),
    success: createToastMethod('success-id'),
    warning: createToastMethod('warning-id')
  });

  return {
    toast,
    toasterProps: [] as Record<string, unknown>[],
    useSonner: vi.fn()
  };
});

vi.mock('next-themes', () => ({
  useTheme: themeMock.useTheme
}));

vi.mock('sonner', () => ({
  Toaster: (props: Record<string, unknown>) => {
    sonnerMock.toasterProps.push(props);

    return (
      <div
        data-expand={String(props.expand)}
        data-position={String(props.position)}
        data-rich-colors={String(props.richColors)}
        data-testid="sonner-toaster"
        data-theme={String(props.theme)}
      />
    );
  },
  toast: sonnerMock.toast,
  useSonner: sonnerMock.useSonner
}));

describe('Sonner', () => {
  beforeEach(() => {
    message.destroy();
    notification.destroy();
    message.config({ duration: 3000, maxCount: undefined, position: 'top-center' });
    notification.config({ closeButton: true, duration: 4500, maxCount: undefined, position: 'top-right' });
    sonnerMock.toasterProps.length = 0;
    themeMock.useTheme.mockReturnValue({ theme: 'dark' });
    vi.clearAllMocks();
  });

  it('renders the config-aware toaster with theme and merged toast class names', () => {
    render(
      <ConfigProvider sonner={{ expand: false, position: 'bottom-left', richColors: true }}>
        <Sonner
          toastOptions={{
            classNames: {
              title: 'custom-toast-title',
              toast: 'custom-toast-root'
            }
          }}
        />
      </ConfigProvider>
    );

    const toaster = screen.getByTestId('sonner-toaster');
    const props = sonnerMock.toasterProps.at(-1);
    const toastOptions = props?.toastOptions as { classNames: Record<string, string> };

    expect(toaster).toHaveAttribute('data-theme', 'dark');
    expect(toaster).toHaveAttribute('data-expand', 'false');
    expect(toaster).toHaveAttribute('data-position', 'bottom-left');
    expect(toaster).toHaveAttribute('data-rich-colors', 'true');
    expect(toastOptions.classNames.toast).toContain('!border-border');
    expect(toastOptions.classNames.toast).toContain('custom-toast-root');
    expect(toastOptions.classNames.title).toContain('text-sm font-medium');
    expect(toastOptions.classNames.title).toContain('custom-toast-title');
  });

  it('routes message calls through sonner toast methods with global defaults and max count handling', () => {
    const onClose = vi.fn();

    message.config({ duration: 5000, maxCount: 1, position: 'bottom-center' });

    const firstId = message.success({
      className: 'custom-message',
      content: 'Saved',
      key: 'first-message',
      onClose
    });
    message.error('Failed', 1000);

    const successOptions = sonnerMock.toast.success.mock.calls[0]?.[1] as ToastOptions;
    const errorOptions = sonnerMock.toast.error.mock.calls[0]?.[1] as ToastOptions;

    expect(firstId).toBe('first-message');
    expect(sonnerMock.toast.success).toHaveBeenCalledWith('Saved', expect.objectContaining({ id: 'first-message' }));
    expect(successOptions.duration).toBe(5000);
    expect(successOptions.position).toBe('bottom-center');
    expect(successOptions.className).toContain('!py-2');
    expect(successOptions.className).toContain('custom-message');
    expect(sonnerMock.toast.dismiss).toHaveBeenCalledWith('first-message');
    expect(sonnerMock.toast.error).toHaveBeenCalledWith('Failed', expect.objectContaining({ duration: 1000 }));
    expect(errorOptions.position).toBe('bottom-center');

    successOptions.onDismiss?.();

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('routes remaining message types, open defaults and keyed dismissal branches', () => {
    const onClose = vi.fn();

    const warningId = message.warning('Warning');
    const infoId = message.info('Info');
    const loadingId = message.loading({
      content: 'Loading',
      key: 'loading-message',
      onClose
    });
    const openId = message.open({ content: 'Opened' });
    const defaultId = message.open({ content: 'Default opened', type: 'default' as never });

    const loadingOptions = sonnerMock.toast.loading.mock.calls[0]?.[1] as ToastOptions;

    expect(warningId).toBe('warning-id');
    expect(infoId).toBe('info-id');
    expect(loadingId).toBe('loading-message');
    expect(openId).toBe('info-id');
    expect(defaultId).toBe('toast-id');
    expect(sonnerMock.toast.warning).toHaveBeenCalledWith('Warning', expect.any(Object));
    expect(sonnerMock.toast.info).toHaveBeenCalledWith('Opened', expect.any(Object));
    expect(sonnerMock.toast.loading).toHaveBeenCalledWith('Loading', expect.objectContaining({ id: 'loading-message' }));
    expect(sonnerMock.toast).toHaveBeenCalledWith('Default opened', expect.any(Object));

    loadingOptions.onAutoClose?.();
    message.dismiss('loading-message');

    expect(onClose).toHaveBeenCalledOnce();
    expect(sonnerMock.toast.dismiss).toHaveBeenCalledWith('loading-message');
  });

  it('handles message close callbacks without keys and default promise options', () => {
    const onClose = vi.fn();

    message.config({ maxCount: -1 });
    message.success({
      content: 'No key',
      onClose
    });
    message.promise(requestDone, {
      loading: 'Loading without options'
    });

    const successOptions = sonnerMock.toast.success.mock.calls[0]?.[1] as ToastOptions;

    successOptions.onDismiss?.();
    successOptions.onAutoClose?.();

    expect(onClose).toHaveBeenCalledTimes(2);
    expect(sonnerMock.toast.dismiss).not.toHaveBeenCalled();
    expect(sonnerMock.toast.promise).toHaveBeenCalledWith(
      requestDone,
      expect.objectContaining({
        className: expect.stringContaining('!py-2'),
        loading: 'Loading without options',
        position: 'top-center'
      })
    );
  });

  it('passes promise message options to sonner promise toasts', () => {
    const request = Promise.resolve('done');

    message.promise(
      request,
      {
        error: 'Failed',
        loading: 'Loading',
        success: 'Done'
      },
      {
        className: 'promise-message',
        key: 'promise-key',
        position: 'top-right'
      }
    );

    expect(sonnerMock.toast.promise).toHaveBeenCalledWith(
      request,
      expect.objectContaining({
        className: expect.stringContaining('promise-message'),
        error: 'Failed',
        id: 'promise-key',
        loading: 'Loading',
        position: 'top-right',
        success: 'Done'
      })
    );
  });

  it('routes notification calls through rich toast options, actions and max count handling', () => {
    const handleAction = vi.fn();
    const onClose = vi.fn();

    notification.config({ closeButton: false, duration: 6000, maxCount: 1, position: 'bottom-right' });

    const firstId = notification.open({
      action: {
        label: 'Fix',
        onClick: handleAction,
        style: { color: 'red' }
      },
      cancel: <span>Later</span>,
      className: 'custom-notification',
      description: 'Needs attention',
      key: 'first-notification',
      onClose,
      title: 'Check settings',
      type: 'warning'
    });
    notification.success({ key: 'second-notification', title: 'Saved' });

    const warningOptions = sonnerMock.toast.warning.mock.calls[0]?.[1] as ToastOptions;

    expect(firstId).toBe('first-notification');
    expect(sonnerMock.toast.warning).toHaveBeenCalledWith(
      'Check settings',
      expect.objectContaining({
        closeButton: false,
        description: 'Needs attention',
        duration: 6000,
        id: 'first-notification',
        position: 'bottom-right'
      })
    );
    expect(warningOptions.className).toContain('!min-w-[320px]');
    expect(warningOptions.className).toContain('custom-notification');
    expect(warningOptions.classNames).toMatchObject({
      description: '!mt-1.5',
      icon: '!mt-1',
      title: '!text-base'
    });
    expect(warningOptions.action).toMatchObject({
      actionButtonStyle: { color: 'red' },
      label: 'Fix',
      onClick: handleAction
    });
    expect(warningOptions.cancel).toMatchObject({ props: { children: 'Later' } });
    expect(sonnerMock.toast.dismiss).toHaveBeenCalledWith('first-notification');

    warningOptions.onAutoClose?.();

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('routes remaining notification types, default toasts and keyed dismissal branches', () => {
    const onClose = vi.fn();

    const errorId = notification.error({
      key: 'error-notification',
      onClose,
      title: 'Error title'
    });
    const infoId = notification.info({ title: 'Info title' });
    const warningId = notification.warning({ title: 'Warning title' });
    const defaultId = notification.open({ title: 'Default title', type: 'default' as never });

    const errorOptions = sonnerMock.toast.error.mock.calls[0]?.[1] as ToastOptions;

    expect(errorId).toBe('error-notification');
    expect(infoId).toBe('info-id');
    expect(warningId).toBe('warning-id');
    expect(defaultId).toBe('toast-id');
    expect(sonnerMock.toast.error).toHaveBeenCalledWith('Error title', expect.objectContaining({ id: 'error-notification' }));
    expect(sonnerMock.toast.info).toHaveBeenCalledWith('Info title', expect.any(Object));
    expect(sonnerMock.toast.warning).toHaveBeenCalledWith('Warning title', expect.any(Object));
    expect(sonnerMock.toast).toHaveBeenCalledWith('Default title', expect.any(Object));

    errorOptions.onDismiss?.();
    notification.dismiss('error-notification');

    expect(onClose).toHaveBeenCalledOnce();
    expect(sonnerMock.toast.dismiss).toHaveBeenCalledWith('error-notification');
  });

  it('handles notification close callbacks without keys and empty max-count queues', () => {
    const onClose = vi.fn();

    notification.config({ maxCount: -1 });
    notification.info({
      onClose,
      title: 'No key notification'
    });

    const infoOptions = sonnerMock.toast.info.mock.calls[0]?.[1] as ToastOptions;

    infoOptions.onDismiss?.();
    infoOptions.onAutoClose?.();

    expect(onClose).toHaveBeenCalledTimes(2);
    expect(sonnerMock.toast.dismiss).not.toHaveBeenCalled();
  });
});
