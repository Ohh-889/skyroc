import type { LabelProps as _LabelProps } from '@radix-ui/react-label';
import type { StyledComponentProps } from '../../types/shared';

/**
 * Props for the Label component.
 * An accessible form label element that can be associated with form controls.
 * Extends the Radix UI label component with styling capabilities.
 *
 * @example
 * // Basic label
 * <Label htmlFor="email">Email Address</Label>
 *
 * @example
 * // Label with custom styling
 * <Label htmlFor="password" className="text-sm font-semibold">
 *   Password
 * </Label>
 *
 * @example
 * // Label with multiple form controls
 * <Label htmlFor="remember">
 *   <input id="remember" type="checkbox" />
 *   Remember me
 * </Label>
 */
export interface LabelProps extends StyledComponentProps<_LabelProps> {}
