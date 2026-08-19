import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode, createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ComputedField, Field, Form, List, useFieldError, useForm } from '../src/react';

interface LoginValues {
  /** 用户邮箱，用于验证错误展示和提交结果 */
  email: string;
}

interface NameValues {
  /** 用户名，用于字段事件分支 */
  name: string;
}

const EmailError = () => {
  const errors = useFieldError<LoginValues, 'email'>('email');

  return <output aria-label="Email error">{errors.join(', ')}</output>;
};

interface VisibilityValues {
  /** 名称字段，用于隐藏分支 */
  name: string;
}

interface VisibilityExampleProps {
  /** 初始字段值 */
  initialName: string;
}

const VisibilityExample = (props: VisibilityExampleProps) => {
  const { initialName } = props;
  const [form] = useForm<VisibilityValues>();

  return (
    <Form form={form} initialValues={{ name: initialName }}>
      <Field name="name">
        <input aria-label="Visible name" />
      </Field>
      <button type="button" onClick={() => form.setHidden('name', true)}>
        Hide name
      </button>
    </Form>
  );
};

interface ComputedVisibilityValues {
  /** 数量，用于计算合计 */
  quantity: number;
  /** 合计字段，用于隐藏 computed field */
  total: number;
  /** 单价，用于计算合计 */
  unitPrice: number;
}

const ComputedVisibilityExample = () => {
  const [form] = useForm<ComputedVisibilityValues>();

  return (
    <Form form={form} initialValues={{ quantity: 2, total: 10, unitPrice: 5 }}>
      <ComputedField
        compute={get => Number(get('quantity') || 0) * Number(get('unitPrice') || 0)}
        deps={['quantity', 'unitPrice']}
        name="total"
        rules={[{ message: 'Total required', required: true }]}
      >
        <input aria-label="Computed total" />
      </ComputedField>
      <button type="button" onClick={() => form.setHidden('total', true)}>
        Hide total
      </button>
    </Form>
  );
};

interface ListVisibilityValues {
  /** 动态列表，用于覆盖 List 隐藏分支 */
  items: { title: string }[];
}

interface StrictListValues {
  /** 用户列表，用于覆盖 StrictMode 下的动态数组订阅 */
  users: { age: number; name: string }[];
}

const ListVisibilityExample = () => {
  const [form] = useForm<ListVisibilityValues>();

  return (
    <Form form={form} initialValues={{ items: [{ title: 'A' }] }}>
      <List name="items">
        {fields => (
          <ul aria-label="Hidden list">
            {fields.map(field => (
              <li key={field.key}>{field.name}</li>
            ))}
          </ul>
        )}
      </List>
      <button type="button" onClick={() => form.setHidden('items', true)}>
        Hide list
      </button>
    </Form>
  );
};

const StrictListExample = () => {
  return (
    <StrictMode>
      <Form<StrictListValues>
        initialValues={{
          users: [
            { age: 20, name: 'John' },
            { age: 21, name: 'Jane' }
          ]
        }}
      >
        <List<StrictListValues> name="users">
          {(fields, ops) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Field<StrictListValues> name={`${field.name}.name` as any}>
                    <input aria-label={`Name ${index}`} />
                  </Field>
                  <Field<StrictListValues> name={`${field.name}.age` as any}>
                    <input aria-label={`Age ${index}`} />
                  </Field>
                  <button type="button" onClick={() => ops.insert(index + 1, { age: 11, name: '' })}>
                    Insert {index}
                  </button>
                  <button type="button" onClick={() => ops.remove(index)}>
                    Remove {index}
                  </button>
                </div>
              ))}
            </>
          )}
        </List>
      </Form>
    </StrictMode>
  );
};

