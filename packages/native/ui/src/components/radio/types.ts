import type { ReactNode } from 'react';
import type { ThemeColor, ThemeSize } from '@skyroc/ui-types';

/** Radio icon shape */
export type RadioShape = 'round' | 'square';

/** Label position relative to the icon */
export type RadioLabelPosition = 'left' | 'right';

/** Layout direction for RadioGroup */
export type RadioGroupDirection = 'horizontal' | 'vertical';

/** Position of the radio control in a card */
export type RadioPosition = 'left' | 'right';

export interface RadioProps {
  /** Controlled checked state */
  checked?: boolean;

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

  /** Whether the radio is disabled */
  disabled?: boolean;

  /** Size of the radio icon in pixels, overrides size prop */
  iconSize?: number;

  /** When true, only the icon toggles the radio, label tap is ignored */
  labelDisabled?: boolean;

  /** Position of the label relative to the icon */
  labelPosition?: RadioLabelPosition;

  /** Unique identifier, required when used inside RadioGroup */
  name?: string;

  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** Icon shape: round (circle with dot) or square (with check) */
  shape?: RadioShape;

  /** Component size preset */
  size?: ThemeSize;
}

export interface RadioGroupProps {
  /** Custom icon when checked, applied to all children */
  checkedIcon?: ReactNode;

  /** Radio items */
  children: ReactNode;

  /** NativeWind className for the group container */
  className?: string;

  /** Theme color preset for all children */
  color?: ThemeColor;

  /** Initial value for uncontrolled usage */
  defaultValue?: string;

  /** Layout direction of the radios */
  direction?: RadioGroupDirection;

  /** Whether to disable all child radios */
  disabled?: boolean;

  /** Icon size for all child radios in pixels */
  iconSize?: number;

  /** Callback fired when the selected value changes */
  onChange?: (value: string) => void;

  /** Icon shape for all child radios */
  shape?: RadioShape;

  /** Component size preset for all children */
  size?: ThemeSize;

  /** Controlled selected radio name */
  value?: string;
}

export interface RadioGroupContextValue {
  /** Custom icon when checked */
  checkedIcon?: ReactNode;

  /** Theme color from group */
  color?: ThemeColor;

  /** Whether the group is disabled */
  disabled?: boolean;

  /** Icon size from group */
  iconSize?: number;

  /** Check if a name is the selected value */
  isChecked: (name: string) => boolean;

  /** Select a radio by name */
  select: (name: string) => void;

  /** Shape from group */
  shape?: RadioShape;

  /** Size from group */
  size?: ThemeSize;
}

export interface RadioCardProps {
  /** Controlled checked state */
  checked?: boolean;

  /** Custom icon when checked */
  checkedIcon?: ReactNode;

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

  /** Size of the radio icon in pixels */
  iconSize?: number;

  /** Label text or element */
  label?: ReactNode;

  /** Unique identifier */
  name?: string;

  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** Position of the radio relative to card content */
  radioPosition?: RadioPosition;

  /** Icon shape */
  shape?: RadioShape;

  /** Component size preset */
  size?: ThemeSize;
}

export interface RadioGroupCardItem {
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

export interface RadioGroupCardProps {
  /** NativeWind className for the group container */
  className?: string;

  /** Theme color preset */
  color?: ThemeColor;

  /** Initial value for uncontrolled usage */
  defaultValue?: string;

  /** Layout direction */
  direction?: RadioGroupDirection;

  /** Disable all items */
  disabled?: boolean;

  /** Icon size */
  iconSize?: number;

  /** Items to render */
  items: RadioGroupCardItem[];

  /** Callback when value changes */
  onChange?: (value: string) => void;

  /** Position of radio relative to card content */
  radioPosition?: RadioPosition;

  /** Icon shape */
  shape?: RadioShape;

  /** Component size preset */
  size?: ThemeSize;

  /** Controlled selected value */
  value?: string;
}
