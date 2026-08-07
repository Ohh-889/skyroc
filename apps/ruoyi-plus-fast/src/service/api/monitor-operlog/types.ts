export type OperLogId = number | string;

export type OperLogStatus = 0 | 1;

export type OperLogBusinessType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface OperLogItem {
  businessType: OperLogBusinessType;
  costTime: number;
  deptName: string;
  errorMsg: string;
  jsonResult: string;
  method: string;
  operatorType: number;
  operId: OperLogId;
  operIp: string;
  operLocation: string;
  operName: string;
  operParam: string;
  operTime: null | string;
  operUrl: string;
  requestMethod: string;
  status: OperLogStatus;
  tenantId: string;
  title: string;
}

export interface OperLogListPage {
  current: number;
  records: OperLogItem[];
  size: number;
  total: number;
}

export interface OperLogListParams {
  beginTime?: string;
  businessType?: OperLogBusinessType;
  current: number;
  endTime?: string;
  isAsc?: 'asc' | 'desc';
  operIp?: string;
  operName?: string;
  orderByColumn?: 'businessType' | 'costTime' | 'operId' | 'operIp' | 'operName' | 'operTime' | 'status' | 'title';
  size: number;
  status?: OperLogStatus;
  title?: string;
}

export type OperLogExportParams = Omit<OperLogListParams, 'current' | 'size'>;
