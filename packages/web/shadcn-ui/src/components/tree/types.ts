import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ClassValue, MaybeArray, StyledComponentProps } from '../../types/shared';
import type { TreeSlots } from './tree-variants';

/** Custom class names for tree component slots */
export type TreeClassNames = Partial<Record<TreeSlots, ClassValue>>;

/** Selection behavior when clicking on a tree item: 'toggle' toggles selection, 'replace' replaces current selection */
export type TreeSelectBehavior = 'replace' | 'toggle';

/** Toggle behavior for expanding/collapsing tree nodes: 'single' allows only one expanded node, 'multiple' allows multiple */
export type TreeToggleBehavior = 'multiple' | 'single';

/**
 * Base data structure for a tree item.
 */
export interface TreeItemBaseData {
  /** Prevents user interaction with the item. Set to `true` to disable. */
  disabled?: boolean;
  /** Display label for the tree item */
  label: ReactNode;
  /** Unique identifier for this tree item */
  value: string;
}

/**
 * Data structure for a tree item with optional children.
 * @template T - Type extending TreeItemBaseData
 */
export type TreeItemData<T extends TreeItemBaseData = TreeItemBaseData> = T & {
  /** List of children items */
  children?: TreeItemData<T>[];
};

/**
 * Flattened representation of a tree item for rendering.
 * @template T - Type extending TreeItemData
 */
export interface FlattenedItem<T extends TreeItemData> {
  /** Internal unique identifier */
  _id: string;
  /** Binding properties for rendering */
  bind: {
    /** Original tree item data */
    data: T;
    /** Depth level in the tree hierarchy */
    level: number;
    /** Additional custom properties */
    [key: string]: any;
  };
  /** Original tree item data */
  data: T;
  /** Indicates if this item has children. Set to `true` when children exist. */
  hasChildren: boolean;
  /** Index position in the flattened list */
  index: number;
  /** Display label for the item */
  label: ReactNode;
  /** Depth level in the tree hierarchy (0-based) */
  level: number;
  /** Reference to the parent item data */
  parent?: T;
  /** Item value identifier */
  value: string;
}

/**
 * Context value provided by TreeRoot for child components.
 * @template T - Type extending TreeItemData
 */
export interface TreeRootContextValue<T extends TreeItemData = TreeItemData> {
  /**
   * Controls whether parent nodes with children can be selected.
   * Set to `true` to allow parent selection.
   */
  allowParentSelect: boolean | undefined;
  /**
   * Controls whether selecting all children automatically selects the parent.
   * Set to `true` to enable upward selection propagation.
   */
  bubbleSelect: boolean | undefined;
  /**
   * Controls user interaction with the entire tree.
   * Set to `true` to prevent all interactions.
   */
  disabled: boolean | undefined;
  /** Array of currently expanded item keys */
  expanded: string[];
  /** Flattened list of expanded tree items */
  expandedItems: FlattenedItem<T>[];
  /** Original tree data items */
  items: T[];
  /** Current selected value(s) of the tree */
  modelValue?: MaybeArray<string>;
  /**
   * Controls the selection mode of the tree.
   * Set to `true` to allow multiple items to be selected.
   */
  multiple: boolean | undefined;
  /** Callback function when an item is selected */
  onSelect: (value: string) => void;
  /** Callback function when an item is toggled (expanded/collapsed) */
  onToggle: (value: string) => void;
  /**
   * Controls whether selecting a parent automatically selects its children.
   * Set to `true` to enable downward selection propagation.
   */
  propagateSelect: boolean | undefined;
  /** Array of currently selected item keys */
  selectedKeys: string[];
  /** How multiple selection should behave in the collection */
  selectionBehavior: TreeSelectBehavior | undefined;
}

/**
 * Props passed to the render function of TreeRoot.
 * @template T - Type extending TreeItemData
 */
export interface TreeRootRenderProps<T extends TreeItemData = TreeItemData> {
  /** Array of currently expanded item keys */
  expanded: string[];
  /** Flattened list of all tree items for rendering */
  flattenItems: FlattenedItem<T>[];
  /** Current selected value(s) */
  modelValue: string | string[] | undefined;
  /** Function to select an item by its value */
  select: (value: string) => void;
  /** Function to toggle (expand/collapse) an item by its value */
  toggle: (value: string) => void;
}
/** Custom event type for tree item selection events */
export type TreeSelectEvent = CustomEvent<{
  /** Indicates if the item is expanded. Set to `true` when expanded. */
  isExpanded: boolean;
  /** Indicates if the item is selected. Set to `true` when selected. */
  isSelected: boolean;
  /** The original browser event that triggered the selection */
  originalEvent: MouseEvent | KeyboardEvent;
  /** Value identifier of the selected item */
  value?: string;
}>;

