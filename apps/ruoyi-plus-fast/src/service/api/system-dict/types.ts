export type DictId = number | string;

export interface DictTypeItem {
  createTime: null | string;
  dictId: DictId;
  dictName: string;
  dictType: string;
  remark: null | string;
}

export interface DictDataItem {
  createTime: null | string;
  cssClass: null | string;
  dictCode: DictId;
  dictLabel: string;
  dictSort: number;
  dictType: string;
  dictValue: string;
  isDefault: 'N' | 'Y';
  listClass: null | string;
  remark: null | string;
}

export interface DictListPage<T> {
  current: number;
  records: T[];
  size: number;
  total: number;
}

export interface DictTypeListParams {
  current: number;
  dictName?: string;
  dictType?: string;
  size: number;
}

export interface DictDataListParams {
  current: number;
  dictLabel?: string;
  dictType?: string;
  size: number;
}

export type DictTypeExportParams = Omit<DictTypeListParams, 'current' | 'size'>;

export type DictDataExportParams = Omit<DictDataListParams, 'current' | 'size'>;

export interface DictTypeSavePayload {
  dictName: string;
  dictType: string;
  remark?: null | string;
}

export interface DictTypeUpdatePayload extends DictTypeSavePayload {
  dictId: DictId;
}

export interface DictDataSavePayload {
  cssClass?: null | string;
  dictLabel: string;
  dictSort: number;
  dictType: string;
  dictValue: string;
  isDefault: 'N' | 'Y';
  listClass?: null | string;
  remark?: null | string;
}

export interface DictDataUpdatePayload extends DictDataSavePayload {
  dictCode: DictId;
}
