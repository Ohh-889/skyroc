import { request } from '../../request';

import type {
  OssConfigId,
  OssConfigItem,
  OssConfigListPage,
  OssConfigListParams,
  OssConfigSavePayload,
  OssConfigStatusPayload,
  OssConfigUpdatePayload
} from './types';
import { SYSTEM_OSS_CONFIG_URLS } from './urls';

export function fetchOssConfigList(params: OssConfigListParams) {
  return request<OssConfigListPage>({ method: 'get', params, url: SYSTEM_OSS_CONFIG_URLS.LIST });
}

export function fetchOssConfigDetail(id: OssConfigId) {
  return request<OssConfigItem>({ method: 'get', url: SYSTEM_OSS_CONFIG_URLS.DETAIL(id) });
}

/** 新增一套存储配置。status 传 '0' 时原来那条默认自动让位 */
export function createOssConfig(data: OssConfigSavePayload) {
  return request<OssConfigItem>({ data, method: 'post', url: SYSTEM_OSS_CONFIG_URLS.CREATE });
}

export function updateOssConfig(data: OssConfigUpdatePayload) {
  return request<OssConfigItem>({ data, method: 'put', url: SYSTEM_OSS_CONFIG_URLS.UPDATE });
}

/** 只收 ossConfigId 和 status 两个字段，改不了连接信息 */
export function updateOssConfigStatus(data: OssConfigStatusPayload) {
  return request<OssConfigItem>({ data, method: 'put', url: SYSTEM_OSS_CONFIG_URLS.CHANGE_STATUS });
}

/** 删一批配置。内置的那四条（id 1-4）删不掉，历史文件还指着它们 */
export function deleteOssConfigs(ids: OssConfigId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_OSS_CONFIG_URLS.DELETE(ids) });
}
