import { createAppRequest } from '@skyroc/service';
import { createRequestSealer } from '@skyroc/service/crypto';

import { getServiceBaseURL } from '@/utils/service';

import { antdAdapter } from '../adapter';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createAppRequest({
  adapter: antdAdapter,
  axiosConfig: {
    baseURL
  },
  codes: {
    expiredToken: import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES.split(','),
    logout: import.meta.env.VITE_SERVICE_LOGOUT_CODES.split(','),
    modalLogout: import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES.split(','),
    success: import.meta.env.VITE_SERVICE_SUCCESS_CODE
  },
  // 加密器由调用方注入：node-forge 只会进真正用到它的端的包
  sealRequest: createRequestSealer({
    header: import.meta.env.VITE_API_CRYPTO_HEADER || 'X-Encrypt-Key',
    publicKey: import.meta.env.VITE_API_CRYPTO_PUBLIC_KEY || ''
  })
});
