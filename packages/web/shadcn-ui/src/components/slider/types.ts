import type {
  SliderProps as _SliderProps,
  SliderRangeProps as _SliderRangeProps,
  SliderThumbProps as _SliderThumbProps,
  SliderTrackProps as _SliderTrackProps
} from '@radix-ui/react-slider';
import type { ClassValue, StyledComponentProps, ThemeColor } from '../../types/shared';
import type { SliderSlots } from './slider-variants';

/**
 * Props for the slider range component.
 * The filled portion of the slider track between the minimum and maximum values.
 */
export interface SliderRangeProps extends StyledComponentProps<_SliderRangeProps> {
  /**
   * Theme color for the slider range fill.
   * Determines the color of the filled portion of the slider.
   */
  color?: ThemeColor;
}

/**
 * Props for the slider root component.
 * The main container for all slider elements including track, range, and thumbs.
 */
export interface SliderRootProps extends StyledComponentProps<_SliderProps> {}

/**
 * Props for the slider thumb component.
 * The draggable handle that the user moves to change the slider value.
 */
export interface SliderThumbProps extends StyledComponentProps<_SliderThumbProps> {
  /**
   * Theme color for the slider thumb.
   * Determines the appearance of the draggable handle.
   */
  color?: ThemeColor;
}

/**
 * Props for the slider track component.
 * The background rail on which the range fill and thumb sit.
 */
export interface SliderTrackProps extends StyledComponentProps<_SliderTrackProps> {
  /**
   * Theme color for the slider track.
   * Determines the background color of the slider rail.
   */
  color?: ThemeColor;
}

/**
 * Class names for different slots in the slider component.
 * Allows customizing styles for track, range, and thumb elements.
 */
export type SliderClassNames = Partial<Record<SliderSlots, ClassValue>>;

/**
 * Props for the main Slider component.
 * A range input component for selecting a value or range of values on a continuous scale.
 *
 * @example
 * ```tsx
 * // Single value slider
 * <Slider
 *   defaultValue={[50]}
 *   min={0}
 *   max={100}
 *   step={1}
 *   color="primary"
 * />
 *
 * // Range slider
 * <Slider
 *   defaultValue={[25, 75]}
 *   min={0}
 *   max={100}
 *   step={5}
 *   color="secondary"
 * />
 * ```
 */
export interface SliderProps extends Omit<SliderRootProps, 'children'> {
  /**
   * Class names for customizing different parts of the slider component.
   */
  classNames?: SliderClassNames;
  /**
   * Theme color applied to the slider range and thumb.
   * Affects both the fill and interactive elements.
   */
  color?: ThemeColor;
  /**
   * Props for the slider range component.
   */
  rangeProps?: SliderRangeProps;
  /**
   * Props for the slider thumb component.
   */
  thumbProps?: SliderThumbProps;
  /**
   * Props for the slider track component.
   */
  trackProps?: SliderTrackProps;
}
