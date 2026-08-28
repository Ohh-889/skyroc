# Skyroc Form

English | [简体中文](./README.zh.md)

A powerful, type-safe React form management library with complete form state management, validation, and dynamic field support.

## ✨ Features

- 🎯 **Full TypeScript Support** - Built with TypeScript, providing complete type inference and type safety
- 📦 **Lightweight Design** - Minimal core functionality without extra dependency burden
- 🔄 **Reactive State Management** - Efficient form state subscription and update mechanism
- ✅ **Powerful Validation System** - Supports sync/async validation, built-in rules, and custom validators
- 🎨 **Flexible Component Design** - Supports polymorphic rendering and headless mode
- 📝 **Dynamic Array Fields** - Complete array field management (CRUD, sorting, etc.)
- 🔌 **Schema Validation Support** - Compatible with mainstream validation libraries like Zod, Yup, etc.
- ⚡ **Performance Optimized** - Precise field subscription to avoid unnecessary re-renders
- 🔧 **Middleware System** - Supports extension and custom form behavior
- ↩️ **Undo/Redo** - Built-in undo/redo functionality

## 📦 Installation

```bash
npm install skyroc-form
# or
pnpm add skyroc-form
# or
yarn add skyroc-form
```

## 🚀 Quick Start

### Basic Form

```tsx
import { Form, Field } from 'skyroc-form';

function BasicForm() {
  return (
    <Form
      initialValues={{ username: '', email: '' }}
      onFinish={values => {
        console.log('Form submitted:', values);
      }}
    >
      <Field name="username">
        <input placeholder="Username" />
      </Field>

      <Field name="email">
        <input
          type="email"
          placeholder="Email"
        />
      </Field>

      <button type="submit">Submit</button>
    </Form>
  );
}
```

### Form with Validation

```tsx
import { Form, Field, useForm } from 'skyroc-form';

function ValidatedForm() {
  const [form] = useForm();

  return (
    <Form
      form={form}
      initialValues={{ email: '', password: '' }}
      onFinish={values => console.log('Submit success:', values)}
      onFinishFailed={error => console.log('Validation failed:', error)}
    >
      <Field
        name="email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Invalid email format' }
        ]}
      >
        <input placeholder="Email" />
      </Field>

      <Field
        name="password"
        rules={[
          { required: true, message: 'Please enter password' },
          { minLength: 6, message: 'Password must be at least 6 characters' }
        ]}
      >
        <input
          type="password"
          placeholder="Password"
        />
      </Field>

      <button type="submit">Submit</button>
      <button
        type="button"
        onClick={() => form.resetFields()}
      >
        Reset
      </button>
    </Form>
  );
}
```

## 📚 Core API

### Components

#### `<Form>`

Form container component that provides form context and state management.

**Props:**

| Property           | Type                     | Default      | Description                                 |
| ------------------ | ------------------------ | ------------ | ------------------------------------------- |
| `form`             | `FormInstance`           | -            | External form instance                      |
| `initialValues`    | `object`                 | `{}`         | Initial form values                         |
| `onFinish`         | `(values) => void`       | -            | Callback on successful submission           |
| `onFinishFailed`   | `(error) => void`        | -            | Callback on failed submission               |
| `onValuesChange`   | `(changed, all) => void` | -            | Callback on value changes                   |
| `onFieldsChange`   | `(changed, all) => void` | -            | Callback on field metadata changes          |
| `schema`           | `FormSchema`             | -            | Schema validator (supports Zod, etc.)       |
| `validateTrigger`  | `string \| string[]`     | `'onChange'` | Validation trigger event                    |
| `validateMessages` | `ValidateMessages`       | -            | Custom validation messages                  |
| `preserve`         | `boolean`                | `true`       | Whether to preserve field values on unmount |
| `component`        | `ElementType \| false`   | `'form'`     | Component type to render as                 |

**Examples:**

```tsx
// Basic usage
<Form initialValues={{ name: 'John' }}>
  {/* Fields */}
</Form>

// Headless mode (no wrapper element)
<Form component={false}>
  <div className="custom-layout">
    {/* Fields */}
  </div>
</Form>

// Using Schema validation
const schema = z.object({
  username: z.string().min(3),
  age: z.number().min(18)
});

<Form schema={schema} onFinish={handleSubmit}>
  {/* Fields */}
</Form>
```

#### `<Field>`

Field component for wrapping input controls with state management and validation.

**Props:**

