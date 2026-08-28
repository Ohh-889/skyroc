'use client';

/** Hook for creating and managing form instances Provides a stable form instance that persists across re-renders */

import { useRef } from 'react';

import CreateFromStore from '../../form-core/createStore';

import type { FormInstance } from './FieldContext';

/**
 * Hook to create or reuse a form instance for form state management Returns a stable form instance that can be used
 * with Form components or independently
 *
 * @example
 *   ```tsx
 *   // Programmatic form control
 *   function ControlledForm() {
 *     const [form] = useForm();
 *
 *     const handleReset = () => {
 *       form.resetFields();
 *     };
 *
 *     const handleSubmit = (values: any) => {
 *       console.log('Form values:', values);
 *     };
 *
 *     const handleSetValues = () => {
 *       form.setFieldsValue({ name: 'John', email: 'john@example.com' });
 *     };
 *
 *     return (
 *       <Form
 *         form={form}
 *         onFinish={handleSubmit}
 *       >
 *         <Field name="name">
 *           <Input placeholder="Name" />
 *         </Field>
 *         <Field name="email">
 *           <Input placeholder="Email" />
 *         </Field>
 *         <button
 *           type="button"
 *           onClick={handleReset}
 *         >
 *           Reset
 *         </button>
 *         <button
 *           type="button"
 *           onClick={handleSetValues}
 *         >
 *           Set Values
 *         </button>
 *       </Form>
 *     );
 *   }
 *   ```;
 */
export const useForm = <Values = any>(form?: FormInstance<Values>): readonly [FormInstance<Values>] => {
  // Use ref to maintain stable form instance across re-renders
  const formRef = useRef<FormInstance<Values> | null>(null);

  // Initialize form instance only once
  if (!formRef.current) {
    if (form) {
      // Use provided external form instance
      formRef.current = form;
    } else {
      // Create new internal form instance
      const internalForm = new CreateFromStore();
      formRef.current = internalForm.getForm() as any;
    }
  }

  // Return form instance in tuple format for consistency with React patterns
  return [formRef.current] as unknown as readonly [FormInstance<Values>];
};
