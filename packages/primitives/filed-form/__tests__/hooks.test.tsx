import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FormStore from '../src/form-core/createStore';
import type { FormInstance } from '../src/react';
import {
  Field,
  Form,
  List,
  useArrayField,
  useEffectField,
  useFieldError,
  useFieldState,
  useForm,
  useSelector,
  useUndoRedo,
  useWatch
} from '../src/react';

interface HookValues {
  /** 用户邮箱，用于多字段 watch */
  email: string;
  /** 展示字段错误的邮箱 */
  errorEmail: string;
  /** 展示字段错误的用户名 */
  errorName: string;
  /** 动态列表，用于数组字段 hook */
  items: { title: string }[];
  /** 用户名，用于 watch 和 effect 订阅 */
  name: string;
  /** 数量，用于 selector 派生计算 */
  quantity: number;
  /** 单价，用于 selector 派生计算 */
  unitPrice: number;
}

interface WatchSelectorEffectPanelProps {
  /** 接收 useEffectField 被触发时读取到的用户名 */
  onEffect: (value: string) => void;
}

const WatchSelectorEffectPanel = (props: WatchSelectorEffectPanelProps) => {
  const { onEffect } = props;
  const name = useWatch<HookValues, 'name'>('name', {} as any);
  const selected = useWatch<HookValues, 'email' | 'name'>(['name', 'email'], {} as any) as Pick<
    HookValues,
    'email' | 'name'
  >;
  const values = useWatch<HookValues>() as HookValues;
  const total = useSelector<HookValues, number>(get => Number(get('quantity') || 0) * Number(get('unitPrice') || 0), {
    deps: ['quantity', 'unitPrice']
  });

  useEffectField<HookValues>(['name'], get => {
    onEffect(String(get('name')));
  });

  return (
    <>
      <output aria-label="Single name">{name}</output>
      <output aria-label="Selected email">{selected.email}</output>
      <output aria-label="All values">{JSON.stringify(values)}</output>
      <output aria-label="Total">{total}</output>
    </>
  );
};

interface ArrayFieldPanelProps {
  /** 新增列表项标题 */
  title: string;
}

const ArrayFieldPanel = (props: ArrayFieldPanelProps) => {
  const { title } = props;
  const items = useWatch<HookValues, 'items'>('items', {} as any);
  const ops = useArrayField<HookValues>('items');

  return (
    <>
      <output aria-label="Item count">{items.length}</output>
      <button
        type="button"
        onClick={() => ops.insert(items.length, { title })}
      >
        Add item
      </button>
      <button
        type="button"
        onClick={() => ops.remove(0)}
      >
        Remove first
      </button>
    </>
  );
};

interface ExternalWatchDisplayProps {
  /** 外部 form 实例，用于覆盖非上下文传入的 hook 分支 */
  form: FormInstance<HookValues>;
}

const ExternalWatchDisplay = (props: ExternalWatchDisplayProps) => {
  const { form } = props;
  const values = useWatch<HookValues>(form);
  const state = useFieldState<HookValues, 'name'>('name', { form });
  const stableName = useSelector<HookValues, string>(get => String(get('name')), {
    deps: ['name'],
    eq: () => true,
    form
  });

  return (
    <>
      <Field name="name">
        <input aria-label="External name" />
      </Field>
      <output aria-label="External watch">{values.name}</output>
      <output aria-label="External touched">{String(state.touched)}</output>
      <output aria-label="Stable selected name">{stableName}</output>
    </>
  );
};

const ExternalWatchPanel = () => {
  const [form] = useForm<HookValues>();

  return (
    <Form
      form={form}
      initialValues={{
        email: 'ada@example.com',
        errorEmail: '',
        errorName: '',
        items: [],
        name: 'Ada',
        quantity: 1,
        unitPrice: 1
      }}
    >
      <ExternalWatchDisplay form={form} />
    </Form>
  );
};