| Property            | Type                                   | Default      | Description                                          |
| ------------------- | -------------------------------------- | ------------ | ---------------------------------------------------- |
| `name`              | `string`                               | **Required** | Field name (supports nested paths like `user.email`) |
| `rules`             | `Rule[]`                               | -            | Array of validation rules                            |
| `initialValue`      | `any`                                  | -            | Initial field value                                  |
| `trigger`           | `string`                               | `'onChange'` | Event that triggers value update                     |
| `validateTrigger`   | `string \| string[]`                   | -            | Event(s) that trigger validation                     |
| `valuePropName`     | `string`                               | `'value'`    | Name of the value prop                               |
| `getValueFromEvent` | `(...args) => any`                     | -            | Custom value extraction function                     |
| `normalize`         | `(value, prevValue, allValues) => any` | -            | Value normalization/transformation function          |
| `preserve`          | `boolean`                              | `true`       | Whether to preserve value on unmount                 |

**Examples:**

```tsx
// Basic field
<Field name="username">
  <input />
</Field>

// With validation rules
<Field
  name="phone"
  rules={[
    { required: true, message: 'Please enter phone number' },
    { pattern: /^1\d{10}$/, message: 'Invalid phone format' }
  ]}
>
  <input />
</Field>

// Custom value extraction and normalization
<Field
  name="phone"
  getValueFromEvent={(e) => e.target.value.replace(/\D/g, '')}
  normalize={(value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : value;
  }}
>
  <input placeholder="138-0013-8000" />
</Field>

// Nested field
<Field name="user.profile.email">
  <input type="email" />
</Field>
```

#### `<List>`

Dynamic array field management component with complete array operations.

**Props:**

| Property       | Type                                | Default      | Description         |
| -------------- | ----------------------------------- | ------------ | ------------------- |
| `name`         | `string`                            | **Required** | Array field name    |
| `initialValue` | `any[]`                             | -            | Initial array value |
| `children`     | `(fields, operations) => ReactNode` | **Required** | Render function     |

**Operations:**

- `add(value?)` - Add new item
- `remove(index)` - Remove item at index
- `move(from, to)` - Move item position
- `swap(i, j)` - Swap two items
- `insert(index, value)` - Insert at specific position
- `replace(index, value)` - Replace item at index

**Examples:**

```tsx
// Basic list
<List name="users" initialValue={[{ name: '', email: '' }]}>
  {(fields, { add, remove }) => (
    <>
      {fields.map((field) => (
        <div key={field.key}>
          <Field name={`${field.name}.name`}>
            <input placeholder="Name" />
          </Field>
          <Field name={`${field.name}.email`}>
            <input placeholder="Email" />
          </Field>
          <button onClick={() => remove(field.name)}>Remove</button>
        </div>
      ))}
      <button onClick={() => add()}>Add User</button>
    </>
  )}
</List>

// Advanced list operations
<List name="tasks">
  {(fields, { add, remove, move, swap }) => (
    <>
      {fields.map((field, index) => (
        <div key={field.key}>
          <Field name={`${field.name}.title`}>
            <input />
          </Field>
          <button onClick={() => remove(index)}>Delete</button>
          <button onClick={() => move(index, index - 1)} disabled={index === 0}>
            Move Up
          </button>
          <button onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
            Move Down
          </button>
        </div>
      ))}
      <button onClick={() => add({ title: '' })}>Add Task</button>
    </>
  )}
</List>
```

#### `<ComputedField>`

Computed field component that automatically calculates and updates based on other field values.

**Props:**

| Property        | Type                | Default      | Description                          |
| --------------- | ------------------- | ------------ | ------------------------------------ |
| `name`          | `string`            | **Required** | Computed field name                  |
| `deps`          | `string[]`          | **Required** | Array of dependent field names       |
| `compute`       | `(get, all) => any` | **Required** | Compute function                     |
| `rules`         | `Rule[]`            | -            | Validation rules array               |
| `valuePropName` | `string`            | `'value'`    | Name of the value prop               |
| `preserve`      | `boolean`           | `true`       | Whether to preserve value on unmount |

**Examples:**

