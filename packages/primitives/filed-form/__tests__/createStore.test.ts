import { afterEach, describe, expect, it, vi } from 'vitest';
import FormStore from '../src/form-core/createStore';
import { ChangeTag, addTag } from '../src/form-core/event';

function createHarness(initialValues: Record<string, any> = {}) {
  const store = new FormStore();
  const form = store.getForm() as any;
  const hooks = form.getInternalHooks();

  hooks.setInitialValues(initialValues);

  return { form, hooks, store };
}

function registerField(hooks: any, name: string, initialValue?: any) {
  const changeValue = vi.fn();
  const unregister = hooks.registerField({
    changeValue,
    initialValue,
    name,
    preserve: true
  });

  return { changeValue, unregister };
}

async function flushNotify() {
  await Promise.resolve();
  await Promise.resolve();
}

function noopUnregister() {}

afterEach(() => {
  vi.useRealTimers();
});

describe('FormStore values and metadata', () => {
  it('should update field values and dirty/touched state', () => {
    const onValuesChange = vi.fn();
    const { form, hooks } = createHarness({ profile: { name: 'Ada' } });

    hooks.setCallbacks({ onValuesChange });
    registerField(hooks, 'profile.name');

    form.setFieldValue('profile.name', 'Grace');

    expect(form.getFieldValue('profile.name')).toBe('Grace');
    expect(form.getFieldTouched('profile.name')).toBe(true);
    expect(form.getFormState().dirtyFields).toEqual({ 'profile.name': true });
    expect(onValuesChange).toHaveBeenCalledWith({ profile: { name: 'Grace' } }, { profile: { name: 'Grace' } });
  });

  it('should expose selected metadata and ignore unchanged field values', () => {
    const { form, hooks } = createHarness();

    registerField(hooks, 'name', 'Ada');

    form.setFieldValue('name', 'Ada');

    expect(form.getFieldValue('name')).toBe('Ada');
    expect(form.getFieldsError(['name'])).toEqual({ name: undefined });
    expect(form.getFieldsTouched(['name'])).toBe(false);
    expect(form.getFormState()).toEqual(
      expect.objectContaining({
        dirtyFields: {},
        isDirty: false,
        isValid: true,
        touchedFields: {},
        validatedFields: {},
        validatingFields: {}
      })
    );
  });

  it('should use global preserve and tolerate missing callbacks', () => {
    const { form, hooks } = createHarness({ name: 'Ada' });

    hooks.setCallbacks(null as any);
    hooks.setPreserve(true);

    const unregister = hooks.registerField({
      changeValue: vi.fn(),
      name: 'name'
    });

    unregister();
    form.setFieldValue('name', 'Grace');

    expect(form.getFieldValue('name')).toBe('Grace');
  });

  it('should register multiple listeners for the same field name', async () => {
    const { form, hooks } = createHarness({ name: 'Ada' });
    const first = registerField(hooks, 'name');
    const second = registerField(hooks, 'name');

    form.setFieldValue('name', 'Grace');
    await flushNotify();

    expect(first.changeValue).toHaveBeenCalled();
    expect(second.changeValue).toHaveBeenCalled();
  });

  it('should reset selected fields without dropping unrelated values', () => {
    const { form, hooks } = createHarness({ first: 'Ada', last: 'Lovelace' });

    registerField(hooks, 'first');
    registerField(hooks, 'last');

    form.setFieldValue('first', 'Grace');
    form.setFieldValue('last', 'Hopper');
    form.resetFields(['first']);

    expect(form.getFieldsValue()).toEqual({
      first: 'Ada',
      last: 'Hopper'
    });
    expect(form.getFieldTouched('first')).toBe(false);
    expect(form.getFieldTouched('last')).toBe(true);
  });

  it('should notify prefix subscribers when child fields change', async () => {
    const { form, hooks } = createHarness({ profile: { name: 'Ada' } });
    const listener = vi.fn();

    registerField(hooks, 'profile.name');
    hooks.subscribeField('profile', listener, {
      includeChildren: true,
      mask: ChangeTag.Value
    });

    form.setFieldValue('profile.name', 'Grace');
    await flushNotify();

    expect(listener).toHaveBeenCalledWith(
      { name: 'Grace' },
      'profile',
      { profile: { name: 'Grace' } },
      expect.any(Number)
    );
  });

  it('should set nested values, report selected values, and validate changed fields in batch', async () => {
    const onValuesChange = vi.fn();
    const onFieldsChange = vi.fn();
    const { form, hooks } = createHarness({
      items: [],
      profile: { name: 'Ada' }
    });

    hooks.setCallbacks({ onFieldsChange, onValuesChange });
    registerField(hooks, 'profile.name');
    registerField(hooks, 'items');
    registerField(hooks, 'items.0.name');
    hooks.setFieldRules('profile.name', [{ debounceMs: 0, message: 'Name is required', required: true }]);
    hooks.setFieldRules('items.0.name', [{ debounceMs: 0, message: 'Item name is required', required: true }]);

    form.setFieldsValue(
      {
        items: [{ name: '' }],
        profile: { name: 'Grace' }
      },
      true
    );

    await flushNotify();

    expect(form.getFieldsValue(['profile.name', 'items.0.name'])).toEqual({
      'items.0.name': '',
      'profile.name': 'Grace'
    });
    await expect(form.validateField('items.0.name')).resolves.toBe(false);
    expect(form.getFieldError('items.0.name')).toEqual(['Item name is required']);
    expect(onValuesChange).toHaveBeenCalledWith(
      { items: [{ name: '' }], profile: { name: 'Grace' } },
      { items: [{ name: '' }], profile: { name: 'Grace' } }
    );
    expect(onFieldsChange).toHaveBeenCalled();
  });

  it('should ignore empty batch patches and walk null array items', () => {
    const onValuesChange = vi.fn();
    const { form, hooks } = createHarness({ items: [] });

    hooks.setCallbacks({ onValuesChange });

    form.setFieldsValue(undefined as any);
    form.setFieldsValue({ items: [null] });

    expect(form.getFieldValue('items')).toEqual([null]);
    expect(onValuesChange).toHaveBeenCalledTimes(1);
  });

  it('should unregister non-preserved fields and clear their values', () => {
    const { form, hooks } = createHarness({ name: 'Ada' });
    const unregister = hooks.registerField({
      changeValue: vi.fn(),
      name: 'name',
      preserve: false
    });

    expect(form.getFieldValue('name')).toBe('Ada');

    unregister();

    expect(form.getFieldValue('name')).toBeUndefined();
    expect(form.getFields()).toEqual({});
  });

  it('should ignore repeated disabled and hidden state updates', async () => {
    const { form, hooks } = createHarness({ name: 'Ada' });
    const listener = vi.fn();

    registerField(hooks, 'name');
    hooks.subscribeField('name', listener, {
      mask: addTag(0, ChangeTag.Disabled, ChangeTag.Hidden)
    });

    form.setDisabled('name', true);
    form.setDisabled('name', true);
    form.setHidden('name', true);
    form.setHidden('name', true);
    await flushNotify();

    expect(form.isDisabled('name')).toBe(true);
    expect(form.isHidden('name')).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should notify when disabled and hidden states are cleared', async () => {
    const { form, hooks } = createHarness({ name: 'Ada' });
    const listener = vi.fn();

    registerField(hooks, 'name');
    hooks.subscribeField('name', listener, {
      mask: addTag(0, ChangeTag.Disabled, ChangeTag.Hidden)
    });

    form.setDisabled('name', true);
    form.setDisabled('name', false);
    form.setHidden('name', true);
    form.setHidden('name', false);
    await flushNotify();

    expect(form.isDisabled('name')).toBe(false);
    expect(form.isHidden('name')).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should recompute computed fields and run field effects', () => {
    const effect = vi.fn();
    const { form, hooks } = createHarness({ price: 5, quantity: 2, total: 10 });

    registerField(hooks, 'total');
    const unregisterComputed = hooks.registerComputed('total', ['price', 'quantity'], (get: (name: string) => any) => {
      return Number(get('price')) * Number(get('quantity'));
    });
    const unregisterEffect = hooks.registerEffect(['quantity'], effect);

    form.setFieldValue('quantity', 3);

    expect(form.getFieldValue('total')).toBe(15);
    expect(effect).toHaveBeenCalledWith(expect.any(Function), { price: 5, quantity: 3, total: 15 });

    unregisterComputed();
    unregisterEffect();
    form.setFieldValue('quantity', 4);

    expect(form.getFieldValue('total')).toBe(15);
  });

  it('should recompute chained computed fields in dependency order', () => {
    const { form, hooks } = createHarness({ price: 5, quantity: 2, subtotal: 10, total: 12 });

    registerField(hooks, 'subtotal');
    registerField(hooks, 'total');
    const unregisterSubtotal = hooks.registerComputed(
      'subtotal',
      ['price', 'quantity'],
      (get: (name: string) => any) => {
        return Number(get('price')) * Number(get('quantity'));
      }
    );
    const unregisterTotal = hooks.registerComputed('total', ['subtotal'], (get: (name: string) => any) => {
      return Number(get('subtotal')) + 2;
    });

    form.setFieldValue('price', 6);

    expect(form.getFieldValue('subtotal')).toBe(12);
    expect(form.getFieldValue('total')).toBe(14);

    unregisterSubtotal();
    unregisterTotal();
  });

  it('should deduplicate shared computed dependencies in batch updates', () => {
    const { form, hooks } = createHarness({
      first: 'Ada',
      fullName: 'Ada Lovelace',
      last: 'Lovelace'
    });
    const compute = vi.fn((get: (name: string) => any) => `${get('first')} ${get('last')}`);

    const unregister = hooks.registerComputed('fullName', ['first', 'last'], compute);

    form.setFieldsValue({
      first: 'Grace',
      last: 'Hopper'
    });

    expect(form.getFieldValue('fullName')).toBe('Grace Hopper');
    expect(compute).toHaveBeenCalledTimes(1);

    unregister();
  });

  it('should tolerate computed targets unregistered during recompute', () => {
    const { form, hooks } = createHarness({ source: 1 });
    let unregisterTarget = noopUnregister;

    const unregisterRemover = hooks.registerComputed('remover', ['source'], () => {
      unregisterTarget();

      return 1;
    });
    unregisterTarget = hooks.registerComputed('target', ['source'], () => 2);

    expect(() => form.setFieldValue('source', 2)).not.toThrow();
    expect(form.getFieldValue('remover')).toBe(1);
    expect(form.getFieldValue('target')).toBeUndefined();

    unregisterRemover();
  });

  it('should write manually registered computed target values', () => {
    const { form, store } = createHarness({ source: 1 });

    (store as any)._computed.set('manualTotal', {
      compute: () => 2,
      deps: ['source']
    });
    (store as any).recomputeTargets(['manualTotal']);

    expect(form.getFieldValue('manualTotal')).toBe(2);
  });

  it('should tolerate stale computed dependency targets', () => {
    const { form, hooks, store } = createHarness({ source: 1 });

    hooks.registerComputed('missing.target', ['source'], () => 1);
    (form as any).getInternalHooks().registerComputed('stable', ['source'], () => form.getFieldValue('stable'));
    (store as any)._computed.delete('missing.target');

    expect(() => form.setFieldValue('source', 2)).not.toThrow();
  });
});

