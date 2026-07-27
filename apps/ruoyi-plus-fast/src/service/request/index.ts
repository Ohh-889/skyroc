import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest } from '@skyroc/axios';
import { createAppRequest } from '@skyroc/service';

import { getServiceBaseURL } from '@/utils/service';
import { localStg } from '@/utils/storage';

import { antdAdapter } from '../adapter';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createAppRequest({
  adapter: antdAdapter,
  axiosConfig: {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    }
  },
  codes: {
    expiredToken: import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [],
    logout: import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [],
    modalLogout: import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [],
    success: import.meta.env.VITE_SERVICE_SUCCESS_CODE
  }
});

export const demoRequest = createFlatRequest(
  {
    baseURL: otherBaseURL.demo
  },
  {
    transform(response: AxiosResponse<Api.Service.DemoResponse>) {
      return response.data.result;
    },
    isBackendSuccess(response) {
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // when the backend response code is not "200", it means the request is fail
    },
    onError(error) {
      let message = error.message;

      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      showErrorMessage(message);
    },
    async onRequest(config) {
      const { headers } = config;

      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    }
  }
);
