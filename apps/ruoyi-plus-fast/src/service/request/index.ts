import { createAppRequest } from '@skyroc/service';

import { getServiceBaseURL } from '@/utils/service';

import { antdAdapter } from '../adapter';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createAppRequest({
  adapter: antdAdapter,
  axiosConfig: {
    baseURL,
  },
  codes: {
    expiredToken: import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [],
    logout: import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [],
    modalLogout: import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [],
    success: import.meta.env.VITE_SERVICE_SUCCESS_CODE
  },
  crypto: {
    header: import.meta.env.VITE_API_CRYPTO_HEADER || 'X-Encrypt-Key',
    publicKey: import.meta.env.VITE_API_CRYPTO_PUBLIC_KEY || ''
  }
});
