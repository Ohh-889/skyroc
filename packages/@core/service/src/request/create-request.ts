import { createRequest } from '@skyroc/axios';
import type { AxiosResponse } from 'axios';
import { backEndFail, handleError } from './error-handler';
import { getAuthorization, normalizeCodes } from './shared';
import type { CreateRequestOptions, RequestInstanceState } from './types';

/**
 * 创建平台无关的请求实例
 *
 * 通过 adapter 注入平台差异（UI 反馈、认证、导航、i18n）， 使错误处理、token 刷新等逻辑可跨端复用。
 */
export function createAppRequest(options: CreateRequestOptions) {
  const { adapter, axiosConfig, requestIdKey, retry, sealRequest } = options;
  const codes = normalizeCodes(options.codes);

  const request = createRequest<{ code: string | number; data: any; msg: string }, any, RequestInstanceState>(
    axiosConfig,
    {
      defaultState: {
        errMsgStack: []
      },
      isBackendSuccess:
        options.isBackendSuccess ??
        ((response: AxiosResponse<{ code: string | number }>) => {
          return String(response.data.code) === codes.success;
        }),
      // 必须把结果交回去：续签成功后 backEndFail 返回的是重试的响应，吞掉它等于刷完了 token
      // 还让调用方拿到失败。
      // 返回类型必须显式写出来：不写的话 request 的类型要经由这里回推自己，TS 判成循环推断
      onBackendFail(response, instance): Promise<AxiosResponse | null> {
        return backEndFail(response, instance, request, adapter, codes);
      },
      onError(error) {
        handleError(error, request, adapter, codes);
      },
      async onRequest(config) {
        config.headers.set('Authorization', getAuthorization(adapter));

        // 加密放在最后：认证头不能跟着 body 一起被加密掉
        return sealRequest ? sealRequest(config) : config;
      },
      requestIdKey,
      retry,
      transform:
        options.transform ??
        ((response: AxiosResponse<{ data: any }>) => {
          return response.data.data;
        })
    }
  );

  return request;
}
