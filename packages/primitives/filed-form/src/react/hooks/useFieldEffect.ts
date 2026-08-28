'use client';
/**
 * Hook for creating reactive side effects based on form field changes Allows running custom logic when specified form
 * fields change
 */

import type { AllPathsKeys } from '@skyroc/utils/type';
import { useEffect } from 'react';

import type { FormInstance, InternalFormInstance } from './FieldContext';
import { useFieldContext } from './FieldContext';

/**
 * Hook to create reactive side effects that run when form fields change Unlike computed fields, effects don't write
 * back to the form - they're for side effects only
 *
 * @example
 *   ```tsx
 *   // Log when name fields change
 *   function UserForm() {
 *   useEffectField(['firstName', 'lastName'], get => {
 *   const firstName = get('firstName');
 *   const lastName = get('lastName');
 *   console.log(`Name changed: ${firstName} ${lastName}`);
 *   });
 *
 *   return (
 *   <Form>
 *   <Field name="firstName">
 *   <Input placeholder="First Name" />
 *   </Field>
 *   <Field name="lastName">
 *   <Input placeholder="Last Name" />
 *   </Field>
 *   </Form>
 *   );
 *   }
 *   ```
 */
export function useEffectField<Values = any>(
  deps: AllPathsKeys<Values>[],
  effect: (get: (n: AllPathsKeys<Values>) => any, all: Values) => void,
  form?: FormInstance<Values>
) {
  // Get form context from React context
  const contextForm = useFieldContext<Values>();

  // Use provided form instance or fall back to context form
  const formInstance = form ?? contextForm;

  // Ensure form instance is available
  if (!formInstance) {
    throw new Error('Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.');
  }

  // Extract internal hooks from form instance
  const { getInternalHooks } = formInstance as unknown as InternalFormInstance<Values>;

  // Get the registerEffect function
  const { registerEffect } = getInternalHooks();

  // Register the effect with the form's reactive system
  useEffect(() => {
    // Register effect and get cleanup function
    const unregister = registerEffect(deps, effect);
    // Return cleanup function to unregister when component unmounts or deps change
    return unregister;
  }, [deps]);
}
