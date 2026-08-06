export interface OnlineSession {
  browser: null | string;
  clientKey: null | string;
  deptName: null | string;
  deviceType: null | string;
  ipaddr: null | string;
  isCurrent: boolean;
  lastSeenTime: null | number;
  loginLocation: null | string;
  loginTime: number;
  os: null | string;
  tokenId: string;
  userName: string;
}

export interface OnlineSessionPage {
  current: number;
  records: OnlineSession[];
  size: number;
  total: number;
}

export interface OnlineSessionListParams {
  current: number;
  ipaddr?: string;
  size: number;
  userName?: string;
}
