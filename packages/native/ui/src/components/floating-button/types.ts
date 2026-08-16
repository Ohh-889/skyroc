import type { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';

/** Axis constraint for drag movement */
export type FloatingButtonAxis = 'lock' | 'x' | 'xy' | 'y';

/** Edge direction for magnetic snapping after drag ends */
export type FloatingButtonMagnetic = 'x' | 'y';

export interface FloatingButtonProps {
  /** Drag axis constraint: 'x' horizontal only, 'y' vertical only, 'xy' free drag, 'lock' no drag */
  axis?: FloatingButtonAxis;

  /** Custom content rendered inside the button */
  children?: ReactNode;

  /** NativeWind className applied to the inner visual container */
  className?: string;

  /** Minimum distance from screen edges in pixels, or per-axis config */
  gap?: number | { x: number; y: number };

  /** Auto-snap to nearest edge after drag ends along this axis */
  magnetic?: FloatingButtonMagnetic;

  /** Controlled position offset from top-left corner */
  offset?: { x: number; y: number };

  /** Callback fired with new position after drag ends or magnetic snap completes */
  onOffsetChange?: (offset: { x: number; y: number }) => void;

  /** Callback fired on tap (distinguished from drag by movement threshold) */
  onPress?: () => void;

  /** Button diameter in pixels */
  size?: number;

  /** Whether the button is visible, with scale animation on toggle */
  visible?: boolean;

  /** SharedValue (0 or 1) to drive visibility on UI thread, overrides visible prop when provided */
  visibleValue?: SharedValue<number>;
}
