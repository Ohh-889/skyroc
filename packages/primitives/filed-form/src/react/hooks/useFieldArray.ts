'use client';

/** Hook for managing array fields in forms Provides array operations for dynamic field arrays with stable keys */

import type { ArrayKeys } from '@skyroc/utils/type';

import type { FormInstance, InternalFormInstance } from './FieldContext';
import { useFieldContext } from './FieldContext';

/** Interface for array field items Provides stable keys and field paths for array field management */
export type ArrayFieldItem = {
  /** Stable key for React rendering optimization */
  key: string;
  /** Field path for this array item (e.g., "users.0", "tasks.1") */
  name: string;
};

/**
 * Hook to manage array fields with CRUD operations Provides methods to add, remove, move, swap, and replace array items
 *
 * @example
 *   ```tsx
 *   // Usage with external form instance
 *   function ExternalFormExample() {
 *   const [form] = useForm();
 *   const { fields, add, remove } = useArrayField('items', form);
 *
 *   const handleSubmit = () => {
 *   form.validateFields().then((isValid) => {
 *   if (isValid) {
 *   const values = form.getFieldsValue();
 *   console.log('Form values:', values);
 *   }
 *   });
 *   };
 *
 *   return (
 *   <Form form={form} initialValues={{ items: [] }}>
 *   <List name="items">
 *   {(fields）) => (
 *   fields.map((field) => (
 *   <div key={field.key}>
 *   <Field name={`${field.name}.name`}>
 *   <Input placeholder="Item name" />
 *   </Field>
 *   <Field name={`${field.name}.quantity`}>
 *   <Input type="number" placeholder="Quantity" />
 *   </Field>
 *   <button onClick={() => remove(field.name)}>Remove</button>
 *   </div>
 *   ))}
 *   </List>
 *   <button onClick={() => add({ name: '', quantity: 1 })}>Add Item</button>
 *   <button onClick={handleSubmit}>Submit</button>
 *   </Form>
 *   );
 *   }
 *   ```
 */
export function useArrayField<Values = any>(name: ArrayKeys<Values>, form?: FormInstance<Values>) {
  // Get form context from React context
  const contextForm = useFieldContext();

  // Use provided form instance or fall back to context form
  const formInstance = form ?? contextForm;

  // Ensure form instance is available
  if (!formInstance) {
    throw new Error('Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.');
  }

  // Extract array operations from internal form instance
  const { arrayOp } = formInstance as unknown as InternalFormInstance<Values>;

  // Return array operations for the specified field
  return arrayOp(name);
}
