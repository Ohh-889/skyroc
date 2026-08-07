export type ClientId = number | string;

export type ClientStatus = '0' | '1';

export interface ClientItem {
  activeTimeout: number;
  clientId: null | string;
  clientKey: null | string;
  clientSecret: null | string;
  deviceType: null | string;
  grantType: null | string;
  grantTypeList: string[];
  id: ClientId;
  status: ClientStatus;
  timeout: number;
}

export interface ClientListPage {
  current: number;
  records: ClientItem[];
  size: number;
  total: number;
}

export interface ClientListParams {
  clientId?: string;
  clientKey?: string;
  current: number;
  isAsc?: 'asc' | 'desc';
  orderByColumn?: 'clientId' | 'clientKey' | 'id' | 'status';
  size: number;
  status?: ClientStatus;
}

export type ClientExportParams = Omit<ClientListParams, 'current' | 'size'>;

export interface ClientSavePayload {
  activeTimeout: number;
  clientKey: string;
  clientSecret: string;
  deviceType?: null | string;
  grantTypeList: string[];
  status: ClientStatus;
  timeout: number;
}

export interface ClientUpdatePayload extends ClientSavePayload {
  id: ClientId;
}

export interface ClientStatusPayload {
  clientId: string;
  status: ClientStatus;
}