describe('FormStore validation and submit', () => {
  it('should expose validation results through the public form API', async () => {
    const { form, hooks } = createHarness({ email: '' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [{ debounceMs: 0, message: 'Email is required', required: true }]);

    await expect(form.validateField('email')).resolves.toBe(false);
    expect(form.getFieldError('email')).toEqual(['Email is required']);

    form.setFieldValue('email', 'ada@example.com');

    await expect(form.validateFields(['email'])).resolves.toBe(true);
    expect(form.getFieldError('email')).toEqual([]);
  });

  it('should omit disabled and hidden fields from submitted values', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    const { form, hooks } = createHarness({
      name: 'Ada',
      profile: { age: 36 },
      secret: 'token'
    });

    hooks.setCallbacks({ onFinish, onFinishFailed });
    registerField(hooks, 'name');
    registerField(hooks, 'profile.age');
    registerField(hooks, 'secret');

    form.setDisabled('secret', true);
    form.setHidden('profile.age', true);

    await form.submit();

    expect(onFinish).toHaveBeenCalledWith({
      name: 'Ada',
      profile: {}
    });
    expect(onFinishFailed).not.toHaveBeenCalled();
  });

  it('should clear external errors when a field has no internal rules', async () => {
    const onFieldsChange = vi.fn();
    const { form, hooks } = createHarness({ email: 'ada@example.com' });

    hooks.setCallbacks({ onFieldsChange });
    registerField(hooks, 'email');
    hooks.dispatch({ entries: [['email', ['External error']]], type: 'setExternalErrors' });

    expect(form.getFieldError('email')).toEqual(['External error']);

    await expect(form.validateField('email')).resolves.toBe(true);

    expect(form.getFieldError('email')).toEqual([]);
    expect(onFieldsChange).toHaveBeenCalled();
  });

  it('should clear all external errors when schema validation succeeds', async () => {
    const { form, hooks } = createHarness({ email: 'ada@example.com', name: 'Ada' });

    registerField(hooks, 'email');
    registerField(hooks, 'name');
    hooks.dispatch({
      entries: [
        ['email', ['Invalid email']],
        ['name', ['Invalid name']]
      ],
      type: 'setExternalErrors'
    });

    expect(form.getFieldsError()).toEqual({
      email: ['Invalid email'],
      name: ['Invalid name']
    });

    hooks.dispatch({ entries: [], type: 'setExternalErrors' });

    expect(form.getFieldsError()).toEqual({});
  });

  it('should clear selected external errors through empty entries', () => {
    const { form, hooks } = createHarness({ email: '' });

    registerField(hooks, 'email');
    hooks.dispatch({ entries: [['email', ['Invalid email']]], type: 'setExternalErrors' });

    expect(form.getFieldError('email')).toEqual(['Invalid email']);

    hooks.dispatch({ entries: [['email', []]], type: 'setExternalErrors' });

    expect(form.getFieldError('email')).toEqual([]);
  });

  it('should preserve current errors when validation trigger does not match', async () => {
    const { form, hooks } = createHarness({ email: '' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [
      { debounceMs: 0, message: 'Email is required', required: true, validateTrigger: 'blur' }
    ]);

    await expect(form.validateField('email', { trigger: 'blur' })).resolves.toBe(false);
    await expect(form.validateField('email', { trigger: 'change' })).resolves.toBe(false);

    expect(form.getFieldError('email')).toEqual(['Email is required']);
  });

  it('should skip trigger-mismatched validation when no current error exists', async () => {
    const { form, hooks } = createHarness({ email: 'ada@example.com' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [
      { debounceMs: 0, message: 'Email is required', required: true, validateTrigger: 'blur' }
    ]);

    await expect(form.validateField('email', { trigger: 'change' })).resolves.toBe(true);

    expect(form.getFieldError('email')).toEqual([]);
  });

  it('should validate only dirty fields when requested', async () => {
    const { form, hooks } = createHarness({ first: '', second: '' });

    registerField(hooks, 'first');
    registerField(hooks, 'second');
    hooks.setFieldRules('first', [{ debounceMs: 0, message: 'First required', required: true }]);
    hooks.setFieldRules('second', [{ debounceMs: 0, message: 'Second required', required: true }]);

    form.setFieldValue('first', 'Ada');

    await expect(form.validateFields(['first', 'second'], { dirty: true })).resolves.toBe(true);

    expect(form.getFieldError('first')).toEqual([]);
    expect(form.getFieldError('second')).toEqual([]);
  });

  it('should resolve dirty validation when there are no dirty fields', async () => {
    const { form, hooks } = createHarness({ name: 'Ada' });

    registerField(hooks, 'name');
    hooks.setFieldRules('name', [{ debounceMs: 0, message: 'Name is required', required: true }]);

    await expect(form.validateFields(undefined, { dirty: true })).resolves.toBe(true);
  });

  it('should validate field updates requested through setFieldValue', async () => {
    const { form, hooks } = createHarness({ email: 'ada@example.com' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [{ debounceMs: 0, message: 'Email is required', required: true }]);

    form.setFieldValue('email', '', true);
    await expect(form.validateField('email')).resolves.toBe(false);

    expect(form.getFieldError('email')).toEqual(['Email is required']);
  });

  it('should store and clear warning-only validation results', async () => {
    const { form, hooks } = createHarness({ name: 'draft' });

    registerField(hooks, 'name');
    hooks.setFieldRules('name', [
      { debounceMs: 0, message: 'Use a production name', pattern: /^prod$/, warningOnly: true }
    ]);

    await expect(form.validateField('name')).resolves.toBe(true);
    expect(form.getFieldWarning('name')).toEqual(['Use a production name']);

    form.setFieldValue('name', 'prod');
    await expect(form.validateField('name')).resolves.toBe(true);

    expect(form.getFieldWarning('name')).toEqual([]);
  });

  it('should clear stale warnings when a field no longer has rules', async () => {
    const onFieldsChange = vi.fn();
    const { form, hooks } = createHarness({ name: 'draft' });

    hooks.setCallbacks({ onFieldsChange });
    registerField(hooks, 'name');
    hooks.setFieldRules('name', [
      { debounceMs: 0, message: 'Use a production name', pattern: /^prod$/, warningOnly: true }
    ]);

    await expect(form.validateField('name')).resolves.toBe(true);
    expect(form.getFieldWarning('name')).toEqual(['Use a production name']);

    hooks.setFieldRules('name', []);
    await expect(form.validateField('name')).resolves.toBe(true);

    expect(form.getFieldWarning('name')).toEqual([]);
    expect(onFieldsChange).toHaveBeenCalled();
  });

  it('should use debounced validation and cancel stale timers', async () => {
    vi.useFakeTimers();

    const { form, hooks } = createHarness({ email: '' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [{ debounceMs: 20, message: 'Email is required', required: true }]);

    const first = form.validateField('email');
    const second = form.validateField('email');

    await vi.advanceTimersByTimeAsync(20);

    await expect(second).resolves.toBe(false);
    expect(form.getFieldError('email')).toEqual(['Email is required']);

    // The first promise is intentionally superseded by the second timer.
    expect(first).toEqual(expect.any(Promise));
  });

  it('should use default debounce when no debounce value is configured', async () => {
    vi.useFakeTimers();

    const { form, hooks } = createHarness({ email: '' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [{ message: 'Email is required', required: true }]);

    const pending = form.validateField('email');

    await vi.advanceTimersByTimeAsync(159);
    expect(form.getFieldError('email')).toEqual([]);

    await vi.advanceTimersByTimeAsync(1);
    await expect(pending).resolves.toBe(false);

    expect(form.getFieldError('email')).toEqual(['Email is required']);
  });

  it('should convert thrown validators into field errors through FormStore', async () => {
    const { form, hooks } = createHarness({ name: 'Ada' });

    registerField(hooks, 'name');
    hooks.setFieldRules('name', [
      {
        debounceMs: 0,
        validator: () => {
          throw new Error('Validator crashed');
        }
      }
    ]);

    await expect(form.validateField('name')).resolves.toBe(false);

    expect(form.getFieldError('name')).toEqual(['Validator crashed']);
  });

  it('should convert thrown non-error validators into string errors', async () => {
    const { form, hooks } = createHarness({ name: 'Ada' });
    const plainCrash = Reflect.get({ value: 'plain crash' }, 'value');

    registerField(hooks, 'name');
    hooks.setFieldRules('name', [
      {
        debounceMs: 0,
        validator: () => {
          throw plainCrash;
        }
      }
    ]);

    await expect(form.validateField('name')).resolves.toBe(false);

    expect(form.getFieldError('name')).toEqual(['plain crash']);
  });

  it('should fail submit when schema validation returns issues', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    const { form, hooks } = createHarness({ email: 'bad' });

    hooks.setCallbacks({ onFinish, onFinishFailed });
    registerField(hooks, 'email');
    hooks.setSchemaValidator(async () => [{ message: 'Invalid email', path: ['email'] }]);

    await form.submit();

    expect(onFinish).not.toHaveBeenCalled();
    expect(onFinishFailed).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCount: 1,
        errorMap: { email: ['Invalid email'] },
        firstErrorName: 'email'
      })
    );
  });

  it('should submit when schema validation returns no issues', async () => {
    const onFinish = vi.fn();
    const { form, hooks } = createHarness({ email: 'ada@example.com' });

    hooks.setCallbacks({ onFinish });
    registerField(hooks, 'email');
    hooks.setSchemaValidator(async () => []);

    await form.submit();

    expect(onFinish).toHaveBeenCalledWith({ email: 'ada@example.com' });
  });

  it('should omit disabled and hidden array entries from submitted values', async () => {
    const onFinish = vi.fn();
    const { form, hooks } = createHarness({
      items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }]
    });

    hooks.setCallbacks({ onFinish });
    registerField(hooks, 'items');
    registerField(hooks, 'items.0.title');
    registerField(hooks, 'items.1.title');
    registerField(hooks, 'items.2.title');

    form.setHidden('items.1', true);

    await form.submit();

    expect(onFinish).toHaveBeenCalledWith({
      items: [{ title: 'A' }, { title: 'C' }]
    });
  });

  it('should submit raw values when pruning is disabled internally', async () => {
    const onFinish = vi.fn();
    const { form, hooks } = createHarness({ name: 'Ada', secret: 'token' });

    hooks.setCallbacks({ onFinish });
    registerField(hooks, 'name');
    registerField(hooks, 'secret');

    form.setDisabled('secret', true);

    await form.submit(false);

    expect(onFinish).toHaveBeenCalledWith({ name: 'Ada', secret: 'token' });
  });

  it('should prune to an empty object when the root value is hidden', async () => {
    const onFinish = vi.fn();
    const { form, hooks } = createHarness({ name: 'Ada' });

    hooks.setCallbacks({ onFinish });
    registerField(hooks, 'name');
    form.setHidden('', true);

    await form.submit();

    expect(onFinish).toHaveBeenCalledWith({});
  });
});

