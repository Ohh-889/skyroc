'use client';

import { Button, Form, FormField, Input, useForm } from '@skyroc/web-ui';
import { z } from 'zod';

// Define Zod Schema
const zodSchema = z.object({
  email: z.email('email is not valid'),
  info: z.object({
    password: z.string().min(3, 'password is not valid')
  }),
  username: z.string().min(3, 'username is not valid')
});

interface Inputs {
  email: string;
  info: {
    password: string;
  };
  username: string;
}

const initialValues: Inputs = {
  email: '',
  info: {
    password: ''
  },
  username: ''
};

const ZodResolverDemo = () => {
  const [form] = useForm<Inputs>();

  return (
    <Form
      className="w-[480px] space-y-4 max-sm:w-full"
      form={form}
      initialValues={initialValues}
      schema={zodSchema}
    >
      <FormField
        label="Username"
        name="username"
      >
        <Input />
      </FormField>

      <FormField
        label="Email"
        name="email"
      >
        <Input />
      </FormField>

      <FormField
        label="Password"
        name="info.password"
      >
        <Input />
      </FormField>

      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
};

export default ZodResolverDemo;
