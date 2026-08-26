import type { ComponentPropsWithoutRef } from 'react';
import type { ClassValue, SlotProps, StyledComponentProps } from '../../types/shared';
import type { NumberInputSlots } from './number-input-variants';

/**
 * Class names for different slots in the number input component.
 * Allows customizing styles for the root, buttons, control, and clearable parts.
 */
export type NumberInputClassNames = Partial<Record<NumberInputSlots, ClassValue>>;

/**
 * Props for the NumberInput control component.
 * The actual input element for numeric value entry.
 */
export interface NumberInputControlProps extends StyledComponentProps<Omit<ComponentPropsWithoutRef<'input'>, 'defaultValue' | 'max' | 'min' | 'value'>> {
  /**
   * Whether to center the input value with buttons on both sides.
   * @default false
   */
  center?: boolean;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: number | string;

  /**
   * Maximum allowed value.
   */
  max?: number;

  /**
   * Minimum allowed value.
   */
  min?: number;

  /**
   * Current numeric value.
   */
  value?: number | string;
}

/**
 * Props for the main NumberInput component.
 * A numeric input with increment/decrement buttons.
 *
 * @example
 * ```tsx
 * // Basic number input
 * <NumberInput value={count} onChange={setCount} />
 *
 * // With min/max limits
 * <NumberInput min={0} max={100} step={5} />
 *
 * // Centered layout with buttons on both sides
 * <NumberInput center />
 *
 * // With clearable button
 * <NumberInput clearable />
 *
 * // Different sizes
 * <NumberInput size="lg" />
 *
 * // Disabled state
 * <NumberInput disabled />
 * ```
 */
export interface NumberInputProps extends NumberInputControlProps, SlotProps {
  /**
   * Whether to center the input value with buttons on both sides.
   * @default false
   */
  center?: boolean;
  classNames?: NumberInputClassNames;
  /**
   * Whether to show the clearable button.
   * @default false
   */
  clearable?: boolean;
  /**
   * Props for the input control.
   */
  controlProps?: Omit<NumberInputControlProps, 'onChange' | 'value'>;
  /**
   * Custom decrement icon.
   */
  decrementIcon?: React.ReactNode;
  /**
   * Custom increment icon.
   */
  incrementIcon?: React.ReactNode;
  /**
   * Callback fired when the input value changes.
   */
  onValueChange?: (value: number | string | undefined) => void;
  /**
   * Step value for increment/decrement operations.
   * @default 1
   */
  step?: number;
}
