import type { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { FormInstance, TablePaginationConfig, TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Key, ReactNode } from 'react';

/** 表格接口函数类型。 */
export type TableApiFn<Params = any, Response = PaginatingQueryRecord<any>> = (params: Params) => Promise<Response>;

/** 后端分页列表的最小结构。 */
export interface PaginatingQueryRecord<T = any> {
  /** 当前页码。 */
  current: number;
  /** 数据列表。 */
  records: T[];
  /** 每页条数。 */
  size: number;
  /** 总条数。 */
  total: number;
}

/** 从分页接口响应中提取列表项类型。 */
export type GetTableData<A extends TableApiFn> =
  Awaited<ReturnType<A>> extends PaginatingQueryRecord<infer T> ? T : never;

/** 从分页接口响应类型中提取列表项类型。 */
export type GetTableDataFromResponse<Response> = Response extends PaginatingQueryRecord<infer T> ? T : never;

/** 带序号的表格行数据。 */
export type TableDataWithIndex<T> = T & {
  /** 当前查询结果中的连续序号。 */
  index: number;
};

/** Ant Design 表格列定义。 */
export type TableColumn<T = any> = ColumnsType<T>[number];

/** 表格列固定位置。 */
export type TableColumnFixed = 'left' | 'right' | 'unFixed';

/** 列设置面板中展示的列标题。 */
export type TableColumnCheckTitle = ReactNode | ((...args: any[]) => ReactNode);

/** 表格列设置项。 */
export interface TableColumnCheck {
  /** 列是否参与表格渲染。 */
  checked: boolean;
  /** 列固定到左侧、右侧，或取消固定。 */
  fixed: TableColumnFixed;
  /** 列的稳定唯一标识。 */
  key: string;
  /** 列设置面板中展示的标题。 */
  title: TableColumnCheckTitle;
  /** 列是否出现在列设置面板中。 */
  visible: boolean;
}

/** 标准分页数据。 */
export interface PaginationData<T = any> {
  /** 当前页数据。 */
  data: T[];
  /** 当前页码。 */
  pageNum: number;
  /** 每页条数。 */
  pageSize: number;
  /** 总条数。 */
  total: number;
}

/** 表格操作类型。 */
export type TableOperateType = 'add' | 'edit';

/** 表格行基础数据。 */
export interface TableData {
  /** 表格行的稳定业务主键。 */
  id: Key;
  /** 业务字段。 */
  [key: string]: any;
}

/** 表格变化回调参数。 */
export type TableOnChange<T = any> = Parameters<NonNullable<TableProps<T>['onChange']>>;

/** 根据请求参数生成 React Query key。 */
export type TableQueryKeyBuilder<A extends TableApiFn> = (params: Parameters<A>[0]) => QueryKey;

/** 表格查询 Hook 可接收的 React Query 配置。 */
export type TableQueryHookOptions<Response, Data = Response> = Omit<
  UseQueryOptions<Response, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

/** 表格查询 Hook 类型，消费侧负责声明 queryKey 和 queryFn。 */
export type TableQueryHook<Params, Response> = <Data = Response>(
  params: Params,
  options?: TableQueryHookOptions<Response, Data>
) => UseQueryResult<Data, Error>;

/** React Query 配置，enabled/select/queryKey/queryFn 由表格 Hook 和查询 Hook 接管。 */
export type TableQueryOptions<Response, T> = Omit<
  TableQueryHookOptions<Response, PaginationData<TableDataWithIndex<T>>>,
  'enabled' | 'queryFn' | 'queryKey' | 'select'
>;

/** 核心表格 Hook 配置。 */
export interface HookTableConfig<Params, Response, T, Column> {
  /** 初始查询参数，通常包含分页和查询表单默认值。 */
  apiParams?: Partial<Params>;
  /** 表格列工厂，允许消费侧按权限或国际化重新生成列。 */
  columns: () => Column[];
  /** 外部业务是否允许发起查询。 */
  enabled?: boolean;
  /** 从列定义生成列设置项。 */
  getColumnChecks: (columns: Column[]) => TableColumnCheck[];
  /** 根据列设置项生成最终渲染列。 */
  getColumns: (columns: Column[], checks: TableColumnCheck[]) => Column[];
  /** 是否首次挂载后立即请求。 */
  immediate?: boolean;
  /** 是否把提交后的查询参数同步给外部路由。 */
  isChangeURL?: boolean;
  /** 查询完成后的业务回调。 */
  onFetched?: (data: PaginationData<TableDataWithIndex<T>>) => Promise<void> | void;
  /** 查询参数变化时的外部同步回调。 */
  onSearchParamsChange?: (params: Partial<Params>) => void;
  /** 根据当前查询参数创建 React Query 查询。 */
  queryHook: TableQueryHook<Params, Response>;
  /** 透传给 React Query 的附加配置。 */
  queryOptions?: TableQueryOptions<Response, T>;
  /** 重置查询时使用的参数。 */
  resetParams?: Partial<Params>;
  /** 把接口响应转换成标准分页数据。 */
  transformer: (response: Response) => PaginationData<T>;
  /** 接口请求前的参数转换。 */
  transformParams?: (params: Params) => Params;
}

/** 核心表格 Hook 返回值。 */
export interface HookTableResult<Params, T, Column> {
  /** 可配置的列设置项。 */
  columnChecks: TableColumnCheck[];
  /** 最终传给表格组件的列。 */
  columns: Column[];
  /** 当前页数据。 */
  data: TableDataWithIndex<T>[];
  /** 当前查询是否为空结果。 */
  empty: boolean;
  /** 重新请求当前查询。 */
  getData: () => Promise<void>;
  /** 当前查询是否正在请求。 */
  loading: boolean;
  /** 当前页码。 */
  pageNum: number;
  /** 每页条数。 */
  pageSize: number;
  /** 底层 React Query 查询结果。 */
  query: UseQueryResult<PaginationData<TableDataWithIndex<T>>, Error>;
  /** 重新从列工厂生成列设置项，并保留用户设置。 */
  reloadColumns: () => void;
  /** 用默认参数重置查询。 */
  resetSearchParams: () => void;
  /** 当前已提交的查询参数。 */
  searchParams: Partial<Params>;
  /** 更新列设置项。 */
  setColumnChecks: (checks: TableColumnCheck[]) => void;
  /** 总条数。 */
  total: number;
  /** 合并更新查询参数。 */
  updateSearchParams: (params: Partial<Params>) => void;
}

/** 表格配置。 */
export interface TableConfig<Params, Response, T = GetTableDataFromResponse<Response>>
  extends Omit<
    TableProps<TableDataWithIndex<T>>,
    'columns' | 'dataSource' | 'loading' | 'onChange' | 'pagination' | 'rowKey'
  > {
  /** 接口默认查询参数。 */
  apiParams?: Partial<Params>;
  /** Ant Design 表格列工厂。 */
  columns: () => TableColumn<TableDataWithIndex<T>>[];
  /** 外部业务是否允许发起查询。 */
  enabled?: boolean;
  /** 判断列是否出现在列设置面板中。 */
  getColumnVisible?: (column: TableColumn<TableDataWithIndex<T>>) => boolean;
  /** 是否首次挂载后立即请求。 */
  immediate?: boolean;
  /** 是否读取并同步路由查询参数。 */
  isChangeURL?: boolean;
  /** 是否使用移动端简洁分页。 */
  isMobile?: boolean;
  /** 表格分页、筛选、排序变化回调。 */
  onChange?: (...args: TableOnChange<TableDataWithIndex<T>>) => Partial<Params> | void;
  /** 查询完成后的业务回调。 */
  onFetched?: (data: PaginationData<TableDataWithIndex<T>>) => Promise<void> | void;
  /** 查询参数变化时的外部路由同步回调。 */
  onSearchParamsChange?: (params: Partial<Params>) => void;
  /** 分页配置；传 false 可关闭分页。 */
  pagination?: false | TablePaginationConfig;
  /** 根据当前查询参数创建 React Query 查询。 */
  queryHook: TableQueryHook<Params, Response>;
  /** 透传给 React Query 的附加配置。 */
  queryOptions?: TableQueryOptions<Response, T>;
  /** 当前路由查询字符串，用于初始化查询参数。 */
  routeSearch?: string;
  /** Ant Design 表格行 key。 */
  rowKey?: TableProps<TableDataWithIndex<T>>['rowKey'];
  /** 是否展示总数。 */
  showTotal?: boolean;
  /** 把接口响应转换成标准分页数据。 */
  transformer?: (response: Response) => PaginationData<T>;
  /** 接口请求前的参数转换。 */
  transformParams?: (params: Params) => Params;
}

/** 自定义表格 Props。 */
export type CustomTableProps<T> = Omit<TableProps<TableDataWithIndex<T>>, 'loading'> & {
  /** 当前表格是否展示加载状态。 */
  loading: boolean;
};

/** 表格搜索 Props。 */
export interface TableSearchProps<T = any> {
  /** Ant Design 表单实例。 */
  form: FormInstance<T>;
  /** 重置查询表单。 */
  reset: () => void;
  /** 提交查询表单。 */
  search: (isResetCurrent?: boolean) => Promise<void>;
  /** 当前已提交的查询参数。 */
  searchParams: T;
}

/** 通用弹窗操作 Props。 */
export interface GeneralPopupOperationProps<T extends TableData = TableData> {
  /** Ant Design 表单实例。 */
  form: FormInstance<T>;
  /** 提交弹窗表单。 */
  handleSubmit: () => Promise<void>;
  /** 关闭弹窗。 */
  onClose: () => void;
  /** 弹窗是否打开。 */
  open: boolean;
  /** 当前操作类型。 */
  operateType: TableOperateType;
}
