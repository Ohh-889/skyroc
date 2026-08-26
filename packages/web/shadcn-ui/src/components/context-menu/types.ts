import type { ReactNode } from 'react';
import type {
  ContextMenuProps as _ContextMenuProps
} from '@radix-ui/react-context-menu';
import type { StyledComponentProps } from '../../types/shared';
import type {
  MenuArrowProps,
  MenuCheckboxGroupItemProps,
  MenuCheckboxGroupProps,
  MenuCheckboxItemProps,
  MenuCommonProps,
  MenuContentProps,
  MenuItemIndicatorProps,
  MenuItemProps,
  MenuLabelProps,
  MenuOptionProps,
  MenuRadioGroupProps,
  MenuRadioItemOptionProps,
  MenuRadioItemProps,
  MenuSeparatorProps,
  MenuSubContentProps,
  MenuSubTriggerProps
} from '../menu/types';

/**
 * Props for the context menu arrow component.
 * Displays a small arrow pointing to the trigger element.
 */
export type ContextMenuArrowProps = Omit<MenuArrowProps, 'component'>;

/**
 * Props for the context menu content component.
 * The container that holds menu items and appears on right-click.
 */
export type ContextMenuContentProps = Omit<MenuContentProps, 'arrowComponent' | 'component' | 'portalComponent'>;

/**
 * Props for individual context menu item component.
 * A selectable item in the context menu.
 */
export type ContextMenuItemProps = Omit<MenuItemProps, 'component'>;

/**
 * Props for context menu label component.
 * Non-interactive label for grouping menu items.
 */
export type ContextMenuLabelProps = Omit<MenuLabelProps, 'component'>;

/**
 * Props for context menu option component.
 * Base type for different option types (item, group, etc).
 */
export type ContextMenuOptionProps = Omit<
  MenuOptionProps,
  'component' | 'labelComponent' | 'separatorComponent' | 'subComponent' | 'subContentComponent' | 'subTriggerComponent'
>;

/**
 * Props for context menu item indicator component.
 * Visual indicator for checked or selected menu items.
 */
export type ContextMenuItemIndicatorProps = Omit<MenuItemIndicatorProps, 'component'>;

/**
 * Props for context menu separator component.
 * Visual divider between menu items or groups.
 */
export type ContextMenuSeparatorProps = Omit<MenuSeparatorProps, 'component'>;

/**
 * Props for context menu submenu content component.
 * Container for nested submenu items.
 */
export type ContextMenuSubContentProps = Omit<MenuSubContentProps, 'component' | 'groupComponent' | 'portalComponent'>;

/**
 * Props for context menu submenu trigger component.
 * Clickable item that opens a submenu.
 */
export type ContextMenuSubTriggerProps = Omit<MenuSubTriggerProps, 'component'>;

/**
 * Props for context menu checkbox item component.
 * Menu item with checkbox functionality.
 */
export type ContextMenuCheckboxItemProps = Omit<MenuCheckboxItemProps, 'component' | 'indicatorComponent'>;

/**
 * Props for context menu checkbox group component.
 * Group of related checkbox items with mutual exclusivity control.
 */
export type ContextMenuCheckboxGroupProps = Omit<
  MenuCheckboxGroupProps,
  'component' | 'groupComponent' | 'labelComponent' | 'separatorComponent'
>;

/**
 * Props for context menu with checkbox items.
 * Full context menu component supporting checkbox group functionality.
 *
 * @example
 * ```tsx
 * <ContextMenuCheckbox
 *   value={selected}
 *   items={[
 *     { type: 'item', label: 'Option 1', value: 'opt1' },
 *     { type: 'item', label: 'Option 2', value: 'opt2' }
 *   ]}
 * />
 * ```
 */
export interface ContextMenuCheckboxProps
  extends Omit<ContextMenuCheckboxGroupProps, 'dir'>,
  StyledComponentProps<_ContextMenuProps> {
  /**
   * Props to pass to the content component.
   */
  contentProps?: Omit<ContextMenuContentProps, 'arrowClass' | 'className'>;
}

