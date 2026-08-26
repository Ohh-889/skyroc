import type { SwitchProps as _SwitchRootProps, SwitchThumbProps as _SwitchThumbProps } from '@radix-ui/react-switch';
import type { ClassValue, StyledComponentProps, ThemeColor } from '../../types/shared';
import type { SwitchSlots } from './switch-varianst';

/**
 * Props for the switch root component.
 * Extends the base Radix UI switch props with additional theme customization.
 */
export interface SwitchRootProps extends StyledComponentProps<_SwitchRootProps> {
  /**
   * Color theme to apply to the switch component.
   * Controls the visual appearance of the switch in different states.
   */
  color?: ThemeColor;
}

/**
 * Props for the switch thumb component.
 * The sliding toggle element that moves within the switch track.
 */
export type SwitchThumbProps = StyledComponentProps<_SwitchThumbProps>;

/**
 * Class names for different slots in the switch component.
 * Allows customizing styles for specific parts of the switch (root, thumb, etc.).
 *
 * @example
 * ```tsx
 * const classNames = {
 *   root: 'custom-root-class',
 *   thumb: 'custom-thumb-class'
 * }
 * ```
 */
export type ClassNames = Partial<Record<SwitchSlots, ClassValue>>;

/**
 * Props for the Switch component.
 * Combines root props with class name customization support.
 *
 * @example
 * ```tsx
 * <Switch
 *   disabled={false}
 *   color="primary"
 *   classNames={{ root: 'custom-switch' }}
 * />
 * ```
 */
export interface SwitchProps extends SwitchRootProps {
  /**
   * Class names for customizing different slots within the switch component.
   */
  classNames?: ClassNames;
}
