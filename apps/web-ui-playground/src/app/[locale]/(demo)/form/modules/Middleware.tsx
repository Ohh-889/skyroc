'use client';

import type { AllPathsKeys, FormAction } from '@skyroc/web-ui';
import { Button, Form, FormField, Input, useForm } from '@skyroc/web-ui';
import { useEffect } from 'react';

// ============ Form field types ============
interface Inputs {
  confirmPassword: string;
  password: string;
  username: string;
}

type InputsAction = FormAction<Inputs, AllPathsKeys<Inputs>>;

interface AnalyticsMiddlewareCtx {
  dispatch: (a: InputsAction) => void;
  getState: () => Inputs;
}

// ============ Analytics Middleware (logging/tracking) ============
function analyticsMiddleware({ getState }: AnalyticsMiddlewareCtx) {
  return (next: (a: InputsAction) => void) => (action: InputsAction) => {
    // the action before the middleware
    console.log('[middleware] before', action, 'state:', getState());

    next(action); // run default logic first

    // the action after the middleware
    console.log('[middleware] after', action, 'state:', getState());

    if (action.type === 'setFieldValue') {
      console.log(`[Analytics] User modified field: ${action.name}`, action.value);
      // Report tracking event
      // report({ field: action.name, value: action.value });
    }
  };
}

const initialValues: Inputs = {
  confirmPassword: '123456',
  password: '123456',
  username: 'ohh'
};

const UseFormWithMiddleware = () => {
  const [form] = useForm<Inputs>();

  useEffect(() => {
    // Register middleware: add analytics/tracing for form actions
    form.use(analyticsMiddleware);
  }, [form]);

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
        <Input />
      </FormField>

      <FormField
        label="Password"
        name="password"
      >
        <Input />
      </FormField>

      <FormField
        label="Confirm Password"
        name="confirmPassword"
      >
        <Input />
      </FormField>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">Submit</Button>
        <Button onClick={() => form.setFieldValue('username', 'ohh-889')}>Set Username</Button>
      </div>
    </Form>
  );
};

export default UseFormWithMiddleware;
