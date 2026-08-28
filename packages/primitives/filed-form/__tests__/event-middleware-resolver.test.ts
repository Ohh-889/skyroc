import { describe, expect, it, vi } from 'vitest';
import { ChangeTag, addTag, delTag, hasTag, toMask } from '../src/form-core/event';
import { compose } from '../src/form-core/middleware';
import { extractSchemaValidator, resolveSchema } from '../src/form-core/resolver/resolver';
import { createStandardResolver, isStandardSchema } from '../src/form-core/resolver/standard';
import { createGenericResolver, dispatchIssues, toEntries } from '../src/form-core/resolver/utils';

describe('event masks', () => {
  it('should compose and inspect bit masks', () => {
    const mask = addTag(0, ChangeTag.Value, ChangeTag.Errors);

    expect(hasTag(mask, ChangeTag.Value)).toBe(true);
    expect(hasTag(mask, ChangeTag.Errors)).toBe(true);
    expect(hasTag(mask, ChangeTag.Hidden)).toBe(false);
    expect(hasTag(delTag(mask, ChangeTag.Errors), ChangeTag.Errors)).toBe(false);
  });

  it('should convert subscription options into masks', () => {
    expect(toMask({ all: true })).toBe(ChangeTag.All);
    expect(
      toMask({
        dirty: true,
        disabled: true,
        errors: true,
        hidden: true,
        reset: true,
        touched: true,
        validated: true,
        validating: true,
        value: true,
        warnings: true
      })
    ).toBe(
      addTag(
        0,
        ChangeTag.Dirty,
        ChangeTag.Disabled,
        ChangeTag.Errors,
        ChangeTag.Hidden,
        ChangeTag.Reset,
        ChangeTag.Touched,
        ChangeTag.Validated,
        ChangeTag.Validating,
        ChangeTag.Value,
        ChangeTag.Warnings
      )
    );
    expect(toMask()).toBe(0);
  });
});

describe('middleware composition', () => {
  it('should return identity when no middleware functions are provided', () => {
    const identity = compose();

    expect(identity('action')).toBe('action');
  });

  it('should compose middleware functions from right to left', () => {
    const composed = compose(
      (value: string) => `${value}-a`,
      (value: string) => `${value}-b`,
      (value: string) => `${value}-c`
    );

    expect(composed('start')).toBe('start-c-b-a');
  });
});

