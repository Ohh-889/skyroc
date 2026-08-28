import { describe, expect, it, vi } from 'vitest';
import { defaultValidateMessages } from '../src/form-core/validate';
import { runRulesWithMode } from '../src/form-core/validation';

describe('runRulesWithMode', () => {
  it('should report required errors for empty values', async () => {
    const result = await runRulesWithMode('', [{ required: true }], 'parallelAll', {}, defaultValidateMessages);

    expect(result).toEqual({
      errors: ['This field is required'],
      warns: []
    });
  });

  it('should report required errors for empty arrays', async () => {
    const result = await runRulesWithMode([], [{ required: true }], 'parallelAll', {}, defaultValidateMessages);

    expect(result.errors).toEqual(['This field is required']);
  });

  it('should skip optional empty values by default', async () => {
    const result = await runRulesWithMode('', [{ type: 'email' }], 'parallelAll', {}, defaultValidateMessages);

    expect(result).toEqual({
      errors: [],
      warns: []
    });
  });

  it('should use default messages for built-in type and length checks', async () => {
    const email = await runRulesWithMode('bad-email', [{ type: 'email' }], 'parallelAll', {}, defaultValidateMessages);
    const age = await runRulesWithMode('NaN', [{ type: 'number' }], 'parallelAll', {}, defaultValidateMessages);
    const password = await runRulesWithMode(
      'ab',
      [{ minLength: 3, type: 'string' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );

    expect(email.errors).toEqual(['Must be a valid email']);
    expect(age.errors).toEqual(['Must be a number']);
    expect(password.errors).toEqual(['Min length is 3']);
  });

  it('should fall back to the validation key when message templates are missing', async () => {
    const result = await runRulesWithMode('bad-email', [{ type: 'email' }], 'parallelAll', {}, {});

    expect(result.errors).toEqual(['email']);
  });

  it('should validate string boundaries and patterns', async () => {
    const maxLength = await runRulesWithMode(
      'abcdef',
      [{ maxLength: 3, type: 'string' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const exactLength = await runRulesWithMode(
      'ab',
      [{ len: 3, type: 'string' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const pattern = await runRulesWithMode(
      'abc',
      [{ pattern: /^\d+$/, type: 'string' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );

    expect(maxLength.errors).toEqual(['Max length is 3']);
    expect(exactLength.errors).toEqual(['Length must be 3']);
    expect(pattern.errors).toEqual(['Pattern not match']);
  });

  it('should validate numeric, integer, and float rules', async () => {
    const min = await runRulesWithMode(1, [{ min: 2, type: 'number' }], 'parallelAll', {}, defaultValidateMessages);
    const max = await runRulesWithMode(3, [{ max: 2, type: 'number' }], 'parallelAll', {}, defaultValidateMessages);
    const len = await runRulesWithMode(3, [{ len: 2, type: 'number' }], 'parallelAll', {}, defaultValidateMessages);
    const integer = await runRulesWithMode(1.5, [{ type: 'integer' }], 'parallelAll', {}, defaultValidateMessages);
    const float = await runRulesWithMode(2, [{ type: 'float' }], 'parallelAll', {}, defaultValidateMessages);

    expect(min.errors).toEqual(['Min is 2']);
    expect(max.errors).toEqual(['Max is 2']);
    expect(len.errors).toEqual(['Must equal 2']);
    expect(integer.errors).toEqual(['Must be an integer']);
    expect(float.errors).toEqual(['Must be a float']);
  });

  it('should validate integer min and max boundaries', async () => {
    const min = await runRulesWithMode(1, [{ min: 2, type: 'integer' }], 'parallelAll', {}, defaultValidateMessages);
    const max = await runRulesWithMode(3, [{ max: 2, type: 'integer' }], 'parallelAll', {}, defaultValidateMessages);

    expect(min.errors).toEqual(['Min is 2']);
    expect(max.errors).toEqual(['Max is 2']);
  });

  it('should accept valid numeric, integer, float, and date values', async () => {
    const number = await runRulesWithMode(
      2,
      [{ max: 3, min: 1, type: 'number' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const integer = await runRulesWithMode(
      2,
      [{ max: 3, min: 1, type: 'integer' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const float = await runRulesWithMode(1.5, [{ type: 'float' }], 'parallelAll', {}, defaultValidateMessages);
    const date = await runRulesWithMode('2026-05-07', [{ type: 'date' }], 'parallelAll', {}, defaultValidateMessages);

    expect(number.errors).toEqual([]);
    expect(integer.errors).toEqual([]);
    expect(float.errors).toEqual([]);
    expect(date.errors).toEqual([]);
  });

  it('should validate date boundaries', async () => {
    const invalid = await runRulesWithMode(
      'not-a-date',
      [{ type: 'date' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const min = await runRulesWithMode(
      '2026-01-01',
      [{ min: '2026-05-07', type: 'date' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const max = await runRulesWithMode(
      new Date('2026-06-01'),
      [{ max: new Date('2026-05-07'), type: 'date' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );

    expect(invalid.errors).toEqual(['Must be a valid Date']);
    expect(min.errors).toEqual(['Date is earlier than minimum']);
    expect(max.errors).toEqual(['Date is later than maximum']);
  });

  it('should validate date instances and numeric timestamps', async () => {
    const invalidDateInstance = await runRulesWithMode(
      new Date('invalid'),
      [{ type: 'date' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const invalidTimestamp = await runRulesWithMode(
      Number.POSITIVE_INFINITY,
      [{ type: 'date' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const invalidMinDate = await runRulesWithMode(
      new Date('2026-05-07'),
      [{ min: new Date('invalid'), type: 'date' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const validDate = await runRulesWithMode(
      new Date('2026-05-07'),
      [{ type: 'date' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const validTimestamp = await runRulesWithMode(
      Date.parse('2026-05-07'),
      [{ type: 'date' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );

    expect(invalidDateInstance.errors).toEqual([]);
    expect(invalidTimestamp.errors).toEqual(['Must be a valid Date']);
    expect(invalidMinDate.errors).toEqual([]);
    expect(validDate.errors).toEqual([]);
    expect(validTimestamp.errors).toEqual([]);
  });

  it('should reject unsupported date-like values', async () => {
    const result = await runRulesWithMode({}, [{ type: 'date' }], 'parallelAll', {}, defaultValidateMessages);

    expect(result.errors).toEqual(['Must be a valid Date']);
  });

  it('should validate enum, boolean, hex, regexp, and url rules', async () => {
    const enumResult = await runRulesWithMode(
      'guest',
      [{ enum: ['admin', 'editor'], type: 'enum' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const booleanResult = await runRulesWithMode(
      'true',
      [{ type: 'boolean' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const hexResult = await runRulesWithMode('zzzzzz', [{ type: 'hex' }], 'parallelAll', {}, defaultValidateMessages);
    const regexpResult = await runRulesWithMode('[', [{ type: 'regexp' }], 'parallelAll', {}, defaultValidateMessages);
    const urlResult = await runRulesWithMode('example', [{ type: 'url' }], 'parallelAll', {}, defaultValidateMessages);

    expect(enumResult.errors).toEqual(['Value is not in enum']);
    expect(booleanResult.errors).toEqual(['Must be a boolean']);
    expect(hexResult.errors).toEqual(['Must be a valid hex color']);
    expect(regexpResult.errors).toEqual(['Must be a valid regular expression']);
    expect(urlResult.errors).toEqual(['Must be a valid URL']);
  });

  it('should accept empty enum rules and valid boolean and regexp values', async () => {
    const enumResult = await runRulesWithMode(
      'guest',
      [{ enum: [], type: 'enum' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const enumMatch = await runRulesWithMode(
      'admin',
      [{ enum: ['admin', 'editor'], type: 'enum' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const booleanResult = await runRulesWithMode(
      true,
      [{ type: 'boolean' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const emailResult = await runRulesWithMode(
      'ada@example.com',
      [{ type: 'email' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const hexResult = await runRulesWithMode('#16a34a', [{ type: 'hex' }], 'parallelAll', {}, defaultValidateMessages);
    const emptyRegexp = await runRulesWithMode('', [{ type: 'regexp' }], 'parallelAll', {}, defaultValidateMessages);
    const strictEmptyRegexp = await runRulesWithMode(
      '',
      [{ skipIfEmpty: false, type: 'regexp' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const regexpInstance = await runRulesWithMode(
      /abc/,
      [{ type: 'regexp' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );
    const regexpObject = await runRulesWithMode({}, [{ type: 'regexp' }], 'parallelAll', {}, defaultValidateMessages);
    const urlResult = await runRulesWithMode(
      'https://soybeanjs.cn',
      [{ type: 'url' }],
      'parallelAll',
      {},
      defaultValidateMessages
    );

    expect(enumResult.errors).toEqual([]);
    expect(enumMatch.errors).toEqual([]);
    expect(booleanResult.errors).toEqual([]);
    expect(emailResult.errors).toEqual([]);
    expect(hexResult.errors).toEqual([]);
    expect(emptyRegexp.errors).toEqual([]);
    expect(strictEmptyRegexp.errors).toEqual([]);
    expect(regexpInstance.errors).toEqual([]);
    expect(regexpObject.errors).toEqual(['Must be a valid regular expression']);
    expect(urlResult.errors).toEqual([]);
  });

  it('should reject whitespace-only required strings', async () => {
    const result = await runRulesWithMode(
      '   ',
      [{ required: true, whitespace: true }],
      'parallelAll',
      {},
      defaultValidateMessages
    );

    expect(result.errors).toEqual(['Only whitespace is not allowed']);
  });

  it('should collect warnings separately when a rule is warning-only', async () => {
    const result = await runRulesWithMode(
      'draft',
      [{ message: 'Name is discouraged', pattern: /^prod$/, warningOnly: true }],
      'parallelAll',
      {},
      defaultValidateMessages
    );

    expect(result).toEqual({
      errors: [],
      warns: ['Name is discouraged']
    });
  });

  it('should return an empty result when no rules are provided', async () => {
    await expect(runRulesWithMode('value', [], 'parallelAll', {}, defaultValidateMessages)).resolves.toEqual({
      errors: [],
      warns: []
    });
  });

  it('should use an empty rule fallback in serial mode', async () => {
    await expect(runRulesWithMode('value', [undefined as any], 'serial', {}, defaultValidateMessages)).resolves.toEqual(
      {
        errors: [],
        warns: []
      }
    );
  });

  it('should format undefined values as empty strings', async () => {
    const valuePlaceholder = ['$', '{value}'].join('');
    const result = await runRulesWithMode(
      undefined,
      [{ skipIfEmpty: false, type: 'email' }],
      'parallelAll',
      {},
      {
        email: `Bad value: ${valuePlaceholder}`
      }
    );

    expect(result.errors).toEqual(['Bad value: ']);
  });

  it('should stop after the first error in serial mode', async () => {
    const secondValidator = vi.fn(() => 'second error');

    const result = await runRulesWithMode(
      'value',
      [{ validator: () => 'first error' }, { validator: secondValidator }],
      'serial',
      {},
      defaultValidateMessages
    );

    expect(result.errors).toEqual(['first error']);
    expect(secondValidator).not.toHaveBeenCalled();
  });

  it('should collect warning-only results in serial mode', async () => {
    const result = await runRulesWithMode(
      'draft',
      [{ validator: () => 'warning', warningOnly: true }, { validator: () => undefined }],
      'serial',
      {},
      defaultValidateMessages
    );

    expect(result).toEqual({
      errors: [],
      warns: ['warning']
    });
  });

  it('should pass transformed values to custom validators', async () => {
    const validator = vi.fn(() => undefined);

    await runRulesWithMode(
      '  Ada  ',
      [
        {
          transform: value => String(value).trim(),
          validator
        }
      ],
      'parallelAll',
      { name: '  Ada  ' },
      defaultValidateMessages
    );

    expect(validator).toHaveBeenCalledWith(expect.any(Object), 'Ada', { name: '  Ada  ' });
  });

  it('should collect all results in parallelAll mode', async () => {
    const result = await runRulesWithMode(
      'value',
      [
        { validator: () => 'first error' },
        { validator: () => 'warning', warningOnly: true },
        { validator: () => 'second error' }
      ],
      'parallelAll',
      {},
      defaultValidateMessages
    );

    expect(result).toEqual({
      errors: ['first error', 'second error'],
      warns: ['warning']
    });
  });

  it('should stop at the first error in parallelFirst mode', async () => {
    const result = await runRulesWithMode(
      'value',
      [{ validator: () => 'first error' }, { validator: () => 'second error' }],
      'parallelFirst',
      {},
      defaultValidateMessages
    );

    expect(result.errors).toEqual(['first error']);
  });

  it('should return warnings when parallelFirst has no blocking error', async () => {
    const result = await runRulesWithMode(
      'value',
      [{ validator: () => 'warning', warningOnly: true }, { validator: () => undefined }],
      'parallelFirst',
      {},
      defaultValidateMessages
    );

    expect(result).toEqual({
      errors: [],
      warns: ['warning']
    });
  });

  it('should reject when a validator throws outside the FormStore fallback', async () => {
    await expect(
      runRulesWithMode(
        'value',
        [
          {
            validator: () => {
              throw new Error('Validator crashed');
            }
          }
        ],
        'parallelAll',
        {},
        defaultValidateMessages
      )
    ).rejects.toThrow('Validator crashed');
  });
});