```tsx
// Calculate total price
<Form initialValues={{ quantity: 1, unitPrice: 100 }}>
  <Field name="quantity">
    <input type="number" placeholder="Quantity" />
  </Field>

  <Field name="unitPrice">
    <input type="number" placeholder="Unit Price" />
  </Field>

  <ComputedField
    name="totalPrice"
    deps={['quantity', 'unitPrice']}
    compute={(get) => {
      const quantity = get('quantity') || 0;
      const unitPrice = get('unitPrice') || 0;
      return quantity * unitPrice;
    }}
  >
    <input placeholder="Total Price (auto-calculated)" />
  </ComputedField>
</Form>

// Format full name
<Form>
  <Field name="firstName">
    <input placeholder="First Name" />
  </Field>
  <Field name="lastName">
    <input placeholder="Last Name" />
  </Field>

  <ComputedField
    name="fullName"
    deps={['firstName', 'lastName']}
    compute={(get) => {
      const first = get('firstName') || '';
      const last = get('lastName') || '';
      return `${first} ${last}`.trim();
    }}
  >
    <input placeholder="Full Name (auto-generated)" />
  </ComputedField>
</Form>
```

### Hooks

#### `useForm()`

Create a form instance for programmatic form control.

```tsx
const [form] = useForm<FormValues>();

// Form instance methods
form.getFieldValue('username'); // Get field value
form.getFieldsValue(); // Get all field values
form.setFieldValue('username', 'John'); // Set field value
form.setFieldsValue({ username: 'John', email: 'john@example.com' });
form.resetFields(); // Reset all fields
form.resetFields(['username']); // Reset specific fields
form.submit(); // Trigger submission
form.validateFields(); // Validate all fields
form.validateFields(['email']); // Validate specific fields
form.getFieldError('email'); // Get field error
form.getFieldsError(); // Get all field errors
```

#### `useWatch()`

Watch form field value changes.

```tsx
// Watch single field
const username = useWatch('username', { form });

// Watch multiple fields
const { email, phone } = useWatch(['email', 'phone'], { form });

// Watch all fields
const allValues = useWatch(form);

// Use inside form (automatically gets form instance)
function FormContent() {
  const values = useWatch(); // No need to pass form
  return <div>{JSON.stringify(values)}</div>;
}
```

#### `useFieldState()`

Get complete field state (value, errors, validation state, etc.).

```tsx
const fieldState = useFieldState('email', { form });
// {
//   value: 'test@example.com',
//   errors: [],
//   warnings: [],
//   validating: false,
//   validated: true,
//   touched: true
// }
```

#### `useFieldError()`

Get field error information.

```tsx
const error = useFieldError('email', { form });
```

#### `useArrayField()`

Hook for array field operations, providing complete array operation capabilities.

```tsx
const { fields, add, remove, move, swap, insert, replace } = useArrayField('users', form);

// Return values
// fields: ListRenderItem[] - Array field items list (with stable keys)
// add: (value?) => void - Add new item
// remove: (index) => void - Remove item at index
// move: (from, to) => void - Move item position
// swap: (i, j) => void - Swap two items
// insert: (index, value) => void - Insert at specific position
// replace: (index, value) => void - Replace item at index
```

**Examples:**

```tsx
function TodoList() {
  const [form] = useForm();
  const { fields, add, remove, move } = useArrayField('todos', form);

  return (
    <Form
      form={form}
      initialValues={{ todos: [] }}
    >
      {fields.map((field, index) => (
        <div key={field.key}>
          <Field name={`${field.name}.title`}>
            <input placeholder="Task Title" />
          </Field>
          <button onClick={() => remove(index)}>Delete</button>
          <button onClick={() => move(index, index - 1)}>Move Up</button>
        </div>
      ))}
      <button onClick={() => add({ title: '' })}>Add Task</button>
    </Form>
  );
}
```

#### `useFieldEffect()`

Create reactive side effects that execute custom logic when specified fields change.

```tsx
useFieldEffect(
  deps: string[],           // Array of dependent field names
  effect: (get, all) => void, // Effect function
  form?: FormInstance       // Optional form instance
);
```

**Examples:**

```tsx
function UserForm() {
  const [form] = useForm();

  // Log when username changes
  useFieldEffect(
    ['firstName', 'lastName'],
    get => {
      const firstName = get('firstName');
      const lastName = get('lastName');
      console.log(`Name changed to: ${firstName} ${lastName}`);
    },
    form
  );

  // Clear city when country changes
  useFieldEffect(
    ['country'],
    (get, all) => {
      const country = get('country');
      if (country !== all.previousCountry) {
        form.setFieldValue('city', undefined);
      }
    },
    form
  );

  return (
    <Form form={form}>
      <Field name="firstName">
        <input placeholder="First Name" />
      </Field>
      <Field name="lastName">
        <input placeholder="Last Name" />
      </Field>
      <Field name="country">
        <select>{/* Country options */}</select>
      </Field>
      <Field name="city">
        <select>{/* City options */}</select>
      </Field>
    </Form>
  );
}
```

