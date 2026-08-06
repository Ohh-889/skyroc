import { request } from '../../request';

import type {
  DictDataItem,
  DictDataListParams,
  DictDataSavePayload,
  DictDataUpdatePayload,
  DictId,
  DictListPage,
  DictTypeItem,
  DictTypeListParams,
  DictTypeSavePayload,
  DictTypeUpdatePayload
} from './types';
import { SYSTEM_DICT_URLS } from './urls';

export function fetchDictTypes(params: DictTypeListParams) {
  return request<DictListPage<DictTypeItem>>({
    method: 'get',
    params,
    url: SYSTEM_DICT_URLS.TYPE_LIST
  });
}

export function fetchDictTypeOptions() {
  return request<DictTypeItem[]>({
    method: 'get',
    url: SYSTEM_DICT_URLS.TYPE_OPTIONS
  });
}

export function fetchDictType(id: DictId) {
  return request<DictTypeItem>({
    method: 'get',
    url: SYSTEM_DICT_URLS.TYPE_DETAIL(id)
  });
}

export function createDictType(data: DictTypeSavePayload) {
  return request<DictTypeItem>({
    data,
    method: 'post',
    url: SYSTEM_DICT_URLS.TYPE_CREATE
  });
}

export function updateDictType(data: DictTypeUpdatePayload) {
  return request<DictTypeItem>({
    data,
    method: 'put',
    url: SYSTEM_DICT_URLS.TYPE_UPDATE
  });
}

export function deleteDictTypes(ids: DictId[]) {
  return request<null>({
    method: 'delete',
    url: SYSTEM_DICT_URLS.TYPE_DELETE(ids)
  });
}

export function fetchDictData(params: DictDataListParams) {
  return request<DictListPage<DictDataItem>>({
    method: 'get',
    params,
    url: SYSTEM_DICT_URLS.DATA_LIST
  });
}

export function fetchDictDataDetail(id: DictId) {
  return request<DictDataItem>({
    method: 'get',
    url: SYSTEM_DICT_URLS.DATA_DETAIL(id)
  });
}

export function createDictData(data: DictDataSavePayload) {
  return request<DictDataItem>({
    data,
    method: 'post',
    url: SYSTEM_DICT_URLS.DATA_CREATE
  });
}

export function updateDictData(data: DictDataUpdatePayload) {
  return request<DictDataItem>({
    data,
    method: 'put',
    url: SYSTEM_DICT_URLS.DATA_UPDATE
  });
}

export function deleteDictData(ids: DictId[]) {
  return request<null>({
    method: 'delete',
    url: SYSTEM_DICT_URLS.DATA_DELETE(ids)
  });
}

export function refreshDictCache() {
  return request<null>({
    method: 'delete',
    url: SYSTEM_DICT_URLS.REFRESH_CACHE
  });
}
