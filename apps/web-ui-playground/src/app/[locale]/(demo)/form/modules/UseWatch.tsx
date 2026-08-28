'use client';

import { Form, FormField, Input, useForm, useWatch } from '@skyroc/web-ui';
import React, { useEffect } from 'react';
import { showToastCode } from './toast';

interface Inputs {
  age: number;
  info: { city: string; company: string };
  password: string;
  username: string;
}

const EffectWatch = () => {
  const values = useWatch<Inputs>();

  console.log('values', values);

  return null;
};

const WatchDemo = () => {
  const [form] = useForm<Inputs>();

  // 1) Watch single field
  const username = useWatch('username', { form });

  // 2) Watch multiple fields
  const { age, password } = useWatch(['age', 'password'], { form });

  // 3) Watch nested fields
  const info = useWatch('info', { form, includeChildren: true });

  const { age: NewAge, password: NewPassword, username: NewUsername } = useWatch(form);

  useEffect(() => {
    showToastCode('NewValues', { NewAge, NewPassword, NewUsername });
  }, [NewAge, NewPassword, NewUsername]);

  return (
    <div className="w-[480px] space-y-4 max-sm:w-full">
      <Form form={form}>
        <FormField
          label="Username"
          name="username"
        >
          <Input placeholder="Enter username" />
        </FormField>

        <FormField
          label="Age"
          name="age"
          rules={[{ message: 'Must be 18 or older', min: 18, type: 'number' }]}
        >
          <Input placeholder="Enter age" />
        </FormField>

        <FormField
          label="Password"
          name="password"
          rules={[{ message: 'Password must be at least 6 characters', minLength: 6 }]}
        >
          <Input placeholder="Enter password" />
        </FormField>

        <FormField
          label="Info&City"
          name="info.city"
          rules={[{ message: 'Password must be at least 6 characters', minLength: 6 }]}
        >
          <Input placeholder="Enter info.city" />
        </FormField>

        <FormField
          label="Info&company"
          name="info.company"
          rules={[{ message: 'Password must be at least 6 characters', minLength: 6 }]}
        >
          <Input placeholder="Enter info.company" />
        </FormField>

        <EffectWatch />
      </Form>

      {/* 4) Dynamic rendering */}
      <div className="mt-4 rounded border p-2">
        <h3 className="font-bold">Real-time Watch Results:</h3>

        <p>
          Username:
          {username}
        </p>

        <p>
          Age:
          {age}
        </p>

        <p>
          Password:
          {password}
        </p>

        <p>
          Info:
          {JSON.stringify(info, (_, value) => (value === undefined ? null : value), 2)}
        </p>
      </div>
    </div>
  );
};

export default WatchDemo;
