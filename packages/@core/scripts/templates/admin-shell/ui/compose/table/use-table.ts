import { parseQuery } from '@skyroc/utils';
import { Form } from 'antd';
import type { TablePaginationConfig } from 'antd';
import { useTranslation } from 'react-i18next';

import { formatSearchParams, useHookTable } from './hooks';
import type {
  CustomTableProps,
  GetTableDataFromResponse,
  PaginationData,
  TableColumn,
  TableColumnCheck,
  TableColumnCheckTitle,
  TableColumnFixed,
  TableConfig,
  TableDataWithIndex,
  TableOnChange
} from './types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = ['10', '15', '20', '25', '30'];

/** Ant Design 表格 Hook，组合查询参数、React Query、Form、分页和列设置。 */
export function useTable<Params, Response, T = GetTableDataFromResponse<Response>>(
  config: TableConfig<Params, Response, T>
) {
  const {
    apiParams,
    columns: columnsFactory,
    enabled,
    getColumnVisible,
    immediate = true,
    isChangeURL = true,
    isMobile = false,
    onChange: onChangeCallback,
    onFetched,
    onSearchParamsChange,
    pagination: paginationConfig,
    queryHook,
    queryOptions,
    routeSearch = '',
    rowKey = 'id',
    showTotal = true,
    transformer,
    transformParams,
    ...rest
  } = config;

  const { t } = useTranslation();
  const [form] = Form.useForm<Params>();
  const routeParams = isChangeURL && routeSearch ? parseQuery(routeSearch) : {};
  const initialParams = createTableParams<Params>({
    ...(apiParams as Partial<Params>),
    ...(routeParams as Partial<Params>)
  });
  const resetParams = createTableParams<Params>(apiParams);

  const result = useHookTable<Params, Response, T, TableColumn<TableDataWithIndex<T>>>({
    apiParams: initialParams,
    columns: columnsFactory,
    enabled,
    getColumnChecks: columns => getAntdColumnChecks(columns, getColumnVisible),
    getColumns: getAntdColumns,
    immediate,
    isChangeURL,
    onFetched,
    onSearchParamsChange,
    queryHook,
    queryOptions,
    resetParams,
    transformer: transformer ?? (defaultTableTransformer as (response: Response) => PaginationData<T>),
    transformParams
  });

  const pagination = createPaginationConfig({
    isMobile,
    pageNum: result.pageNum,
    pageSize: result.pageSize,
    paginationConfig,
    showTotal,
    totalText: total => t('datatable.itemCount', { total }),
    total: result.total
  });

  /** 重置搜索表单和已提交查询参数。 */
  function reset() {
    form.setFieldsValue((apiParams ?? {}) as unknown as Parameters<typeof form.setFieldsValue>[0]);
    result.resetSearchParams();
  }

  /** 提交搜索表单。 */
  async function run(isResetCurrent: boolean = true) {
    const values = await form.validateFields();
    const nextParams = isResetCurrent
      ? {
          ...values,
          current: DEFAULT_PAGE,
          size: result.pageSize
        }
      : values;

    result.updateSearchParams(nextParams as unknown as Partial<Params>);
  }

  /** 同步 Ant Design 表格分页、筛选和排序变化。 */
  function handleChange(...args: TableOnChange<TableDataWithIndex<T>>) {
    const [paginationContext, ...otherParams] = args;

    let nextParams = {
      current: paginationContext.current ?? DEFAULT_PAGE,
      size: paginationContext.pageSize ?? result.pageSize
    } as unknown as Partial<Params>;

    if (onChangeCallback) {
      const customParams = onChangeCallback(paginationContext, ...otherParams);

      if (customParams) {
        nextParams = customParams;
      }
    }

    result.updateSearchParams(nextParams);
  }

  return {
    ...result,
    form,
    pagination,
    reset,
    run,
    searchProps: {
      form,
      reset,
      search: run,
      searchParams: result.searchParams as NonNullable<Params>
    },
    tableProps: {
      columns: result.columns,
      dataSource: result.data,
      loading: result.loading,
      onChange: handleChange,
      pagination,
      rowKey,
      ...rest
    } as CustomTableProps<T>
  };
}

