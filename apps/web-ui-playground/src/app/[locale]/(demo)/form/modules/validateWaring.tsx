'use client';

import { Button, Form, FormField, useFieldState, useForm } from '@skyroc/web-ui';
import { useEffect } from 'react';
import { DemoInput } from './DemoComponents';
import { showToastCode } from './toast';

interface Inputs {
  age: number;
  email: string;
  username: string;
}

const ValidateOnlyDemo = () => {
  const [form] = useForm<Inputs>();

  const fieldsState = useFieldState(['email', 'username'], { form, mask: { warnings: true } });

  async function validateOnly() {
    await form.validateFields();
    const result = form.getFieldsWarning();

    showToastCode('warning result', result);
  }

  useEffect(() => {
    showToastCode('warnings', fieldsState);
  }, [fieldsState]);

  return (
    <Form
      className="w-[480px] space-y-4 max-sm:w-full"
      form={form}
    >
      <FormField
        label="Username"
        name="username"
        rules={[
          { message: 'Username is required', required: true, warningOnly: true },
          { message: 'Username must be at least 4 characters', minLength: 4, warningOnly: true }
        ]}
      >
        <DemoInput
          name="username"
          placeholder="Username"
        />
      </FormField>

      <FormField
        label="Age"
        name="age"
        rules={[
          { message: 'Age is required', required: true },
          { message: 'Age must be at least 18', min: 18, type: 'number', warningOnly: true },
          { max: 35, message: 'Age must be less than 35', type: 'number', warningOnly: true }
        ]}
      >
        <DemoInput
          name="age"
          placeholder="Age"
        />
      </FormField>

      <FormField
        label="Email"
        name="email"
        rules={[
          { message: 'Please enter a valid email', type: 'email', warningOnly: true },
          { message: 'Email is required', required: true }
        ]}
      >
        <DemoInput
          name="email"
          placeholder="Email"
        />
      </FormField>

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={validateOnly}
        >
          Validate Only
        </Button>

        <Button type="submit">Submit (Normal)</Button>
      </div>
    </Form>
  );
};

export default ValidateOnlyDemo;
