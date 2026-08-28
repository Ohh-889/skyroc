'use client';

import { Button, Form, FormField, Input, useForm } from '@skyroc/web-ui';
import React from 'react';

interface Inputs {
  info: { city: string; company: string };
  password: string;
  username: string;
}

const initialValues = {
  info: {
    city: 'Beijing'
  },
  password: '22333'
};

const Reset = () => {
  const [form] = useForm<Inputs>();

  const handleReset = () => {
    form.resetFields();
  };

  const handleResetUsername = () => {
    form.resetFields(['username']);
  };

  return (
    <Form
      className="w-[480px] space-y-4 max-sm:w-full"
      form={form}
      initialValues={initialValues}
    >
      <FormField
        label="Username"
        name="username"
      >
        <Input placeholder="Enter username" />
      </FormField>

      <FormField
        label="Password"
        name="password"
      >
        <Input placeholder="Enter password" />
      </FormField>

      <FormField
        label="Info&City"
        name="info.city"
      >
        <Input placeholder="Enter info.city" />
      </FormField>

      <FormField
        label="Info&Company"
        name="info.company"
      >
        <Input placeholder="Enter info.company" />
      </FormField>

      <div className="flex gap-x-1">
        <Button onClick={handleReset}>Reset All</Button>
        <Button onClick={handleResetUsername}>Reset Username</Button>
      </div>
    </Form>
  );
};

export default Reset;
