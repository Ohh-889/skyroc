'use client';

import { useMemo } from 'react';
import { cn } from '@skyroc/utils';
import { useTreeRootContext } from './context';
import { flattenChildren, handleAndDispatchCustomEvent, recurseCheckChildren } from './shared';
import { getIndentStyle } from './tree-variants';
import type { TreeItemProps, TreeItemRenderProps, TreeSelectEvent, TreeToggleEvent } from './types';

const TREE_SELECT = 'tree.select';
const TREE_TOGGLE = 'tree.toggle';

const TreeItem = (props: TreeItemProps) => {
  const { children, className, disabled: itemDisabled, disabledSelect, disabledToggle, indentSize, level, onSelect, onToggle, style, value, ...rest } = props;

  const {
    bubbleSelect,
    disabled: rootDisabled,
    expanded,
    expandedItems,
    modelValue,
    onSelect: contextOnSelect,
    onToggle: contextOnToggle,
    propagateSelect,
    selectedKeys
  } = useTreeRootContext('TreeItem');

  const currentItem = useMemo(() => expandedItems.find(item => item.value === value), [expandedItems, value]);

  const disabled = rootDisabled || itemDisabled;

  const hasChildren = Boolean(currentItem?.hasChildren);

  const isExpanded = expanded.includes(value);

  const isSelected = selectedKeys.includes(value);

  const hasSelectedChildren = recurseCheckChildren(selectedKeys, currentItem?.data?.children);

  const isIndeterminate = useMemo(() => {
    if (!currentItem || !hasChildren || !Array.isArray(modelValue)) {
      return undefined;
    }
    const childItems = flattenChildren(currentItem.data.children);
    if (bubbleSelect) {
      const someSelected = childItems.some(child => selectedKeys.includes(child.value));
      const allSelected = childItems.every(child => selectedKeys.includes(child.value));
      return someSelected && !allSelected;
    }
    else if (propagateSelect && isSelected) {
      return !childItems.every(child => selectedKeys.includes(child.value));
    }
    return undefined;
  }, [currentItem, hasChildren, modelValue, bubbleSelect, propagateSelect, isSelected, selectedKeys]);

  const handleSelect = (event: TreeSelectEvent) => {
    onSelect?.(event);
    if (!event.defaultPrevented) {
      contextOnSelect(value);
    }
  };

  const handleToggle = (event: TreeToggleEvent) => {
    onToggle?.(event);

    if (!event.defaultPrevented) {
      contextOnToggle(value);
    }
  };

  function handleToggleCustomEvent(event?: MouseEvent) {
    if (disabledToggle || !event)
      return;

    const eventDetail = {
      originalEvent: event,
      value,
      isExpanded,
      isSelected
    };
    handleAndDispatchCustomEvent(TREE_TOGGLE, handleToggle, eventDetail);
  }

  function handleSelectCustomEvent(event?: MouseEvent) {
    if (disabledSelect || !event)
      return;

    const eventDetail = {
      originalEvent: event,
      value,
      isExpanded,
      isSelected
    };
    handleAndDispatchCustomEvent(TREE_SELECT, handleSelect, eventDetail);
  }

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (disabled) {
      return;
    }
    event.stopPropagation();

    handleSelectCustomEvent(event.nativeEvent);

    handleToggleCustomEvent(event.nativeEvent);
  };

  const renderProps: TreeItemRenderProps = { isExpanded, isSelected, isIndeterminate, hasChildren };

  const indentStyle = getIndentStyle(level, indentSize);

  return (
    <li
      aria-disabled={disabled || undefined}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-level={level}
      aria-selected={isSelected}
      className={cn(className)}
      data-contains-selected={hasSelectedChildren ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-expanded={isExpanded ? '' : undefined}
      data-indent={level}
      data-selected={isSelected ? '' : undefined}
      data-value={value}
      role="treeitem"
      style={{ ...indentStyle, ...style }}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      {...rest}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </li>
  );
};

export default TreeItem;