#### `useSelector()`

Select and subscribe to derived form state, only triggering re-renders when the selected value changes.

```tsx
const value = useSelector<Values, Result>(
  selector: (get, all) => Result, // Selector function
  options?: {
    deps?: string[];              // Dependent fields (empty array = all fields)
    form?: FormInstance;          // Form instance
    eq?: (a, b) => boolean;       // Custom equality comparison function
    mask?: ChangeMask;            // Change type bitmask to subscribe to
    includeChildren?: boolean;    // Whether to include child field changes
  }
);
```

**Examples:**

```tsx
// Calculate shopping cart total
function ShoppingCart() {
  const total = useSelector(
    get => {
      const items = get('items') || [];
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    { deps: ['items'] }
  );

  return (
    <Form>
      <List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(field => (
              <div key={field.key}>
                <Field name={`${field.name}.name`}>
                  <input placeholder="Product Name" />
                </Field>
                <Field name={`${field.name}.price`}>
                  <input
                    type="number"
                    placeholder="Price"
                  />
                </Field>
                <Field name={`${field.name}.quantity`}>
                  <input
                    type="number"
                    placeholder="Quantity"
                  />
                </Field>
                <button onClick={() => remove(field.name)}>Delete</button>
              </div>
            ))}
            <button onClick={() => add({ name: '', price: 0, quantity: 1 })}>Add Product</button>
          </>
        )}
      </List>
      <div>Total: ${total.toFixed(2)}</div>
    </Form>
  );
}

// Use custom equality comparison (avoid re-renders from object reference changes)
function UserProfile() {
  const userInfo = useSelector(
    get => ({
      name: get('name'),
      age: get('age'),
      email: get('email')
    }),
    {
      deps: ['name', 'age', 'email'],
      eq: (a, b) => {
        // Deep equality comparison
        return a.name === b.name && a.age === b.age && a.email === b.email;
      }
    }
  );

  return <div>{JSON.stringify(userInfo)}</div>;
}
```

#### `useUndoRedo()`

Undo/redo functionality.

```tsx
const { undo, redo, canUndo, canRedo } = useUndoRedo({ form });
```

## 🎯 Validation Rules

### Built-in Validation Types

```tsx
<Field
  name="field"
  rules={[
    // Required
    { required: true, message: 'This field is required' },

    // Type validation
    { type: 'email', message: 'Invalid email format' },
    { type: 'url', message: 'Invalid URL format' },
    { type: 'number', message: 'Must be a number' },
    { type: 'integer', message: 'Must be an integer' },
    { type: 'float', message: 'Must be a float' },
    { type: 'boolean', message: 'Must be a boolean' },
    { type: 'date', message: 'Must be a date' },
    { type: 'hex', message: 'Must be a hex color' },
    { type: 'regexp', message: 'Must be a regular expression' },

    // String length
    { minLength: 3, message: 'At least 3 characters' },
    { maxLength: 20, message: 'At most 20 characters' },
    { len: 11, message: 'Must be 11 digits' },

    // Number range
    { min: 0, max: 100, message: 'Must be between 0-100' },

    // Pattern matching
    { pattern: /^[a-zA-Z]+$/, message: 'Letters only' },

    // Enum values
    { type: 'enum', enum: ['admin', 'user', 'guest'], message: 'Invalid role' },

    // Warning only (doesn't block submission)
    { minLength: 8, message: 'Weak password, at least 8 characters recommended', warningOnly: true },

    // Whitespace validation
    { whitespace: true, message: 'Cannot contain only whitespace' },

    // Custom validator
    {
      validator: async (rule, value, allValues) => {
        if (value !== allValues.password) {
          return 'Passwords do not match';
        }
      }
    },

    // Value transformation
    {
      type: 'string',
      transform: value => value?.trim(),
      message: 'Invalid string'
    }
  ]}
>
  <input />
</Field>
```

### Validation Modes

```tsx
// Serial validation (stops at first error)
form.validateFields({ mode: 'serial' });

// Parallel validation (collect all errors)
form.validateFields({ mode: 'parallelAll' });

// Parallel validation (return first error)
form.validateFields({ mode: 'parallelFirst' });
```

### Schema Validation

```tsx
import { z } from 'zod';

const schema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    age: z.number().min(18, 'Must be at least 18 years old'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

<Form
  schema={schema}
  onFinish={handleSubmit}
>
  {/* Fields */}
</Form>;
```

## 🔧 Advanced Usage