describe('FormStore array operations', () => {
  it('should update array fields with stable operation helpers', () => {
    const { form, hooks } = createHarness({
      items: [{ name: 'A' }, { name: 'B' }]
    });

    registerField(hooks, 'items');

    const items = form.arrayOp('items');

    items.insert(1, { name: 'X' });
    expect(form.getFieldValue('items')).toEqual([{ name: 'A' }, { name: 'X' }, { name: 'B' }]);

    items.move(2, 0);
    expect(form.getFieldValue('items')).toEqual([{ name: 'B' }, { name: 'A' }, { name: 'X' }]);

    items.swap(0, 2);
    expect(form.getFieldValue('items')).toEqual([{ name: 'X' }, { name: 'A' }, { name: 'B' }]);

    items.replace(1, { name: 'Y' });
    expect(form.getFieldValue('items')).toEqual([{ name: 'X' }, { name: 'Y' }, { name: 'B' }]);

    items.remove(2);
    expect(form.getFieldValue('items')).toEqual([{ name: 'X' }, { name: 'Y' }]);
  });

  it('should ignore array operations when the target value is not an array', () => {
    const { form } = createHarness({ items: null });

    form.arrayOp('items').insert(0, { name: 'A' });

    expect(form.getFieldValue('items')).toBeNull();
  });

  it('should ignore unknown array operation payloads', () => {
    const { form, hooks } = createHarness({ items: [{ name: 'A' }] });

    hooks.arrayOp('items', { op: 'unknown' } as any);

    expect(form.getFieldValue('items')).toEqual([{ name: 'A' }]);
  });

  it('should expose stable array field keys and disabled state', () => {
    const { form, hooks } = createHarness({ items: [{ name: 'A' }] });

    const first = hooks.getArrayFields('items', undefined, true);
    const second = hooks.getArrayFields('items', undefined, true);

    expect(first).toEqual([{ disabled: true, key: '0', name: 'items.0' }]);
    expect(second).toEqual(first);
    expect(form.getFieldsValidating()).toBe(false);
    expect(form.getFieldsValidated()).toBe(false);
    expect(form.getFieldsTouched()).toBe(false);
    expect(form.getFieldsError()).toEqual({});
    expect(form.getFieldsWarning()).toEqual({});
  });

  it('should derive array fields from initial values and empty fallback values', () => {
    const { hooks } = createHarness();

    expect(hooks.getArrayFields('items', [{ name: 'A' }], false)).toEqual([
      { disabled: false, key: '0', name: 'items.0' }
    ]);
    expect(hooks.getArrayFields('empty')).toEqual([]);
  });
});

