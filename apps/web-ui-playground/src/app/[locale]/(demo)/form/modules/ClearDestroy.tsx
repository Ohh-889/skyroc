'use client';

import { Button, Form, FormField, Input, useForm } from '@skyroc/web-ui';
import { useState } from 'react';

interface FormValues {
  password: string;
  username: string;
}

const ClearDestroy = () => {
  const [form] = useForm<FormValues>();

  const [show, setShow] = useState(true);

  function toggle() {
    setShow(!show);
  }

  return (
    <div>
      {show ? (
        <Form
          clearOnDestroy
          className="w-[480px] space-y-4 max-sm:w-full"
          form={form}
          initialValues={{ password: '123456' }}
        >
          <FormField
            label="Username"
            name="username"
          >
            <Input placeholder="Username" />
          </FormField>

          <FormField
            label="Password"
            name="password"
          >
            <Input placeholder="Password" />
          </FormField>
        </Form>
      ) : null}

      <Button
        className="mt-2"
        onClick={toggle}
      >
        Toggle
      </Button>
    </div>
  );
};

export default ClearDestroy;
