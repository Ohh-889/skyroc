'use client';

/**
 * Form component with comprehensive form state management and validation
 * Supports polymorphic rendering, schema validation, and flexible configuration
 */

import type { ComponentPropsWithoutRef, ComponentRef, ElementType, HTMLProps, Ref } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import type { DeepPartial } from '@skyroc/type-utils';
import type { FormSchema } from '../../form-core/resolver/resolver';
import { extractSchemaValidator, resolveSchema } from '../../form-core/resolver/resolver';
import type { ValidateMessages } from '../../form-core/validate';
import type {
  FormInstance,
  InternalFormContext,
  InternalFormInstance,
  RegisterCallbackOptions
} from '../hooks/FieldContext';
import { FieldContextProvider } from '../hooks/FieldContext';
import { useForm } from '../hooks/useForm';

/**
 * Base props interface for Form component
 */
export interface FormBaseProps<Values = any> extends RegisterCallbackOptions<Values> {
  /** Child elements to render within the form */
  children?: React.ReactNode;
  /** Whether to clear form data when component is destroyed */
  clearOnDestroy?: boolean;
  /** External form instance to use instead of creating a new one */
  form?: FormInstance<Values>;
  /** Initial values for form fields */
  initialValues?: DeepPartial<Values>;
  /** Whether to preserve field values after component unmount */
  preserve?: boolean;
  /** Schema for form validation (supports various validation libraries) */
  schema?: FormSchema<Values>;
  /** Custom validation messages */
  validateMessages?: ValidateMessages;
  /** Default trigger event(s) for field validation */
  validateTrigger?: string | string[];
}

/**
 * Utility type for polymorphic component props
 */
type PolymorphicProps<As extends ElementType, Own> = Own &
  Omit<ComponentPropsWithoutRef<As>, keyof Own> & {
    /** Component type to render as (e.g., 'form', 'div', custom component) */
    component?: As;
  };

/**
 * Form component props with polymorphic rendering support
 * Can render as different HTML elements or disable wrapper entirely
 */
export type FormProps<Values = any, As extends ElementType = 'form'> =
  | PolymorphicProps<As, FormBaseProps<Values>>
  | ({ component: false } & FormBaseProps<Values>);

/**
 * Form component that provides form state management and validation context
 * Supports polymorphic rendering and comprehensive form functionality
 *
 * @example
 * ```tsx
 * // Basic form with validation
 * <Form
 *   initialValues={{ email: '', password: '' }}
 *   onFinish={(values) => console.log('Form submitted:', values)}
 *   onFinishFailed={(error) => console.log('Validation failed:', error)}
 * >
 *   <Field
 *     name="email"
 *     rules={[{ required: true, type: 'email' }]}
 *   >
 *     <Input placeholder="Email" />
 *   </Field>
 *   <Field
 *     name="password"
 *     rules={[{ required: true, min: 6 }]}
 *   >
 *     <Input type="password" placeholder="Password" />
 *   </Field>
 *   <button type="submit">Submit</button>
 * </Form>
 * ```
 *
 * @example
 * ```tsx
 * // Form with schema validation (e.g., Zod)
 * const schema = z.object({
 *   username: z.string().min(3),
 *   age: z.number().min(18)
 * });
 *
 * <Form
 *   schema={schema}
 *   onFinish={(values) => {
 *     // values are automatically typed and validated
 *     console.log(values.username, values.age);
 *   }}
 * >
 *   <Field name="username">
 *     <Input placeholder="Username" />
 *   </Field>
 *   <Field name="age">
 *     <Input type="number" placeholder="Age" />
 *   </Field>
 *   <button type="submit">Submit</button>
 * </Form>
 * ```
 *
 * @example
 * ```tsx
 * // Headless form (no wrapper element)
 * <Form component={false} initialValues={{ items: [] }}>
 *   <div className="custom-form-layout">
 *     <Field name="title">
 *       <Input placeholder="Title" />
 *     </Field>
 *     <List name="items">
 *       {(fields, { add, remove }) => (
 *         <>
 *           {fields.map((field) => (
 *             <div key={field.key}>
 *               <Field name={field.name}>
 *                 <Input placeholder="Item" />
 *               </Field>
 *               <button onClick={() => remove(field.name)}>Remove</button>
 *             </div>
 *           ))}
 *           <button onClick={() => add()}>Add Item</button>
 *         </>
 *       )}
 *     </List>
 *   </div>
 * </Form>
 * ```
 */
