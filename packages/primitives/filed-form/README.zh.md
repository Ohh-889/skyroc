# Skyroc Form

[English](./README.md) | 简体中文

一个功能强大、类型安全的 React 表单管理库，提供完整的表单状态管理、验证和动态字段支持。

## ✨ 特性

- 🎯 **完整的类型支持** - 基于 TypeScript，提供完整的类型推导和类型安全
- 📦 **轻量级设计** - 核心功能精简，无额外依赖负担
- 🔄 **响应式状态管理** - 高效的表单状态订阅和更新机制
- ✅ **强大的验证系统** - 支持同步/异步验证、内置规则和自定义验证器
- 🎨 **灵活的组件设计** - 支持多态渲染和无头（Headless）模式
- 📝 **动态数组字段** - 完整的数组字段管理（增删改查、排序等）
- 🔌 **Schema 验证支持** - 兼容 Zod、Yup 等主流验证库
- ⚡ **性能优化** - 精确的字段订阅，避免不必要的重渲染
- 🔧 **中间件系统** - 支持扩展和自定义表单行为
- ↩️ **Undo/Redo** - 内置撤销/重做功能

## 📦 安装

```bash
npm install skyroc-form
# 或
pnpm add skyroc-form
# 或
yarn add skyroc-form
```

## 🚀 快速开始

### 基础表单

```tsx
import { Form, Field } from 'skyroc-form';

function BasicForm() {
  return (
    <Form
      initialValues={{ username: '', email: '' }}
      onFinish={values => {
        console.log('表单提交:', values);
      }}
    >
      <Field name="username">
        <input placeholder="用户名" />
      </Field>

      <Field name="email">
        <input
          type="email"
          placeholder="邮箱"
        />
      </Field>

      <button type="submit">提交</button>
    </Form>
  );
}
```

### 带验证的表单

```tsx
import { Form, Field, useForm } from 'skyroc-form';

function ValidatedForm() {
  const [form] = useForm();

  return (
    <Form
      form={form}
      initialValues={{ email: '', password: '' }}
      onFinish={values => console.log('提交成功:', values)}
      onFinishFailed={error => console.log('验证失败:', error)}
    >
      <Field
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' }
        ]}
      >
        <input placeholder="邮箱" />
      </Field>

      <Field
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { minLength: 6, message: '密码至少6位' }
        ]}
      >
        <input
          type="password"
          placeholder="密码"
        />
      </Field>

      <button type="submit">提交</button>
      <button
        type="button"
        onClick={() => form.resetFields()}
      >
        重置
      </button>
    </Form>
  );
}
```

## 📚 核心 API

### 组件

#### `<Form>`

表单容器组件，提供表单上下文和状态管理。

**Props:**

| 属性               | 类型                     | 默认值       | 说明                         |
| ------------------ | ------------------------ | ------------ | ---------------------------- |
| `form`             | `FormInstance`           | -            | 外部表单实例                 |
| `initialValues`    | `object`                 | `{}`         | 初始表单值                   |
| `onFinish`         | `(values) => void`       | -            | 提交成功回调                 |
| `onFinishFailed`   | `(error) => void`        | -            | 提交失败回调                 |
| `onValuesChange`   | `(changed, all) => void` | -            | 值变化回调                   |
| `onFieldsChange`   | `(changed, all) => void` | -            | 字段元数据变化回调           |
| `schema`           | `FormSchema`             | -            | Schema 验证器（支持 Zod 等） |
| `validateTrigger`  | `string \| string[]`     | `'onChange'` | 验证触发事件                 |
| `validateMessages` | `ValidateMessages`       | -            | 自定义验证消息               |
| `preserve`         | `boolean`                | `true`       | 卸载时是否保留字段值         |
| `component`        | `ElementType \| false`   | `'form'`     | 渲染的组件类型               |

**示例:**