/** 默认分页响应转换，适配 current/size/total/records 结构。 */
export function defaultTableTransformer<T>(response?: {
  current?: number;
  records?: T[];
  size?: number;
  total?: number;
}): PaginationData<T> {
  return {
    data: response?.records ?? [],
    pageNum: response?.current ?? DEFAULT_PAGE,
    pageSize: response?.size ?? DEFAULT_PAGE_SIZE,
    total: response?.total ?? 0
  };
}

/** 从 Ant Design 列定义生成列设置项。 */
export function getAntdColumnChecks<T>(
  columns: TableColumn<T>[],
  getColumnVisible?: (column: TableColumn<T>) => boolean
) {
  const checks: TableColumnCheck[] = [];

  columns.forEach(column => {
    const key = getColumnKey(column);

    if (!key) return;

    checks.push({
      checked: true,
      fixed: getColumnFixed(column),
      key,
      title: getColumnTitle(column, key),
      visible: getColumnVisible?.(column) ?? true
    });
  });

  return checks;
}

/** 根据列设置项生成 Ant Design 表格列。 */
export function getAntdColumns<T>(columns: TableColumn<T>[], checks: TableColumnCheck[]) {
  const columnMap = new Map<string, TableColumn<T>>();
  const unmanagedColumns: TableColumn<T>[] = [];

  columns.forEach(column => {
    const key = getColumnKey(column);

    if (key) {
      columnMap.set(key, column);
      return;
    }

    unmanagedColumns.push(column);
  });

  const checkedColumns = checks
    .filter(item => item.checked)
    .map(check => {
      const column = columnMap.get(check.key);

      if (!column) return null;

      return {
        ...column,
        fixed: check.fixed === 'unFixed' ? undefined : check.fixed
      } as TableColumn<T>;
    })
    .filter(Boolean) as TableColumn<T>[];

  return [...unmanagedColumns, ...checkedColumns];
}

function createTableParams<T>(params?: Partial<T>) {
  return formatSearchParams<T>({
    current: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
    ...params
  } as unknown as Partial<T>);
}

function createPaginationConfig(options: {
  isMobile: boolean;
  pageNum: number;
  pageSize: number;
  paginationConfig?: false | TablePaginationConfig;
  showTotal: boolean;
  total: number;
  totalText: (total: number) => string;
}): false | TablePaginationConfig {
  const { isMobile, pageNum, pageSize, paginationConfig, showTotal, total, totalText } = options;

  if (paginationConfig === false) {
    return false;
  }

  return {
    current: pageNum,
    pageSize,
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    showSizeChanger: true,
    showTotal: showTotal ? totalText : undefined,
    simple: isMobile,
    total,
    ...paginationConfig
  } satisfies TablePaginationConfig;
}

function getColumnKey<T>(column: TableColumn<T>) {
  const key = column.key;

  if (key !== undefined && key !== null) {
    return String(key);
  }

  if (!('dataIndex' in column)) {
    return null;
  }

  const { dataIndex } = column;

  if (Array.isArray(dataIndex)) {
    return dataIndex.join('.');
  }

  if (dataIndex !== undefined && dataIndex !== null) {
    return String(dataIndex);
  }

  return null;
}

function getColumnFixed<T>(column: TableColumn<T>): TableColumnFixed {
  if (!('fixed' in column)) {
    return 'unFixed';
  }

  if (column.fixed === true || column.fixed === 'left') {
    return 'left';
  }

  if (column.fixed === 'right') {
    return 'right';
  }

  return 'unFixed';
}

function getColumnTitle<T>(column: TableColumn<T>, key: string): TableColumnCheckTitle {
  if (!('title' in column)) {
    return key;
  }

  return column.title ?? key;
}
