import type { ThemeSize } from '@skyroc/ui-types';
import type { ViewStyle } from 'react-native';

/**
 * Base props for styled RN components.
 *
 * Unlike Web's className-based StyledComponentProps, this supports
 * both NativeWind className and native style prop.
 */
export interface StyledNativeComponentProps {
  /** NativeWind class name */
  className?: string;

  /** Component size variant */
  size?: ThemeSize;

  /** Native style override */
  style?: ViewStyle;
}

/**
 * Slot-based classNames for components using tailwind-variants slots.
 *
 * Allows consumers to override individual slot styles.
 */
export type SlotClassNames<Slots extends string> = Partial<Record<Slots, string>>;
