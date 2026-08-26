import type { ComponentProps, ElementType, ReactNode } from 'react';
import type { ComputedFieldProps, FieldProps } from '@skyroc/form';
import type { ClassValue, StyledComponentProps } from '../../types/shared';
import type { LabelProps } from '../label/types';
import type { FormSlots } from './form-variants';

/**
 * Class names for different slots in the form component.
 * Allows customizing styles for specific parts of form layout.
 */
type FormClassNames = Partial<Record<FormSlots, ClassValue>>;

/**
 * Props for the form description component.
 * Used to display helper text or additional information about a form field.
 */
export interface FormDescriptionProps extends StyledComponentProps<ComponentProps<'p'>> {}

/**
 * Props for the form item wrapper component.
 * Container that groups label, input, description, and error message.
 */
export interface FormItemProps extends StyledComponentProps<ComponentProps<'div'>> {}

/**
 * Props for the form label component.
 * Label text associated with form fields, with error state styling.
 */
export interface FormLabelProps extends LabelProps {
  /**
   * Whether the label should display error styling.
   * Applied when the associated field has validation errors.
   */
  error?: boolean;
}

/**
 * Props for the form message component.
 * Displays validation error messages or informational text.
 */
export interface FormMessageProps extends StyledComponentProps<ComponentProps<'p'>> {
  /**
   * Array of error messages to display.
   * When present, the message component renders in error state.
   */
  error?: string[];
}

/**
 * Shared props for form field components.
 * Common configuration options for both regular and computed fields.
 */
type FormSharedProps = StyledComponentProps<{
  /**
   * Class names for customizing different parts of the form field.
   */
  classNames?: FormClassNames;
  /**
   * Helper text displayed below the form field input.
   * Used to provide additional context or usage information.
   */
  description?: string;
  /**
   * Error message displayed when field validation fails.
   */
  error?: string;
  /**
   * Label text displayed above the form field input.
   */
  label?: ReactNode;
}>;

/**
 * Props for a regular form field component.
 * Used for standard form inputs with validation and labeling.
 *
 * @template Values - The shape of form values object
 *
 * @example
 * ```tsx
 * <FormField<{ email: string }>
 *   name="email"
 *   label="Email Address"
 *   description="Enter your email"
 *   error={errors.email}
 *   component={Input}
 * />
 * ```
 */
export type FormFieldProps<Values = any> = FieldProps<Values>
  & FormSharedProps & {
    /**
     * The React component or HTML element to render as the form input.
     * Examples: Input, Select, Textarea, etc.
     */
    component?: ElementType;
  };

/**
 * Props for a computed form field component.
 * Used for fields that derive their value from other form fields.
 *
 * @template Values - The shape of form values object
 *
 * @example
 * ```tsx
 * <FormComputedField<{ firstName: string; lastName: string; fullName: string }>
 *   name="fullName"
 *   compute={(values) => `${values.firstName} ${values.lastName}`}
 *   label="Full Name"
 * />
 * ```
 */
export type FormComputedFieldProps<Values = any> = ComputedFieldProps<Values> & FormSharedProps;