```tsx
// 基础用法
<Form initialValues={{ name: 'John' }}>
  {/* 字段 */}
</Form>

// 无头模式（不渲染包裹元素）
<Form component={false}>
  <div className="custom-layout">
    {/* 字段 */}
  </div>
</Form>

// 使用 Schema 验证
const schema = z.object({
  username: z.string().min(3),
  age: z.number().min(18)
});

<Form schema={schema} onFinish={handleSubmit}>
  {/* 字段 */}
</Form>
```

#### `<Field>`

字段组件，用于包裹输入控件并提供状态管理和验证。

**Props:**

| 属性                | 类型                                   | 默认值       | 说明                                  |
| ------------------- | -------------------------------------- | ------------ | ------------------------------------- |
| `name`              | `string`                               | **必填**     | 字段名（支持嵌套路径如 `user.email`） |
| `rules`             | `Rule[]`                               | -            | 验证规则数组                          |
| `initialValue`      | `any`                                  | -            | 字段初始值                            |
| `trigger`           | `string`                               | `'onChange'` | 触发值更新的事件                      |
| `validateTrigger`   | `string \| string[]`                   | -            | 触发验证的事件                        |
| `valuePropName`     | `string`                               | `'value'`    | 值属性名                              |
| `getValueFromEvent` | `(...args) => any`                     | -            | 自定义值提取函数                      |
| `normalize`         | `(value, prevValue, allValues) => any` | -            | 值规范化/转换函数                     |
| `preserve`          | `boolean`                              | `true`       | 卸载时是否保留值                      |

**示例:**

```tsx
// 基础字段
<Field name="username">
  <input />
</Field>

// 带验证规则
<Field
  name="phone"
  rules={[
    { required: true, message: '请输入手机号' },
    { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
  ]}
>
  <input />
</Field>

// 自定义值提取和规范化
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

// 嵌套字段
<Field name="user.profile.email">
  <input type="email" />
</Field>
```

#### `<List>`

动态数组字段管理组件，提供完整的数组操作能力。

**Props:**

| 属性           | 类型                                | 默认值   | 说明       |
| -------------- | ----------------------------------- | -------- | ---------- |
| `name`         | `string`                            | **必填** | 数组字段名 |
| `initialValue` | `any[]`                             | -        | 数组初始值 |
| `children`     | `(fields, operations) => ReactNode` | **必填** | 渲染函数   |

**Operations:**

- `add(value?)` - 添加新项
- `remove(index)` - 移除指定项
- `move(from, to)` - 移动项位置
- `swap(i, j)` - 交换两项位置
- `insert(index, value)` - 在指定位置插入
- `replace(index, value)` - 替换指定项

**示例:**

```tsx
// 基础列表
<List name="users" initialValue={[{ name: '', email: '' }]}>
  {(fields, { add, remove }) => (
    <>
      {fields.map((field) => (
        <div key={field.key}>
          <Field name={`${field.name}.name`}>
            <input placeholder="姓名" />
          </Field>
          <Field name={`${field.name}.email`}>
            <input placeholder="邮箱" />
          </Field>
          <button onClick={() => remove(field.name)}>删除</button>
        </div>
      ))}
      <button onClick={() => add()}>添加用户</button>
    </>
  )}
</List>

// 高级列表操作
<List name="tasks">
  {(fields, { add, remove, move, swap }) => (
    <>
      {fields.map((field, index) => (
        <div key={field.key}>
          <Field name={`${field.name}.title`}>
            <input />
          </Field>
          <button onClick={() => remove(index)}>删除</button>
          <button onClick={() => move(index, index - 1)} disabled={index === 0}>
            上移
          </button>
          <button onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
            下移
          </button>
        </div>
      ))}
      <button onClick={() => add({ title: '' })}>添加任务</button>
    </>
  )}
</List>
```

#### `<ComputedField>`

计算字段组件，根据其他字段值自动计算和更新。

**Props:**

| 属性            | 类型                | 默认值    | 说明             |
| --------------- | ------------------- | --------- | ---------------- |
| `name`          | `string`            | **必填**  | 计算字段名       |
| `deps`          | `string[]`          | **必填**  | 依赖的字段名数组 |
| `compute`       | `(get, all) => any` | **必填**  | 计算函数         |
| `rules`         | `Rule[]`            | -         | 验证规则数组     |
| `valuePropName` | `string`            | `'value'` | 值属性名         |
| `preserve`      | `boolean`           | `true`    | 卸载时是否保留值 |

