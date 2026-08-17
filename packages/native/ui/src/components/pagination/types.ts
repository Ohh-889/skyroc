import type { ReactNode, Ref } from 'react';
import type { View, ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types/shared';

/** 页码项 */
interface PageItem {
  /** 页码类型 */
  type: 'page';

  /** 页码值 */
  value: number;
}

/** 省略号项 */
interface PageEllipsis {
  /** 省略号类型 */
  type: 'ellipsis';
}

/** 分页页码项联合类型，由 `getPageItems` 产出，仅用于组件内部渲染 */
type PaginationPageItem = PageEllipsis | PageItem;

/** 分页模式 */
type PaginationMode = 'multi' | 'simple';

/** 分页插槽名称，`simple` 为 simple 模式下「当前页/总页数」的容器 */
type PaginationSlots = 'content' | 'desc' | 'ellipsis' | 'item' | 'itemText' | 'navButton' | 'root' | 'simple';

/** Pagination 组件属性 */
interface PaginationProps extends Omit<ViewProps, 'children'> {
  /** Uniwind className，作用于根节点 */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<PaginationSlots>;

  /** 非受控默认页码 */
  defaultPage?: number;

  /** 是否禁用 */
  disabled?: boolean;

  /** 每页条数 */
  itemsPerPage?: number;

  /** 分页模式，`simple` 只显示「当前页/总页数」 */
  mode?: PaginationMode;

  /** 下一页按钮内容，string / number 自动包裹 Text，也可传图标节点 */
  next?: ReactNode;

  /** 页码变化回调 */
  onPageChange?: (page: number) => void;

  /** 受控当前页码 */
  page?: number;

  /** 上一页按钮内容，string / number 自动包裹 Text，也可传图标节点 */
  prev?: ReactNode;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** 是否始终显示首尾页码，中间部分用省略号折叠 */
  showEdges?: boolean;

  /** 当前页码左右各显示几个兄弟页码 */
  siblingCount?: number;

  /** 数据总条数 */
  totalItems?: number;
}

export type { PaginationMode, PaginationPageItem, PaginationProps, PaginationSlots };
