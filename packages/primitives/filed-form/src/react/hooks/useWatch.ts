'use client';

import type { AllPathsKeys, PathToDeepType, ShapeFromPaths } from '@skyroc/utils/type';
import { isObject, isString } from '@skyroc/utils';
import type { FormInstance } from './FieldContext';
import { useFieldContext } from './FieldContext';
import { useFieldState } from './useFieldState';

/**
 * Options for useWatch hook configuration
 */
type UseWatchOpts<Values = any> = {
  /** Form instance to watch values from */
  form: FormInstance<Values>;
  /** Whether to include child field changes in subscription */
  includeChildren?: boolean;
};

/**
 * Hook overload: Watch a single field value
 *
 * @example
 * ```tsx
 * // Watch single field with external form
 * function UserForm() {
 *   const [form] = useForm();
 *   const username = useWatch('username', { form });
 *
 *   return (
 *     <Form form={form}>
 *       <Field name="username">
 *         <Input placeholder="Username" />
 *       </Field>
 *       <div>Current username: {username}</div>
 *     </Form>
 *   );
 * }
 * ```
 *
】
 */
function useWatch<Values, T extends AllPathsKeys<Values>>(
  name: T,
  opts: UseWatchOpts<Values>
): PathToDeepType<Values, T>;

/**
 * Hook overload: Watch multiple specific field values
 *
 * @example
 * ```tsx
 * // Watch multiple fields with external form
 * function UserInfo() {
 *   const [form] = useForm();
 *   const { name, email } = useWatch(['name', 'email'], { form });
 *
 *   return (
 *     <Form form={form}>
 *       <Field name="name">
 *         <Input placeholder="Name" />
 *       </Field>
 *       <Field name="email">
 *         <Input placeholder="Email" />
 *       </Field>
 *       <div>Name: {name}, Email: {email}</div>
 *     </Form>
 *   );
 * }
 * ```
 */
function useWatch<Values, T extends AllPathsKeys<Values>>(
  names: T[],
  opts: UseWatchOpts<Values>
): ShapeFromPaths<Values, T[]>;

/**
 * Hook overload: Watch all field values using external form instance
 *
 * @example
 * ```tsx
 * // Watch all fields with external form
 * function FormDebugger() {
 *   const [form] = useForm();
 *   const allValues = useWatch(form);
 *
 *   return (
 *     <Form form={form}>
 *       <Field name="name">
 *         <Input placeholder="Name" />
 *       </Field>
 *       <Field name="email">
 *         <Input placeholder="Email" />
 *       </Field>
 *       <pre>{JSON.stringify(allValues, null, 2)}</pre>
 *     </Form>
 *   );
 * }
 * ```
 */
function useWatch<Values = any>(form: FormInstance<Values>): Values;

/**
 * Hook overload: Watch all field values using context form
 *
 * @example
 * ```tsx
 * // Watch all fields in child component (no form prop needed)
 * function FormSummary() {
 *   const allValues = useWatch();
 *   return <pre>{JSON.stringify(allValues, null, 2)}</pre>;
 * }
 *
 * function App() {
 *   return (
 *     <Form initialValues={{ name: 'John', email: 'john@example.com' }}>
 *       <Field name="name">
 *         <Input placeholder="Name" />
 *       </Field>
 *       <Field name="email">
 *         <Input placeholder="Email" />
 *       </Field>
 *       <FormSummary />
 *     </Form>
 *   );
 * }
 * ```
 */
function useWatch<Values = any>(): Values;

/**
 * Implementation function for useWatch hook
 * Handles all overload cases and returns appropriate field values
 */
function useWatch<Values = any, T extends AllPathsKeys<Values> = AllPathsKeys<Values>>(
  names?: T[] | T | FormInstance<Values>,
  opts?: UseWatchOpts<Values>
) {
  // Check if watching a single field (string parameter)
  const isSingleField = isString(names);
  const isFormInstance = isObject(names) && 'getFieldsValue' in names;
  const contextForm = useFieldContext<Values>();
  const form = isFormInstance ? names : (opts?.form ?? contextForm);

  // Use useFieldState to subscribe to field value changes only
  const state = useFieldState<Values>(names as any, { ...opts, mask: { value: true } });

  // Return single field value or object of field values
  if (isSingleField) return state.value; // For single field, return the value directly
  if (isFormInstance || names === undefined) return form?.getFieldsValue();

  return Object.fromEntries(Object.entries(state).map(([key, value]) => [key, value.value])); // For multiple fields, extract values from state objects
}

export { useWatch };
