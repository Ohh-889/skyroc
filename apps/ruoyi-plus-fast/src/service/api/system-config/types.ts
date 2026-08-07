export type ConfigId = number | string;
export type ConfigType = 'N' | 'Y';

export interface ConfigItem {
  configId: ConfigId;
  configKey: string;
  configType: ConfigType;
  configName: string;
  configValue: string;
  remark: null | string;
  createTime: null | string;
}

export interface ConfigListPage {
  current: number;
  records: ConfigItem[];
  size: number;
  total: number;
}
export interface ConfigListParams {
  configKey?: string;
  configName?: string;
  configType?: ConfigType;
  current: number;
  endTime?: string;
  rangeBegin?: string;
  rangeEnd?: string;
  size: number;
}
export interface ConfigSavePayload {
  configKey: string;
  configName: string;
  configType: ConfigType;
  configValue: string;
  remark?: null | string;
}
export interface ConfigUpdatePayload extends ConfigSavePayload {
  configId: ConfigId;
}