### Conditional Fields

```tsx
function ConditionalFields() {
  const [form] = useForm();
  const userType = useWatch('userType', { form });

  return (
    <Form form={form}>
      <Field name="userType">
        <select>
          <option value="individual">Individual</option>
          <option value="company">Company</option>
        </select>
      </Field>

      {userType === 'company' && (
        <Field name="companyName">
          <input placeholder="Company Name" />
        </Field>
      )}
    </Form>
  );
}
```

### Field Dependencies

```tsx
function LinkedFields() {
  const [form] = useForm();

  return (
    <Form form={form}>
      <Field
        name="country"
        onChange={value => {
          // Clear city when country changes
          form.setFieldValue('city', undefined);
        }}
      >
        <select>{/* Country options */}</select>
      </Field>

      <Field name="city">
        <select>{/* Dynamically load cities based on country */}</select>
      </Field>
    </Form>
  );
}
```

### Middleware System

```tsx
// Create logger middleware
const loggerMiddleware = (action, next) => {
  console.log('Action:', action);
  const result = next(action);
  console.log('Result:', result);
  return result;
};

const [form] = useForm();
form.use(loggerMiddleware);
```

### Nested Forms

```tsx
<Form>
  <Field name="user.profile.firstName">
    <input />
  </Field>
  <Field name="user.profile.lastName">
    <input />
  </Field>
  <Field name="user.contact.email">
    <input />
  </Field>
</Form>
```

## 🎨 TypeScript Support

Complete type inference and type safety:

```tsx
interface FormValues {
  username: string;
  email: string;
  profile: {
    age: number;
    bio: string;
  };
  hobbies: string[];
}

function TypedForm() {
  const [form] = useForm<FormValues>();

  // ✅ Type safe
  const username = form.getFieldValue('username'); // string
  const age = form.getFieldValue('profile.age'); // number

  // ✅ Auto-completion
  form.setFieldsValue({
    username: 'John',
    profile: { age: 25, bio: 'Developer' }
  });

  return (
    <Form<FormValues>
      form={form}
      onFinish={values => {
        // values are fully typed
        console.log(values.username); // ✅
        console.log(values.profile.age); // ✅
      }}
    >
      <Field<FormValues> name="username">
        <input />
      </Field>
      <Field<FormValues> name="profile.age">
        <input type="number" />
      </Field>
    </Form>
  );
}
```

## 📖 Best Practices

### 1. Use External Form Instance for Programmatic Control

```tsx
function MyForm() {
  const [form] = useForm();

  const handleReset = () => {
    form.resetFields();
  };

  const handleFill = () => {
    form.setFieldsValue({
      username: 'admin',
      email: 'admin@example.com'
    });
  };

  return (
    <Form form={form}>
      {/* Fields */}
      <button
        type="button"
        onClick={handleReset}
      >
        Reset
      </button>
      <button
        type="button"
        onClick={handleFill}
      >
        Fill
      </button>
    </Form>
  );
}
```

### 2. Use useWatch Wisely to Avoid Unnecessary Renders

```tsx
// ❌ Bad: Entire component re-renders on any field change
function BadExample() {
  const values = useWatch();
  return <div>{values.someField}</div>;
}

// ✅ Good: Only re-renders when someField changes
function GoodExample() {
  const someField = useWatch('someField');
  return <div>{someField}</div>;
}
```

### 3. Use Custom Validators for Complex Validation

```tsx
<Field
  name="password"
  rules={[
    {
      validator: async (rule, value) => {
        // Async validation: check password strength
        const strength = await checkPasswordStrength(value);
        if (strength < 3) {
          return 'Password strength is insufficient';
        }
      }
    }
  ]}
>
  <input type="password" />
</Field>
```

## 🤝 Integration with UI Libraries

Skyroc Form seamlessly integrates with any UI library:

```tsx
// Integration with Ant Design
import { Input, Button } from 'antd';

<Form>
  <Field name="username">
    <Input placeholder="Username" />
  </Field>
  <Button
    type="primary"
    htmlType="submit"
  >
    Submit
  </Button>
</Form>;

// Integration with Material-UI
import { TextField, Button } from '@mui/material';

<Form>
  <Field name="email">
    <TextField label="Email" />
  </Field>
  <Button type="submit">Submit</Button>
</Form>;
```

## 📄 License

MIT License

## 🔗 Links

- [GitHub Repository](https://github.com/Ohh-889/skyroc-ui)
- [Issue Tracker](https://github.com/Ohh-889/skyroc-ui/issues)