**示例:**

```tsx
// 计算总价
<Form initialValues={{ quantity: 1, unitPrice: 100 }}>
  <Field name="quantity">
    <input type="number" placeholder="数量" />
  </Field>

  <Field name="unitPrice">
    <input type="number" placeholder="单价" />
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
    <input placeholder="总价（自动计算）" />
  </ComputedField>
</Form>

// 格式化全名
<Form>
  <Field name="firstName">
    <input placeholder="名" />
  </Field>
  <Field name="lastName">
    <input placeholder="姓" />
  </Field>

  <ComputedField
    name="fullName"
    deps={['firstName', 'lastName']}
    compute={(get) => {
      const first = get('firstName') || '';
      const last = get('lastName') || '';
      return `${last}${first}`.trim();
    }}
  >
    <input placeholder="全名（自动生成）" />
  </ComputedField>
</Form>
```

### Hooks

#### `useForm()`

创建表单实例，用于程序化控制表单。

```tsx
const [form] = useForm<FormValues>();

// 表单实例方法
form.getFieldValue('username'); // 获取字段值
form.getFieldsValue(); // 获取所有字段值
form.setFieldValue('username', 'John'); // 设置字段值
form.setFieldsValue({ username: 'John', email: 'john@example.com' });
form.resetFields(); // 重置所有字段
form.resetFields(['username']); // 重置指定字段
form.submit(); // 触发提交
form.validateFields(); // 验证所有字段
form.validateFields(['email']); // 验证指定字段
form.getFieldError('email'); // 获取字段错误
form.getFieldsError(); // 获取所有字段错误
```

#### `useWatch()`

监听表单字段值变化。

```tsx
// 监听单个字段
const username = useWatch('username', { form });

// 监听多个字段
const { email, phone } = useWatch(['email', 'phone'], { form });

// 监听所有字段
const allValues = useWatch(form);

// 在表单内部使用（自动获取表单实例）
function FormContent() {
  const values = useWatch(); // 无需传入 form
  return <div>{JSON.stringify(values)}</div>;
}
```

#### `useFieldState()`

获取字段的完整状态（值、错误、验证状态等）。

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

获取字段错误信息。

```tsx
const error = useFieldError('email', { form });
```

#### `useArrayField()`

用于数组字段的操作 Hook，提供完整的数组操作能力。

```tsx
const { fields, add, remove, move, swap, insert, replace } = useArrayField('users', form);

// 返回值说明
// fields: ListRenderItem[] - 数组字段项列表（带稳定 key）
// add: (value?) => void - 添加新项
// remove: (index) => void - 移除指定项
// move: (from, to) => void - 移动项位置
// swap: (i, j) => void - 交换两项
// insert: (index, value) => void - 在指定位置插入
// replace: (index, value) => void - 替换指定项
```

