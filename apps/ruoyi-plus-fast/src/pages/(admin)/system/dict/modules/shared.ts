import { z } from 'zod';

import { optionalSearchId, optionalSearchText } from '@/features/table/search-params';
import type { DictDataListParams, DictTypeListParams } from '@/service/api/system-dict';

/**
 * URL 查询串的契约。
 *
 * 这一页上下挂着两张表，共用一条地址栏，所以分页参数必须各带前缀，否则左边翻页会把右边也带走。 dictType 不属于任何一张表的筛选条件，它表示“当前选中的字典类型”。
 */
export const DictSearchSchema = z.object({
  dataCurrent: optionalSearchId,
  dataSize: optionalSearchId,
  dictLabel: optionalSearchText,
  dictName: optionalSearchText,
  dictType: optionalSearchText,
  typeCurrent: optionalSearchId
});

export type DictSearchQuery = z.infer<typeof DictSearchSchema>;

/** 字典类型表首次加载的参数。 */
export function getDictTypeSearchInitialParams(query: DictSearchQuery, pageSize: number): DictTypeListParams {
  return {
    current: query.typeCurrent ?? 1,
    dictName: query.dictName,
    size: pageSize
  };
}

/** 字典数据表首次加载的参数。dictType 由选中的类型决定，不直接取 URL。 */
export function getDictDataSearchInitialParams(query: DictSearchQuery, pageSize: number): DictDataListParams {
  return {
    current: query.dataCurrent ?? 1,
    dictLabel: query.dictLabel,
    dictType: undefined,
    size: query.dataSize ?? pageSize
  };
}

/**
 * 两张表各自写回 URL 时只认领自己那几个 key。
 *
 * 每个 key 都要显式给出（哪怕是 undefined），这样摊到上一次的查询串上时能把清空的条件真正抹掉。
 */
export function toDictTypeSearchQuery(params: Partial<DictTypeListParams>) {
  return {
    dictName: params.dictName?.trim() || undefined,
    typeCurrent: params.current
  };
}

export function toDictDataSearchQuery(params: Partial<DictDataListParams>) {
  return {
    dataCurrent: params.current,
    dataSize: params.size,
    dictLabel: params.dictLabel?.trim() || undefined
  };
}
