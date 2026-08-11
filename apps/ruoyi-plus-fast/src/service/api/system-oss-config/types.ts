export type OssConfigId = number | string;

/** 是否默认配置。取值是 RuoYi 口径：0 才是"是" */
export type OssConfigStatus = '0' | '1';

/** 桶权限：0 私有 1 公开 2 自定义 */
export type OssConfigAccessPolicy = '0' | '1' | '2';

export type OssConfigHttpsFlag = 'N' | 'Y';

export type OssConfigSortField = 'bucketName' | 'configKey' | 'createTime' | 'ossConfigId' | 'status';

/** 一条存储配置。响应里没有 secretKey：能打开列表的人不该拿到桶的写权限 */
export interface OssConfigItem {
  accessKey: string;
  accessPolicy: OssConfigAccessPolicy;
  bucketName: string;
  /** 配置名，文件记录里存的就是它 */
  configKey: string;
  createTime: null | string;
  domain: string;
  endpoint: string;
  ext1: null | string;
  isHttps: OssConfigHttpsFlag;
  ossConfigId: OssConfigId;
  prefix: string;
  region: string;
  remark: null | string;
  status: OssConfigStatus;
}

export interface OssConfigListPage {
  current: number;
  records: OssConfigItem[];
  size: number;
  total: number;
}

export interface OssConfigListParams {
  bucketName?: string;
  configKey?: string;
  current: number;
  isAsc?: 'asc' | 'desc';
  orderByColumn?: OssConfigSortField;
  size: number;
  status?: OssConfigStatus;
}

export interface OssConfigSavePayload {
  accessKey: string;
  accessPolicy: OssConfigAccessPolicy;
  bucketName: string;
  /** 字母开头，往后是字母、数字、下划线和连字符，2-20 位 */
  configKey: string;
  domain?: string;
  /** 访问站点，不要带 http:// 或 https://，协议由 isHttps 决定 */
  endpoint: string;
  ext1?: null | string;
  isHttps?: OssConfigHttpsFlag;
  prefix?: string;
  region?: string;
  remark?: null | string;
  /** 只进不出，响应里读不回来 */
  secretKey: string;
  status?: OssConfigStatus;
}

/** 整条覆盖，secretKey 也要重填：它读不回来，留空会被当成清空 */
export interface OssConfigUpdatePayload extends OssConfigSavePayload {
  ossConfigId: OssConfigId;
}

export interface OssConfigStatusPayload {
  ossConfigId: OssConfigId;
  status: OssConfigStatus;
}