const ExternalInitialValuesObserver = () => {
  const [form] = useForm<HookValues>();
  const name = useWatch<HookValues, 'name'>('name', { form });
  const values = useWatch<HookValues>(form);
  const total = useSelector<HookValues, number>(get => Number(get('quantity') || 0) * Number(get('unitPrice') || 0), {
    deps: ['quantity', 'unitPrice'],
    form
  });

  return (
    <>
      <Form
        form={form}
        initialValues={{
          email: 'ada@example.com',
          errorEmail: '',
          errorName: '',
          items: [],
          name: 'Ada',
          quantity: 2,
          unitPrice: 5
        }}
      >
        <Field name="name">
          <input aria-label="External initial name input" />
        </Field>
        <Field name="quantity">
          <input aria-label="External initial quantity input" />
        </Field>
      </Form>

      <output aria-label="External initial name">{name || ''}</output>
      <output aria-label="External initial values">{JSON.stringify(values || {})}</output>
      <output aria-label="External initial total">{total}</output>
    </>
  );
};

const NamedErrors = () => {
  const errors = useFieldError<HookValues, 'errorEmail' | 'errorName'>(['errorEmail', 'errorName']);

  return (
    <output aria-label="Named errors">
      {errors.errorEmail.join('|')}::{errors.errorName.join('|')}
    </output>
  );
};

const AllErrors = () => {
  const errors = useFieldError<HookValues>();

  return (
    <output aria-label="All errors">
      {errors.errorEmail?.join('|')}::{errors.errorName?.join('|')}
    </output>
  );
};

interface ExternalErrorsProps {
  /** 外部注入的表单实例，用于覆盖 useFieldError(form) 重载 */
  form: FormInstance<HookValues>;
}

const ExternalErrors = (props: ExternalErrorsProps) => {
  const { form } = props;
  const errors = useFieldError<HookValues>(form);

  return (
    <output aria-label="External errors">
      {errors.errorEmail?.join('|')}::{errors.errorName?.join('|')}
    </output>
  );
};

const ErrorSummaryExample = () => {
  const [form] = useForm<HookValues>();

  return (
    <Form
      form={form}
      initialValues={{
        email: 'ada@example.com',
        errorEmail: '',
        errorName: '',
        items: [],
        name: 'Ada',
        quantity: 1,
        unitPrice: 1
      }}
    >
      <Field
        name="errorEmail"
        rules={[{ debounceMs: 0, message: 'Email required', required: true }]}
      >
        <input aria-label="Error email" />
      </Field>
      <Field
        name="errorName"
        rules={[{ debounceMs: 0, message: 'Name required', required: true }]}
      >
        <input aria-label="Error name" />
      </Field>
      <NamedErrors />
      <AllErrors />
      <ExternalErrors form={form} />
      <button type="submit">Submit errors</button>
    </Form>
  );
};

interface UndoControlsProps {
  /** 当前表单实例，用于注册 undo/redo 中间件 */
  form: FormInstance<UndoValues>;
}

interface UndoValues {
  /** 动态列表，用于覆盖数组操作撤销 */
  items: { title: string }[];
  /** 标题字段，用于覆盖字段值撤销 */
  title: string;
}

const UndoControls = (props: UndoControlsProps) => {
  const { form } = props;
  const { canRedo, canUndo, redo, undo } = useUndoRedo(form);

  return (
    <>
      <button
        disabled={!canUndo}
        type="button"
        onClick={undo}
      >
        Undo
      </button>
      <button
        disabled={!canRedo}
        type="button"
        onClick={redo}
      >
        Redo
      </button>
    </>
  );
};

interface UndoExampleProps {
  /** 标题初始值 */
  initialTitle: string;
}

