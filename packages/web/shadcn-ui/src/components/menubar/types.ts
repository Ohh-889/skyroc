import type { ReactNode } from 'react';
import type {
  MenubarContentProps as _MenubarContentProps,
  MenubarGroupProps as _MenubarGroupProps,
  MenubarMenuProps as _MenubarMenuProps,
  MenubarPortalProps as _MenubarPortalProps,
  MenubarProps as _MenubarProps,
  MenubarRadioGroupProps as _MenubarRadioGroupProps,
  MenubarSubProps as _MenubarSubProps,
  MenubarTriggerProps as _MenubarTriggerProps
} from '@radix-ui/react-menubar';
import type { ClassValue, StyledComponentProps, ThemeSize } from '../../types/shared';
import type {
  MenuCheckboxGroupItemProps,
  MenuCheckboxGroupProps,
  MenuCheckboxItemProps,
  MenuClassNames,
  MenuCommonProps,
  MenuItemIndicatorProps,
  MenuItemProps,
  MenuLabelProps,
  MenuOptionProps,
  MenuRadioGroupProps,
  MenuRadioItemOptionProps,
  MenuRadioItemProps,
  MenuSeparatorProps,
  MenuShortcutProps,
  MenuSubContentProps,
  MenuSubTriggerProps
} from '../menu/types';

/**
 * Props for the primitive menubar menu component (composable usage).
 */
export type MenubarMenuPrimitiveProps = _MenubarMenuProps;

/**
 * Props for the composed menubar menu component.
 */
export interface MenubarMenuComposedProps extends Omit<MenubarTriggerProps, 'children' | 'classNames'> {
  children: ReactNode;
  classNames?: Pick<MenuClassNames, 'content' | 'shortcut'> & {
    trigger?: ClassValue;
  };
  size?: ThemeSize;
  trigger: ReactNode;
  value?: string;
}

/**
 * Props for the menubar content component.
 */
export interface MenubarContentProps extends StyledComponentProps<_MenubarContentProps> {
  size?: ThemeSize;
}

/**
 * Props for a menubar item.
 */
export interface MenubarItemProps extends Omit<MenuItemProps, 'component'> {
  inset?: boolean;
}

/**
 * Props for a menubar label.
 */
export type MenubarLabelProps = Omit<MenuLabelProps, 'component'>;

/**
 * Props for rendering a menubar option from data.
 */
export type MenubarOptionProps = Omit<
  MenuOptionProps,
  'component' | 'labelComponent' | 'separatorComponent' | 'subComponent' | 'subContentComponent' | 'subTriggerComponent'
>;

/**
 * Props for a menubar item indicator.
 */
export type MenubarItemIndicatorProps = Omit<MenuItemIndicatorProps, 'component'>;

/**
 * Props for a menubar separator.
 */
export type MenubarSeparatorProps = Omit<MenuSeparatorProps, 'component'>;

/**
 * Props for menubar submenu content.
 */
export type MenubarSubContentProps = Omit<MenuSubContentProps, 'component' | 'groupComponent' | 'portalComponent'>;

/**
 * Props for a menubar submenu trigger.
 */
export type MenubarSubTriggerProps = Omit<MenuSubTriggerProps, 'component'>;

/**
 * Props for menubar checkbox item.
 */
export type MenubarCheckboxItemProps = Omit<MenuCheckboxItemProps, 'component' | 'indicatorComponent'>;

/**
 * Props for menubar radio item.
 */
export type MenubarRadioItemProps = Omit<MenuRadioItemProps, 'component' | 'indicatorComponent'>;

/**
 * Props for menubar checkbox group.
 */
export type MenubarCheckboxGroupProps = Omit<
  MenuCheckboxGroupProps,
  'component' | 'groupComponent' | 'labelComponent' | 'separatorComponent'
>;

/**
 * Props for menubar radio group (primitive).
 */
export type MenubarRadioGroupPrimitiveProps = _MenubarRadioGroupProps;

/**
 * Props for menubar radio group (data-driven).
 */
export type MenubarRadioGroupProps = Omit<
  MenuRadioGroupProps,
  'component' | 'groupComponent' | 'labelComponent' | 'separatorComponent'
>;

export type MenubarGroupProps = _MenubarGroupProps;

export type MenubarPortalProps = _MenubarPortalProps;

export interface MenubarShortcutProps extends Omit<MenuShortcutProps, 'value'> {
  children?: ReactNode;
}

export type MenubarSubProps = _MenubarSubProps;

export interface MenubarTriggerProps extends StyledComponentProps<_MenubarTriggerProps> {
  classNames?: Pick<MenuClassNames, 'shortcut'> & {
    trigger?: ClassValue;
  };
  leading?: ReactNode;
  shortcut?: string | string[];
  trailing?: ReactNode;
}

/**
 * Base option for normal menu items.
 */
interface MenubarOptionBase extends Omit<MenubarMenuComposedProps, 'children' | 'classNames' | 'trigger' | 'type'> {
  label: ReactNode;
}

/**
 * Normal menu option (default type).
 */
interface MenubarNormalOption extends MenubarOptionBase {
  children: MenubarOptionProps['item'][];
  type?: 'item';
}

/**
 * Checkbox menu option.
 */
interface MenubarCheckboxOption extends MenubarOptionBase {
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
interface MenubarRadioOption extends MenubarOptionBase {
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
 * Union type for all menu option types.
 */
export type MenubarOption = MenubarCheckboxOption | MenubarNormalOption | MenubarRadioOption;

export interface MenubarRootProps extends StyledComponentProps<_MenubarProps> {}

/**
 * Props for the main Menubar component.
 *
 * @example
 * <Menubar
 *   items={[
 *     { label: 'File', children: [...] },
 *     { label: 'View', type: 'checkbox', checks: [...], onChecksChange: ..., children: [...] },
 *     { label: 'Profiles', type: 'radio', value: '...', onValueChange: ..., children: [...] }
 *   ]}
 * />
 */
export interface MenubarProps extends Omit<_MenubarProps, 'children'>, Omit<MenuCommonProps, 'classNames'> {
  classNames?: MenuCommonProps['classNames'] & {
    trigger?: ClassValue;
  };
  items: MenubarOption[];
}
