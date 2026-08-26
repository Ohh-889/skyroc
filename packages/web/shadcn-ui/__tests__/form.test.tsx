// oxlint-disable no-template-curly-in-string
import type { ComponentPropsWithoutRef } from 'react';
import { useState } from 'react';
import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Form, FormComputedField, FormList, useForm, useSelector, useWatch } from '../src/components/form';
import FormDescription from '../src/components/form/FormDescription';
import FormItem from '../src/components/form/FormItem';
import FormLabel from '../src/components/form/FormLable';
import FormMessage from '../src/components/form/FormMessage';
import { FormField } from '../src/preset/form';
import { Input } from '../src/preset/input';
import { render, screen, waitFor } from './helpers/render';

interface ChoiceGroupProps extends ComponentPropsWithoutRef<'div'> {
  /** Called when a choice is selected. */
  onValueChange?: (value: string) => void;
  /** Current selected choice from the form store. */
  value?: string;
}

const ChoiceGroup = (props: ChoiceGroupProps) => {
  const { onValueChange, value, ...rest } = props;

  return (
    <div
      {...rest}
      role="radiogroup"
    >
      <button
        aria-pressed={value === 'male'}
        type="button"
        onClick={() => onValueChange?.('male')}
      >
        Male
      </button>
      <button
        aria-pressed={value === 'female'}
        type="button"
        onClick={() => onValueChange?.('female')}
      >
        Female
      </button>
    </div>
  );
};

