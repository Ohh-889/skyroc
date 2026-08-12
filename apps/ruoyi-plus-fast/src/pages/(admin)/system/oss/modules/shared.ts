import { z } from 'zod';

import {
  optionalSearchEnum,
  optionalSearchId,
  optionalSearchText,
  optionalSearchTime,
  resolveSearchPagination,
  searchPaginationShape
} from '@/features/table/search-params';
import type { OssListParams } from '@/service/api/system-oss';

/**
 * URL 查询串的契约，同时也是发请求前的清洗规则。
 *
 * 它只描述“URL 上可能出现什么”，不负责给默认值——默认值集中在 getOssSearchInitialParams。
 */
export const OssSearchSchema = z.object({
  ...searchPaginationShape,
  beginTime: optionalSearchTime,
  createBy: optionalSearchId,
  endTime: optionalSearchTime,
  fileName: optionalSearchText,
  /** 接口按精确值匹配后缀，大小写在这里抹平。 */
  fileSuffix: optionalSearchText.transform(value => value?.toLowerCase()),
  isAsc: optionalSearchEnum(['asc', 'desc']),
  orderByColumn: optionalSearchEnum(['createTime', 'fileName', 'fileSuffix', 'originalName', 'ossId', 'service']),
  originalName: optionalSearchText,
  service: optionalSearchText
});

export type OssSearchQuery = z.infer<typeof OssSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getOssSearchInitialParams(pageSize: number): OssListParams {
  return {
    // 这几个 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    beginTime: undefined,
    createBy: undefined,
    current: 1,
    endTime: undefined,
    fileName: undefined,
    fileSuffix: undefined,
    isAsc: 'desc',
    orderByColumn: 'createTime',
    originalName: undefined,
    service: undefined,
    size: pageSize
  };
}

/** 表格参数写回 URL。 */
export function toOssSearchQuery(params: Partial<OssListParams>): OssSearchQuery {
  return OssSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，翻页和排序也可能带上脏值，统一过一遍 schema 再发出去。 */
export function normalizeOssSearchParams(params: Partial<OssListParams>): OssListParams {
  const query = OssSearchSchema.parse(params);

  return { ...query, ...resolveSearchPagination(query) };
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasOssFilters(params: Partial<OssListParams>) {
  return Boolean(
    params.beginTime ||
      params.createBy ||
      params.endTime ||
      params.fileName ||
      params.fileSuffix ||
      params.originalName ||
      params.service
  );
}
