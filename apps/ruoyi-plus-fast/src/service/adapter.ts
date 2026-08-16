import { refreshToken } from '@skyroc/service';
import type { RequestAdapter } from '@skyroc/service';

import { setAuth } from '@/features/auth/use-auth';
import { getRouter } from '@/features/router/router-ref';
import { $t } from '@/locales';
import { localStg } from '@/utils/storage';

import { fetchRefreshToken } from './api/auth/api';
import { AUTH_URLS } from './api/auth/urls';

function showRequestErrorMessage(msg: string, onClose?: () => void) {
  if (onClose) {
    showErrorMessage({ content: msg, onClose });
    return;
  }

  showErrorMessage(msg);
}

function showRequestErrorModal(options: Parameters<RequestAdapter['showErrorModal']>[0]) {
  showErrorModal({
    content: options.content,
    keyboard: false,
    maskClosable: options.maskClosable ?? false,
    okText: $t('common.confirm'),
    onCancel() {
      options.onConfirm();
    },
    onOk() {
      options.onConfirm();
    },
    title: options.title
  });
}

export const antdAdapter: RequestAdapter = {
  fetchRefreshToken,
  getCurrentPath() {
    return getRouter().state.location.href;
  },
  getRefreshToken() {
    return localStg.get('refreshToken') || null;
  },
  getToken() {
    return localStg.get('token') || null;
  },
  redirectToLogin(redirectPath?: string) {
    getRouter().navigate({ search: { redirect: redirectPath }, to: '/login-out' });
  },
  refreshTokenUrl: AUTH_URLS.REFRESH_TOKEN,
  resetAuth() {
    localStg.remove('token');
    localStg.remove('refreshToken');
  },
  setAuth(tokens) {
    setAuth({ refreshToken: tokens.refreshToken, token: tokens.token });
  },
  showErrorMessage: showRequestErrorMessage,
  showErrorModal: showRequestErrorModal,
  t(key: string) {
    return $t(key);
  }
};

/**
 * 续签当前令牌，返回是否成功；失败时已经跳过登录页了。
 *
 * WebSocket 和 SSE 拿到「令牌过期」也走这里，和 HTTP 共用同一次在途刷新 —— 各自去调
 * fetchRefreshToken 的话，后发的那次会拿着已经轮换掉的 refresh token 去换，必定失败。
 */
export function refreshAppToken(): Promise<boolean> {
  return refreshToken(antdAdapter);
}