**示例:**

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
            <input placeholder="任务标题" />
          </Field>
          <button onClick={() => remove(index)}>删除</button>
          <button onClick={() => move(index, index - 1)}>上移</button>
        </div>
      ))}
      <button onClick={() => add({ title: '' })}>添加任务</button>
    </Form>
  );
}
```

#### `useFieldEffect()`

创建响应式副作用，当指定字段变化时执行自定义逻辑。

```tsx
useFieldEffect(
  deps: string[],           // 依赖的字段名数组
  effect: (get, all) => void, // 副作用函数
  form?: FormInstance       // 可选的表单实例
);
```

**示例:**

```tsx
function UserForm() {
  const [form] = useForm();

  // 监听用户名变化并记录日志
  useFieldEffect(
    ['firstName', 'lastName'],
    get => {
      const firstName = get('firstName');
      const lastName = get('lastName');
      console.log(`姓名变更为: ${firstName} ${lastName}`);
    },
    form
  );

  // 监听国家变化并清空城市
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
        <input placeholder="名" />
      </Field>
      <Field name="lastName">
        <input placeholder="姓" />
      </Field>
      <Field name="country">
        <select>{/* 国家选项 */}</select>
      </Field>
      <Field name="city">
        <select>{/* 城市选项 */}</select>
      </Field>
    </Form>
  );
}
```

#### `useSelector()`

选择和订阅派生的表单状态，只在选中的值变化时触发重渲染。

```tsx
const value = useSelector<Values, Result>(
  selector: (get, all) => Result, // 选择器函数
  options?: {
    deps?: string[];              // 依赖字段（空数组表示所有字段）
    form?: FormInstance;          // 表单实例
    eq?: (a, b) => boolean;       // 自定义相等比较函数
    mask?: ChangeMask;            // 订阅的变化类型掩码
    includeChildren?: boolean;    // 是否包含子字段变化
  }
);
```

**示例:**

```tsx
// 计算购物车总价
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
                  <input placeholder="商品名称" />
                </Field>
                <Field name={`${field.name}.price`}>
                  <input
                    type="number"
                    placeholder="单价"
                  />
                </Field>
                <Field name={`${field.name}.quantity`}>
                  <input
                    type="number"
                    placeholder="数量"
                  />
                </Field>
                <button onClick={() => remove(field.name)}>删除</button>
              </div>
            ))}
            <button onClick={() => add({ name: '', price: 0, quantity: 1 })}>添加商品</button>
          </>
        )}
      </List>
      <div>总价: ¥{total.toFixed(2)}</div>
    </Form>
  );
}

// 使用自定义相等比较（避免对象引用变化导致的重渲染）
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
        // 深度相等比较
        return a.name === b.name && a.age === b.age && a.email === b.email;
      }
    }
  );

  return <div>{JSON.stringify(userInfo)}</div>;
}
```

#### `useUndoRedo()`

撤销/重做功能。

```tsx
const { undo, redo, canUndo, canRedo } = useUndoRedo({ form });
```

## 🎯 验证规则

### 内置验证类型

```tsx
<Field
  name="field"
  rules={[
    // 必填
    { required: true, message: '此字段必填' },

    // 类型验证
    { type: 'email', message: '邮箱格式不正确' },
    { type: 'url', message: 'URL 格式不正确' },
    { type: 'number', message: '必须是数字' },
    { type: 'integer', message: '必须是整数' },
    { type: 'float', message: '必须是浮点数' },
    { type: 'boolean', message: '必须是布尔值' },
    { type: 'date', message: '必须是日期' },
    { type: 'hex', message: '必须是十六进制颜色' },
    { type: 'regexp', message: '必须是正则表达式' },

    // 字符串长度
    { minLength: 3, message: '至少 3 个字符' },
    { maxLength: 20, message: '最多 20 个字符' },
    { len: 11, message: '必须是 11 位' },

    // 数值范围
    { min: 0, max: 100, message: '必须在 0-100 之间' },

    // 正则匹配
    { pattern: /^[a-zA-Z]+$/, message: '只能包含字母' },

    // 枚举值
    { type: 'enum', enum: ['admin', 'user', 'guest'], message: '角色不正确' },

    // 仅警告（不阻止提交）
    { minLength: 8, message: '密码较弱，建议至少 8 位', warningOnly: true },

    // 空格验证
    { whitespace: true, message: '不能只包含空格' },

    // 自定义验证器
    {
      validator: async (rule, value, allValues) => {
        if (value !== allValues.password) {
          return '两次密码不一致';
        }
      }
    },

    // 值转换
    {
      type: 'string',
      transform: value => value?.trim(),
      message: '无效的字符串'
    }
  ]}
>
  <input />
</Field>
```

### 验证模式

```tsx
// 串行验证（遇到第一个错误即停止）
form.validateFields({ mode: 'serial' });

// 并行验证（收集所有错误）
form.validateFields({ mode: 'parallelAll' });

// 并行验证（返回第一个错误）
form.validateFields({ mode: 'parallelFirst' });
```

### Schema 验证

```tsx
import { z } from 'zod';

