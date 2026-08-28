import type { AxiosResponse } from 'axios';

/**
 * Check if http status is success
 *
 * @param status
 */
export function isHttpSuccess(status: number) {
  const isSuccessCode = status >= 200 && status < 300;
  return isSuccessCode || status === 304;
}

/**
 * 二进制响应里夹带 JSON 时把它解出来
 *
 * 典型场景：`responseType: 'blob'` 的文件下载失败了，后端回的其实是 JSON 错误信封。不解出来的话 `isBackendSuccess` / `onBackendFail` 拿到的是一坨
 * Blob，业务码无从判断。
 *
 * @param response Axios response
 */
export async function transformResponse(response: AxiosResponse) {
  const { responseType } = response.config;

  if (!responseType || responseType === 'json') return;

  const isJson = response.headers['content-type']?.includes('application/json');
  if (!isJson) return;

  if (responseType === 'blob') {
    await transformBlobToJson(response);
  }

  if (responseType === 'arraybuffer') {
    await transformArrayBufferToJson(response);
  }
}

export async function transformBlobToJson(response: AxiosResponse) {
  try {
    let data = response.data;

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (Object.prototype.toString.call(data) === '[object Blob]') {
      const json = await data.text();
      data = JSON.parse(json);
    }

    response.data = data;
  } catch {
    // 解不出 JSON 说明响应体确实是二进制，保留原始 data 交给调用方
  }
}

export async function transformArrayBufferToJson(response: AxiosResponse) {
  try {
    let data = response.data;

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (Object.prototype.toString.call(data) === '[object ArrayBuffer]') {
      const json = new TextDecoder().decode(data);
      data = JSON.parse(json);
    }

    response.data = data;
  } catch {
    // 同上：转换只是尽力而为，失败时不能把原始数据弄丢
  }
}
