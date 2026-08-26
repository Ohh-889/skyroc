import type { ToggleProps as _ToggleProps } from '@radix-ui/react-toggle';
import type { StyledComponentProps } from '../../types/shared';
import type { ToggleVariant } from './toggle-variants';

/**
 * Props for the Toggle component.
 * A component that can be toggled between two states (pressed/unpressed).
 * Extends the base Radix UI toggle props with additional style customization.
 *
 * @example
 * ```tsx
 * // Basic toggle button
 * <Toggle aria-label="Toggle italic">
 *   <ItalicIcon />
 * </Toggle>
 *
 * // With variant and pressed state
 * <Toggle
 *   variant="outline"
 *   pressed={isPressed}
 *   onPressedChange={setIsPressed}
 *   aria-label="Toggle bold"
 * >
 *   <BoldIcon />
 * </Toggle>
 * ```
 */
export interface ToggleProps extends StyledComponentProps<_ToggleProps> {
  /**
   * Visual variant style for the toggle button.
   * Determines the appearance and styling of the toggle component.
   * Common variants include 'outline', 'solid', 'ghost', etc.
   */
  variant?: ToggleVariant;
}
