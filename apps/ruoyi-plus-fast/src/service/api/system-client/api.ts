import { request } from '../../request';
import type {
  ClientExportParams,
  ClientId,
  ClientItem,
  ClientListPage,
  ClientListParams,
  ClientSavePayload,
  ClientStatusPayload,
  ClientUpdatePayload
} from './types';
import { SYSTEM_CLIENT_URLS } from './urls';

export function fetchClientList(params: ClientListParams) {
  return request<ClientListPage>({ method: 'get', params, url: SYSTEM_CLIENT_URLS.LIST });
}

export function fetchClientDetail(id: ClientId) {
  return request<ClientItem>({ method: 'get', url: SYSTEM_CLIENT_URLS.DETAIL(id) });
}

export function createClient(data: ClientSavePayload) {
  return request<ClientItem>({ data, method: 'post', url: SYSTEM_CLIENT_URLS.CREATE });
}

export function updateClient(data: ClientUpdatePayload) {
  return request<ClientItem>({ data, method: 'put', url: SYSTEM_CLIENT_URLS.UPDATE });
}

export function updateClientStatus(data: ClientStatusPayload) {
  return request<ClientItem>({ data, method: 'put', url: SYSTEM_CLIENT_URLS.CHANGE_STATUS });
}

export function deleteClients(ids: ClientId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_CLIENT_URLS.DELETE(ids) });
}

export function exportClients(params: ClientExportParams) {
  return request<Blob, 'blob'>({ method: 'post', params, responseType: 'blob', url: SYSTEM_CLIENT_URLS.EXPORT });
}
