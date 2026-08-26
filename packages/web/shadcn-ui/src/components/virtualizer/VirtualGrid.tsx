'use client';
/* eslint-disable react-hooks/incompatible-library */

import type { CSSProperties } from 'react';
import { Fragment, useImperativeHandle, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@skyroc/utils';
import { virtualizerVariants } from './virtualizer-variants';
import type { VirtualGridProps, VirtualizerGrid } from './types';

const VirtualGrid = <
  T,
  TScrollElement extends HTMLDivElement = HTMLDivElement,
  TItemElement extends Element = Element
>(
  props: VirtualGridProps<T, TScrollElement, TItemElement>
) => {
  const {
    className,
    classNames,
    columnProps,
    columns,
    columnWidth,
    containerProps,
    data,
    height,
    keyExtractor,
    onChange,
    onScroll,
    ref,
    renderCell,
    rowHeight,
    style,
    width,
    ...rest
  } = props;

  const { inner, root } = virtualizerVariants();

  const mergedRootCls = cn(root(), className ?? classNames?.root);
  const innerCls = cn(inner(), classNames?.inner);

  const rootRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(data.length / columns);

  const getRowSize = (index: number) =>
    typeof rowHeight === 'function' ? rowHeight(index) : rowHeight;

  const getColumnSize = (index: number) =>
    typeof columnWidth === 'function' ? columnWidth(index) : columnWidth;

  // Vertical virtualization: rows
  const rowVirtualizer = useVirtualizer<TScrollElement, TItemElement>({
    getScrollElement: () => rootRef.current as TScrollElement,
    count: rowCount,
    estimateSize: getRowSize,
    // Row virtualizer onChange serves as primary onChange/onScroll callback
    onChange: (instance, sync) => {
      onChange?.(instance, sync);
      onScroll?.(instance.scrollOffset ?? 0);
    },
    ...rest
  });

  // Horizontal virtualization: columns
  const columnVirtualizer = useVirtualizer<TScrollElement, TItemElement>({
    getScrollElement: () => rootRef.current as TScrollElement,
    count: columns,
    estimateSize: getColumnSize,
    horizontal: true,
    ...columnProps
  });

  const containerStyle: CSSProperties = {
    height,
    width,
    overflow: 'auto',
    ...style
  };

  const innerStyle: CSSProperties = {
    position: 'relative',
    height: rowVirtualizer.getTotalSize(),
    width: columnVirtualizer.getTotalSize()
  };

  useImperativeHandle(ref, () => {
    return {
      containerRef: rootRef.current as TScrollElement,
      rowVirtualizer,
      columnVirtualizer,
      ...rowVirtualizer
    } as unknown as VirtualizerGrid<TScrollElement, TItemElement>;
  }, [rowVirtualizer, columnVirtualizer, rootRef]);

  return (
    <div
      {...containerProps}
      className={mergedRootCls}
      ref={rootRef}
      style={containerStyle}
    >
      <div
        className={innerCls}
        style={innerStyle}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <Fragment key={virtualRow.index}>
            {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
              const rowIndex = virtualRow.index;
              const colIndex = virtualColumn.index;
              const dataIndex = rowIndex * columns + colIndex;

              if (dataIndex >= data.length)
                return null;

              const item = data[dataIndex];

              const cellStyle: CSSProperties = {
                position: 'absolute',
                top: 0,
                left: 0,
                width: virtualColumn.size,
                height: virtualRow.size,
                transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`
              };

              // eslint-disable-next-line no-nested-ternary
              const key = keyExtractor
                ? typeof keyExtractor === 'function'
                  ? keyExtractor(item, rowIndex * colIndex)
                  : (item as any)[keyExtractor]
                : `${rowIndex}-${colIndex}`;

              return (
                <Slot
                  key={String(key)}
                  style={cellStyle}
                >
                  {renderCell(item, rowIndex, colIndex)}
                </Slot>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default VirtualGrid;
