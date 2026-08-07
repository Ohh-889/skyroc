import { request } from '../../request';
import type {
  ConfigId,
  ConfigItem,
  ConfigListPage,
  ConfigListParams,
  ConfigSavePayload,
  ConfigUpdatePayload
} from './types';
import { SYSTEM_CONFIG_URLS } from './urls';
export function fetchConfigList(params: ConfigListParams) {
  return request<ConfigListPage>({ method: 'get', params, url: SYSTEM_CONFIG_URLS.LIST });
}
export function fetchConfigDetail(id: ConfigId) {
  return request<ConfigItem>({ method: 'get', url: SYSTEM_CONFIG_URLS.DETAIL(id) });
}
export function createConfig(data: ConfigSavePayload) {
  return request<ConfigItem>({ data, method: 'post', url: SYSTEM_CONFIG_URLS.CREATE });
}
export function updateConfig(data: ConfigUpdatePayload) {
  return request<ConfigItem>({ data, method: 'put', url: SYSTEM_CONFIG_URLS.UPDATE });
}
export function deleteConfigs(ids: ConfigId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_CONFIG_URLS.DELETE(ids) });
}
export function refreshConfigCache() {
  return request<null>({ method: 'delete', url: SYSTEM_CONFIG_URLS.REFRESH_CACHE });
}
export function exportConfigs(params: Omit<ConfigListParams, 'current' | 'size'>) {
  return request<Blob, 'blob'>({ method: 'post', params, responseType: 'blob', url: SYSTEM_CONFIG_URLS.EXPORT });
}
