import type { ReactNode } from 'react';
import type { ThemeColor, ThemeSize } from '@skyroc/ui-types';

export interface SwitchProps {
  /** Controlled checked state */
  checked?: boolean;

  /** Custom content inside the thumb (e.g. icon) */
  children?: ReactNode;

  /** NativeWind className for the track container */
  className?: string;

  /** Theme color preset for the checked state */
  color?: ThemeColor;

  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;

  /** Whether the switch is disabled */
  disabled?: boolean;

  /** Whether the switch is in loading state */
  loading?: boolean;

  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** Component size preset */
  size?: ThemeSize;
}
