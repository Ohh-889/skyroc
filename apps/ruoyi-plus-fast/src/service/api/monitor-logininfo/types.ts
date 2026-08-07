export type LoginInfoId = number | string;

export type LoginInfoStatus = '0' | '1';

export interface LoginInfoItem {
  browser: string;
  clientKey: string;
  deviceType: string;
  infoId: LoginInfoId;
  ipaddr: string;
  loginLocation: string;
  loginTime: null | string;
  msg: string;
  os: string;
  status: LoginInfoStatus;
  userName: string;
}

export interface LoginInfoListPage {
  current: number;
  records: LoginInfoItem[];
  size: number;
  total: number;
}

export interface LoginInfoListParams {
  beginTime?: string;
  current: number;
  endTime?: string;
  ipaddr?: string;
  size: number;
  status?: LoginInfoStatus;
  userName?: string;
}

export type LoginInfoExportParams = Omit<LoginInfoListParams, 'current' | 'size'>;
