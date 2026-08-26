'use client';
/* eslint-disable react-hooks/incompatible-library */
import type { CSSProperties, Ref } from 'react';
import { Fragment, useImperativeHandle, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@skyroc/utils';
import { virtualizerVariants } from './virtualizer-variants';
import type { VirtualListProps, VirtualizerList } from './types';

/**
 * A styled virtual list component for efficiently rendering large lists.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <VirtualList
 *   data={items}
 *   height={400}
 *   itemSize={50}
 *   keyExtractor='id'
 *   renderItem={(item) => (
 *     <div className="flex items-center px-4 border-b">
 *       {item.name}
 *     </div>
 *   )}
 * />
 *
 * // With custom styling
 * <VirtualList
 *   data={items}
 *   height={400}
 *   itemSize={50}
 *   keyExtractor={(item, index) => item.id}
 *   classNames={{
 *     root: 'border rounded-lg',
 *     item: 'hover:bg-accent'
 *   }}
 *   renderItem={(item, index) => (
 *     <div>
 *       {item.name}
 *     </div>
 *   )}
 * />
 * ```
 */
const VirtualList = <T, TScrollElement extends HTMLDivElement = HTMLDivElement, TItemElement extends Element = HTMLDivElement>(props: VirtualListProps<T, TScrollElement, TItemElement>) => {
  const { className, classNames, containerProps, data, dynamic, height, horizontal, itemSize, keyExtractor, onChange, onScroll, ref, renderItem, style, width, ...rest } = props;

  const { inner, root } = virtualizerVariants();

  const mergedCls = cn(root(), className || classNames?.root);

  const innerCls = cn(inner(), classNames?.inner);

  const rootRef = useRef<HTMLDivElement>(null);

  function getEstimateSize(index: number) {
    if (typeof itemSize === 'function') {
      return itemSize(index);
    }

    return itemSize;
  }

  const elementVirtualizer = useVirtualizer<TScrollElement, TItemElement>({
    getScrollElement: () => rootRef.current as TScrollElement,
    count: data.length,
    estimateSize: getEstimateSize,
    horizontal,
    onChange: (instance, sync) => {
      onChange?.(instance, sync);
      onScroll?.(instance.scrollOffset ?? 0);
    },
    ...rest
  });

  const containerStyle: CSSProperties = {
    height: horizontal ? height : height ?? '100%',
    width: horizontal ? (width ?? '100%') : width,
    overflow: 'auto',
    contain: 'strict',
    ...style
  };

  const items = elementVirtualizer.getVirtualItems();
  const totalSize = elementVirtualizer.getTotalSize();

  const innerStyle: CSSProperties = horizontal
    ? {
      width: totalSize,
      height: '100%',
      position: 'relative'
    }
    : {
      height: totalSize,
      width: '100%',
      position: 'relative'
    };

  useImperativeHandle(ref, () => {
    return {
      containerRef: rootRef.current as TScrollElement,
      ...elementVirtualizer
    } as unknown as VirtualizerList<TScrollElement, TItemElement>;
  }, [elementVirtualizer, rootRef]);

  const content = () => {
    if (dynamic) {
      const Comp = horizontal ? Fragment : 'div';

      const dynamicContent = (
        <Comp
          {...(horizontal
            ? {}
            : {
              style: {
                position: 'absolute' as const,
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${items[0]?.start ?? 0}px)`
              }
            })}
        >
          {items.map((virtualItem) => {
            const item = data[virtualItem.index];

            // eslint-disable-next-line no-nested-ternary
            const key = keyExtractor ? typeof keyExtractor === 'function' ? keyExtractor(item, virtualItem.index) : item[keyExtractor] : virtualItem.index;
            return (
              <div
                data-index={virtualItem.index}
                key={String(key)}
                ref={elementVirtualizer.measureElement as Ref<HTMLDivElement>}
                style={horizontal
                  ? {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    transform: `translateX(${virtualItem.start}px)`
                  }
                  : undefined}
              >
                {renderItem({
                  item,
                  index: virtualItem.index,
                  virtualItem,
                  virtualizer: elementVirtualizer
                })}
              </div>

            );
          })}
        </Comp>
      );
      return dynamicContent;
    }
    return items.map((virtualItem) => {
      const item = data[virtualItem.index];

      const itemStyle: CSSProperties = horizontal
        ? {
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${virtualItem.size}px`,
          transform: `translateX(${virtualItem.start}px)`
        }
        : {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${virtualItem.size}px`,
          transform: `translateY(${virtualItem.start}px)`
        };

      // eslint-disable-next-line no-nested-ternary
      const key = keyExtractor ? typeof keyExtractor === 'function' ? keyExtractor(item, virtualItem.index) : item[keyExtractor] : virtualItem.index;

      return (
        <Slot
          key={String(key)}
          style={itemStyle}
        >
          {renderItem({
            item,
            index: virtualItem.index,
            virtualItem,
            virtualizer: elementVirtualizer
          })}
        </Slot>
      );
    }); ;
  };

  return (
    <div
      {...containerProps}
      className={mergedCls}
      ref={rootRef}
      style={containerStyle}
    >
      <div
        className={innerCls}
        style={innerStyle}
      >
        {content()}
      </div>
    </div>
  );
};

export default VirtualList;
