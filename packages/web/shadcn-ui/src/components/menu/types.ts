import type { ComponentType, ElementType, ReactNode } from 'react';
import type {
  MenuArrowProps as _MenuArrowProps,
  MenuCheckboxItemProps as _MenuCheckboxItemProps,
  MenuContentProps as _MenuContentProps,
  MenuGroupProps as _MenuGroupProps,
  MenuItemIndicatorProps as _MenuItemIndicatorProps,
  MenuItemProps as _MenuItemProps,
  MenuLabelProps as _MenuLabelProps,
  MenuRadioGroupProps as _MenuRadioGroupProps,
  MenuRadioItemProps as _MenuRadioItemProps,
  MenuSeparatorProps as _MenuSeparatorProps,
  MenuSubContentProps as _MenuSubContentProps,
  MenuSubTriggerProps as _MenuSubTriggerProps
} from '@radix-ui/react-menu';
import type { ClassValue, HTMLComponentProps, StyledComponentProps, ThemeSize } from '../../types/shared';
import type { MenuSlots } from './menu-variants';

/**
 * Class names for different slots in the menu component.
 * Allows customizing styles for specific parts of the menu.
 */
export type MenuClassNames = Partial<Record<MenuSlots, ClassValue>>;

/**
 * Props for the MenuArrow component.
 * Renders a decorative arrow pointing to the menu trigger.
 */
export type MenuArrowProps = StyledComponentProps<_MenuArrowProps> & {
  /** Custom component to use for rendering the arrow */
  component?: ElementType<MenuArrowProps>;
};

/**
 * Union type for checkbox group items.
 * Can be a label, separator, or checkbox item with optional label.
 */
export type MenuCheckboxGroupItemProps
  = | MenuLabelOption
    | MenuSeparatorOption
    | (Omit<MenuCheckboxItemProps, 'children'> & {
      label?: ReactNode;
    });

/**
 * Props for a group of checkbox menu items.
 * Renders multiple checkbox items that can be independently checked/unchecked.
 *
 * @example
 * <MenuCheckboxGroup
 *   items={[
 *     { label: 'Bold', value: 'bold' },
 *     { label: 'Italic', value: 'italic' },
 *     { type: 'separator' },
 *     { label: 'Strikethrough', value: 'strike' }
 *   ]}
 *   checks={['bold']}
 *   onChecksChange={(checks) => console.log(checks)}
 * />
 */
export interface MenuCheckboxGroupProps extends MenuCommonProps, StyledComponentProps<_MenuGroupProps> {
  /** Array of checked item values */
  checks?: string[];
  /** Custom component for rendering checkbox items */
  component?: ElementType<MenuCheckboxItemProps>;
  /** Custom component for the group wrapper */
  groupComponent?: ElementType;
  /** Items to render in the checkbox group */
  items: MenuCheckboxGroupItemProps[];
  /** Custom component for rendering labels */
  labelComponent?: ElementType<MenuLabelProps>;
  /** Callback when checked items change */
  onChecksChange?: (checks: string[]) => void;
  /** Custom component for rendering separators */
  separatorComponent?: ElementType<MenuSeparatorProps>;
}

/**
 * Props for a checkbox menu item.
 * A menu item with a checkbox indicator that can be toggled.
 *
 * @example
 * <MenuCheckboxItem value="notifications">
 *   <MenuItemIndicator icon={<Check />} />
 *   Enable Notifications
 * </MenuCheckboxItem>
 */
export interface MenuCheckboxItemProps extends StyledComponentProps<_MenuCheckboxItemProps> {
  /** Class names for customizing checkbox item slots */
  classNames?: Pick<MenuClassNames, 'item' | 'itemIndicator' | 'shortcut'>;
  /** Custom component for rendering the item */
  component?: ElementType<_MenuCheckboxItemProps>;
  /** Custom component for the indicator */
  indicatorComponent?: ElementType<MenuItemIndicatorProps>;
  /** Icon to display in the indicator */
  indicatorIcon?: ReactNode;
  /** Content to display before the label */
  leading?: ReactNode;
  /** Keyboard shortcut to display (e.g., "Cmd+K") */
  shortcut?: string | string[];
  /** Content to display after the label */
  trailing?: ReactNode;
  /** Value of the checkbox item */
  value?: string;
}

/**
 * Props for the MenuContent component.
 * Renders the content area of a menu with optional arrow and portal support.
 *
 * @example
 * <MenuContent showArrow sideOffset={5}>
 *   <MenuItem>Edit</MenuItem>
 *   <MenuItem>Delete</MenuItem>
 * </MenuContent>
 */