describe('resolver utilities', () => {
  it('should group normalized issues by field path', () => {
    expect(
      toEntries([
        { message: 'Name is required', path: ['user', 'name'] },
        { message: 'Name is too short', path: ['user', 'name'] },
        { message: 'Age is invalid', path: ['user', 'age'] }
      ])
    ).toEqual([
      ['user.name', ['Name is required', 'Name is too short']],
      ['user.age', ['Age is invalid']]
    ]);
  });

  it('should dispatch grouped issues as external form errors', () => {
    const dispatch = vi.fn();

    dispatchIssues(dispatch, [{ message: 'Required', path: ['email'] }]);

    expect(dispatch).toHaveBeenCalledWith({
      entries: [['email', ['Required']]],
      type: 'setExternalErrors'
    });
  });

  it('should intercept field validation and clear a field when it has no matching issue', async () => {
    const state = { email: 'ada@example.com' };
    const validate = vi.fn(async () => [{ message: 'Name required', path: ['name'] }]);
    const dispatch = vi.fn();
    const next = vi.fn();

    const middleware = createGenericResolver<typeof state>(validate)({
      dispatch,
      getState: () => state
    })(next);

    await middleware({ name: 'email', type: 'validateField' } as any);

    expect(validate).toHaveBeenCalledWith(state, 'email');
    expect(dispatch).toHaveBeenCalledWith({
      entries: [['email', []]],
      type: 'setExternalErrors'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should dispatch matching field issues during field validation', async () => {
    const validate = vi.fn(async () => [
      { message: 'Invalid email', path: ['email'] },
      { message: 'Name required', path: ['name'] }
    ]);
    const dispatch = vi.fn();

    const middleware = createGenericResolver(validate)({
      dispatch,
      getState: () => ({ email: 'bad' })
    })(vi.fn());

    await middleware({ name: 'email', type: 'validateField' } as any);

    expect(dispatch).toHaveBeenCalledWith({
      entries: [['email', ['Invalid email']]],
      type: 'setExternalErrors'
    });
  });

  it('should validate all requested fields for validateFields actions', async () => {
    const validate = vi.fn(async () => [
      { message: 'Invalid email', path: ['email'] },
      { message: 'Name required', path: ['profile', 'name'] }
    ]);
    const dispatch = vi.fn();

    const middleware = createGenericResolver(validate)({
      dispatch,
      getState: () => ({})
    })(vi.fn());

    await middleware({ name: ['email', 'profile.name'], type: 'validateFields' } as any);

    expect(validate).toHaveBeenCalledWith({}, ['email', 'profile.name']);
    expect(dispatch).toHaveBeenCalledWith({
      entries: [
        ['email', ['Invalid email']],
        ['profile.name', ['Name required']]
      ],
      type: 'setExternalErrors'
    });
  });

  it('should validate all fields when validateFields omits names', async () => {
    const validate = vi.fn(async () => [{ message: 'Invalid root', path: [] }]);
    const dispatch = vi.fn();

    const middleware = createGenericResolver(validate)({
      dispatch,
      getState: () => ({})
    })(vi.fn());

    await middleware({ type: 'validateFields' } as any);

    expect(validate).toHaveBeenCalledWith({}, undefined);
    expect(dispatch).toHaveBeenCalledWith({
      entries: [['', ['Invalid root']]],
      type: 'setExternalErrors'
    });
  });

  it('should pass unrelated actions to the next middleware', async () => {
    const next = vi.fn();
    const action = { name: 'email', type: 'setFieldValue', value: 'ada@example.com' };
    const middleware = createGenericResolver(vi.fn())({
      dispatch: vi.fn(),
      getState: () => ({})
    })(next);

    await middleware(action as any);

    expect(next).toHaveBeenCalledWith(action);
  });
});

describe('standard schema resolver', () => {
  it('should detect and normalize standard schema validation issues', async () => {
    const schema = {
      '~standard': {
        validate: vi.fn(() => ({
          issues: [{ message: 'Invalid email', path: ['user', { key: 'email' }] }]
        })),
        vendor: 'test',
        version: 1
      }
    } as const;

    const validator = extractSchemaValidator(schema);

    expect(isStandardSchema(schema)).toBe(true);
    expect(isStandardSchema({ '~standard': { validate: 'not-a-function' } })).toBe(false);
    await expect(validator?.({})).resolves.toEqual([{ message: 'Invalid email', path: ['user', 'email'] }]);
  });

  it('should normalize standard schema issues without paths and undefined issue lists', async () => {
    const noPathSchema = {
      '~standard': {
        validate: vi.fn(() => ({
          issues: [{ message: 'Invalid form' }]
        })),
        vendor: 'test',
        version: 1
      }
    } as const;
    const undefinedIssuesSchema = {
      '~standard': {
        validate: vi.fn(() => ({
          issues: undefined
        })),
        vendor: 'test',
        version: 1
      }
    } as const;

    await expect(extractSchemaValidator(noPathSchema)?.({})).resolves.toEqual([{ message: 'Invalid form', path: [] }]);
    await expect(extractSchemaValidator(undefinedIssuesSchema as any)?.({})).resolves.toEqual([]);
  });

  it('should return no issues for successful standard schema validation', async () => {
    const schema = {
      '~standard': {
        validate: vi.fn(() => ({ value: { email: 'ada@example.com' } })),
        vendor: 'test',
        version: 1
      }
    } as const;

    const validator = extractSchemaValidator(schema);

    await expect(validator?.({ email: 'ada@example.com' })).resolves.toEqual([]);
  });

  it('should resolve standard schema middleware', async () => {
    const dispatch = vi.fn();
    const schema = {
      '~standard': {
        validate: vi.fn(() => ({
          issues: [
            { message: 'Invalid email', path: [{ key: 'user' }, { key: 'email' }] },
            { message: 'Invalid segment', path: [{ label: 'field' }] as any }
          ]
        })),
        vendor: 'test',
        version: 1
      }
    } as const;

    const middleware = createStandardResolver(schema)({
      dispatch,
      getState: () => ({ email: 'bad' })
    })(vi.fn());

    await middleware({ name: ['user.email', '[object Object]'], type: 'validateFields' } as any);

    expect(dispatch).toHaveBeenCalledWith({
      entries: [
        ['user.email', ['Invalid email']],
        ['[object Object]', ['Invalid segment']]
      ],
      type: 'setExternalErrors'
    });

    expect(resolveSchema(schema)).toEqual(expect.any(Function));
  });

  it('should resolve successful and root-level standard schema results', async () => {
    const successDispatch = vi.fn();
    const successSchema = {
      '~standard': {
        validate: vi.fn(() => ({ value: { email: 'ada@example.com' } })),
        vendor: 'test',
        version: 1
      }
    } as const;

    const successMiddleware = createStandardResolver(successSchema)({
      dispatch: successDispatch,
      getState: () => ({ email: 'ada@example.com' })
    })(vi.fn());

    await successMiddleware({ type: 'validateFields' } as any);

    expect(successDispatch).toHaveBeenCalledWith({
      entries: [],
      type: 'setExternalErrors'
    });

    const issueDispatch = vi.fn();
    const rootIssueSchema = {
      '~standard': {
        validate: vi.fn(() => ({
          issues: [{ message: 'Invalid form' }]
        })),
        vendor: 'test',
        version: 1
      }
    } as const;

    const issueMiddleware = createStandardResolver(rootIssueSchema)({
      dispatch: issueDispatch,
      getState: () => ({})
    })(vi.fn());

    await issueMiddleware({ type: 'validateFields' } as any);

    expect(issueDispatch).toHaveBeenCalledWith({
      entries: [['', ['Invalid form']]],
      type: 'setExternalErrors'
    });

    const noIssueDispatch = vi.fn();
    const noIssueSchema = {
      '~standard': {
        validate: vi.fn(() => ({
          issues: undefined
        })),
        vendor: 'test',
        version: 1
      }
    } as const;

    const noIssueMiddleware = createStandardResolver(noIssueSchema as any)({
      dispatch: noIssueDispatch,
      getState: () => ({})
    })(vi.fn());

    await noIssueMiddleware({ type: 'validateFields' } as any);

    expect(noIssueDispatch).toHaveBeenCalledWith({
      entries: [],
      type: 'setExternalErrors'
    });
  });

  it('should return custom validators as-is', () => {
    const schema = vi.fn(async () => []);

    expect(extractSchemaValidator(schema)).toBe(schema);
    expect(resolveSchema(schema)).toEqual(expect.any(Function));
  });

  it('should fall back to a noop middleware for unsupported schemas', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const next = vi.fn();
    const action = { name: 'email', type: 'validateField' };

    const middleware = resolveSchema(null as any)({
      dispatch: vi.fn(),
      getState: () => ({})
    })(next);

    middleware(action as any);

    expect(next).toHaveBeenCalledWith(action);
    expect(extractSchemaValidator(null as any)).toBeNull();

    warn.mockRestore();
  });
});
