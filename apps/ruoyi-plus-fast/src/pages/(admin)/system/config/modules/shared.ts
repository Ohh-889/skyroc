import { z } from 'zod';

import {
  optionalSearchEnum,
  optionalSearchText,
  optionalSearchTime,
  resolveSearchPagination,
  searchPaginationShape
} from '@/features/table/search-params';
import type { ConfigListParams } from '@/service/api/system-config';

/**
 * URL 查询串的契约，同时也是发请求前的清洗规则。默认值不写在这里，见 getConfigSearchInitialParams。
 *
 * 这个接口的时间区间字段叫 rangeBegin / rangeEnd，不是别处那对 beginTime / endTime。
 */
export const ConfigSearchSchema = z.object({
  ...searchPaginationShape,
  configKey: optionalSearchText,
  configName: optionalSearchText,
  configType: optionalSearchEnum(['N', 'Y']),
  rangeBegin: optionalSearchTime,
  rangeEnd: optionalSearchTime
});

export type ConfigSearchQuery = z.infer<typeof ConfigSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getConfigSearchInitialParams(pageSize: number): ConfigListParams {
  return {
    // 这些 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    configKey: undefined,
    configName: undefined,
    configType: undefined,
    current: 1,
    rangeBegin: undefined,
    rangeEnd: undefined,
    size: pageSize
  };
}

/** 表格参数写回 URL。 */
export function toConfigSearchQuery(params: Partial<ConfigListParams>): ConfigSearchQuery {
  return ConfigSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，统一过一遍 schema 再发出去。 */
export function normalizeConfigSearchParams(params: Partial<ConfigListParams>): ConfigListParams {
  const query = ConfigSearchSchema.parse(params);

  return { ...query, ...resolveSearchPagination(query) };
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasConfigFilters(params: Partial<ConfigListParams>) {
  return Boolean(params.configKey || params.configName || params.configType || params.rangeBegin || params.rangeEnd);
}
