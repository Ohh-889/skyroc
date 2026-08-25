import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    cleanupAppVersionNotification: vi.fn(),
    setupAppVersionNotification: vi.fn(),
    setupDayjs: vi.fn(),
    setupIconifyOffline: vi.fn(),
    setupNProgress: vi.fn()
  };
});

vi.mock('@shell/runtime/app-update', () => {
  return {
    setupAppVersionNotification: mocks.setupAppVersionNotification
  };
});

vi.mock('@shell/runtime/dayjs', () => {
  return {
    setupDayjs: mocks.setupDayjs
  };
});

vi.mock('@shell/runtime/iconify', () => {
  return {
    setupIconifyOffline: mocks.setupIconifyOffline
  };
});

vi.mock('@shell/runtime/nprogress', () => {
  return {
    setupNProgress: mocks.setupNProgress
  };
});

describe('setupAdminRuntimePlugins', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.setupAppVersionNotification.mockReturnValue(mocks.cleanupAppVersionNotification);
  });

  it('sets up runtime plugins with safe defaults', async () => {
    const { setupAdminRuntimePlugins } = await import('@shell/runtime/plugins');

    setupAdminRuntimePlugins();

    expect(mocks.setupDayjs).toHaveBeenCalledWith(undefined);
    expect(mocks.setupNProgress).toHaveBeenCalledWith(undefined);
    expect(mocks.setupIconifyOffline).toHaveBeenCalledWith(undefined);
    expect(mocks.setupAppVersionNotification).not.toHaveBeenCalled();
  });

  it('skips disabled runtime plugins', async () => {
    const { setupAdminRuntimePlugins } = await import('@shell/runtime/plugins');

    setupAdminRuntimePlugins({
      appVersionNotification: false,
      dayjs: false,
      iconifyOffline: false,
      nprogress: false
    });

    expect(mocks.setupDayjs).not.toHaveBeenCalled();
    expect(mocks.setupNProgress).not.toHaveBeenCalled();
    expect(mocks.setupIconifyOffline).not.toHaveBeenCalled();
    expect(mocks.setupAppVersionNotification).not.toHaveBeenCalled();
  });

  it('passes plugin options and returns app update cleanup', async () => {
    const { setupAdminRuntimePlugins } = await import('@shell/runtime/plugins');
    const onUpdateAvailable = vi.fn();

    const cleanup = setupAdminRuntimePlugins({
      appVersionNotification: {
        baseUrl: '/admin/',
        currentBuildTime: '2026-05-27 10:00:00',
        enabled: true,
        interval: 60_000,
        onUpdateAvailable
      },
      dayjs: {
        withLocaleData: false
      },
      iconifyOffline: {
        apiUrl: 'https://iconify.example.com',
        provider: 'skyroc'
      },
      nprogress: {
        parent: '#app',
        speed: 300
      }
    });

    expect(mocks.setupDayjs).toHaveBeenCalledWith({ withLocaleData: false });
    expect(mocks.setupNProgress).toHaveBeenCalledWith({ parent: '#app', speed: 300 });
    expect(mocks.setupIconifyOffline).toHaveBeenCalledWith({
      apiUrl: 'https://iconify.example.com',
      provider: 'skyroc'
    });
    expect(mocks.setupAppVersionNotification).toHaveBeenCalledWith({
      baseUrl: '/admin/',
      currentBuildTime: '2026-05-27 10:00:00',
      enabled: true,
      interval: 60_000,
      onUpdateAvailable
    });

    cleanup();

    expect(mocks.cleanupAppVersionNotification).toHaveBeenCalledOnce();
  });
});