const UndoExample = (props: UndoExampleProps) => {
  const { initialTitle } = props;
  const [form] = useForm<UndoValues>();

  return (
    <Form
      form={form}
      initialValues={{ items: [{ title: 'A' }], title: initialTitle }}
    >
      <Field name="title">
        <input aria-label="Title" />
      </Field>
      <List name="items">
        {(fields, ops) => (
          <>
            <output aria-label="Undo item count">{fields.length}</output>
            <button
              type="button"
              onClick={() => ops.insert(fields.length, { title: 'B' })}
            >
              Add undo item
            </button>
          </>
        )}
      </List>
      <UndoControls form={form} />
    </Form>
  );
};

interface UndoArraySnapshotProps {
  /** 输出当前数组标题，用于断言数组撤销结果 */
  label: string;
}

const UndoArraySnapshot = (props: UndoArraySnapshotProps) => {
  const { label } = props;
  const items = useWatch<UndoValues, 'items'>('items', {} as any);

  return <output aria-label={label}>{items.map(item => item.title).join('|')}</output>;
};

const UndoArrayExample = () => {
  const [form] = useForm<UndoValues>();

  return (
    <Form
      form={form}
      initialValues={{
        items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
        title: 'Draft'
      }}
    >
      <UndoArraySnapshot label="Undo array titles" />
      <List name="items">
        {(_, ops) => (
          <>
            <button
              type="button"
              onClick={() => ops.remove(1)}
            >
              Remove middle
            </button>
            <button
              type="button"
              onClick={() => ops.move(2, 0)}
            >
              Move last first
            </button>
            <button
              type="button"
              onClick={() => ops.swap(0, 2)}
            >
              Swap ends
            </button>
            <button
              type="button"
              onClick={() => ops.replace(1, { title: 'X' })}
            >
              Replace middle
            </button>
          </>
        )}
      </List>
      <UndoControls form={form} />
    </Form>
  );
};

const ForceUndoRedoExample = () => {
  const [form] = useForm<UndoValues>();
  const { redo, undo } = useUndoRedo(form);
  const hooks = (form as any).getInternalHooks();

  return (
    <Form
      form={form}
      initialValues={{ items: [], title: 'Draft' }}
    >
      <Field name="title">
        <input aria-label="Bulk title" />
      </Field>
      <button
        type="button"
        onClick={() => form.setFieldsValue({ title: 'Bulk' } as any)}
      >
        Bulk title
      </button>
      <button
        type="button"
        onClick={undo}
      >
        Force undo
      </button>
      <button
        type="button"
        onClick={redo}
      >
        Force redo
      </button>
      <button
        type="button"
        onClick={() => hooks.dispatch({ args: { op: 'unknown' }, name: 'items', type: 'arrayOp' } as any)}
      >
        Unknown op
      </button>
      <button
        type="button"
        onClick={() =>
          hooks.dispatch({
            args: { index: 0, item: { title: 'Ghost' }, op: 'insert' },
            name: 'missing',
            type: 'arrayOp'
          } as any)
        }
      >
        Missing array op
      </button>
    </Form>
  );
};