export type MenuContentProps = StyledComponentProps<_MenuContentProps> & {
  /** Class names for the arrow element */
  arrowClass?: ClassValue;
  /** Custom component for rendering the arrow */
  arrowComponent?: ElementType<MenuArrowProps>;
  /** Custom component for the content wrapper */
  component?: ElementType<MenuContentProps>;
  /** Custom component for the portal wrapper */
  portalComponent?: ElementType<MenuContentProps>;
  /** Whether to display an arrow pointing to the menu trigger */
  showArrow?: boolean;
};

/**
 * Props for a basic menu item.
 * A clickable item in the menu that triggers an action.
 *
 * @example
 * <MenuItem value="edit">
 *   <Edit className="w-4 h-4" />
 *   Edit
 * </MenuItem>
 */
export interface MenuItemProps extends StyledComponentProps<_MenuItemProps> {
  /** Class names for customizing menu item slots */
  classNames?: Pick<MenuClassNames, 'item' | 'shortcut'>;
  /** Custom component for rendering the item */
  component?: ComponentType<_MenuItemProps>;
  /** Content to display before the label */
  leading?: ReactNode;
  /** Keyboard shortcut to display (e.g., "Cmd+K") */
  shortcut?: string | string[];
  /** Content to display after the label */
  trailing?: ReactNode;
}

/**
 * Props for the MenuItemIndicator component.
 * Renders an indicator (check mark, radio button, etc.) within a menu item.
 */
export interface MenuItemIndicatorProps extends StyledComponentProps<_MenuItemIndicatorProps> {
  /** Custom component for rendering the indicator */
  component?: ComponentType<_MenuItemIndicatorProps>;
}

/**
 * Props for a menu label.
 * A non-interactive text label used to group or describe menu items.
 *
 * @example
 * <MenuLabel>Edit Options</MenuLabel>
 * <MenuItem>Cut</MenuItem>
 * <MenuItem>Copy</MenuItem>
 */
export interface MenuLabelProps extends StyledComponentProps<_MenuLabelProps> {
  /** Class names for customizing label slots */
  classNames?: Pick<MenuClassNames, 'itemIcon' | 'label'>;
  /** Custom component for rendering the label */
  component?: ElementType<MenuLabelProps>;
  /** Content to display before the label text */
  leading?: ReactNode;
  /** Content to display after the label text */
  trailing?: ReactNode;
}

/**
 * Data structure for a basic menu option.
 * Use this when rendering menu items from data.
 */
export interface MenuOption extends Omit<MenuItemProps, 'children'> {
  /** Display text for the menu item */
  label?: ReactNode;
  /** Option type identifier */
  type?: 'item';
}

/**
 * Data structure for a menu label option.
 * Use this to add non-interactive labels to data-driven menus.
 */
export interface MenuLabelOption extends Omit<MenuLabelProps, 'children'> {
  /** Display text for the label */
  label?: ReactNode;
  /** Option type identifier */
  type: 'label';
}

/**
 * Data structure for a menu separator option.
 * Use this to add visual separators between menu items.
 */
export interface MenuSeparatorOption extends Omit<MenuSeparatorProps, 'children'> {
  /** Option type identifier */
  type: 'separator';
}

/**
 * Data structure for a submenu option.
 * Represents a menu item that opens a nested submenu.
 *
 * @example
 * {
 *   type: 'sub',
 *   label: 'More Options',
 *   children: [
 *     { type: 'item', label: 'Settings' },
 *     { type: 'item', label: 'Preferences' }
 *   ]
 * }
 */
export interface MenuSubOption extends Omit<MenuSubTriggerProps, 'children'> {
  /** Submenu items to display when expanded */
  children: MenuOptionData[];
  /** Display text for the submenu trigger */
  label?: ReactNode;
  /** Props to pass to the submenu content component */
  subContentProps?: _MenuSubContentProps;
  /** Props to pass to the submenu trigger component */
  subProps?: _MenuSubTriggerProps;
  /** Option type identifier */
  type: 'sub';
}

/**
 * Union type for all menu option data types.
 * Can be any of: item, label, separator, or submenu.
 */
export type MenuOptionData = MenuOption | MenuLabelOption | MenuSeparatorOption | MenuSubOption;

/**
 * Common props shared by multiple menu components.
 * Includes styling and sizing options.
 */
export interface MenuCommonProps {
  /** Class names for customizing different parts of the menu */
  classNames?: MenuClassNames;
  /** Size variant for the menu (affects spacing and text size) */
  size?: ThemeSize;
}

/**
 * Props for rendering a menu option from data.
 * Used internally to render menu items dynamically.
 */
export interface MenuOptionProps extends MenuCommonProps {
  /** Custom component for rendering menu items */
  component?: ElementType<MenuItemProps>;
  /** Menu option data to render */
  item: MenuOptionData;
  /** Custom component for rendering labels */
  labelComponent?: ElementType<MenuLabelProps>;
  /** Custom component for rendering separators */
  separatorComponent?: ElementType<MenuSeparatorProps>;
  /** Custom component for submenu trigger */
  subComponent?: ElementType<MenuSubTriggerProps>;
  /** Custom component for submenu content */
  subContentComponent?: ElementType<MenuSubContentProps>;
  /** Custom component for submenu content trigger */
  subTriggerComponent?: ElementType<MenuSubTriggerProps>;
}

