import type { ReactNode } from 'react';
import type { ThemeColor, ThemeSize } from '@skyroc/ui-types';

/** Checkbox icon shape */
export type CheckboxShape = 'round' | 'square';

/** Label position relative to the icon */
export type CheckboxLabelPosition = 'left' | 'right';

/** Layout direction for CheckboxGroup */
export type CheckboxGroupDirection = 'horizontal' | 'vertical';

/** Position of the checkbox control in a card */
export type CheckboxPosition = 'left' | 'right';

/** Checked state: boolean or 'indeterminate' */
export type CheckedState = boolean | 'indeterminate';

export interface CheckboxProps {
  /** Controlled checked state (boolean or 'indeterminate') */
  checked?: CheckedState;

  /** Custom icon when checked, replaces default indicator */
  checkedIcon?: ReactNode;

  /** Label content */
  children?: ReactNode;

  /** NativeWind className for the root container */
  className?: string;

  /** Theme color preset (primary, destructive, success, etc.) */
  color?: ThemeColor;

  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;

  /** Whether the checkbox is disabled */
  disabled?: boolean;

  /** Size of the checkbox icon in pixels, overrides size prop */
  iconSize?: number;

  /** Custom icon for indeterminate state */
  indeterminateIcon?: ReactNode;

  /** When true, only the icon toggles the checkbox, label tap is ignored */
  labelDisabled?: boolean;

  /** Position of the label relative to the icon */
  labelPosition?: CheckboxLabelPosition;

  /** Unique identifier, required when used inside CheckboxGroup */
  name?: string;

  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** Icon shape: round (circle) or square */
  shape?: CheckboxShape;

  /** Component size preset */
  size?: ThemeSize;

  /** Test identifier for E2E testing */
  testID?: string;
}

export interface CheckboxGroupProps {
  /** Custom icon when checked, applied to all children */
  checkedIcon?: ReactNode;

  /** Checkbox items */
  children: ReactNode;

  /** NativeWind className for the group container */
  className?: string;

  /** Theme color preset for all children */
  color?: ThemeColor;

  /** Initial checked values for uncontrolled usage */
  defaultValue?: string[];

  /** Layout direction of the checkboxes */
  direction?: CheckboxGroupDirection;

  /** Whether to disable all child checkboxes */
  disabled?: boolean;

  /** Icon size for all child checkboxes in pixels */
  iconSize?: number;

  /** Custom icon for indeterminate state, applied to all children */
  indeterminateIcon?: ReactNode;

  /** Maximum number of checkboxes that can be checked */
  max?: number;

  /** Callback fired when the checked values change */
  onChange?: (value: string[]) => void;

  /** Icon shape for all child checkboxes */
  shape?: CheckboxShape;

  /** Component size preset for all children */
  size?: ThemeSize;

  /** Controlled array of checked checkbox names */
  value?: string[];
}

export interface CheckboxGroupContextValue {
  /** Custom icon when checked */
  checkedIcon?: ReactNode;

  /** Theme color from group */
  color?: ThemeColor;

  /** Whether the group is disabled */
  disabled?: boolean;

  /** Icon size from group */
  iconSize?: number;

  /** Custom icon for indeterminate state */
  indeterminateIcon?: ReactNode;

  /** Check if a name is in the checked list */
  isChecked: (name: string) => boolean;

  /** Whether max checked limit is reached */
  isMaxReached: () => boolean;

  /** Shape from group */
  shape?: CheckboxShape;

  /** Size from group */
  size?: ThemeSize;

  /** Toggle a checkbox by name */
  toggle: (name: string, checked: boolean) => void;
}

export interface CheckboxCardProps {
  /** Controlled checked state (boolean or 'indeterminate') */
  checked?: CheckedState;

  /** Custom icon when checked */
  checkedIcon?: ReactNode;

  /** Position of the checkbox relative to card content */
  checkboxPosition?: CheckboxPosition;

  /** NativeWind className for the card container */
  className?: string;

  /** Theme color preset */
  color?: ThemeColor;

  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;

  /** Description text below the label */
  description?: ReactNode;

  /** Whether disabled */
  disabled?: boolean;

  /** Icon element to display on the card */
  icon?: ReactNode;

  /** Size of the checkbox icon in pixels */
  iconSize?: number;

  /** Custom icon for indeterminate state */
  indeterminateIcon?: ReactNode;

  /** Label text or element */
  label?: ReactNode;

  /** Unique identifier, required when used inside CheckboxGroupCard */
  name?: string;

  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** Icon shape */
  shape?: CheckboxShape;

  /** Component size preset */
  size?: ThemeSize;
}

export interface CheckboxGroupCardItem {
  /** Description text */
  description?: ReactNode;

  /** Whether this item is disabled */
  disabled?: boolean;

  /** Icon element */
  icon?: ReactNode;

  /** Label text or element */
  label: ReactNode;

  /** Unique value identifier */
  value: string;
}

export interface CheckboxGroupCardProps {
  /** Position of checkbox relative to card content */
  checkboxPosition?: CheckboxPosition;

  /** NativeWind className for the group container */
  className?: string;

  /** Theme color preset */
  color?: ThemeColor;

  /** Initial checked values for uncontrolled usage */
  defaultValue?: string[];

  /** Layout direction */
  direction?: CheckboxGroupDirection;

  /** Disable all items */
  disabled?: boolean;

  /** Icon size */
  iconSize?: number;

  /** Items to render */
  items: CheckboxGroupCardItem[];

  /** Callback when values change */
  onChange?: (value: string[]) => void;

  /** Icon shape */
  shape?: CheckboxShape;

  /** Component size preset */
  size?: ThemeSize;

  /** Controlled selected values */
  value?: string[];
}
