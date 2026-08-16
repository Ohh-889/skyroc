import type { PaginationPageItem } from './types';

/** 页码折叠规则 */
interface PageItemsOptions {
  /** 总页数 */
  pageCount: number;

  /** 是否始终显示首尾页码 */
  showEdges: boolean;

  /** 当前页左右各显示几个兄弟页码 */
  siblingCount: number;
}

/** 省略号项没有状态，所有位置共用同一个对象 */
const ELLIPSIS: PaginationPageItem = { type: 'ellipsis' };

/** 单个页码项 */
function pageItem(value: number): PaginationPageItem {
  return { type: 'page', value };
}

/** 创建 [start, end] 的连续页码项 */
function pageRange(start: number, end: number): PaginationPageItem[] {
  const length = Math.max(0, end - start + 1);

  return Array.from({ length }, (_, idx) => pageItem(idx + start));
}

/** 计算总页数；空数据也保留一页，避免页码区在加载态里塌成空白 */
function getPageCount(total: number, itemsPerPage: number): number {
  return Math.max(1, Math.ceil(total / (itemsPerPage || 1)));
}

/**
 * 根据当前页计算要显示的页码项。
 *
 * `showEdges` 关掉时只渲染一个宽度为 `2 * siblingCount + 1` 的滑动窗口，页码数量恒定、不出现省略号； 打开后额外固定首尾两页，中间用省略号折叠，布局是 `首页 + 省略号 + 兄弟窗口 + 省略号 +
 * 尾页`。
 *
 * 两个关键阈值：
 *
 * - 上面那套布局最多占 `2 * siblingCount + 5` 格，总页数没超过它就直接全铺开，一个省略号都不需要；
 * - 省略号自己也占一格，只折叠一两页等于白占位置（`1 … 4` 并不比 `1 2 3 4` 短），所以某一侧至少要藏起 2 页才画省略号——这正是下面两处 `> 3` / `< pageCount - 2` 的由来。
 *
 * @param currentPage - 当前页码，调用方需保证已在 [1, pageCount] 区间内
 * @param options - 折叠规则
 */
function getPageItems(currentPage: number, options: PageItemsOptions): PaginationPageItem[] {
  const { pageCount, showEdges, siblingCount } = options;

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, pageCount);

  if (!showEdges) {
    const windowSize = siblingCount * 2 + 1;

    if (pageCount <= windowSize) return pageRange(1, pageCount);

    // 贴着首尾时窗口会被截短，整体平移让可见页码数保持不变
    if (currentPage <= siblingCount + 1) return pageRange(1, windowSize);

    if (pageCount - currentPage <= siblingCount) return pageRange(pageCount - windowSize + 1, pageCount);

    return pageRange(leftSibling, rightSibling);
  }

  const maxSlots = siblingCount * 2 + 5;

  if (pageCount <= maxSlots) return pageRange(1, pageCount);

  /** 只有一侧折叠时，另一侧能连续铺开的页码数（让出尾页与省略号各一格） */
  const runLength = maxSlots - 2;

  const showLeftEllipsis = leftSibling > 3;
  const showRightEllipsis = rightSibling < pageCount - 2;

  // pageCount > maxSlots 时两侧不可能同时铺得开，因此至少有一个省略号

  if (!showLeftEllipsis) {
    return [...pageRange(1, runLength), ELLIPSIS, pageItem(pageCount)];
  }

  if (!showRightEllipsis) {
    return [pageItem(1), ELLIPSIS, ...pageRange(pageCount - runLength + 1, pageCount)];
  }

  return [pageItem(1), ELLIPSIS, ...pageRange(leftSibling, rightSibling), ELLIPSIS, pageItem(pageCount)];
}

export { getPageCount, getPageItems };