/** Custom event type for tree item toggle (expand/collapse) events */
export type TreeToggleEvent = CustomEvent<{
  /** Indicates if the item is expanded. Set to `true` when expanded. */
  isExpanded: boolean;
  /** Indicates if the item is selected. Set to `true` when selected. */
  isSelected: boolean;
  /** The original browser event that triggered the toggle */
  originalEvent: MouseEvent | KeyboardEvent;
  /** Value identifier of the toggled item */
  value?: string;
}>;

/** Props passed to the render function of a tree item */
export interface TreeItemRenderProps {
  /** Indicates if the item has children. Set to `true` when children exist. */
  hasChildren: boolean;
  /** Indicates if the item is expanded. Set to `true` when expanded. */
  isExpanded: boolean;
  /** Indicates if the item is in an indeterminate state (some children selected). Set to `true` for indeterminate state. */
  isIndeterminate: boolean | undefined;
  /** Indicates if the item is selected. Set to `true` when selected. */
  isSelected: boolean;
}

/** Props for the TreeItem component */
export interface TreeItemProps extends StyledComponentProps<Omit<ComponentPropsWithoutRef<'li'>, 'children' | 'onSelect' | 'onToggle'>> {
  /** Content of the tree item, can be a ReactNode or a render function */
  children?: ReactNode | ((props: TreeItemRenderProps) => ReactNode);
  /** Prevents user interaction with the item. Set to `true` to disable. */
  disabled?: boolean;
  /** Prevents selection of the item. Set to `true` to disable selection only. */
  disabledSelect?: boolean;
  /** Prevents toggling (expand/collapse) of the item. Set to `true` to disable toggle only. */
  disabledToggle?: boolean;
  /** Size of the indentation per level in pixels */
  indentSize?: number;
  /** Depth level in the tree hierarchy (0-based) */
  level: number;
  /** Callback function when the item is selected */
  onSelect?: (event: TreeSelectEvent) => void;
  /** Callback function when the item is toggled (expanded/collapsed) */
  onToggle?: (event: TreeToggleEvent) => void;
  /** Unique identifier for this tree item */
  value: string;
}

/**
 * Props for the TreeRoot component with full control over rendering.
 * @template T - Type extending TreeItemData
 */
export interface TreeRootProps<T extends TreeItemData = TreeItemData>
  extends StyledComponentProps<Omit<ComponentPropsWithRef<'ul'>, 'children' | 'defaultValue'>> {
  /**
   * Controls whether parent nodes with children can be selected.
   * Set to `true` to allow parent selection.
   */
  allowParentSelect?: boolean;
  /** Content to display at the bottom of the tree */
  bottom?: ReactNode;
  /**
   * Controls whether selecting all children automatically selects the parent.
   * Set to `true` to enable upward selection propagation.
   */
  bubbleSelect?: boolean;
  /** Render function that receives tree state and utilities for custom rendering */
  children: (props: TreeRootRenderProps<T>) => ReactNode;
  /** The value of the expanded tree when initially rendered. */
  defaultExpanded?: string[];
  /** Default value of the tree */
  defaultValue?: MaybeArray<string>;
  /**
   * Controls user interaction with the entire tree.
   * Set to `true` to prevent all interactions.
   */
  disabled?: boolean;
  /** The controlled value of the expanded item. Can be bound-with with `v-model`. */
  expanded?: string[];
  /** List of tree items */
  items: T[];
  /**
   * Controls the selection mode of the tree.
   * Set to `true` to allow multiple items to be selected.
   */
  multiple?: boolean;
  /** Callback function that is called when the expanded value changes */
  onExpandedChange?: (expanded: string[]) => void;
  /** Callback function that is called when the value changes */
  onValueChange?: (value: MaybeArray<string>) => void;
  /**
   * Controls whether selecting a parent automatically selects its children.
   * Set to `true` to enable downward selection propagation.
   */
  propagateSelect?: boolean;
  /** How multiple selection should behave in the collection. */
  selectionBehavior?: TreeSelectBehavior;

  /**
   * Determines whether a "single" or "multiple" items can be toggled at a time.
   *
   * @defaultValue 'multiple'
   */
  toggleBehavior?: TreeToggleBehavior;

  /** Content to display at the top of the tree */
  top?: ReactNode;

  /** Controlled value of the tree */
  value?: MaybeArray<string>;
}

/** Props for the Tree component with simplified API */
export interface TreeProps<T extends TreeItemData = TreeItemData> extends Omit<TreeRootProps<T>, 'children' | 'onSelect' | 'onToggle'>, Pick<TreeItemProps, 'disabledSelect' | 'disabledToggle' | 'indentSize' | 'onSelect' | 'onToggle'> {
  /** Custom class names for tree component slots */
  classNames?: TreeClassNames;

  /** Custom render function for tree items, receives item state and tree state */
  renderItem?: (props: TreeItemRenderProps & { item: FlattenedItem<T> } & TreeRootRenderProps<T>) => ReactNode;
}