describe('Form and Field integration', () => {
  it('should render controlled fields from initial values and keep cleared values', async () => {
    render(
      <Form initialValues={{ name: 'Ada' }}>
        <Field name="name">
          <input aria-label="Name" />
        </Field>
      </Form>
    );

    const input = screen.getByLabelText('Name');

    expect(input).toHaveValue('Ada');

    fireEvent.change(input, { target: { value: 'Grace' } });

    await waitFor(() => {
      expect(input).toHaveValue('Grace');
    });

    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('should submit valid values and render field errors when validation fails', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();

    render(
      <Form initialValues={{ email: '' }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Field name="email" rules={[{ debounceMs: 0, message: 'Email is required', required: true }]}>
          <input aria-label="Email" />
        </Field>
        <EmailError />
        <button type="submit">Submit</button>
      </Form>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Email error')).toHaveTextContent('Email is required');
    });
    expect(onFinishFailed).toHaveBeenCalledTimes(1);
    expect(onFinish).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });

    await waitFor(() => {
      expect(screen.getByLabelText('Email error')).toHaveTextContent('');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ email: 'ada@example.com' });
    });
  });

  it('should validate fields from additional validate triggers', async () => {
    render(
      <Form initialValues={{ email: '' }} validateTrigger="onBlur">
        <Field name="email" rules={[{ debounceMs: 0, message: 'Email is required', required: true }]}>
          <input aria-label="Blur email" />
        </Field>
        <EmailError />
      </Form>
    );

    fireEvent.change(screen.getByLabelText('Blur email'), { target: { value: '' } });

    expect(screen.getByLabelText('Email error')).toHaveTextContent('');

    fireEvent.blur(screen.getByLabelText('Blur email'));

    await waitFor(() => {
      expect(screen.getByLabelText('Email error')).toHaveTextContent('Email is required');
    });
  });

  it('should apply schema validation on submit', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    const schema = vi.fn(async () => [{ message: 'Invalid email', path: ['email'] }]);

    render(
      <Form initialValues={{ email: 'bad' }} onFinish={onFinish} onFinishFailed={onFinishFailed} schema={schema}>
        <Field name="email">
          <input aria-label="Schema email" />
        </Field>
        <button type="submit">Submit schema</button>
      </Form>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit schema' }));

    await waitFor(() => {
      expect(onFinishFailed).toHaveBeenCalledWith(
        expect.objectContaining({
          errorMap: { email: ['Invalid email'] }
        })
      );
    });
    expect(onFinish).not.toHaveBeenCalled();
    expect(schema).toHaveBeenCalledWith({ email: 'bad' });
  });

  it('should render without a wrapper when component is false', () => {
    const { container } = render(
      <Form component={false} initialValues={{ name: 'Ada' }}>
        <Field name="name">
          <input aria-label="Headless name" />
        </Field>
      </Form>
    );

    expect(container.querySelector('form')).toBeNull();
    expect(screen.getByLabelText('Headless name')).toHaveValue('Ada');
  });

  it('should render a custom component wrapper', () => {
    render(
      <Form aria-label="Custom form shell" component="section" initialValues={{ name: 'Ada' }}>
        <Field name="name">
          <input aria-label="Custom name" />
        </Field>
      </Form>
    );

    expect(screen.getByRole('region', { name: 'Custom form shell' })).toBeInTheDocument();
    expect(screen.getByLabelText('Custom name')).toHaveValue('Ada');
  });

  it('should expose the native form element through refs without initial values', () => {
    const ref = createRef<any>();

    render(
      <Form ref={ref}>
        <button type="submit">Submit empty</button>
      </Form>
    );

    expect(ref.current?.tagName).toBe('FORM');
  });

  it('should ignore unsupported schema objects on mount', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <Form schema={{} as any}>
        <Field name="name">
          <input aria-label="Unsupported schema name" />
        </Field>
      </Form>
    );

    expect(screen.getByLabelText('Unsupported schema name')).toHaveValue('');

    warn.mockRestore();
  });

  it('should reset fields through native form reset events', async () => {
    const onReset = vi.fn();

    render(
      <Form initialValues={{ name: 'Ada' }} onReset={onReset}>
        <Field name="name">
          <input aria-label="Reset name" />
        </Field>
        <button type="reset">Reset</button>
      </Form>
    );

    const input = screen.getByLabelText('Reset name');

    fireEvent.change(input, { target: { value: 'Grace' } });

    await waitFor(() => {
      expect(input).toHaveValue('Grace');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(input).toHaveValue('Ada');
    });
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should support custom value extraction and normalization', async () => {
    const onValuesChange = vi.fn();

    render(
      <Form initialValues={{ phone: '' }} onValuesChange={onValuesChange}>
        <Field
          getValueFromEvent={event => event.target.value}
          name="phone"
          normalize={value => String(value).replace(/\D/g, '')}
        >
          <input aria-label="Phone" />
        </Field>
      </Form>
    );

    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: 'abc123' } });

    await waitFor(() => {
      expect(screen.getByLabelText('Phone')).toHaveValue('123');
    });
    expect(onValuesChange).toHaveBeenCalledWith({ phone: '123' }, { phone: '123' });
  });

  it('should leave normalized values unchanged when normalization is a no-op', async () => {
    render(
      <Form initialValues={{ phone: '123' }}>
        <Field name="phone" normalize={value => value}>
          <input aria-label="Noop phone" />
        </Field>
      </Form>
    );

    fireEvent.change(screen.getByLabelText('Noop phone'), { target: { value: '456' } });

    await waitFor(() => {
      expect(screen.getByLabelText('Noop phone')).toHaveValue('456');
    });
  });

  it('should support checked value props', async () => {
    render(
      <Form initialValues={{ enabled: true }}>
        <Field name="enabled" valuePropName="checked">
          <input aria-label="Enabled" type="checkbox" />
        </Field>
      </Form>
    );

    const checkbox = screen.getByLabelText('Enabled');

    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('should transform values before passing them to child components', () => {
    render(
      <Form initialValues={{ name: 'ada' }}>
        <Field
          getValueProps={value => String(value).toUpperCase()}
          name="name"
        >
          <input aria-label="Uppercase name" />
        </Field>
      </Form>
    );

    expect(screen.getByLabelText('Uppercase name')).toHaveValue('ADA');
  });

  it('should skip unchanged extracted values and disabled validation triggers', () => {
    const onValuesChange = vi.fn();
    const validator = vi.fn(() => 'Name is invalid');

    render(
      <Form<NameValues> initialValues={{ name: 'Ada' }} onValuesChange={onValuesChange}>
        <Field
          getValueFromEvent={() => 'Ada'}
          name="name"
          rules={[{ validator }]}
          trigger="onClick"
          validateTrigger={false}
        >
          <button type="button">Same name</button>
        </Field>
      </Form>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Same name' }));

    expect(onValuesChange).not.toHaveBeenCalled();
    expect(validator).not.toHaveBeenCalled();
  });

  it('should omit control handlers when field names are empty', () => {
    const onChange = vi.fn();

    render(
      <Form>
        <Field name={'' as any}>
          <input aria-label="Nameless field" onChange={onChange} />
        </Field>
      </Form>
    );

    fireEvent.change(screen.getByLabelText('Nameless field'), { target: { value: 'Ada' } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should hide fields when the form marks them hidden', async () => {
    render(<VisibilityExample initialName="Ada" />);

    expect(screen.getByLabelText('Visible name')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hide name' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Visible name')).toBeNull();
    });
  });

  it('should hide computed fields when the form marks them hidden', async () => {
    render(<ComputedVisibilityExample />);

    expect(screen.getByLabelText('Computed total')).toHaveValue('10');

    fireEvent.click(screen.getByRole('button', { name: 'Hide total' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Computed total')).toBeNull();
    });
  });
});

describe('List component integration', () => {
  it('should render array fields and refresh names after insert and remove operations', async () => {
    render(
      <Form initialValues={{ items: [{ title: 'A' }, { title: 'B' }] }}>
        <List name="items">
          {(fields, ops) => (
            <>
              <ul aria-label="Items">
                {fields.map(field => (
                  <li key={field.key}>{field.name}</li>
                ))}
              </ul>
              <button type="button" onClick={() => ops.insert(fields.length, { title: 'C' })}>
                Add
              </button>
              <button type="button" onClick={() => ops.remove(0)}>
                Remove first
              </button>
            </>
          )}
        </List>
      </Form>
    );

    expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['items.0', 'items.1']);

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual([
        'items.0',
        'items.1',
        'items.2'
      ]);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove first' }));

    await waitFor(() => {
      expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(['items.0', 'items.1']);
    });
  });

  it('should keep array operations subscribed in StrictMode', async () => {
    render(<StrictListExample />);

    expect(screen.getByLabelText('Name 0')).toHaveValue('John');
    expect(screen.getByLabelText('Name 1')).toHaveValue('Jane');

    fireEvent.click(screen.getByRole('button', { name: 'Insert 0' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Name 1')).toHaveValue('');
      expect(screen.getByLabelText('Age 1')).toHaveValue('11');
      expect(screen.getByLabelText('Name 2')).toHaveValue('Jane');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove 1' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Name 2')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Name 1')).toHaveValue('Jane');
    });
  });

  it('should hide lists when the form marks them hidden', async () => {
    render(<ListVisibilityExample />);

    expect(screen.getByLabelText('Hidden list')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hide list' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Hidden list')).toBeNull();
    });
  });
});

describe('ComputedField integration', () => {
  it('should pass empty values to unresolved computed fields', () => {
    render(
      <Form>
        <ComputedField compute={() => undefined} deps={[]} name={'total' as any}>
          <input aria-label="Empty total" />
        </ComputedField>
      </Form>
    );

    expect(screen.getByLabelText('Empty total')).toHaveValue('');
    expect(screen.getByLabelText('Empty total')).toHaveAttribute('readonly');
  });

  it('should recompute read-only values when dependencies change', async () => {
    render(
      <Form initialValues={{ quantity: 2, total: 10, unitPrice: 5 }}>
        <Field name="quantity">
          <input aria-label="Quantity" type="number" />
        </Field>
        <Field name="unitPrice">
          <input aria-label="Unit price" type="number" />
        </Field>
        <ComputedField
          compute={get => Number(get('quantity') || 0) * Number(get('unitPrice') || 0)}
          deps={['quantity', 'unitPrice']}
          name="total"
        >
          <input aria-label="Total" />
        </ComputedField>
      </Form>
    );

    const total = screen.getByLabelText('Total');

    expect(total).toHaveValue('10');
    expect(total).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '3' } });

    await waitFor(() => {
      expect(total).toHaveValue('15');
    });
  });
});