/**
 * Props for the MenuSeparator component.
 * A visual divider between menu items.
 */
export type MenuSeparatorProps = StyledComponentProps<_MenuSeparatorProps> & {
  /** Custom component for rendering the separator */
  component?: ElementType<MenuSeparatorProps>;
};

/**
 * Props for the MenuShortcut component.
 * Displays a keyboard shortcut hint next to menu items.
 *
 * @example
 * <MenuShortcut value={['Cmd', 'K']} />
 * // renders: Cmd K
 */
export type MenuShortcutProps = HTMLComponentProps<'div'> & {
  /** The keyboard shortcut to display */
  value?: string | string[];
};

/**
 * Props for the MenuSubContent component.
 * Container for submenu items that appear when a submenu is opened.
 */
export type MenuSubContentProps = StyledComponentProps<_MenuSubContentProps> & {
  /** Custom component for the content wrapper */
  component?: ElementType<MenuSubContentProps>;
  /** Custom component for grouping items */
  groupComponent?: ElementType<MenuSubContentProps>;
  /** Custom component for the portal wrapper */
  portalComponent?: ElementType<MenuSubContentProps>;
};

/**
 * Props for the MenuSubTrigger component.
 * A menu item that opens a submenu when triggered.
 *
 * @example
 * <MenuSubTrigger triggerIcon={<ChevronRight />}>
 *   More Options
 * </MenuSubTrigger>
 */
export interface MenuSubTriggerProps extends StyledComponentProps<_MenuSubTriggerProps> {
  /** Class names for customizing submenu trigger icon slot */
  classNames?: Pick<MenuClassNames, 'subTriggerIcon'>;
  /** Custom component for rendering the trigger */
  component?: ElementType<MenuSubTriggerProps>;
  /** Content to display before the label */
  leading?: ReactNode;
  /** Content to display after the label */
  trailing?: ReactNode;
  /** Icon to indicate this item has a submenu */
  triggerIcon?: ReactNode;
}

/**
 * Props for a radio menu item.
 * A menu item with a radio button indicator, typically used in mutually exclusive groups.
 *
 * @example
 * <MenuRadioItem value="light">
 *   <MenuItemIndicator icon={<Radio />} />
 *   Light Theme
 * </MenuRadioItem>
 */
export interface MenuRadioItemProps extends StyledComponentProps<_MenuRadioItemProps> {
  /** Class names for customizing radio item slots */
  classNames?: Pick<MenuClassNames, 'item' | 'itemIndicator' | 'radioIndicatorIcon' | 'shortcut'>;
  /** Custom component for rendering the item */
  component?: ElementType<_MenuRadioItemProps>;
  /** Custom component for the radio indicator */
  indicatorComponent?: ElementType<MenuItemIndicatorProps>;
  /** Icon to display in the radio indicator */
  indicatorIcon?: ReactNode;
  /** Content to display before the label */
  leading?: ReactNode;
  /** Keyboard shortcut to display (e.g., "Cmd+K") */
  shortcut?: string | string[];
  /** Content to display after the label */
  trailing?: ReactNode;
  /** Option type identifier */
  type?: 'item';
}

/**
 * Union type for radio group items.
 * Can be a label, separator, or radio item with optional label.
 */
export type MenuRadioItemOptionProps
  = | MenuLabelOption
    | MenuSeparatorOption
    | (Omit<MenuRadioItemProps, 'children'> & {
      label?: ReactNode;
    });

/**
 * Props for a group of radio menu items.
 * Renders multiple radio items where only one can be selected at a time.
 *
 * @example
 * <MenuRadioGroup
 *   items={[
 *     { label: 'Small', value: 'sm' },
 *     { label: 'Medium', value: 'md' },
 *     { label: 'Large', value: 'lg' }
 *   ]}
 * />
 */
export interface MenuRadioGroupProps extends MenuCommonProps, StyledComponentProps<_MenuRadioGroupProps> {
  /** Custom component for rendering radio items */
  component?: ElementType<MenuRadioItemProps>;
  /** Custom component for the group wrapper */
  groupComponent?: ElementType;
  /** Items to render in the radio group */
  items: MenuRadioItemOptionProps[];
  /** Custom component for rendering labels */
  labelComponent?: ElementType<MenuLabelProps>;
  /** Custom component for rendering separators */
  separatorComponent?: ElementType<MenuSeparatorProps>;
}

/**
 * Props for the main Menu component.
 * A composable menu component that wraps Radix UI's menu primitives.
 */
export interface MenuProps extends MenuCommonProps {
  /**
   * Menu content/children
   */
  children?: ReactNode;
}
