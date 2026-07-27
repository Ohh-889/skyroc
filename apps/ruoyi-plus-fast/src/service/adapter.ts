import type { RequestAdapter } from '@skyroc/service';

import { setAuth } from '@/features/auth/use-auth';
import { getRouter } from '@/features/router/router-ref';
import { $t } from '@/locales';
import { localStg } from '@/utils/storage';

import { fetchRefreshToken } from './api/auth/api';

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