describe('FormStore lifecycle and transactions', () => {
  it('should notify wildcard subscribers on full reset', async () => {
    const { form, hooks } = createHarness({ name: 'Ada' });
    const listener = vi.fn();

    registerField(hooks, 'name');
    hooks.subscribeField(undefined, listener);

    form.setFieldValue('name', 'Grace');
    form.resetFields();
    await flushNotify();

    expect(listener).toHaveBeenCalled();
    expect(form.getFieldValue('name')).toBe('Ada');
  });

  it('should support exact and prefix subscriber cleanup', async () => {
    const { form, hooks } = createHarness({ name: 'Ada', profile: { name: 'Ada' } });
    const exact = vi.fn();
    const prefix = vi.fn();

    const unsubscribeExact = hooks.subscribeField('name', exact);
    const unsubscribePrefix = hooks.subscribeField(undefined, prefix, { includeChildren: true });

    form.resetFields();
    await flushNotify();

    expect(exact).toHaveBeenCalled();
    expect(prefix).toHaveBeenCalled();

    unsubscribeExact();
    unsubscribeExact();
    unsubscribePrefix();
    unsubscribePrefix();

    form.setFieldValue('name', 'Grace');
    await flushNotify();

    expect(exact).toHaveBeenCalledTimes(1);
    expect(prefix).toHaveBeenCalledTimes(1);
  });

  it('should only aggregate prefix notifications for matching changed keys', async () => {
    const { form, hooks } = createHarness({
      account: { name: 'Ada' },
      profile: { name: 'Ada' }
    });
    const account = vi.fn();
    const profile = vi.fn();

    hooks.subscribeField('account', account, { includeChildren: true });
    hooks.subscribeField('profile', profile, { includeChildren: true });

    form.setFieldValue('profile.name', 'Grace');
    await flushNotify();

    expect(profile).toHaveBeenCalled();
    expect(account).not.toHaveBeenCalled();
  });

  it('should pass unknown internal actions through without changing state', () => {
    const { form, hooks } = createHarness({ name: 'Ada' });
    const store = new FormStore();

    expect(hooks.dispatch({ type: 'unknown' } as any)).toBeUndefined();
    expect((store as any).dispatch({ type: 'unknown' })).toBeUndefined();
    expect(form.getFieldsValue()).toEqual({ name: 'Ada' });
  });

  it('should dispatch reset actions without explicit field names', () => {
    const { form, hooks } = createHarness({ name: 'Ada' });

    form.setFieldValue('name', 'Grace');
    hooks.dispatch({ type: 'reset' });

    expect(form.getFieldValue('name')).toBe('Ada');
  });

  it('should tolerate sparse external error entries', () => {
    const { form, hooks } = createHarness({ name: 'Ada' });
    const entries = Array(1) as any;

    expect(() => hooks.dispatch({ entries, type: 'setExternalErrors' })).not.toThrow();
    expect(form.getFieldError('name')).toEqual([]);
  });

  it('should allow middleware to dispatch follow-up actions', () => {
    const { form, hooks } = createHarness({ name: 'Ada' });

    registerField(hooks, 'name');
    form.use(({ dispatch }: any) => {
      return (next: any) => {
        return (action: any) => {
          if (action.type === 'setFieldValue') {
            dispatch({
              entries: [['name', ['Middleware error']]],
              type: 'setExternalErrors'
            });
          }

          return next(action);
        };
      };
    });

    form.setFieldValue('name', 'Grace');

    expect(form.getFieldError('name')).toEqual(['Middleware error']);
  });

  it('should expose invalid and in-progress validation state snapshots', async () => {
    vi.useFakeTimers();

    const { form, hooks } = createHarness({ email: 'bad' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [
      {
        debounceMs: 0,
        validator: () =>
          new Promise<string>(resolve => {
            setTimeout(() => resolve('Email required'), 20);
          })
      }
    ]);

    const pending = form.validateField('email');

    expect(form.getFormState()).toEqual(
      expect.objectContaining({
        isValid: true,
        isValidating: true,
        validatingFields: { email: true }
      })
    );

    await vi.advanceTimersByTimeAsync(20);
    await expect(pending).resolves.toBe(false);

    expect(form.getFormState()).toEqual(
      expect.objectContaining({
        errors: { email: ['Email required'] },
        isValid: false,
        validatedFields: { email: true }
      })
    );
  });

  it('should avoid duplicate validating setup for concurrent field validation', async () => {
    vi.useFakeTimers();

    const { form, hooks } = createHarness({ email: 'ada@example.com' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [
      {
        debounceMs: 0,
        validator: () =>
          new Promise(resolve => {
            setTimeout(() => resolve(undefined), 20);
          })
      }
    ]);

    const first = form.validateFields(['email']);
    const second = form.validateFields(['email']);

    await vi.advanceTimersByTimeAsync(20);

    await expect(first).resolves.toBe(false);
    await expect(second).resolves.toBe(true);
  });

  it('should complete validation when validating state was already cleared', async () => {
    const { form, hooks, store } = createHarness({ email: 'ada@example.com' });

    registerField(hooks, 'email');
    hooks.setFieldRules('email', [
      {
        debounceMs: 0,
        validator: () => {
          (store as any)._validating.delete('email');

          return undefined;
        }
      }
    ]);

    await expect(form.validateField('email')).resolves.toBe(true);
    expect(form.getFieldsValidating(['email'])).toBe(false);
  });

  it('should roll back failed transactions', () => {
    const { form, hooks } = createHarness({ name: 'Ada' });

    expect(() =>
      hooks.transaction(() => {
        form.setFieldValue('name', 'Grace');
        throw new Error('rollback');
      })
    ).toThrow('rollback');

    expect(form.getFieldValue('name')).toBe('Grace');
    expect(form.getFormState().isDirty).toBe(true);
  });

  it('should roll back failed async transactions', async () => {
    const { form, hooks } = createHarness({ name: 'Ada' });

    await expect(
      hooks.transactionAsync(async () => {
        form.setFieldValue('name', 'Grace');
        throw new Error('async rollback');
      })
    ).rejects.toThrow('async rollback');

    expect(form.getFieldValue('name')).toBe('Grace');
  });

  it('should destroy form state when clearOnDestroy is true', () => {
    const { form, hooks } = createHarness({ name: 'Ada' });

    form.setFieldValue('name', 'Grace');
    hooks.destroyForm(true);

    expect(form.getFieldsValue()).toEqual({});
    expect(form.getFormState().isDirty).toBe(false);
  });
});
