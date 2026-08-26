'use client';
/* eslint-disable react-hooks/incompatible-library */

import type { CSSProperties, ReactNode, Ref } from 'react';
import { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { type Virtualizer, useVirtualizer } from '@tanstack/react-virtual';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { Icon } from '../icon';
import { TreeRootProvider } from './context';
import { findParentPath, flattenChildren, flattenItems } from './shared';
import { treeVariants } from './tree-variants';
import TreeItem from './TreeItem';
import type {
  FlattenedItem,
  TreeClassNames,
  TreeItemData,
  TreeItemProps,
  TreeItemRenderProps,
  TreeRootProps,
  TreeRootRenderProps
} from './types';

export interface TreeVirtualizerProps<T extends TreeItemData = TreeItemData>
  extends Omit<TreeRootProps<T>, 'children' | 'onScroll' | 'onSelect' | 'onToggle'>,
  Pick<TreeItemProps, 'disabledSelect' | 'disabledToggle' | 'indentSize' | 'onSelect' | 'onToggle'> {
  /**
   * Custom class names for component slots
   */
  classNames?: TreeClassNames & {
    virtualContainer?: string;
    virtualContent?: string;
  };
  /**
   * Whether to use dynamic item size measurement
   */
  dynamic?: boolean;
  /**
   * Height of the virtual container
   */
  height: number | string;
  /**
   * Estimated item height for virtualization
   */
  itemSize?: number | ((index: number) => number);
  /**
   * Callback when scroll offset changes
   */
  onScroll?: (offset: number) => void;
  /**
   * Overscan count for rendering extra items
   */
  overscan?: number;
  /**
   * Custom render function for each tree item
   */
  renderItem?: (props: TreeItemRenderProps & { item: FlattenedItem<T> } & TreeRootRenderProps<T>) => ReactNode;
  /**
   * Reference to the virtualizer instance
   */
  virtualizerRef?: Ref<TreeVirtualizerRef<T> | null>;
  /**
   * Width of the virtual container
   */
  width?: number | string;
}

export interface TreeVirtualizerRef<T extends TreeItemData = TreeItemData> {
  containerRef: HTMLDivElement | null;
  flattenItems: FlattenedItem<T>[];
  scrollToIndex: (index: number, options?: { align?: 'auto' | 'center' | 'end' | 'start' }) => void;
  scrollToValue: (value: string, options?: { align?: 'auto' | 'center' | 'end' | 'start' }) => void;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
}

const DefaultIndicator = ({ isExpanded }: { isExpanded: boolean }) => {
  return (
    <span
      className="flex shrink-0 items-center justify-center transition-transform duration-200"
      data-expanded={isExpanded ? '' : undefined}
    >
      <Icon
        className="size-full transition-transform duration-200"
        icon="lucide:chevron-right"
        style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
      />
    </span>
  );
};

function defaultRenderItemContent<T extends TreeItemData>(item: FlattenedItem<T>, isExpanded: boolean, hasChildren: boolean) {
  const indicator = hasChildren
    ? (
      <DefaultIndicator isExpanded={isExpanded} />
    )
    : <span className="w-4" />;
  const label = 'label' in item.data ? (item.data).label : item.value;
  return (
    <>
      {indicator}
      <span className="flex-1 truncate">{label}</span>
    </>
  );
}

const TreeVirtualizer = <T extends TreeItemData = TreeItemData>(props: TreeVirtualizerProps<T>) => {
  const {
    allowParentSelect,
    bottom,
    bubbleSelect,
    className,
    classNames,
    defaultExpanded = [],
    defaultValue,
    disabled,
    disabledSelect,
    disabledToggle,
    dynamic,
    expanded: controlledExpanded,
    // Virtual props
    height,
    indentSize,
    items,
    itemSize = 36,
    multiple,
    onExpandedChange,
    onScroll,
    // TreeItem props
    onSelect,
    onToggle,
    onValueChange,
    overscan = 5,
    propagateSelect,
    renderItem,
    selectionBehavior = 'toggle',
    size,
    toggleBehavior = 'multiple',
    top,
    value: controlledValue,
    virtualizerRef,
    width
  } = props;

  const { virtualContainer, virtualContent } = treeVariants();

  const rootRef = useRef<HTMLDivElement>(null);
  const firstValue = useRef<string>('');

  const [modelValue, setModelValue] = useControllableState({
    caller: 'tree-virtualizer',
    defaultProp: defaultValue ?? (multiple ? [] : ''),
    onChange: onValueChange,
    prop: controlledValue
  });

  const [expanded, setExpanded] = useControllableState({
    caller: 'tree-virtualizer-expanded',
    defaultProp: defaultExpanded,
    onChange: onExpandedChange,
    prop: controlledExpanded
  });

  const selectedKeys = useMemo(() => {
    if (multiple && Array.isArray(modelValue)) {
      return modelValue;
    }
    return modelValue ? [modelValue] as string[] : [];
  }, [multiple, modelValue]);

  const expandedItems = useMemo(() => flattenItems(items, expanded), [items, expanded]);

  // eslint-disable-next-line complexity
  const handleSelect = useCallback((value: string) => {
    if (disabled) {
      return;
    }

    const item = expandedItems.find(i => i.value === value);

    if (item?.hasChildren && !allowParentSelect) {
      return;
    }

    let newValue: string | string[];

    if (multiple && Array.isArray(modelValue)) {
      if (selectionBehavior === 'replace') {
        newValue = [value];
        firstValue.current = value;
      }
      else {
        const index = modelValue.findIndex(v => v === value);
        newValue = index !== -1 ? modelValue.filter(v => v !== value) : [...modelValue, value];
      }
    }
    else if (selectionBehavior === 'replace') {
      newValue = value;
    }
    else if (!Array.isArray(modelValue) && modelValue === value) {
      newValue = '';
    }
    else {
      newValue = value;
    }

    if (bubbleSelect && multiple && Array.isArray(newValue) && item) {
      const bubbleUp = (currentItem: FlattenedItem<TreeItemData>) => {
        if (!currentItem.parent) {
          return;
        }
        const parentItem = expandedItems.find(i => i.value === currentItem.parent?.value);
        if (!parentItem) {
          return;
        }
        const isAllSelected = parentItem.data.children?.every(child => (newValue as string[]).includes(child.value));
        if (isAllSelected) {
          newValue = [...newValue as string[], parentItem.data.value];
        }
        else {
          newValue = (newValue as string[]).filter(v => v !== parentItem.data.value);
        }
        bubbleUp(parentItem);
      };
      bubbleUp(item);
    }

    if (propagateSelect && multiple && Array.isArray(newValue) && item) {
      const children = flattenChildren(item.data.children);
      const isSelected = newValue.includes(value);
      if (isSelected) {
        newValue = newValue.filter(v => !children.some(child => child.value === v));
      }
      else {
        newValue = [...newValue, ...children.map(child => child.value)];
      }
    }

    setModelValue(newValue);
  }, [disabled, expandedItems, allowParentSelect, multiple, modelValue, selectionBehavior, bubbleSelect, propagateSelect, setModelValue]);

  const handleToggle = useCallback((value: string) => {
    if (disabled) {
      return;
    }
    const item = expandedItems.find(i => i.value === value);
    if (!item?.data?.children) {
      return;
    }
    if (expanded.includes(value)) {
      setExpanded(expanded.filter(v => v !== value));
      return;
    }
    if (toggleBehavior === 'single') {
      const parentPath = findParentPath(value, items);
      setExpanded(parentPath ? [...parentPath, value] : [value]);
    }
    else {
      setExpanded([...expanded, value]);
    }
  }, [disabled, expandedItems, expanded, toggleBehavior, items, setExpanded]);

  function getEstimateSize(index: number) {
    if (typeof itemSize === 'function') {
      return itemSize(index);
    }
    return itemSize;
  }

  const virtualizer = useVirtualizer({
    getScrollElement: () => rootRef.current,
    count: expandedItems.length,
    estimateSize: getEstimateSize,
    overscan,
    onChange: (instance) => {
      onScroll?.(instance.scrollOffset ?? 0);
    }
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const scrollToIndex = useCallback((index: number, options?: { align?: 'auto' | 'center' | 'end' | 'start' }) => {
    virtualizer.scrollToIndex(index, options);
  }, [virtualizer]);

  const scrollToValue = useCallback((value: string, options?: { align?: 'auto' | 'center' | 'end' | 'start' }) => {
    const index = expandedItems.findIndex(item => item.value === value);
    if (index !== -1) {
      virtualizer.scrollToIndex(index, options);
    }
  }, [virtualizer, expandedItems]);

  useImperativeHandle(virtualizerRef, () => ({
    containerRef: rootRef.current,
    virtualizer,
    flattenItems: expandedItems,
    scrollToIndex,
    scrollToValue
  }), [virtualizer, expandedItems, scrollToIndex, scrollToValue]);

  const contextValue = useMemo(() => ({
    modelValue,
    expanded,
    selectedKeys,
    expandedItems,
    items,
    multiple,
    disabled,
    selectionBehavior,
    propagateSelect,
    bubbleSelect,
    allowParentSelect,
    isVirtual: true,
    size,
    onSelect: handleSelect,
    onToggle: handleToggle
  }), [modelValue, selectedKeys, expanded, expandedItems, items, multiple, disabled, selectionBehavior, propagateSelect, bubbleSelect, allowParentSelect, size, handleSelect, handleToggle]);

  const containerStyle: CSSProperties = {
    height,
    width: width ?? '100%',
    overflow: 'auto',
    contain: 'strict'
  };

  const contentStyle: CSSProperties = {
    height: totalSize,
    width: '100%',
    position: 'relative'
  };

  const renderProps: TreeRootRenderProps<T> = {
    flattenItems: expandedItems,
    modelValue,
    expanded,
    select: handleSelect,
    toggle: handleToggle
  };

  const renderContent = () => {
    if (dynamic) {
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`
          }}
        >
          {virtualItems.map((virtualItem) => {
            const item = expandedItems[virtualItem.index];

            return (
              <TreeItem
                className={classNames?.item}
                data-index={virtualItem.index}
                disabled={item.data.disabled}
                disabledSelect={disabledSelect}
                disabledToggle={disabledToggle}
                indentSize={indentSize}
                key={item._id}
                level={item.level}
                value={item.value}
                onSelect={onSelect}
                onToggle={onToggle}
              >
                {({ hasChildren, isExpanded, isIndeterminate, isSelected }: TreeItemRenderProps) => {
                  return renderItem
                    ? renderItem({ item, isExpanded, isSelected, isIndeterminate, hasChildren, ...renderProps })
                    : defaultRenderItemContent(item, isExpanded, hasChildren);
                }}
              </TreeItem>
            );
          })}
        </div>
      );
    }

    return virtualItems.map((virtualItem) => {
      const item = expandedItems[virtualItem.index];

      const itemStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`
      };

      return (
        <TreeItem
          className={classNames?.item}
          disabled={item.data.disabled}
          disabledSelect={disabledSelect}
          disabledToggle={disabledToggle}
          indentSize={indentSize}
          key={item._id}
          level={item.level}
          style={itemStyle}
          value={item.value}
          onSelect={onSelect}
          onToggle={onToggle}
        >
          {({ hasChildren, isExpanded, isIndeterminate, isSelected }: TreeItemRenderProps) => {
            return renderItem
              ? renderItem({ item, isExpanded, isSelected, isIndeterminate, hasChildren, ...renderProps })
              : defaultRenderItemContent(item, isExpanded, hasChildren);
          }}
        </TreeItem>
      );
    });
  };

  return (
    <TreeRootProvider value={contextValue}>
      <div
        aria-disabled={disabled || undefined}
        aria-multiselectable={multiple || undefined}
        className={cn(virtualContainer(), className, classNames?.virtualContainer)}
        data-disabled={disabled ? '' : undefined}
        ref={rootRef}
        role="tree"
        style={containerStyle}
      >
        {top}

        <ul
          className={cn(virtualContent(), classNames?.root, classNames?.virtualContent)}
          style={contentStyle}
        >
          {renderContent()}
        </ul>

        {bottom}
      </div>
    </TreeRootProvider>
  );
};

export default TreeVirtualizer;
