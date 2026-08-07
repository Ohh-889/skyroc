import { request } from '../../request';

import type { OperLogExportParams, OperLogId, OperLogListPage, OperLogListParams } from './types';
import { MONITOR_OPERLOG_URLS } from './urls';

export function fetchOperLogList(params: OperLogListParams) {
  return request<OperLogListPage>({ method: 'get', params, url: MONITOR_OPERLOG_URLS.LIST });
}

export function exportOperLogs(params: OperLogExportParams) {
  return request<Blob, 'blob'>({
    method: 'post',
    params,
    responseType: 'blob',
    url: MONITOR_OPERLOG_URLS.EXPORT
  });
}

export function deleteOperLogs(operIds: OperLogId[]) {
  return request<null>({ method: 'delete', url: MONITOR_OPERLOG_URLS.DELETE(operIds) });
}

export function cleanOperLogs() {
  return request<null>({ method: 'delete', url: MONITOR_OPERLOG_URLS.CLEAN });
}
