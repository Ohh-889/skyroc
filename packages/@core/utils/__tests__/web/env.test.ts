import { describe, expect, it, vi } from 'vitest';
import { isMacOs, isPC, isWindow, isWindowsOs } from '../../src/web/env';

// ==================== isWindow ====================

describe('isWindow', () => {
  it('window 对象应返回 true', () => {
    expect(isWindow(window)).toBe(true);
  });

  it('null 应返回 false', () => {
    expect(isWindow(null)).toBe(false);
  });

  it('普通对象应返回 false', () => {
    expect(isWindow({})).toBe(false);
  });
});

// ==================== isMacOs ====================

describe('isMacOs', () => {
  it('Mac userAgent 应返回 true', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    );
    expect(isMacOs()).toBe(true);
    vi.restoreAllMocks();
  });

  it('Windows userAgent 应返回 false', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );
    expect(isMacOs()).toBe(false);
    vi.restoreAllMocks();
  });
});

// ==================== isWindowsOs ====================

describe('isWindowsOs', () => {
  it('Windows userAgent 应返回 true', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );
    expect(isWindowsOs()).toBe(true);
    vi.restoreAllMocks();
  });

  it('Mac userAgent 应返回 false', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    );
    expect(isWindowsOs()).toBe(false);
    vi.restoreAllMocks();
  });
});

// ==================== isPC ====================

describe('isPC', () => {
  it('桌面端 userAgent 应返回 true', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    );
    expect(isPC()).toBe(true);
    vi.restoreAllMocks();
  });

  it('iPhone userAgent 应返回 false', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/537.36'
    );
    expect(isPC()).toBe(false);
    vi.restoreAllMocks();
  });

  it('Android userAgent 应返回 false', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36');
    expect(isPC()).toBe(false);
    vi.restoreAllMocks();
  });
});