// eslint-disable-next-line prettier/prettier
const Form = <Values=any, As extends ElementType = 'form'>(props: FormProps<Values, As>, ref: Ref<As>) => {
  // Destructure props with default values
  const {
    children,
    clearOnDestroy,
    component: Component = 'form',
    form,
    initialValues,
    onFieldsChange,
    onFinish,
    onFinishFailed,
    onValuesChange,
    preserve = true,
    schema,
    validateMessages,
    validateTrigger = 'onChange',
    ...rest
  } = props;

  // Reference to the native DOM element
  const nativeElement = useRef<ComponentRef<As>>(null);

  // Get or create form instance
  const [formInstance] = useForm<Values>(form);

  // Track if component has been mounted to avoid duplicate initialization
  const mountRef = useRef(false);

  // Extract internal form methods for configuration
  const { destroyForm, setCallbacks, setInitialValues, setPreserve, setSchemaValidator, setValidateMessages } = (
    formInstance as InternalFormInstance<Values>
  ).getInternalHooks();

  // Create form context value with validation trigger
  const formContextValue = useMemo<InternalFormContext<Values>>(
    () => ({
      ...formInstance,
      validateTrigger
    }),
    [formInstance, validateTrigger]
  );

  // Forward ref to the native element
  useImperativeHandle(ref as any, () => nativeElement.current);

  // Initialize form configuration on first mount
  if (!mountRef.current) {
    // Set initial form values
    setInitialValues(initialValues);

    // Configure field preservation behavior
    setPreserve(preserve);

    // Set custom validation messages
    setValidateMessages(validateMessages || {});

    // Register form lifecycle callbacks
    setCallbacks({
      onFieldsChange,
      onFinish,
      onFinishFailed,
      onValuesChange
    });

    // Add schema validation middleware if provided
    if (schema) {
      formInstance.use(resolveSchema(schema));
      const validator = extractSchemaValidator(schema);
      if (validator) setSchemaValidator(validator);
    }

    mountRef.current = true;
  }

  // Cleanup form when component unmounts
  useEffect(() => {
    return () => {
      destroyForm(clearOnDestroy);
    };
  }, []);

  // Render headless form (no wrapper element)
  if (Component === false) {
    return <FieldContextProvider value={formContextValue}>{children}</FieldContextProvider>;
  }

  // Render as HTML form element with enhanced behavior
  if (Component === 'form') {
    const { onReset, onSubmit, ...formProps } = rest as HTMLProps<HTMLFormElement>;

    return (
      <FieldContextProvider value={formContextValue}>
        <Component
          {...formProps}
          ref={nativeElement as Ref<HTMLFormElement>}
          onReset={e => {
            // Prevent default form reset and use form instance reset
            e.preventDefault();
            e.stopPropagation();
            onReset?.(e);
            formInstance.resetFields();
          }}
          onSubmit={e => {
            // Prevent default form submission and use form instance submit
            e.preventDefault();
            onSubmit?.(e);
            formInstance.submit();
          }}
        >
          {children}
        </Component>
      </FieldContextProvider>
    );
  }

  // Render as custom component
  return (
    <FieldContextProvider value={formContextValue}>
      <Component
        {...(rest as any)}
        ref={nativeElement}
      >
        {children}
      </Component>
    </FieldContextProvider>
  );
};

Form.displayName = 'SkyrocForm';

const SkyrocForm = forwardRef(Form) as <Values = any, As extends ElementType = 'form'>(
  props: FormProps<Values, As> & { ref?: Ref<As> }
) => React.ReactElement;

export default SkyrocForm;