describe('form hooks', () => {
  it('should reuse an externally provided form instance', () => {
    const external = new FormStore().getForm() as FormInstance<HookValues>;
    const replacement = new FormStore().getForm() as FormInstance<HookValues>;
    const { rerender, result } = renderHook(
      (props: { form: FormInstance<HookValues> }) => useForm<HookValues>(props.form),
      { initialProps: { form: external } }
    );

    expect(result.current[0]).toBe(external);

    rerender({ form: replacement });

    expect(result.current[0]).toBe(external);
  });

  it('should watch fields, derive selector values, and run field effects', async () => {
    const onEffect = vi.fn();

    render(
      <Form
        initialValues={{
          email: 'ada@example.com',
          items: [],
          name: 'Ada',
          quantity: 2,
          unitPrice: 5
        }}
      >
        <Field name="name">
          <input aria-label="Name" />
        </Field>
        <Field name="quantity">
          <input
            aria-label="Quantity"
            type="number"
          />
        </Field>
        <WatchSelectorEffectPanel onEffect={onEffect} />
      </Form>
    );

    expect(screen.getByLabelText('Single name')).toHaveTextContent('Ada');
    expect(screen.getByLabelText('Selected email')).toHaveTextContent('ada@example.com');
    expect(screen.getByLabelText('All values')).toHaveTextContent('"quantity":2');
    expect(screen.getByLabelText('Total')).toHaveTextContent('10');

    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '3' } });

    await waitFor(() => {
      expect(screen.getByLabelText('Total')).toHaveTextContent('15');
    });

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Grace' } });

    await waitFor(() => {
      expect(screen.getByLabelText('Single name')).toHaveTextContent('Grace');
      expect(onEffect).toHaveBeenCalledWith('Grace');
    });
  });

  it('should expose array operations through useArrayField', async () => {
    render(
      <Form
        initialValues={{
          email: 'ada@example.com',
          items: [{ title: 'A' }],
          name: 'Ada',
          quantity: 1,
          unitPrice: 1
        }}
      >
        <List name="items">
          {fields => (
            <ul aria-label="Array fields">
              {fields.map(field => (
                <li key={field.key}>{field.name}</li>
              ))}
            </ul>
          )}
        </List>
        <ArrayFieldPanel title="B" />
      </Form>
    );

    expect(screen.getByLabelText('Item count')).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Item count')).toHaveTextContent('2');
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove first' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Item count')).toHaveTextContent('1');
    });
  });

  it('should watch an external form instance and keep selector output stable when equality passes', async () => {
    render(<ExternalWatchPanel />);

    expect(screen.getByLabelText('External watch')).toHaveTextContent('Ada');
    expect(screen.getByLabelText('External touched')).toHaveTextContent('false');
    expect(screen.getByLabelText('Stable selected name')).toHaveTextContent('Ada');

    fireEvent.change(screen.getByLabelText('External name'), { target: { value: 'Grace' } });

    await waitFor(() => {
      expect(screen.getByLabelText('External watch')).toHaveTextContent('Grace');
      expect(screen.getByLabelText('External touched')).toHaveTextContent('true');
    });
    expect(screen.getByLabelText('Stable selected name')).toHaveTextContent('Ada');
  });

  it('should resync external watch and selector values after form initial values are mounted', async () => {
    render(<ExternalInitialValuesObserver />);

    await waitFor(() => {
      expect(screen.getByLabelText('External initial name')).toHaveTextContent('Ada');
      expect(screen.getByLabelText('External initial values')).toHaveTextContent('"name":"Ada"');
      expect(screen.getByLabelText('External initial total')).toHaveTextContent('10');
    });

    fireEvent.change(screen.getByLabelText('External initial quantity input'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('External initial name input'), { target: { value: 'Grace' } });

    await waitFor(() => {
      expect(screen.getByLabelText('External initial name')).toHaveTextContent('Grace');
      expect(screen.getByLabelText('External initial values')).toHaveTextContent('"name":"Grace"');
      expect(screen.getByLabelText('External initial total')).toHaveTextContent('15');
    });
  });

  it('should return named, contextual, and external field errors', async () => {
    render(<ErrorSummaryExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Submit errors' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Named errors')).toHaveTextContent('Email required::Name required');
      expect(screen.getByLabelText('All errors')).toHaveTextContent('Email required::Name required');
      expect(screen.getByLabelText('External errors')).toHaveTextContent('Email required::Name required');
    });
  });

  it('should throw when useArrayField is used without a form context', () => {
    expect(() => renderHook(() => useArrayField<HookValues>('items'))).toThrow(
      'Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.'
    );
  });

  it('should throw context errors from field effect, field state, and selector hooks', () => {
    expect(() => renderHook(() => useEffectField<HookValues>(['name'], () => undefined))).toThrow(
      'Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.'
    );
    expect(() => renderHook(() => useFieldState<HookValues, 'name'>('name'))).toThrow(
      'Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.'
    );
    expect(() => renderHook(() => useSelector<HookValues, string>(get => String(get('name'))))).toThrow(
      'Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.'
    );
  });

  it('should undo and redo field and array operations', async () => {
    render(<UndoExample initialTitle="Draft" />);

    const title = screen.getByLabelText('Title');
    const undo = screen.getByRole('button', { name: 'Undo' });
    const redo = screen.getByRole('button', { name: 'Redo' });

    expect(undo).toBeDisabled();
    expect(redo).toBeDisabled();

    fireEvent.change(title, { target: { value: 'Published' } });

    await waitFor(() => {
      expect(undo).toBeEnabled();
      expect(title).toHaveValue('Published');
    });

    fireEvent.click(undo);

    await waitFor(() => {
      expect(title).toHaveValue('Draft');
      expect(redo).toBeEnabled();
    });

    fireEvent.click(redo);

    await waitFor(() => {
      expect(title).toHaveValue('Published');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add undo item' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Undo item count')).toHaveTextContent('2');
    });

    fireEvent.click(undo);

    await waitFor(() => {
      expect(screen.getByLabelText('Undo item count')).toHaveTextContent('1');
    });
  });

  it('should throw when useUndoRedo is used without a form context', () => {
    expect(() => renderHook(() => useUndoRedo<UndoValues>())).toThrow(
      'Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.'
    );
  });

  it('should undo and redo remove, move, swap, and replace array operations', async () => {
    render(<UndoArrayExample />);

    const titles = screen.getByLabelText('Undo array titles');
    const undo = screen.getByRole('button', { name: 'Undo' });
    const redo = screen.getByRole('button', { name: 'Redo' });

    expect(titles).toHaveTextContent('A|B|C');

    fireEvent.click(screen.getByRole('button', { name: 'Remove middle' }));

    await waitFor(() => {
      expect(titles).toHaveTextContent('A|C');
    });

    fireEvent.click(undo);

    await waitFor(() => {
      expect(titles).toHaveTextContent('A|B|C');
      expect(redo).toBeEnabled();
    });

    fireEvent.click(redo);

    await waitFor(() => {
      expect(titles).toHaveTextContent('A|C');
    });

    fireEvent.click(undo);

    await waitFor(() => {
      expect(titles).toHaveTextContent('A|B|C');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Move last first' }));

    await waitFor(() => {
      expect(titles).toHaveTextContent('C|A|B');
    });

    fireEvent.click(undo);

    await waitFor(() => {
      expect(titles).toHaveTextContent('A|B|C');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Swap ends' }));

    await waitFor(() => {
      expect(titles).toHaveTextContent('C|B|A');
    });

    fireEvent.click(undo);

    await waitFor(() => {
      expect(titles).toHaveTextContent('A|B|C');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Replace middle' }));

    await waitFor(() => {
      expect(titles).toHaveTextContent('A|X|C');
    });

    fireEvent.click(undo);

    await waitFor(() => {
      expect(titles).toHaveTextContent('A|B|C');
    });
  });

  it('should handle empty undo/redo calls and setFieldsValue patches', async () => {
    render(<ForceUndoRedoExample />);

    const title = screen.getByLabelText('Bulk title');
    const undo = screen.getByRole('button', { name: 'Force undo' });
    const redo = screen.getByRole('button', { name: 'Force redo' });

    fireEvent.click(undo);
    fireEvent.click(redo);

    expect(title).toHaveValue('Draft');

    fireEvent.click(screen.getByRole('button', { name: 'Bulk title' }));

    await waitFor(() => {
      expect(title).toHaveValue('Bulk');
    });

    fireEvent.click(undo);

    await waitFor(() => {
      expect(title).toHaveValue('Draft');
    });

    fireEvent.click(redo);

    await waitFor(() => {
      expect(title).toHaveValue('Bulk');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Unknown op' }));
    fireEvent.click(screen.getByRole('button', { name: 'Missing array op' }));

    expect(title).toHaveValue('Bulk');
  });
});