/**
 * Props for context menu radio item component.
 * Menu item with radio button functionality.
 */
export type ContextMenuRadioItemProps = Omit<MenuRadioItemProps, 'component' | 'indicatorComponent'>;

/**
 * Props for context menu radio group component.
 * Group of related radio items with mutual exclusivity (only one selectable).
 */
export type ContextMenuRadioGroupProps = Omit<
  MenuRadioGroupProps,
  'component' | 'groupComponent' | 'labelComponent' | 'separatorComponent'
>;

/**
 * Props for context menu with radio items.
 * Full context menu component supporting radio group functionality.
 *
 * @example
 * ```tsx
 * <ContextMenuRadio
 *   value={selected}
 *   items={[
 *     { type: 'item', label: 'Option A', value: 'a' },
 *     { type: 'item', label: 'Option B', value: 'b' }
 *   ]}
 * />
 * ```
 */
export interface ContextMenuRadioProps
  extends Omit<ContextMenuRadioGroupProps, 'dir'>,
  StyledComponentProps<_ContextMenuProps> {
  /**
   * Props to pass to the content component.
   */
  contentProps?: Omit<ContextMenuContentProps, 'arrowClass' | 'className'>;
}

/**
 * Checkbox menu option.
 */
interface ContextMenuCheckboxOption {
  /** Array of checked item values */
  checks?: string[];
  /** Checkbox items to render */
  children: MenuCheckboxGroupItemProps[];
  /** Callback when checked items change */
  onChecksChange?: (checks: string[]) => void;
  /** Menu type */
  type: 'checkbox';
}

/**
 * Radio menu option.
 */
interface ContextMenuRadioOption {
  /** Radio items to render */
  children: MenuRadioItemOptionProps[];
  /** Callback when selected value changes */
  onValueChange?: (value: string) => void;
  /** Menu type */
  type: 'radio';
  /** Currently selected value */
  value?: string;
}

/**
 * Union type for all context menu option types.
 */
export type ContextMenuOption = ContextMenuCheckboxOption | ContextMenuOptionProps['item'] | ContextMenuRadioOption;

/**
 * Props for the main ContextMenu component.
 * A right-click context menu with support for nested items, checkbox groups, and radio groups.
 *
 * @example
 * ```tsx
 * // Normal menu
 * <ContextMenu
 *   items={[
 *     { type: 'item', label: 'Cut', onSelect: () => cut() },
 *     { type: 'item', label: 'Copy', onSelect: () => copy() },
 *   ]}
 * >
 *   <div>Right-click me</div>
 * </ContextMenu>
 *
 * // With checkbox
 * <ContextMenu
 *   items={[
 *     {
 *       type: 'checkbox',
 *       checks: ['opt1'],
 *       onChecksChange: setChecks,
 *       children: [
 *         { label: 'Option 1', value: 'opt1' },
 *         { label: 'Option 2', value: 'opt2' }
 *       ]
 *     }
 *   ]}
 * >
 *   <div>Right-click me</div>
 * </ContextMenu>
 *
 * // With radio
 * <ContextMenu
 *   items={[
 *     {
 *       type: 'radio',
 *       value: 'a',
 *       onValueChange: setValue,
 *       children: [
 *         { label: 'Option A', value: 'a' },
 *         { label: 'Option B', value: 'b' }
 *       ]
 *     }
 *   ]}
 * >
 *   <div>Right-click me</div>
 * </ContextMenu>
 * ```
 */
export interface ContextMenuProps extends StyledComponentProps<_ContextMenuProps>, Omit<MenuCommonProps, 'items'> {
  /**
   * Element that triggers the context menu on right-click.
   */
  children?: ReactNode;

  /**
   * Props to pass to the content component.
   */
  contentProps?: Omit<ContextMenuContentProps, 'children'>;

  /**
   * Array of context menu items, checkbox groups, radio groups, or separators.
   */
  items: ContextMenuOption[];
}
