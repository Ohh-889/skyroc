import { describe, expect, it, vi } from 'vitest';
import { getAuthorization, normalizeCodes, showErrorMsg } from '../src/request/shared';
import type { RequestAdapter, RequestInstanceState } from '../src/request/types';

function createMockAdapter(overrides: Partial<RequestAdapter> = {}): RequestAdapter {
  return {
    getCurrentPath: vi.fn(() => '/current'),
    getRefreshToken: vi.fn(() => 'mock-refresh-token'),
    getToken: vi.fn(() => 'mock-token'),
    redirectToLogin: vi.fn(),
    resetAuth: vi.fn(),
    setAuth: vi.fn(),
    showErrorMessage: vi.fn(),
    showErrorModal: vi.fn(),
    t: vi.fn((key: string) => key),
    fetchRefreshToken: vi.fn(async () => ({ token: 'new-token', refreshToken: 'new-refresh' })),
    ...overrides
  };
}

function createState(overrides: Partial<RequestInstanceState> = {}): RequestInstanceState {
  return {
    errMsgStack: [],
    ...overrides
  };
}

describe('normalizeCodes', () => {
  it('trims codes so a stray space in .env does not silently disable one', () => {
    const codes = normalizeCodes({
      success: ' 0000 ',
      logout: ['8888', ' 8889'],
      modalLogout: ['7777', '7778 '],
      expiredToken: [' 9999 ']
    });

    expect(codes).toEqual({
      success: '0000',
      logout: ['8888', '8889'],
      modalLogout: ['7777', '7778'],
      expiredToken: ['9999']
    });
  });

  it('falls back to 0000 when the success code is missing', () => {
    const codes = normalizeCodes({
      success: undefined as unknown as string,
      logout: [],
      modalLogout: [],
      expiredToken: []
    });

    expect(codes.success).toBe('0000');
  });

  it('drops empty entries left by a trailing comma', () => {
    const codes = normalizeCodes({
      success: '0000',
      logout: ['8888', '', '  '],
      modalLogout: [],
      expiredToken: []
    });

    expect(codes.logout).toEqual(['8888']);
  });

  it('tolerates undefined code lists', () => {
    const codes = normalizeCodes({
      success: '0000',
      logout: undefined as unknown as string[],
      modalLogout: undefined as unknown as string[],
      expiredToken: undefined as unknown as string[]
    });

    expect(codes.logout).toEqual([]);
    expect(codes.modalLogout).toEqual([]);
    expect(codes.expiredToken).toEqual([]);
  });
});

describe('getAuthorization', () => {
  it('returns Bearer token when token exists', () => {
    const adapter = createMockAdapter({ getToken: vi.fn(() => 'abc123') });
    expect(getAuthorization(adapter)).toBe('Bearer abc123');
  });

  it('returns null when token is null', () => {
    const adapter = createMockAdapter({ getToken: vi.fn(() => null) });
    expect(getAuthorization(adapter)).toBeNull();
  });
});

describe('showErrorMsg', () => {
  it('shows message and adds to stack', () => {
    const adapter = createMockAdapter();
    const state = createState();

    showErrorMsg(adapter, state, 'Something went wrong');

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('Something went wrong', expect.any(Function));
    expect(state.errMsgStack).toContain('Something went wrong');
  });

  it('does not show duplicate messages', () => {
    const adapter = createMockAdapter();
    const state = createState({ errMsgStack: ['Something went wrong'] });

    showErrorMsg(adapter, state, 'Something went wrong');

    expect(adapter.showErrorMessage).not.toHaveBeenCalled();
  });

  it('removes message from stack on close callback', () => {
    vi.useFakeTimers();
    let onCloseCallback: (() => void) | undefined;
    const adapter = createMockAdapter({
      showErrorMessage: vi.fn((_msg: string, onClose?: () => void) => {
        onCloseCallback = onClose;
      })
    });
    const state = createState();

    showErrorMsg(adapter, state, 'Error msg');
    expect(state.errMsgStack).toContain('Error msg');

    onCloseCallback!();
    expect(state.errMsgStack).not.toContain('Error msg');

    vi.advanceTimersByTime(5000);
    expect(state.errMsgStack).toEqual([]);

    vi.useRealTimers();
  });
});
