import type { ReactNode } from 'react';
import type {
  DropdownMenuProps as _DropdownMenuProps
} from '@radix-ui/react-dropdown-menu';
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
 * Props for the dropdown menu arrow indicator.
 * The small arrow pointing toward the trigger element.
 */
export type DropdownMenuArrowProps = Omit<MenuArrowProps, 'component'>;

/**
 * Props for the dropdown menu content container.
 * Wraps the menu items and handles positioning and accessibility.
 */
export type DropdownMenuContentProps = Omit<MenuContentProps, 'arrowComponent' | 'component' | 'portalComponent'>;

/**
 * Props for a dropdown menu item.
 * Individual menu items that can be clicked to trigger actions.
 */
export type DropdownMenuItemProps = Omit<MenuItemProps, 'component'>;

/**
 * Props for the dropdown menu label component.
 * Non-interactive text used to group or label menu items.
 */
export type DropdownMenuLabelProps = Omit<MenuLabelProps, 'component'>;

/**
 * Props for dropdown menu option data structure.
 * Represents a configurable menu option with label, icon, and action.
 */
export type DropdownMenuOptionProps = Omit<
  MenuOptionProps,
  'component' | 'labelComponent' | 'separatorComponent' | 'subComponent' | 'subContentComponent' | 'subTriggerComponent'
>;

/**
 * Props for the dropdown menu item indicator.
 * Visual indicator for selected or checked menu items.
 */
export type DropdownMenuItemIndicatorProps = Omit<MenuItemIndicatorProps, 'component'>;

/**
 * Props for the dropdown menu separator.
 * Visual divider between menu item groups.
 */
export type DropdownMenuSeparatorProps = Omit<MenuSeparatorProps, 'component'>;

/**
 * Props for the dropdown menu sub-content component.
 * Container for nested/submenu items.
 */
export type DropdownMenuSubContentProps = Omit<MenuSubContentProps, 'component' | 'groupComponent' | 'portalComponent'>;

/**
 * Props for the dropdown menu sub-trigger component.
 * Trigger element that opens a submenu.
 */
export type DropdownMenuSubTriggerProps = Omit<MenuSubTriggerProps, 'component'>;

/**
 * Props for dropdown menu checkbox item.
 * Menu item with a checkbox indicator for boolean selections.
 */
export type DropdownMenuCheckboxItemProps = Omit<MenuCheckboxItemProps, 'component' | 'indicatorComponent'>;

/**
 * Props for dropdown menu checkbox group.
 * Group of checkbox items where multiple items can be selected.
 */
export type DropdownMenuCheckboxGroupProps = Omit<
  MenuCheckboxGroupProps,
  'component' | 'groupComponent' | 'labelComponent' | 'separatorComponent'
>;

/**
 * Props for the main Dropdown Menu with checkbox group.
 * A dropdown menu where items can be checked/unchecked independently.
 *
 * @example
 * ```tsx
 * <DropdownMenuCheckbox
 *   items={[
 *     { label: 'Option 1', value: 'opt1' },
 *     { label: 'Option 2', value: 'opt2' }
 *   ]}
 *   value={['opt1']}
 *   onChange={handleChange}
 * />
 * ```
 */
export interface DropdownMenuCheckboxProps
  extends Omit<DropdownMenuCheckboxGroupProps, 'dir'>,
  StyledComponentProps<_DropdownMenuProps> {
  /**
   * Props to customize the dropdown menu content container.
   */
  contentProps?: Omit<DropdownMenuContentProps, 'arrowClass' | 'className'>;
}

/**
 * Props for dropdown menu radio item.
 * Menu item with a radio button indicator for mutually exclusive selections.
 */
export type DropdownMenuRadioItemProps = Omit<MenuRadioItemProps, 'component' | 'indicatorComponent'>;

/**
 * Props for dropdown menu radio group.
 * Group of radio items where only one item can be selected at a time.
 */
export type DropdownMenuRadioGroupProps = Omit<
  MenuRadioGroupProps,
  'component' | 'groupComponent' | 'labelComponent' | 'separatorComponent'
>;

/**
 * Props for the main Dropdown Menu with radio group.
 * A dropdown menu where only one item can be selected at a time.
 *
 * @example
 * ```tsx
 * <DropdownMenuRadio
 *   items={[
 *     { label: 'Small', value: 'sm' },
 *     { label: 'Medium', value: 'md' },
 *     { label: 'Large', value: 'lg' }
 *   ]}
 *   value="md"
 *   onChange={handleChange}
 * />
 * ```
 */
export interface DropdownMenuRadioProps
  extends Omit<DropdownMenuRadioGroupProps, 'dir'>,
  StyledComponentProps<_DropdownMenuProps> {
  /**
   * Props to customize the dropdown menu content container.
   */
  contentProps?: Omit<DropdownMenuContentProps, 'arrowClass' | 'className'>;
}

/**
 * Checkbox menu option.
 */
interface DropdownMenuCheckboxOption {
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
interface DropdownMenuRadioOption {
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
 * Union type for all dropdown menu option types.
 */
export type DropdownMenuOption = DropdownMenuCheckboxOption | DropdownMenuOptionProps['item'] | DropdownMenuRadioOption;

/**
 * Props for the main Dropdown Menu component.
 * A context menu triggered by an element with customizable items and actions.
 *
 * @example
 * ```tsx
 * // Normal menu
 * <DropdownMenu
 *   items={[
 *     { label: 'Edit', icon: <EditIcon /> },
 *     { label: 'Delete', icon: <DeleteIcon /> }
 *   ]}
 * >
 *   <button>Menu</button>
 * </DropdownMenu>
 *
 * // With checkbox
 * <DropdownMenu
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
 *   <button>Menu</button>
 * </DropdownMenu>
 *
 * // With radio
 * <DropdownMenu
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
 *   <button>Menu</button>
 * </DropdownMenu>
 * ```
 */
export interface DropdownMenuProps extends StyledComponentProps<_DropdownMenuProps>, Omit<MenuCommonProps, 'items'> {
  /**
   * Child elements of the dropdown menu (typically the trigger).
   */
  children?: ReactNode;
  /**
   * Props to customize the dropdown menu content container.
   */
  contentProps?: Omit<DropdownMenuContentProps, 'children'>;
  /**
   * Array of dropdown menu items, checkbox groups, radio groups, or separators.
   */
  items: DropdownMenuOption[];
}
