// oxlint-disable max-params
/* eslint-disable no-nested-ternary */
/* eslint-disable no-new */
/* eslint-disable no-await-in-loop */
/**
 * Form validation system with rule-based validation Supports synchronous and asynchronous validation with customizable
 * messages
 */

import { isEqual, isNil } from '@skyroc/utils';

import type { StoreValue } from './types';
import type { ValidateMessages } from './validate';

/** Supported validation rule types */
export type RuleType =
  | 'boolean'
  | 'date'
  | 'email'
  | 'enum'
  | 'float'
  | 'hex'
  | 'integer'
  | 'number'
  | 'regexp'
  | 'string'
  | 'url';

/** Custom validation function signature (returns string for failure; can be async) */
type Validator = (
  rule: Rule,
  value: StoreValue,
  values: StoreValue
) => Promise<string | any> | string | undefined | null;

/** Validation rule configuration combining base, type-specific, and custom validations. */
export interface Rule {
  /** Optional debounce time in milliseconds for async validators. */
  debounceMs?: number;
  /** Allowed values for type 'enum'. Compared by deep equality. */
  enum?: StoreValue[];
  /** Exact numeric value or exact string length, depending on type. */
  len?: number;
  /** Maximum numeric value or latest date/time allowed. */
  max?: number | Date | string;
  /** Maximum string length allowed (type 'string'). */
  maxLength?: number;
  /** Override default error/warning message. */
  message?: string;
  /** Minimum numeric value or earliest date/time allowed. */
  min?: number | Date | string;
  /** Minimum string length allowed (type 'string'). */
  minLength?: number;
  /** Regular expression to test a string value against. */
  pattern?: RegExp;
  /** Whether the field is required (non-empty). */
  required?: boolean;
  /** If true (default), skip checks when empty and not required. */
  skipIfEmpty?: boolean;
  /** Transform the raw value before validation. */
  transform?: (value: StoreValue) => StoreValue;
  /** Declares which built-in type validators should run. Defaults to 'string'. */
  type?: RuleType;
  /** Which trigger(s) cause this rule to run (e.g., 'change', 'blur'). */
  validateTrigger?: string | string[];
  /** Custom validator executed after base and type-specific checks. */
  validator?: Validator;
  /** Treat failures as warnings instead of errors when true. */
  warningOnly?: boolean;
  /** Disallow strings that contain only whitespace when true. */
  whitespace?: boolean;
}

/** Execution strategy for running multiple rules. */
export type RunMode = 'parallelAll' | 'parallelFirst' | 'serial';

/** Options controlling validation execution, including mode and triggers. */
export type ValidateOptions = {
  /** Rule execution mode; see RunMode. */
  mode?: RunMode;
  /** Which trigger(s) initiated validation; used to filter rules. */
  trigger?: string | string[];
};

/** Result of a single rule execution: error or warning message. */
type Res = { err?: string; warn?: string };
/** Context passed to a check function, including the rule and all form values. */
type Ctx = { rule: Rule; value: any; values: StoreValue };
/** Function type for an individual check strategy. */
type Check = (ctx: Ctx) => Promise<Res> | Res;

/* -------------------- Utility Functions -------------------- */
/** Returns an empty success result */
const ok = (): Res => ({});

/** Checks if a value is considered empty */
const isEmpty = (v: any) =>
  isNil(v) || (typeof v === 'string' && v.length === 0) || (Array.isArray(v) && v.length === 0);

/** Checks if a string contains only whitespace characters */
const onlyWhitespace = (s: string) => s.length > 0 && s.trim().length === 0;

/** Converts various date formats to milliseconds timestamp */
const toDateMs = (d: number | string | Date): number | null => {
  if (d instanceof Date) return Number.isNaN(d.getTime()) ? null : d.getTime();
  if (typeof d === 'number') return Number.isFinite(d) ? d : null;
  if (typeof d === 'string') {
    const t = Date.parse(d);
    return Number.isNaN(t) ? null : t;
  }
  return null;
};

