import type { RenderProps } from 'input-otp';
import type { ClassValue, HTMLComponentProps, ThemeSize } from '../../types/shared';
import type { InputOTPSlots } from './input-otp-variants';

/**
 * Utility type that overrides specific properties in a type.
 * Used to merge base properties with custom overrides.
 */
type OverrideProps<T, R> = Omit<T, keyof R> & R;

/**
 * Base styled component props for the OTP input root element.
 * Combines HTML input attributes with OTP-specific configuration.
 */
type OTPInputRootStyledComponentProps = OverrideProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    /**
     * CSS class name for the root input element styling.
     */
    className?: ClassValue;
    /**
     * CSS class name for the container wrapper element.
     */
    containerClassName?: string;
    /**
     * Number of OTP input slots/digits.
     * Must be a positive integer (typically 4, 6, or 8).
     */
    maxLength: number;
    /**
     * Fallback CSS string for browsers without JavaScript support.
     * Provides basic styling when JS is disabled.
     */
    noScriptCSSFallback?: string | null;
    /**
     * Callback fired when the OTP value changes.
     * Receives the current OTP string value.
     */
    onChange?: (newValue: string) => unknown;
    /**
     * Callback fired when all OTP slots are filled.
     * Receives the complete OTP value.
     */
    onComplete?: (...args: any[]) => unknown;
    /**
     * Function to transform pasted OTP values.
     * Used to handle various paste formats (e.g., "123-456" to "123456").
     */
    pasteTransformer?: (pasted: string) => string;
    /**
     * Strategy for handling password manager auto-fill.
     * 'increase-width' expands the input width temporarily.
     * 'none' disables special handling.
     */
    pushPasswordManagerStrategy?: 'increase-width' | 'none';
    /**
     * Size variant for the OTP input slots (sm, md, lg, etc).
     */
    size?: ThemeSize;
    /**
     * Text alignment of the OTP digits within slots.
     */
    textAlign?: 'center' | 'left' | 'right';
    /**
     * Current OTP value as a string.
     */
    value?: string;
  }
>;

/**
 * Type for the render function used in render-prop pattern.
 * Provides access to OTP rendering context and utilities.
 */
type InputOTPRenderFn = (props: RenderProps) => React.ReactNode;

/**
 * Props for the OTP input group container component.
 * Wrapper that organizes individual OTP slots.
 */
export type InputOTPGroupProps = HTMLComponentProps<'div'> & {
  /**
   * Whether to add visual separation between OTP slots.
   * When true, each slot is displayed as a separate element with spacing.
   */
  separate?: boolean;
};

/**
 * Props for the root OTP input component.
 * Supports both controlled render-prop and children-based rendering.
 *
 * @example
 * ```tsx
 * // Using children rendering
 * <InputOTPRoot value={otp} onChange={setOtp} maxLength={6}>
 *   <InputOTPGroup>
 *     {Array.from({ length: 6 }).map((_, i) => (
 *       <InputOTPSlot key={i} index={i} />
 *     ))}
 *   </InputOTPGroup>
 * </InputOTPRoot>
 *
 * // Using render prop
 * <InputOTPRoot
 *   value={otp}
 *   onChange={setOtp}
 *   maxLength={6}
 *   render={({ slots }) => (
 *     <InputOTPGroup>
 *       {slots.map((slot, i) => (
 *         <InputOTPSlot key={i} index={i} {...slot} />
 *       ))}
 *     </InputOTPGroup>
 *   )}
 * />
 * ```
 */
export type InputOTPRootProps = OTPInputRootStyledComponentProps
  & (
    | {
      /**
       * Child elements - not allowed when using render prop.
       */
      children?: never;
      /**
       * Render function for custom slot rendering.
       * Provides slots array and helper methods.
       */
      render: InputOTPRenderFn;
    }
    | {
      /**
       * Child elements to render OTP slots.
       * Not allowed when using render prop.
       */
      children: React.ReactNode;
      /**
       * Render function - not allowed when using children.
       */
      render?: never;
    }
  );

/**
 * Props for the OTP input separator component.
 * Visual divider between groups of OTP slots.
 *
 * @example
 * ```tsx
 * <InputOTPGroup>
 *   <InputOTPSlot index={0} />
 *   <InputOTPSlot index={1} />
 * </InputOTPGroup>
 * <InputOTPSeparator>-</InputOTPSeparator>
 * <InputOTPGroup>
 *   <InputOTPSlot index={2} />
 *   <InputOTPSlot index={3} />
 * </InputOTPGroup>
 * ```
 */
export interface InputOTPSeparatorProps extends HTMLComponentProps<'div'> {}

/**
 * Props for individual OTP input slot components.
 * Represents a single digit input field.
 */
export interface InputOTPSlotProps extends HTMLComponentProps<'div'> {
  /**
   * Index position of this slot in the OTP sequence (0-based).
   * Used to map slot values in the parent input.
   */
  index: number;
  /**
   * Whether to mask the displayed value (e.g., show bullets instead of digits).
   * Useful for sensitive OTP codes.
   */
  mask?: boolean;
  /**
   * Whether this slot should be visually separated from others.
   * When true, adds spacing and potentially border styling.
   */
  separate?: boolean;
}

/**
 * Class names for different slots in the input OTP component.
 * Allows customizing styles for specific parts of the OTP input.
 */
export type InputOTPClassNames = Partial<Record<InputOTPSlots, ClassValue>>;

/**
 * Props for the main Input OTP component.
 * A convenient wrapper around InputOTPRoot with sensible defaults for common OTP patterns.
 *
 * @example
 * ```tsx
 * <InputOTP
 *   value={code}
 *   onChange={setCode}
 *   inputCount={6}
 *   mask
 *   separator={<span>-</span>}
 *   size="md"
 *   onComplete={handleComplete}
 * />
 * ```
 */
export type InputOTPProps = Omit<OTPInputRootStyledComponentProps, 'maxLength' | 'separate'> & {
  /**
   * Class names for customizing different parts of the OTP input component.
   */
  classNames?: InputOTPClassNames;
  /**
   * Props for the input OTP group component.
   */
  groupProps?: InputOTPGroupProps;
  /**
   * Number of OTP input slots to render.
   * Replaces the maxLength requirement from root props.
   */
  inputCount?: number;
  /**
   * Whether to mask OTP values with bullets/dots for privacy.
   * Defaults to false.
   */
  mask?: boolean;
  /**
   * Separator element displayed between OTP slot groups.
   * Can be a React element or true to use default separator.
   */
  separator?: React.ReactNode | true;
  /**
   * Props for the input OTP separator component.
   */
  separatorProps?: InputOTPSeparatorProps;
  /**
   * Size variant for the OTP input slots (sm, md, lg, etc).
   */
  size?: ThemeSize;
  /**
   * Props for the input OTP slot component.
   */
  slotProps?: InputOTPSlotProps;
};
