import { useEffect, useRef, useState } from 'react';

import type {
  HookTableConfig,
  HookTableResult,
  PaginationData,
  TableColumnCheck,
  TableDataWithIndex
} from './types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

/** 核心表格 Hook，负责查询参数、React Query 请求、分页结果和列设置状态。 */
export function useHookTable<Params, Response, T, Column>(
  config: HookTableConfig<Params, Response, T, Column>
): HookTableResult<Params, T, Column> {
  const {
    apiParams,
    columns: columnsFactory,
    enabled = true,
    getColumnChecks,
    getColumns,
    immediate = true,
    isChangeURL = false,
    onSearchParamsChange,
    queryHook,
    queryOptions,
    resetParams,
    transformer,
    transformParams
  } = config;

  const initialSearchParamsRef = useRef(createSearchParams<Params>(apiParams));
  const resetSearchParamsRef = useRef(createSearchParams<Params>(resetParams ?? apiParams));
  const onFetchedRef = useRef(config.onFetched);

  onFetchedRef.current = config.onFetched;

  const [searchParams, setSearchParams] = useState<Partial<Params>>(initialSearchParamsRef.current);
  const [queryEnabled, setQueryEnabled] = useState(immediate);
  const [columnChecks, setColumnChecks] = useState<TableColumnCheck[]>(() => getColumnChecks(columnsFactory()));

  const allColumns = columnsFactory();
  const columns = getColumns(allColumns, columnChecks);
  const requestParams = resolveRequestParams<Params>(searchParams, transformParams);

  const query = queryHook<PaginationData<TableDataWithIndex<T>>>(requestParams, {
    ...queryOptions,
    enabled: enabled && queryEnabled,
    select: response => {
      return withTableIndex(transformer(response));
    }
  });

  const paginationData = query.data ?? createEmptyPaginationData<T>();
  const empty = !query.isFetching && paginationData.data.length === 0;
  const loading = query.isFetching;

  useEffect(() => {
    if (!query.data) return;

    const onFetched = onFetchedRef.current;

    if (!onFetched) return;

    Promise.resolve(onFetched(query.data)).catch(() => undefined);
  }, [query.data]);

  /** 重新请求当前查询。 */
  async function getData() {
    setQueryEnabled(true);
    await query.refetch();
  }

  /** 合并更新查询参数。 */
  function updateSearchParams(params: Partial<Params>) {
    commitSearchParams({ ...searchParams, ...params });
  }

  /** 用默认参数重置查询。 */
  function resetSearchParams() {
    commitSearchParams(resetSearchParamsRef.current);
  }

  /** 重新生成列设置，并保留已有显隐、固定和排序偏好。 */
  function reloadColumns() {
    const nextChecks = getColumnChecks(columnsFactory());
    setColumnChecks(mergeColumnChecks(columnChecks, nextChecks));
  }

  function commitSearchParams(nextParams: Partial<Params>) {
    const formattedParams = formatSearchParams(nextParams);

    setSearchParams(formattedParams);
    setQueryEnabled(true);

    if (isChangeURL) {
      onSearchParamsChange?.(formattedParams);
    }
  }

  return {
    columnChecks,
    columns,
    data: paginationData.data,
    empty,
    getData,
    loading,
    pageNum: paginationData.pageNum,
    pageSize: paginationData.pageSize,
    query,
    reloadColumns,
    resetSearchParams,
    searchParams,
    setColumnChecks,
    total: paginationData.total,
    updateSearchParams
  };
}

/** 移除查询参数中的空值，保留 false、0 和空字符串。 */
export function formatSearchParams<T>(params: Partial<T> = {}) {
  const entries = Object.entries(params as Record<string, unknown>).filter(([, value]) => {
    return value !== null && value !== undefined;
  });

  return Object.fromEntries(entries) as Partial<T>;
}

function createSearchParams<T>(params?: Partial<T>) {
  return formatSearchParams<T>({
    current: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
    ...params
  } as unknown as Partial<T>);
}

function resolveRequestParams<Params>(
  searchParams: Partial<Params>,
  transformParams?: (params: Params) => Params
) {
  const formattedParams = formatSearchParams(searchParams) as Params;

  if (!transformParams) {
    return formattedParams;
  }

  return transformParams(formattedParams);
}

function createEmptyPaginationData<T>(): PaginationData<TableDataWithIndex<T>> {
  return {
    data: [],
    pageNum: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0
  };
}

function withTableIndex<T>(data: PaginationData<T>): PaginationData<TableDataWithIndex<T>> {
  const { data: records, pageNum, pageSize, total } = data;

  return {
    data: records.map((item, index) => {
      return {
        ...item,
        index: (pageNum - 1) * pageSize + index + 1
      } as TableDataWithIndex<T>;
    }),
    pageNum,
    pageSize,
    total
  };
}

function mergeColumnChecks(currentChecks: TableColumnCheck[], nextChecks: TableColumnCheck[]) {
  const currentMap = new Map(currentChecks.map(item => [item.key, item]));
  const orderMap = new Map(currentChecks.map((item, index) => [item.key, index]));
  const fallbackOrder = nextChecks.length;

  return nextChecks
    .map((item, index) => {
      const current = currentMap.get(item.key);

      return {
        ...item,
        checked: current?.checked ?? item.checked,
        fixed: current?.fixed ?? item.fixed,
        visible: current?.visible ?? item.visible,
        __order: orderMap.get(item.key) ?? fallbackOrder + index
      };
    })
    .toSorted((a, b) => a.__order - b.__order)
    .map(({ __order: _order, ...item }) => item);
}
