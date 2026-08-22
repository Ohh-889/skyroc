import type { ReactElement, Ref } from 'react';
import type { FlatList, FlatListProps } from 'react-native';

/** 各 slot 的 className 覆盖表 */
export type SlotClassNames<Slots extends string> = Partial<Record<Slots, string>>;

/** 分页请求参数，`useInfiniteList` 会把这两个字段合进调用方自己的 params 再发出去 */
export interface PageParams {
  /** 页码，从 1 开始 */
  pageNum: number;

  /** 每页条数 */
  pageSize: number;
}

/** 分页响应体，字段名对齐后端约定；`pages` 是总页数，是否还有下一页只由它决定 */
export interface PageResult<TItem> {
  /** 当前页数据 */
  items: TItem[];

  /** 当前页码 */
  pageNum: number;

  /** 总页数 */
  pages: number;

  /** 总条数 */
  total: number;
}

/** 列表整体状态；`loading` 只表示首屏，翻页中的状态是 `isFetchingMore` */
export type ListStatus = 'error' | 'loading' | 'success';

/** List 可覆盖的 slot 名称 */
export type ListSlots = 'content' | 'footer' | 'placeholder' | 'root' | 'separator';

/** footer 渲染上下文 */
export interface ListFooterContext {
  /** 是否处于折叠态 */
  collapsed: boolean;

  /** 当前已渲染的条数 */
  count: number;

  /** 是否已经没有下一页 */
  isEnd: boolean;

  /** 是否正在加载下一页 */
  isFetchingMore: boolean;
}

/** 占位区（空态 / 错误态 / 首屏加载）渲染上下文 */
export interface ListPlaceholderContext {
  /** 空列表文案 */
  emptyText?: string;

  /** 加载失败文案 */
  errorText?: string;

  /** 失败后的重试回调 */
  onRetry?: () => void;

  /** 列表状态 */
  status: ListStatus;
}

/** 被 List 接管、不再透传给 FlatList 的属性 */
type OmittedListProps =
  | 'ItemSeparatorComponent'
  | 'keyExtractor'
  | 'ListEmptyComponent'
  | 'ListFooterComponent'
  | 'onEndReached'
  | 'onEndReachedThreshold';

/** List 组件属性 */
export interface ListProps<TItem> extends Omit<FlatListProps<TItem>, OmittedListProps> {
  /** 覆盖各 slot 的 className */
  classNames?: SlotClassNames<ListSlots>;

  /** 折叠态：footer 换成「查看更多」，且不再触底自动加载；配合 onExpand 使用 */
  collapsed?: boolean;

  /** 空列表文案，默认「暂无数据」 */
  emptyText?: string;

  /** 加载失败文案，默认「加载失败，点击重试」 */
  errorText?: string;

  /** 是否已经没有下一页，为 true 时 footer 显示「没有更多了」并停止触底加载 */
  isEnd?: boolean;

  /** 是否正在加载下一页 */
  isFetchingMore?: boolean;

  /** 取 key 的字段名，默认 `id`；字段不存在时回退到下标 */
  keyField?: keyof TItem;

  /** 折叠态下点「查看更多」的回调 */
  onExpand?: () => void;

  /** 触底加载下一页；内部已按 status / isEnd / isFetchingMore / collapsed 做过守卫，不会重复触发 */
  onLoadMore?: () => void;

  /** 加载失败后的重试回调 */
  onRetry?: () => void;

  /** 底层 FlatList 的 ref，用于 scrollToTop 等命令式操作 */
  ref?: Ref<FlatList<TItem>>;

  /** 自定义 footer，返回 null 表示不渲染 */
  renderFooter?: (context: ListFooterContext) => ReactElement | null;

  /** 自定义空态 / 错误态 / 首屏加载态，返回 null 表示不渲染 */
  renderPlaceholder?: (context: ListPlaceholderContext) => ReactElement | null;

  /** 是否在条目之间显示分割线 */
  separator?: boolean;

  /** 列表状态，默认 `success`；用 useInfiniteList 时由 listProps 提供 */
  status?: ListStatus;
}
