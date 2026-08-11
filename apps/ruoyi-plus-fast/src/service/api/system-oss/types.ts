export type OssId = number | string;

export type OssSortField = 'createTime' | 'fileName' | 'fileSuffix' | 'originalName' | 'ossId' | 'service';

export interface OssItem {
  createBy: null | OssId;
  /** 上传人账号名，由后端查用户表补上。账号已注销或查不到时是空串 */
  createByName: string;
  createTime: null | string;
  ext1: null | string;
  /** 对象 key，下载和删除按它找文件 */
  fileName: string;
  fileSuffix: string;
  /** 上传时的原始文件名 */
  originalName: string;
  ossId: OssId;
  /** 存的是哪套存储配置的名字 */
  service: string;
  /** 私有桶下是两分钟就失效的临时地址，不要缓存 */
  url: string;
}

export interface OssListPage {
  current: number;
  records: OssItem[];
  size: number;
  total: number;
}

export interface OssListParams {
  beginTime?: string;
  /** 上传人的用户主键 */
  createBy?: number;
  current: number;
  endTime?: string;
  fileName?: string;
  fileSuffix?: string;
  isAsc?: 'asc' | 'desc';
  orderByColumn?: OssSortField;
  originalName?: string;
  service?: string;
  size: number;
  url?: string;
}

export interface OssUploadResult {
  /** 这里是原始文件名，不是对象 key，和 OssItem.fileName 的含义不同 */
  fileName: string;
  /** 后端按 RuoYi 口径返回字符串 */
  ossId: string;
  url: string;
}
