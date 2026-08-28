import { request } from '../../request';

import type { OssId, OssItem, OssListPage, OssListParams, OssUploadResult } from './types';
import { SYSTEM_OSS_URLS } from './urls';

export function fetchOssList(params: OssListParams) {
  return request<OssListPage>({ method: 'get', params, url: SYSTEM_OSS_URLS.LIST });
}

/** 按一串 id 取文件。其中某个 id 已被删除时后端少返回一条，不报错 */
export function fetchOssListByIds(ids: OssId[]) {
  return request<OssItem[]>({ method: 'get', url: SYSTEM_OSS_URLS.LIST_BY_IDS(ids) });
}

/**
 * 必须显式声明 multipart/form-data。
 *
 * 请求实例的默认头是 application/json，axios 的 transformRequest 撞上它会把 FormData 转成 普通 JSON（File 没有可枚举属性，序列化后是 `{}`），后端拿不到
 * multipart 字段直接 422。 这里写的值不带 boundary，发出前由浏览器覆盖成带 boundary 的那一个。
 */
export function uploadOssFile(file: File) {
  const data = new FormData();
  data.append('file', file);

  return request<OssUploadResult>({
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    url: SYSTEM_OSS_URLS.UPLOAD
  });
}

/** 走服务器中转的文件流，文件名在响应头 content-disposition 里 */
export function downloadOssFile(id: OssId) {
  return request<Blob, 'blob'>({ method: 'get', responseType: 'blob', url: SYSTEM_OSS_URLS.DOWNLOAD(id) });
}

export function deleteOssFiles(ids: OssId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_OSS_URLS.DELETE(ids) });
}
