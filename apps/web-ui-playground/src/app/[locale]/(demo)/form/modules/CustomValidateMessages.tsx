'use client';

/* oxlint-disable no-template-curly-in-string */
'use client';

import { Button, Form, FormField, Input, useForm } from '@skyroc/web-ui';

// Form field types
interface Inputs {
  age: number;
  email: string;
  username: string;
}

const initialValues: Inputs = {
  age: 0,
  email: '',
  username: ''
};

const ValidateMessagesDemo = () => {
  const [form] = useForm<Inputs>();

  return (
    <Form
      className="w-[480px] space-y-4 max-sm:w-full"
      form={form}
      initialValues={initialValues}
      validateMessages={{
        number: {
          min: 'This field must be greater than ${min}'
        },
        required: 'This field must be required'
      }}
    >
      <FormField
        label="Username"
        name="username"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter username" />
      </FormField>

      <FormField
        label="Age"
        name="age"
        rules={[{ min: 18, required: true, type: 'number' }]}
      >
        <Input
          placeholder="Enter age"
          type="number"
        />
      </FormField>

      <FormField
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email' }]}
      >
        <Input placeholder="Enter email" />
      </FormField>

      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
};

export default ValidateMessagesDemo;
