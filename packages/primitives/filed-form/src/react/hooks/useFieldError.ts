'use client';

/**
 * Hook for accessing form field validation errors Provides reactive access to field error states with multiple usage
 * patterns
 */

import { isString } from '@skyroc/utils';
import type { AllPathsKeys } from '@skyroc/utils/type';

import type { FormInstance } from './FieldContext';
import { useFieldState } from './useFieldState';

/** Options for useFieldError hook */
type UseWatchOpts<Values = any> = {
  /** Optional form instance, uses context form if not provided */
  form?: FormInstance<Values>;
};

/**
 * Type utility for error shape based on field names Returns appropriate error structure based on whether specific
 * fields are requested
 */
export type ErrorShape<
  Values,
  Names extends readonly AllPathsKeys<Values>[] | undefined = undefined
> = Names extends readonly AllPathsKeys<Values>[]
  ? {
      /** Error arrays for each specified field */
      [K in Names[number]]: string[];
    }
  : {
      /** Error arrays for all form fields */
      [K in AllPathsKeys<Values>]: string[];
    };

/**
 * Hook overload: Get errors for a single field
 *
 * @example
 *   ```tsx
 *   // Get single field errors
 *   function UserForm() {
 *     const nameErrors = useFieldError('name');
 *
 *     return (
 *       <Form>
 *         <Field
 *           name="name"
 *           rules={[{ required: true }]}
 *         >
 *           <Input placeholder="Name" />
 *         </Field>
 *         {nameErrors.length > 0 && <div>{nameErrors.join(', ')}</div>}
 *       </Form>
 *     );
 *   }
 *   ```;
 */
function useFieldError<Values, T extends AllPathsKeys<Values>>(name: T, opts?: UseWatchOpts<Values>): string[];

/**
 * Hook overload: Get errors for multiple specific fields
 *
 * @example
 *   ```tsx
 *   // Get multiple field errors
 *   function UserForm() {
 *     const { name, email } = useFieldError(['name', 'email']);
 *
 *     return (
 *       <Form>
 *         <Field
 *           name="name"
 *           rules={[{ required: true }]}
 *         >
 *           <Input placeholder="Name" />
 *         </Field>
 *         {name.length > 0 && <div>{name.join(', ')}</div>}
 *
 *         <Field
 *           name="email"
 *           rules={[{ required: true, type: 'email' }]}
 *         >
 *           <Input placeholder="Email" />
 *         </Field>
 *         {email.length > 0 && <div>{email.join(', ')}</div>}
 *       </Form>
 *     );
 *   }
 *   ```;
 */
function useFieldError<Values, T extends AllPathsKeys<Values>>(
  names: T[],
  opts?: UseWatchOpts<Values>
): ErrorShape<Values, T[]>;

/**
 * Hook overload: Get errors for all fields using external form instance
 *
 * @example
 *   ```tsx
 *   function CompleteForm() {
 *     const form = useForm();
 *
 *     const allErrors = useFieldError(form);
 *     return (
 *       <Form form={form}>
 *         <Field name="firstName">
 *           <Input placeholder="First Name" />
 *         </Field>
 *         <Field name="lastName">
 *           <Input placeholder="Last Name" />
 *         </Field>
 *       </Form>
 *     );
 *   }
 *   ```;
 */
function useFieldError<Values = any>(form: FormInstance<Values>): ErrorShape<Values, AllPathsKeys<Values>[]>;

/**
 * Hook overload: Get errors for all fields using context form
 *
 * @example
 *   ```tsx
 *   // Get all field errors in child component
 *   function ErrorSummary() {
 *     const allErrors = useFieldError();
 *     const hasErrors = Object.values(allErrors).some(errors => errors.length > 0);
 *
 *     if (!hasErrors) return null;
 *
 *     return (
 *       <div>
 *         {Object.entries(allErrors).map(
 *           ([field, errors]) =>
 *             errors.length > 0 && (
 *               <div key={field}>
 *                 {field}: {errors.join(', ')}
 *               </div>
 *             )
 *         )}
 *       </div>
 *     );
 *   }
 *
 *   function App() {
 *     return (
 *       <Form>
 *         <Field
 *           name="name"
 *           rules={[{ required: true }]}
 *         >
 *           <Input placeholder="Name" />
 *         </Field>
 *         <Field
 *           name="email"
 *           rules={[{ required: true, type: 'email' }]}
 *         >
 *           <Input placeholder="Email" />
 *         </Field>
 *         <ErrorSummary />
 *       </Form>
 *     );
 *   }
 *   ```;
 */
function useFieldError<Values = any>(): ErrorShape<Values, AllPathsKeys<Values>[]>;

function useFieldError<Values = any, T extends AllPathsKeys<Values> = AllPathsKeys<Values>>(
  names?: T[] | T | FormInstance<Values>,
  opts?: UseWatchOpts<Values>
) {
  // Determine if requesting errors for a single field
  const isSingleField = isString(names);

  // Get field state with error mask to optimize performance
  const state = useFieldState<Values>(names as any, { ...opts, mask: { errors: true } });

  // Return appropriate format based on input type
  return isSingleField
    ? state.errors // Single field: return error array directly
    : Object.fromEntries(Object.entries(state).map(([key, value]) => [key, value.errors])); // Multiple fields: return error map
}

export { useFieldError };