const schema = z
  .object({
    username: z.string().min(3, '用户名至少 3 个字符'),
    email: z.string().email('邮箱格式不正确'),
    age: z.number().min(18, '必须年满 18 岁'),
    password: z.string().min(8, '密码至少 8 位'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword']
  });

<Form
  schema={schema}
  onFinish={handleSubmit}
>
  {/* 字段 */}
</Form>;
```

## 🔧 高级用法

### 条件字段显示/禁用

```tsx
function ConditionalFields() {
  const [form] = useForm();
  const userType = useWatch('userType', { form });

  return (
    <Form form={form}>
      <Field name="userType">
        <select>
          <option value="individual">个人</option>
          <option value="company">企业</option>
        </select>
      </Field>

      {userType === 'company' && (
        <Field name="companyName">
          <input placeholder="公司名称" />
        </Field>
      )}
    </Form>
  );
}
```

### 表单联动

```tsx
function LinkedFields() {
  const [form] = useForm();

  return (
    <Form form={form}>
      <Field
        name="country"
        onChange={value => {
          // 国家变化时清空城市
          form.setFieldValue('city', undefined);
        }}
      >
        <select>{/* 国家选项 */}</select>
      </Field>

      <Field name="city">
        <select>{/* 根据国家动态加载城市 */}</select>
      </Field>
    </Form>
  );
}
```

### 中间件系统

```tsx
// 创建日志中间件
const loggerMiddleware = (action, next) => {
  console.log('Action:', action);
  const result = next(action);
  console.log('Result:', result);
  return result;
};

const [form] = useForm();
form.use(loggerMiddleware);
```

### 嵌套表单

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

## 🎨 TypeScript 支持

完整的类型推导和类型安全：

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

  // ✅ 类型安全
  const username = form.getFieldValue('username'); // string
  const age = form.getFieldValue('profile.age'); // number

  // ✅ 自动补全
  form.setFieldsValue({
    username: 'John',
    profile: { age: 25, bio: 'Developer' }
  });

  return (
    <Form<FormValues>
      form={form}
      onFinish={values => {
        // values 已完全类型化
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

## 📖 最佳实践

### 1. 使用外部表单实例进行程序化控制

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
      {/* 字段 */}
      <button
        type="button"
        onClick={handleReset}
      >
        重置
      </button>
      <button
        type="button"
        onClick={handleFill}
      >
        填充
      </button>
    </Form>
  );
}
```

### 2. 合理使用 useWatch 避免不必要的渲染

```tsx
// ❌ 不好：整个组件都会在任何字段变化时重渲染
function BadExample() {
  const values = useWatch();
  return <div>{values.someField}</div>;
}

// ✅ 好：只在 someField 变化时重渲染
function GoodExample() {
  const someField = useWatch('someField');
  return <div>{someField}</div>;
}
```

### 3. 复杂验证使用自定义验证器

```tsx
<Field
  name="password"
  rules={[
    {
      validator: async (rule, value) => {
        // 异步验证：检查密码强度
        const strength = await checkPasswordStrength(value);
        if (strength < 3) {
          return '密码强度不够';
        }
      }
    }
  ]}
>
  <input type="password" />
</Field>
```

## 🤝 与 UI 库集成

Skyroc Form 可以与任何 UI 库无缝集成：

```tsx
// 与 Ant Design 集成
import { Input, Button } from 'antd';

<Form>
  <Field name="username">
    <Input placeholder="用户名" />
  </Field>
  <Button
    type="primary"
    htmlType="submit"
  >
    提交
  </Button>
</Form>;

// 与 Material-UI 集成
import { TextField, Button } from '@mui/material';

<Form>
  <Field name="email">
    <TextField label="邮箱" />
  </Field>
  <Button type="submit">提交</Button>
</Form>;
```

## 📄 License

MIT License

## 🔗 相关链接

- [GitHub Repository](https://github.com/Ohh-889/skyroc-ui)
- [Issue Tracker](https://github.com/Ohh-889/skyroc-ui/issues)