interface SwitchControlProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  /** Current checked state from the form store. */
  checked?: boolean;
  /** Called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
}

const SwitchControl = (props: SwitchControlProps) => {
  const { checked = false, children, onCheckedChange, ...rest } = props;

  return (
    <button
      {...rest}
      aria-checked={checked}
      role="switch"
      type="button"
      onClick={() => onCheckedChange?.(!checked)}
    >
      {children}
    </button>
  );
};

interface BasicValues {
  email: string;
  username: string;
}

interface DefaultFormValues {
  gender: string;
  phone: string;
  remember: boolean;
}

interface ValidationValues {
  age: number;
  password: string;
  password2: string;
  username: string;
  username2: string;
  workEmail: string;
}

interface ComputedValues {
  quantity: number;
  total: number;
  unitPrice: number;
}

interface NestedValues {
  info: {
    city?: string;
    company?: string;
    familyInfo?: {
      phone?: string;
    };
  };
  password: string;
  username: string;
}

interface WatchValues {
  confirmPassword: string;
  info: {
    familyInfo: {
      phone: string;
    };
  };
  password: string;
  username: string;
}

interface ListValues {
  users: {
    age: number;
    name: string;
  }[];
}

const NestedFormApiDemo = () => {
  const [form] = useForm<NestedValues>();
  const [snapshot, setSnapshot] = useState('');

  function setNestedValues() {
    form.setFieldsValue({
      info: {
        company: 'OpenAI'
      },
      username: 'Grace'
    });
  }

  function setCity() {
    form.setFieldValue('info.city', 'Shanghai');
  }

  function resetInfo() {
    form.resetFields(['info']);
  }

  function takeSnapshot() {
    setSnapshot(JSON.stringify(form.getFieldsValue()));
  }

  return (
    <>
      <Form<NestedValues>
        form={form}
        initialValues={{
          info: {
            city: 'Beijing'
          },
          password: '22333',
          username: 'Ada'
        }}
      >
        <FormField<NestedValues>
          label="Username"
          name="username"
        >
          <input aria-label="Nested username" />
        </FormField>

        <FormField<NestedValues>
          label="Password"
          name="password"
        >
          <input aria-label="Nested password" />
        </FormField>

        <FormField<NestedValues>
          label="Info city"
          name="info.city"
        >
          <input aria-label="Info city" />
        </FormField>

        <FormField<NestedValues>
          label="Info company"
          name="info.company"
        >
          <input aria-label="Info company" />
        </FormField>

        <button
          type="button"
          onClick={setNestedValues}
        >
          Set nested values
        </button>
        <button
          type="button"
          onClick={setCity}
        >
          Set city
        </button>
        <button
          type="button"
          onClick={resetInfo}
        >
          Reset info
        </button>
        <button
          type="button"
          onClick={takeSnapshot}
        >
          Snapshot
        </button>
      </Form>

      <output aria-label="Form snapshot">{snapshot}</output>
    </>
  );
};

const WatchSelectorDemo = () => {
  const [form] = useForm<WatchValues>();
  const username = useWatch('username', { form });
  const info = useWatch('info', { form, includeChildren: true });
  const passwordsMatch = useSelector(
    (get) => {
      const password = get('password');
      const confirmPassword = get('confirmPassword');

      return Boolean(password && confirmPassword && password === confirmPassword);
    },
    { deps: ['password', 'confirmPassword'], form }
  );

  return (
    <>
      <Form<WatchValues>
        form={form}
        initialValues={{
          confirmPassword: '123456',
          info: {
            familyInfo: {
              phone: '110'
            }
          },
          password: '123456',
          username: 'ohh'
        }}
      >
        <FormField<WatchValues>
          label="Watch username"
          name="username"
        >
          <input aria-label="Watch username input" />
        </FormField>

        <FormField<WatchValues>
          label="Watch password"
          name="password"
        >
          <input aria-label="Watch password input" />
        </FormField>

        <FormField<WatchValues>
          label="Watch confirm password"
          name="confirmPassword"
        >
          <input aria-label="Watch confirm password input" />
        </FormField>

        <FormField<WatchValues>
          label="Watch phone"
          name="info.familyInfo.phone"
        >
          <input aria-label="Watch phone input" />
        </FormField>
      </Form>

      <output aria-label="Watched username">{username || ''}</output>
      <output aria-label="Watched passwords match">{String(passwordsMatch)}</output>
      <output aria-label="Watched info">{JSON.stringify(info || {})}</output>
    </>
  );
};

describe('FormField', () => {
  it('renders actual input fields, links labels and submits changed values', async () => {
    const onFieldsChange = vi.fn();
    const onFinish = vi.fn();
    const onValuesChange = vi.fn();

    render(
      <Form<BasicValues>
        className="custom-form"
        initialValues={{ email: '', username: 'ohh' }}
        onFieldsChange={onFieldsChange}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <FormField<BasicValues>
          className="custom-form-item"
          classNames={{
            description: 'custom-description',
            label: 'custom-label',
            message: 'custom-message'
          }}
          description="Use your work email."
          label="Username"
          name="username"
          size="lg"
        >
          <Input placeholder="Enter username" />
        </FormField>

        <FormField<BasicValues>
          label="Email"
          name="email"
        >
          <Input
            placeholder="Enter email"
            type="email"
          />
        </FormField>

        <button type="submit">Submit</button>
      </Form>
    );

    const username = screen.getByLabelText('Username');
    const email = screen.getByLabelText('Email');
    const description = screen.getByText('Use your work email.');

    expect(username).toHaveValue('ohh');
    expect(username).toHaveAttribute('aria-invalid', 'false');
    expect(username).toHaveAttribute('aria-describedby', expect.stringContaining('form-item-description'));
    expect(screen.getByText('Username')).toHaveAttribute('data-error', 'false');
    expect(screen.getByText('Username')).toHaveClass('custom-label');
    expect(description).toHaveClass('custom-description');
    expect(description).toHaveAttribute('data-slot', 'form-description');
    expect(document.querySelector('[data-slot="form-item"]')).toHaveClass('custom-form-item');
    expect(document.querySelector('[data-slot="form-message"]')).not.toBeInTheDocument();

    fireEvent.change(username, { target: { value: 'Ada' } });
    fireEvent.change(email, { target: { value: 'ada@example.com' } });

    await waitFor(() => {
      expect(onValuesChange).toHaveBeenLastCalledWith(
        { email: 'ada@example.com' },
        { email: 'ada@example.com', username: 'Ada' }
      );
    });
    expect(onFieldsChange).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ email: 'ada@example.com', username: 'Ada' });
    });
  });

  it('supports playground style trigger, valuePropName and normalization bindings', async () => {
    const onFinish = vi.fn();
    const onValuesChange = vi.fn();

    render(
      <Form<DefaultFormValues>
        initialValues={{ gender: 'male', phone: '', remember: false }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <FormField<DefaultFormValues>
          label="Gender"
          name="gender"
          trigger="onValueChange"
        >
          <ChoiceGroup />
        </FormField>

        <FormField<DefaultFormValues>
          label="Remember"
          name="remember"
          trigger="onCheckedChange"
          valuePropName="checked"
        >
          <SwitchControl>Remember me</SwitchControl>
        </FormField>

        <FormField<DefaultFormValues>
          getValueFromEvent={event => event.target.value}
          label="Phone"
          name="phone"
          normalize={value => String(value).replace(/\D/g, '')}
        >
          <input aria-label="Phone input" />
        </FormField>

        <button type="submit">Submit custom controls</button>
      </Form>
    );

    expect(screen.getByRole('button', { name: 'Male' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('switch', { name: 'Remember me' })).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Female' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Remember me' }));
    fireEvent.change(screen.getByLabelText('Phone input'), { target: { value: 'abc123' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Female' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('switch', { name: 'Remember me' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByLabelText('Phone input')).toHaveValue('123');
    });
    expect(onValuesChange).toHaveBeenCalledWith(
      { phone: '123' },
      { gender: 'female', phone: '123', remember: true }
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit custom controls' }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ gender: 'female', phone: '123', remember: true });
    });
  });

  it('renders validation errors for custom messages, typed rules and cross-field validators', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();

    render(
      <Form<ValidationValues>
        initialValues={{
          age: 0,
          password: '',
          password2: '',
          username: '',
          username2: '',
          workEmail: ''
        }}
        validateMessages={{
          number: {
            min: 'This field must be greater than ${min}'
          },
          required: 'This field must be required'
        }}
        validateTrigger="onBlur"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <FormField<ValidationValues>
          label="Username"
          name="username"
          rules={[{ debounceMs: 0, required: true }]}
        >
          <input aria-label="Required username" />
        </FormField>

        <FormField<ValidationValues>
          getValueFromEvent={event => Number(event.target.value)}
          label="Age"
          name="age"
          rules={[{ min: 18, required: true, type: 'number' }]}
        >
          <input
            aria-label="Age input"
            type="number"
          />
        </FormField>

        <FormField<ValidationValues>
          label="Password"
          name="password"
          rules={[
            {
              debounceMs: 0,
              message: 'Password must be at least 8 characters and contain at least one letter and one number',
              pattern: /^(?=.*[A-Z])(?=.*\d)[A-Z\d]{8,}$/i
            }
          ]}
        >
          <input aria-label="Password input" />
        </FormField>

        <FormField<ValidationValues>
          label="Password2"
          name="password2"
          rules={[
            {
              debounceMs: 0,
              validator: (_, value, values) => {
                if (value !== values.password) {
                  return 'Password must be the same';
                }

                return null;
              }
            }
          ]}
        >
          <input aria-label="Confirm password input" />
        </FormField>

        <FormField<ValidationValues>
          label="Work Email"
          name="workEmail"
          rules={[{ debounceMs: 0, message: 'Invalid email format', type: 'email' }]}
        >
          <input aria-label="Work email input" />
        </FormField>

        <button type="submit">Submit validation</button>
      </Form>
    );

    fireEvent.change(screen.getByLabelText('Required username'), { target: { value: '' } });

    expect(screen.queryByText('This field must be required')).not.toBeInTheDocument();

    fireEvent.blur(screen.getByLabelText('Required username'));

    await waitFor(() => {
      expect(screen.getByText('This field must be required')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Required username'), { target: { value: 'Ada' } });
    fireEvent.blur(screen.getByLabelText('Required username'));

    await waitFor(() => {
      expect(screen.queryByText('This field must be required')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Age input'), { target: { value: '17' } });
    fireEvent.change(screen.getByLabelText('Password input'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText('Confirm password input'), { target: { value: 'xyz' } });
    fireEvent.change(screen.getByLabelText('Work email input'), { target: { value: 'bad-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit validation' }));

    await waitFor(() => {
      expect(screen.getByText('This field must be greater than 18')).toBeInTheDocument();
      expect(
        screen.getByText('Password must be at least 8 characters and contain at least one letter and one number')
      ).toBeInTheDocument();
      expect(screen.getByText('Password must be the same')).toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
    expect(onFinishFailed).toHaveBeenCalled();
    expect(onFinish).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Age input'), { target: { value: '24' } });
    fireEvent.change(screen.getByLabelText('Password input'), { target: { value: 'abc12345' } });
    fireEvent.change(screen.getByLabelText('Confirm password input'), { target: { value: 'abc12345' } });
    fireEvent.change(screen.getByLabelText('Work email input'), { target: { value: 'ada@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit validation' }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({
        age: 24,
        password: 'abc12345',
        password2: 'abc12345',
        username: 'Ada',
        username2: '',
        workEmail: 'ada@example.com'
      });
    });
  });

  it('awaits async validators before deciding submit success', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();

    render(
      <Form<Pick<ValidationValues, 'username2'>>
        initialValues={{ username2: 'admin' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <FormField<Pick<ValidationValues, 'username2'>>
          label="Username2"
          name="username2"
          rules={[
            {
              debounceMs: 0,
              validator: async (_, value) => {
                if (value?.toLowerCase() === 'admin') {
                  return 'This username2 is not allowed';
                }

                return null;
              }
            }
          ]}
        >
          <input aria-label="Async username" />
        </FormField>

        <button type="submit">Submit async validation</button>
      </Form>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit async validation' }));

    await waitFor(() => {
      expect(screen.getByText('This username2 is not allowed')).toBeInTheDocument();
    });
    expect(onFinishFailed).toHaveBeenCalled();
    expect(onFinish).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Async username'), { target: { value: 'guest' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit async validation' }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ username2: 'guest' });
    });
  });
});

describe('FormComputedField', () => {
  it('renders computed read-only values, recomputes and submits the derived field', async () => {
    const onFinish = vi.fn();

    render(
      <Form<ComputedValues>
        initialValues={{ quantity: 2, total: 10, unitPrice: 5 }}
        onFinish={onFinish}
      >
        <FormField<ComputedValues>
          getValueFromEvent={event => Number(event.target.value)}
          label="Quantity"
          name="quantity"
        >
          <input
            aria-label="Quantity input"
            type="number"
          />
        </FormField>

        <FormField<ComputedValues>
          getValueFromEvent={event => Number(event.target.value)}
          label="Unit price"
          name="unitPrice"
        >
          <input
            aria-label="Unit price input"
            type="number"
          />
        </FormField>

        <FormComputedField<ComputedValues>
          compute={get => Number(get('quantity') || 0) * Number(get('unitPrice') || 0)}
          deps={['quantity', 'unitPrice']}
          label="Total"
          name="total"
        >
          <input aria-label="Total input" />
        </FormComputedField>

        <button type="submit">Submit computed</button>
      </Form>
    );

    const total = screen.getByLabelText('Total input');

    expect(total).toHaveValue('10');
    expect(total).toBeDisabled();
    expect(total).toHaveAttribute('readonly');

    fireEvent.change(screen.getByLabelText('Quantity input'), { target: { value: '3' } });

    await waitFor(() => {
      expect(total).toHaveValue('15');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit computed' }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ quantity: 3, total: 15, unitPrice: 5 });
    });
  });
});

describe('useForm integration', () => {
  it('sets, reads and resets nested field values through the form instance', async () => {
    render(<NestedFormApiDemo />);

    expect(screen.getByLabelText('Nested username')).toHaveValue('Ada');
    expect(screen.getByLabelText('Nested password')).toHaveValue('22333');
    expect(screen.getByLabelText('Info city')).toHaveValue('Beijing');

    fireEvent.click(screen.getByRole('button', { name: 'Set nested values' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Nested username')).toHaveValue('Grace');
      expect(screen.getByLabelText('Info company')).toHaveValue('OpenAI');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Set city' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Info city')).toHaveValue('Shanghai');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Snapshot' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Form snapshot')).toHaveTextContent('"username":"Grace"');
      expect(screen.getByLabelText('Form snapshot')).toHaveTextContent('"city":"Shanghai"');
      expect(screen.getByLabelText('Form snapshot')).toHaveTextContent('"company":"OpenAI"');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset info' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Nested username')).toHaveValue('Grace');
      expect(screen.getByLabelText('Info city')).toHaveValue('Beijing');
      expect(screen.getByLabelText('Info company')).toHaveValue('');
    });
  });
});

describe('useWatch and useSelector integration', () => {
  it('updates watched and selected values when nested dependencies change', async () => {
    render(<WatchSelectorDemo />);

    await waitFor(() => {
      expect(screen.getByLabelText('Watched username')).toHaveTextContent('ohh');
      expect(screen.getByLabelText('Watched passwords match')).toHaveTextContent('true');
      expect(screen.getByLabelText('Watched info')).toHaveTextContent('"phone":"110"');
    });

    fireEvent.change(screen.getByLabelText('Watch confirm password input'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText('Watch username input'), { target: { value: 'new_user' } });
    fireEvent.change(screen.getByLabelText('Watch phone input'), { target: { value: '1234567890' } });

    await waitFor(() => {
      expect(screen.getByLabelText('Watched username')).toHaveTextContent('new_user');
      expect(screen.getByLabelText('Watched passwords match')).toHaveTextContent('false');
      expect(screen.getByLabelText('Watched info')).toHaveTextContent('"phone":"1234567890"');
    });
  });
});

describe('FormList integration', () => {
  it('keeps FormField bindings correct after insert, replace, move, swap and remove', async () => {
    render(
      <Form<ListValues>>
        <FormList<ListValues>
          initialValue={[
            { age: 20, name: 'John' },
            { age: 21, name: 'Jane' }
          ]}
          name="users"
        >
          {(fields, ops) => (
            <>
              <div>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <FormField<ListValues>
                      label={`Name ${index}`}
                      name={`${field.name}.name` as any}
                    >
                      <input aria-label={`User name ${index}`} />
                    </FormField>
                    <FormField<ListValues>
                      getValueFromEvent={event => Number(event.target.value)}
                      label={`Age ${index}`}
                      name={`${field.name}.age` as any}
                    >
                      <input
                        aria-label={`User age ${index}`}
                        type="number"
                      />
                    </FormField>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => ops.insert(1, { age: 11, name: 'Inserted' })}
              >
                Insert user
              </button>
              <button
                type="button"
                onClick={() => ops.replace(0, { age: 99, name: 'Replaced' })}
              >
                Replace first user
              </button>
              <button
                type="button"
                onClick={() => ops.move(0, 1)}
              >
                Move first down
              </button>
              <button
                type="button"
                onClick={() => ops.swap(0, 1)}
              >
                Swap first two
              </button>
              <button
                type="button"
                onClick={() => ops.remove(1)}
              >
                Remove second user
              </button>
            </>
          )}
        </FormList>
      </Form>
    );

    expect(screen.getByLabelText('User name 0')).toHaveValue('John');
    expect(screen.getByLabelText('User name 1')).toHaveValue('Jane');

    fireEvent.click(screen.getByRole('button', { name: 'Insert user' }));

    await waitFor(() => {
      expect(screen.getByLabelText('User name 0')).toHaveValue('John');
      expect(screen.getByLabelText('User name 1')).toHaveValue('Inserted');
      expect(screen.getByLabelText('User name 2')).toHaveValue('Jane');
      expect(screen.getByLabelText('User age 1')).toHaveValue(11);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Replace first user' }));

    await waitFor(() => {
      expect(screen.getByLabelText('User name 0')).toHaveValue('Replaced');
      expect(screen.getByLabelText('User age 0')).toHaveValue(99);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Move first down' }));

    await waitFor(() => {
      expect(screen.getByLabelText('User name 0')).toHaveValue('Inserted');
      expect(screen.getByLabelText('User name 1')).toHaveValue('Replaced');
      expect(screen.getByLabelText('User name 2')).toHaveValue('Jane');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Swap first two' }));

    await waitFor(() => {
      expect(screen.getByLabelText('User name 0')).toHaveValue('Replaced');
      expect(screen.getByLabelText('User name 1')).toHaveValue('Inserted');
      expect(screen.getByLabelText('User name 2')).toHaveValue('Jane');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove second user' }));

    await waitFor(() => {
      expect(screen.getByLabelText('User name 0')).toHaveValue('Replaced');
      expect(screen.getByLabelText('User name 1')).toHaveValue('Jane');
      expect(screen.queryByLabelText('User name 2')).not.toBeInTheDocument();
    });
  });
});

describe('form primitives', () => {
  it('renders standalone slots and message fallbacks', () => {
    render(
      <FormItem className="direct-item">
        <FormLabel
          className="direct-label"
          error
        >
          Direct label
        </FormLabel>
        <FormDescription className="direct-description">Direct description</FormDescription>
        <FormMessage className="direct-message">Children message</FormMessage>
        <FormMessage error={['Error message wins']}>Ignored children</FormMessage>
        <FormMessage data-testid="empty-message" />
      </FormItem>
    );

    expect(document.querySelector('[data-slot="form-item"]')).toHaveClass('direct-item');
    expect(screen.getByText('Direct label')).toHaveAttribute('data-error', 'true');
    expect(screen.getByText('Direct label')).toHaveClass('direct-label');
    expect(screen.getByText('Direct description')).toHaveClass('direct-description');
    expect(screen.getByText('Children message')).toHaveClass('direct-message');
    expect(screen.getByText('Error message wins')).toBeInTheDocument();
    expect(screen.queryByText('Ignored children')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-message')).not.toBeInTheDocument();
  });
});
