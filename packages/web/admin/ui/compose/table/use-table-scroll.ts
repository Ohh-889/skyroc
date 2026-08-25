import { useSize } from 'ahooks';
import { useRef } from 'react';

/**
 * 表格滚动配置Hook
 *
 * 自动计算表格滚动区域的宽度和高度
 *
 * @param scrollX - 表格最小宽度，默认702
 * @returns 滚动配置和容器ref
 */
export function useTableScroll(scrollX: number = 702) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const size = useSize(tableWrapperRef);

  /** 获取表格滚动的Y轴高度 */
  function getTableScrollY() {
    const height = size?.height;

    if (!height) return undefined;

    // 减去表格头部、分页等组件的高度
    return height - 160;
  }

  const scrollConfig = {
    x: scrollX,
    y: getTableScrollY()
  };

  return {
    scrollConfig,
    tableWrapperRef
  };
}

/**
 * 计算表格列的总宽度
 *
 * @param columns - 表格列配置
 * @param minWidth - 列的最小宽度，默认120
 * @returns 总宽度
 */
export function getTableScrollX(columns: any[], minWidth: number = 120): number {
  return columns.reduce((acc, column) => {
    return acc + Number(column.width ?? column.minWidth ?? minWidth);
  }, 0);
}
