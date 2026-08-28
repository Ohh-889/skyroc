'use client';

import { Button, Form, FormField, Input, useForm } from '@skyroc/web-ui';
import { useState } from 'react';
import { showToastCode } from './toast';

const Preserve = () => {
  const [form] = useForm();

  const [show, setShow] = useState(true);

  const [load, setLoad] = useState(true);

  function toggle() {
    setShow(!show);
  }

  function toggleLoad() {
    setLoad(!load);
  }

  return load ? (
    <Form
      className="w-[480px] space-y-4 max-sm:w-full"
      form={form}
      onFinish={values => {
        showToastCode('You submitted the following values', values);
      }}
      onFinishFailed={errors => {
        showToastCode('You failed to submit the form', errors);
      }}
    >
      {show ? (
        <FormField
          label="Username"
          name="username"
        >
          <Input placeholder="Username" />
        </FormField>
      ) : null}

      <FormField
        label="Password"
        name="password"
        preserve={false}
      >
        <Input placeholder="Password" />
      </FormField>

      <div className="flex gap-x-2">
        <Button onClick={toggle}>Toggle</Button>
        <Button type="submit">Submit</Button>
        <Button onClick={toggleLoad}>Toggle Load</Button>
      </div>
    </Form>
  ) : null;
};

export default Preserve;
