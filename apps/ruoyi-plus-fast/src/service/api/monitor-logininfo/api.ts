import { request } from '../../request';

import type { LoginInfoExportParams, LoginInfoId, LoginInfoListPage, LoginInfoListParams } from './types';
import { MONITOR_LOGININFO_URLS } from './urls';

export function fetchLoginInfoList(params: LoginInfoListParams) {
  return request<LoginInfoListPage>({ method: 'get', params, url: MONITOR_LOGININFO_URLS.LIST });
}

export function exportLoginInfos(params: LoginInfoExportParams) {
  return request<Blob, 'blob'>({
    method: 'post',
    params,
    responseType: 'blob',
    url: MONITOR_LOGININFO_URLS.EXPORT
  });
}

export function deleteLoginInfos(infoIds: LoginInfoId[]) {
  return request<null>({ method: 'delete', url: MONITOR_LOGININFO_URLS.DELETE(infoIds) });
}

export function cleanLoginInfos() {
  return request<null>({ method: 'delete', url: MONITOR_LOGININFO_URLS.CLEAN });
}

export function unlockLoginInfo(identity: string) {
  return request<boolean>({ method: 'delete', url: MONITOR_LOGININFO_URLS.UNLOCK(identity) });
}
