'use client';

import type { FormInstance } from '@skyroc/web-ui';
import { Button, Form, FormField, Input, useForm, useSelector } from '@skyroc/web-ui';
import { showToastCode } from './toast';

interface Inputs {
  confirmPassword: string;
  info: {
    age: number;
    familyInfo: {
      phone: string;
    };
    gender: string;
    hobbies: string;
  };
  password: string;
  username: string;
}

const SelectorEffect = ({ form }: { form: FormInstance<Inputs> }) => {
  // 1. Single-field selection: only listen to username
  const username = useSelector(get => get('username'), { deps: ['username'], form });

  // 2. Multi-field combination: watch password & confirmPassword
  const passwordsMatch = useSelector(
    get => {
      const pass = get('password');
      const confirm = get('confirmPassword');
      return pass && confirm && pass === confirm;
    },
    { deps: ['password', 'confirmPassword'], form }
  );

  // 3. Deep dependency: watch info.age
  const age = useSelector(get => get('info.age'), { deps: ['info.age'], form });

  // 4. Complex selection: username + age combination
  const userSummary = useSelector(
    (get, all) => ({
      age: get('info.age'),
      name: get('username'),
      phone: all.info?.familyInfo?.phone
    }),
    { deps: ['username', 'info.age', 'info.familyInfo.phone'], form }
  );

  console.log('username', username);
  console.log('passwordsMatch', passwordsMatch);
  console.log('age', age);
  console.log('userSummary', userSummary);

  return null;
};

const initialValues: Inputs = {
  confirmPassword: '123456',
  info: {
    age: 24,
    familyInfo: { phone: '110' },
    gender: 'male',
    hobbies: 'play lol'
  },
  password: '123456',
  username: 'ohh'
};

const UseSelectorDemo = () => {
  const [form] = useForm<Inputs>();

  const setValues = () => {
    form.setFieldsValue({
      confirmPassword: 'abc123',
      info: { age: 30, gender: 'female', hobbies: 'reading' },
      password: 'abc123',
      username: 'new_user'
    });
  };

  const setWrongConfirm = () => {
    form.setFieldValue('confirmPassword', 'wrong_pass');
  };

  const setPhone = () => {
    form.setFieldValue('info.familyInfo.phone', '1234567890');
  };

  const getSummary = () => {
    const values = form.getFieldsValue();
    showToastCode('Summary', values);
  };

  return (
    <>
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
          <Input type="password" />
        </FormField>

        <FormField
          label="Confirm Password"
          name="confirmPassword"
        >
          <Input type="password" />
        </FormField>

        <FormField
          label="Info Age"
          name="info.age"
        >
          <Input type="number" />
        </FormField>

        <FormField
          label="Info Phone"
          name="info.familyInfo.phone"
        >
          <Input />
        </FormField>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={setValues}
          >
            Set Values
          </Button>

          <Button
            type="button"
            onClick={setWrongConfirm}
          >
            Set Wrong Confirm
          </Button>

          <Button
            type="button"
            onClick={setPhone}
          >
            Set Phone
          </Button>

          <Button
            type="button"
            onClick={getSummary}
          >
            Get All Values
          </Button>

          <Button type="submit">Submit</Button>
        </div>
      </Form>

      {/* Observe dependency changes of useSelector */}
      <SelectorEffect form={form} />
    </>
  );
};

export default UseSelectorDemo;
