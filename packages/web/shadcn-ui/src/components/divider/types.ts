import type { SeparatorProps as _SeparatorProps } from '@radix-ui/react-separator';
import type { ClassValue, SlotProps, StyledComponentProps, ThemeAlign, ThemeOrientation } from '../../types/shared';
import type { DividerBorder, DividerSlots } from './divider-variants';

/**
 * Props for the divider root component.
 * Extends the base separator component from Radix UI with styling capabilities.
 */
export interface DividerRootProps extends StyledComponentProps<_SeparatorProps> {
  /**
   * Style variant for the divider border.
   * Controls the visual appearance and styling of the divider line.
   */
  border?: DividerBorder;
}

export type { DividerBorder };

/**
 * Props for the divider label component.
 * Used to create labeled dividers with text or content.
 */
export interface DividerLabelProps extends StyledComponentProps<React.ComponentProps<'span'>> {
  /**
   * Horizontal alignment of the label content.
   * Determines if the label is positioned left, center, or right.
   */
  align?: ThemeAlign;
  /**
   * Orientation of the divider (horizontal or vertical).
   * Controls the direction of the separator line.
   */
  orientation?: ThemeOrientation;
}

/**
 * Class names for different slots in the divider component.
 * Allows customizing styles for specific parts of the divider.
 */
export type DividerUi = Partial<Record<DividerSlots, ClassValue>>;

/**
 * Props for the main Divider component.
 * Combines root and label properties with slot customization.
 *
 * @example
 * ```tsx
 * <Divider
 *   border="solid"
 *   orientation="horizontal"
 *   align="center"
 *   classNames={{ root: 'my-4' }}
 * />
 * ```
 */
export interface DividerProps
  extends DividerRootProps,
  Pick<DividerLabelProps, 'align' | 'orientation' | 'size'>,
  SlotProps {
  /**
   * Class names for customizing different parts of the divider component.
   */
  classNames?: DividerUi;
}