/** Validates email format using regex */
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** Validates hex color format (with or without #) */
const isHexColor = (s: string) => /^#?(?:[A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(s);

/** Validates URL format using URL constructor */
const isURL = (s: string) => {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
};

/* -------------------- Message Template System -------------------- */
/** Formats a message template by replacing placeholders with actual values */
function formatMessage(template: string | undefined, rule: Rule, ctx: { label?: string; value?: any }): string {
  if (!template) return '';
  return template
    .replace(/\$\{label\}/g, ctx.label ?? '')
    .replace(/\$\{min\}/g, String(rule.min ?? ''))
    .replace(/\$\{max\}/g, String(rule.max ?? ''))
    .replace(/\$\{minLength\}/g, String(rule.minLength ?? ''))
    .replace(/\$\{maxLength\}/g, String(rule.maxLength ?? ''))
    .replace(/\$\{len\}/g, String(rule.len ?? ''))
    .replace(/\$\{value\}/g, String(ctx.value ?? ''));
}

/** Picks a message from the ValidateMessages object using dot notation */
function pickMsg(messages: ValidateMessages, key: string): string | undefined {
  // Support nested keys: 'string.minLength' / 'number.max' / 'date.invalid'
  const parts = key.split('.');
  let cur: any = messages;
  for (const p of parts) cur = cur?.[p];
  return typeof cur === 'string' ? cur : undefined;
}

/** Creates a failure result with appropriate message resolution */
function failWithMessages(
  r: Rule,
  key: string, // e.g. 'required' | 'string.minLength' | 'email'
  ctx: { label?: string; value?: any },
  messages: ValidateMessages
): Res {
  // Priority: rule.message > ValidateMessages lookup > fallback to key
  const msg = r.message || formatMessage(pickMsg(messages, key), r, ctx) || messages.default || key;
  return r.warningOnly ? { warn: msg } : { err: msg };
}

/* -------------------- RuleChecker (with messages) -------------------- */
/**
 * Rule-based validation checker with customizable message templates Supports base checks, type-specific checks, and
 * custom validation
 */
class RuleChecker {
  private baseChecks: Check[] = [];
  private typeChecks: Record<RuleType, Check[]> = {} as any;
  private customCheck: Check | null = null;

  constructor(private messages: ValidateMessages = {}) {}

  /** Register a base validation check (runs for all rules) */
  registerBase(check: Check) {
    this.baseChecks.push(check);
  }

  /** Register type-specific validation checks */
  registerType(type: RuleType, ...checks: Check[]) {
    this.typeChecks[type] = checks;
  }

  /** Register a custom validation check */
  registerCustom(check: Check) {
    this.customCheck = check;
  }

  /** Execute all registered checks for a given value and rule */
  async check(value: any, rule: Rule, allValues: StoreValue): Promise<Res> {
    const r = rule || {};
    // Apply transform function if provided
    const v = typeof r.transform === 'function' ? r.transform(value) : value;

    if (!r.required && r.skipIfEmpty !== false && isEmpty(v)) return ok();

    // Run base checks first
    for (const c of this.baseChecks) {
      const res = await c({ rule: r, value: v, values: allValues });
      if (res.err || res.warn) return res;
    }

    // Run type-specific checks
    const actualType: RuleType = r.type ?? 'string';
    if (this.typeChecks[actualType]) {
      for (const c of this.typeChecks[actualType]) {
        const res = await c({ rule: r, value: v, values: allValues });
        if (res.err || res.warn) return res;
      }
    }

    // Run custom check last
    if (this.customCheck) {
      const res = await this.customCheck({ rule: r, value: v, values: allValues });
      if (res.err || res.warn) return res;
    }

    return ok();
  }

  /** Get the messages object for this checker */
  get msg() {
    return this.messages;
  }
}

/* -------------------- Factory: Create checker with messages -------------------- */
/** Creates a rule checker with all built-in validation types and custom message support */
export function createRuleChecker(messages: ValidateMessages = {}) {
  const checker = new RuleChecker(messages);

  // Base checks: required / whitespace / skipIfEmpty
  checker.registerBase(({ rule: r, value: v }) => {
    if (r.required) {
      if (isEmpty(v)) return failWithMessages(r, 'required', { value: v }, checker.msg);
      if (r.whitespace && typeof v === 'string' && onlyWhitespace(v))
        return failWithMessages(r, 'whitespace', { value: v }, checker.msg);
    }
    return ok();
  });

  // String validation
  checker.registerType('string', ({ rule: r, value: v }) => {
    if (!isNil(r.minLength) && (v as string)?.length < r.minLength)
      return failWithMessages(r, 'string.minLength', { value: v }, checker.msg);
    if (!isNil(r.maxLength) && (v as string)?.length > r.maxLength)
      return failWithMessages(r, 'string.maxLength', { value: v }, checker.msg);
    if (!isNil(r.len) && (v as string)?.length !== r.len)
      return failWithMessages(r, 'string.len', { value: v }, checker.msg);
    if (r.pattern && !r.pattern.test(v as string))
      return failWithMessages(r, 'string.pattern', { value: v }, checker.msg);
    return ok();
  });

  // Number validation
  checker.registerType('number', ({ rule: r, value: v }) => {
    const num = Number(v);
    if (!Number.isFinite(num)) return failWithMessages(r, 'number.invalid', { value: v }, checker.msg);

    if (!isNil(r.min) && num < (r.min as number)) return failWithMessages(r, 'number.min', { value: v }, checker.msg);
    if (!isNil(r.max) && num > (r.max as number)) return failWithMessages(r, 'number.max', { value: v }, checker.msg);
    if (!isNil(r.len) && num !== r.len) return failWithMessages(r, 'number.len', { value: v }, checker.msg);
    return ok();
  });

  // Integer validation
  checker.registerType('integer', ({ rule: r, value: v }) => {
    const num = Number(v);
    if (!Number.isInteger(num)) return failWithMessages(r, 'integer.invalid', { value: v }, checker.msg);
    if (!isNil(r.min) && num < (r.min as number)) return failWithMessages(r, 'number.min', { value: v }, checker.msg);
    if (!isNil(r.max) && num > (r.max as number)) return failWithMessages(r, 'number.max', { value: v }, checker.msg);
    return ok();
  });

  // Float validation
  checker.registerType('float', ({ rule: r, value: v }) => {
    const num = Number(v);
    if (!Number.isFinite(num) || Number.isInteger(num)) return failWithMessages(r, 'float', { value: v }, checker.msg);
    return ok();
  });

  // Date validation
  checker.registerType('date', ({ rule: r, value: v }) => {
    const ms = v instanceof Date ? v.getTime() : toDateMs(v);
    if (ms === null) return failWithMessages(r, 'date.invalid', { value: v }, checker.msg);
    if (!isNil(r.min) && ms < toDateMs(r.min as any)!)
      return failWithMessages(r, 'date.min', { value: v }, checker.msg);
    if (!isNil(r.max) && ms > toDateMs(r.max as any)!)
      return failWithMessages(r, 'date.max', { value: v }, checker.msg);
    return ok();
  });

  // Enum validation
  checker.registerType('enum', ({ rule: r, value: v }) => {
    if (!Array.isArray(r.enum) || r.enum.length === 0) return ok();
    return r.enum.some(item => isEqual(item, v)) ? ok() : failWithMessages(r, 'enum', { value: v }, checker.msg);
  });

  // Boolean validation
  checker.registerType('boolean', ({ rule: r, value: v }) => {
    if (typeof v !== 'boolean') return failWithMessages(r, 'boolean', { value: v }, checker.msg);
    return ok();
  });

  // Email validation
  checker.registerType('email', ({ rule: r, value: v }) =>
    isEmail(v as string) ? ok() : failWithMessages(r, 'email', { value: v }, checker.msg)
  );

  // Hex color validation
  checker.registerType('hex', ({ rule: r, value: v }) =>
    isHexColor(v as string) ? ok() : failWithMessages(r, 'hex', { value: v }, checker.msg)
  );

  // RegExp validation
  checker.registerType('regexp', ({ rule: r, value: v }) => {
    if (isEmpty(v) && r.skipIfEmpty !== false) return ok();
    if (v instanceof RegExp) return ok();
    if (typeof v === 'string') {
      try {
        new RegExp(v);
        return ok();
      } catch {
        return failWithMessages(r, 'regexp', { value: v }, checker.msg);
      }
    }
    return failWithMessages(r, 'regexp', { value: v }, checker.msg);
  });

  // URL validation
  checker.registerType('url', ({ rule: r, value: v }) =>
    isURL(v as string) ? ok() : failWithMessages(r, 'url', { value: v }, checker.msg)
  );

  // Custom validation
  checker.registerCustom(async ({ rule: r, value: v, values }) => {
    if (typeof r.validator !== 'function') return ok();
    const res = await r.validator(r, v, values);
    if (typeof res === 'string' && res) {
      const msg = r.message || res; // Custom validator return takes priority
      return r.warningOnly ? { warn: msg } : { err: msg };
    }
    return ok();
  });

  return checker;
}

/* -------------------- Export API -------------------- */
/** Check a single rule against a value using the provided checker */
export async function checkOneRule(
  checker: ReturnType<typeof createRuleChecker>,
  value: any,
  rule: Rule,
  allValues: StoreValue
): Promise<Res> {
  return checker.check(value, rule, allValues);
}

/** Main entry point: Run a set of rules with specified mode and messages */
export async function runRulesWithMode(
  value: any,
  rules: Rule[],
  mode: RunMode,
  allValues: StoreValue,
  messages: ValidateMessages = {}
): Promise<{ errors: string[]; warns: string[] }> {
  const errors: string[] = [];
  const warns: string[] = [];
  if (!Array.isArray(rules) || rules.length === 0) return { errors, warns };

  const checker = createRuleChecker(messages);

  // Serial mode: run rules one by one, stop on first error
  if (mode === 'serial') {
    for (const r of rules) {
      const { err, warn } = await checkOneRule(checker, value, r, allValues);
      if (warn) warns.push(warn);
      if (err && !r.warningOnly) {
        errors.push(err);
        break; // Stop on first error
      }
    }
    return { errors, warns };
  }

  // Create tasks for parallel execution
  const tasks = rules.map(async r => {
    const { err, warn } = await checkOneRule(checker, value, r, allValues);
    return { err, warn, warningOnly: Boolean(r.warningOnly) };
  });

  // Parallel first mode: return as soon as first error is found
  if (mode === 'parallelFirst') {
    return await new Promise(resolve => {
      let done = false;
      let remain = tasks.length;
      tasks.forEach(p =>
        p.then(({ err, warn, warningOnly }) => {
          if (done) return;
          if (warn) warns.push(warn);
          if (err && !warningOnly) {
            done = true;
            resolve({ errors: [err], warns });
            return;
          }
          if ((remain -= 1) === 0) resolve({ errors, warns });
        })
      );
    });
  }

  // Parallel all mode: wait for all rules to complete
  const results = await Promise.all(tasks);

  for (const { err, warn, warningOnly } of results) {
    if (warn) warns.push(warn);
    if (err && !warningOnly) errors.push(err);
  }
  return { errors, warns };
}
