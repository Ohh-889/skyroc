import type { ComponentPropsWithRef } from 'react';
import type { ClassValue, SlotProps, StyledComponentProps } from '../../types/shared';
import type { InputSlots } from './input-variants';

/**
 * Class names for different slots in the drawer component.
 * Allows customizing styles for the overlay, content, and other parts.
 */
export type InputClassNames = Partial<Record<InputSlots, ClassValue>>;

/**
 * Props for the Input component.
 * A styled HTML input element with support for various input types and states.
 *
 * Extends standard HTML input attributes while omitting the native 'size' attribute
 * to avoid conflicts with theme size variants. Use className or style for sizing instead.
 *
 * @example
 * ```tsx
 * // Basic text input
 * <Input type="text" placeholder="Enter text" />
 *
 * // Email input with validation
 * <Input type="email" required placeholder="Enter email" />
 *
 * // Password input
 * <Input type="password" placeholder="Enter password" />
 *
 * // Number input with min/max
 * <Input type="number" min="0" max="100" placeholder="0-100" />
 *
 * // Disabled input
 * <Input type="text" disabled placeholder="Disabled" />
 *
 * // Input with custom styling
 * <Input
 *   type="text"
 *   placeholder="Styled input"
 *   className="border-blue-500 focus:ring-blue-300"
 * />
 *
 * // Input with ref for direct access
 * <Input
 *   ref={inputRef}
 *   type="text"
 *   onFocus={() => inputRef.current?.select()}
 * />
 * ```
 *
 * Supported input types: text, email, password, number, date, time, search,
 * tel, url, color, file, checkbox, radio, range, and more.
 */
export interface InputProps extends StyledComponentProps<Omit<ComponentPropsWithRef<'input'>, 'size'>>, SlotProps {
  /**
   * Class names for customizing different parts of the input component.
   */
  classNames?: InputClassNames;
  /**
   * Whether to show the clearable button.
   */
  clearable?: boolean;
}
