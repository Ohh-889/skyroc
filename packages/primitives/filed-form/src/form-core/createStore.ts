/* eslint-disable no-continue */
/* eslint-disable max-params */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-bitwise */

import {
  type NamePath,
  type PathTuple,
  anyOn,
  assign,
  collectDeepKeys,
  deepGet,
  deepSet,
  deepUnset,
  isArray,
  isEqual,
  isNil,
  isOn,
  isUnderPrefix,
  keyOfName,
  microtask,
  toArray
} from '@skyroc/utils';
import { type ChangeMask, ChangeTag } from './event';
import type { Action, ArrayOpArgs, Middleware, ValidateFieldsOptions } from './middleware';
import { compose } from './middleware';
import type { StandardSchemaV1NormalizedIssue } from './resolver/standard';
import { toEntries } from './resolver/utils';
import type { Callbacks, FieldEntity, Meta, Store, StoreValue } from './types';
import { type ValidateMessages, defaultValidateMessages } from './validate';
import { runRulesWithMode } from './validation';
import type { Rule, ValidateOptions } from './validation';

/** Listener type definition for form state changes */
type Listener = {
  cb: (value: StoreValue, key: string, all: Store, fired: ChangeMask) => void;
  mask: ChangeMask;
};

export type ArrayField = {
  id: number;
  keys: number[];
};

/** Checks if a validation rule should be triggered based on the provided trigger */
const matchTrigger = (rule: Rule, trig?: string | string[]) => {
  const list = toArray(rule.validateTrigger);

  if (!list.length) return true;

  const trigList = toArray(trig);

  return trigList.some(t => list.includes(t));
};

/** Extracts values from a Map based on provided field names */
function getValueByNames<T>(source: Map<string, T>, names?: NamePath[]): Record<string, T> {
  const keys = names?.length ? names.map(keyOfName) : Array.from(source.keys());

  return Object.fromEntries(keys.map(k => [k, source.get(k)!]));
}

/** Checks if any field in the provided names has a flag set in the bucket */
function getFlag(bucket: Set<string>, names?: NamePath[]) {
  if (!names || names.length === 0) {
    return bucket.size > 0;
  }

  return anyOn(bucket, names);
}

/** Moves an array element from one index to another */
function move<T>(arr: T[], from: number, to: number): T[] {
  const clone = arr.slice();
  const item = clone.splice(from, 1)[0];
  clone.splice(to, 0, item);
  return clone;
}

/**
 * FormStore class - Core form state management implementation Handles form state, validation, field registration, and
 * state subscriptions
 */
class FormStore {
  // ------------------------------------------------
  // Fields (State & registries)
  // ------------------------------------------------
  /** Main form state store */
  private _store: Store = {};
  /** Initial form values store */
  private _initial: Store = {};
  /** Registry of field entities */
  private _fieldEntities: FieldEntity[] = [];

  private arrayKeyMap = new Map<string, ArrayField>();

  /** Form lifecycle callbacks */
  private _callbacks: Callbacks = {};
  /** Validation message templates */
  private _validateMessages: ValidateMessages = defaultValidateMessages;

  // Status tracking sets
  /** Set of fields that have been touched by user interaction */
  private _touched = new Set<string>();
  /** Set of fields whose values differ from initial values */
  private _dirty = new Set<string>();
  /** Set of fields currently undergoing validation */
  private _validating = new Set<string>();
  /** Set of fields that have completed validation */
  private _validated = new Set<string>();

  /** Map of field validation errors */
  private _errors = new Map<string, string[]>();
  /** Map of field validation warnings */
  private _warnings = new Map<string, string[]>();
  /** Map of field validation rules */
  private _rules = new Map<string, Rule[]>();

  // Validation control
  /** Token map for managing concurrent validations */
  private _validateToken = new Map<string, number>();
  /** Timer map for validation debouncing */
  private _debounceTimer = new Map<string, any>();

  // Subscription management
  /** Exact match subscribers */
  private _exactListeners = new Map<string, Set<Listener>>();
  /** Prefix match subscribers (for nested fields) */
  private _prefixListeners = new Map<string, Set<Listener>>();

  // Change batching
  /** Pending changes for batch processing */
  private _pending = new Map<string, ChangeMask>();
  /** Flag indicating if a flush is scheduled */
  private _flushScheduled = false;

  // Transaction management
  /** Current transaction depth */
  private _txDepth = 0;
  /** Pending changes within current transaction */
  private _txPending = new Map<string, ChangeMask>();

  /** Middleware stack for form operations */
  private _middlewares: Middleware[] = [];

  /** Schema-level validator registered by resolveSchema middleware */
  private _schemaValidator:
    | ((state: Store, name?: string | string[]) => Promise<StandardSchemaV1NormalizedIssue[]>)
    | null = null;

  // Computed field management
  /** Registry of computed fields and their dependencies */
  private _computed = new Map<
    string,
    {
      /** Computation function that takes a getter and full store */
      compute: (get: (k: string) => any, all: Store) => any;
      /** List of dependency keys */
      deps: string[];
    }
  >();
  /** Reverse index mapping dependency keys to computed fields */
  private _depIndex = new Map<string, Set<string>>();

  // Field visibility management
  /** Set of disabled field keys */
  private _disabledKeys = new Set<string>();
  /** Set of hidden field keys */
  private _hiddenKeys = new Set<string>();

  /** Flag to preserve field values after unmount */
  private _preserve = false;

  private _submitCount = 0;
  private _isSubmitting = false;
  private _isSubmitted = false;
  private _isSubmitSuccessful = false;

  constructor() {
    this.rebindMiddlewares();
  }

  // ------------------------------------------------
  // Configuration and Callback Management
  // ------------------------------------------------
  /** Determines if field values should be preserved based on field and global settings */
  private isMergedPreserve = (fieldPreserve?: boolean) => {
    return fieldPreserve ?? this._preserve;
  };

  /** Sets form lifecycle callbacks */
  private setCallbacks = (c: Callbacks) => {
    this._callbacks = c || {};
  };

  /** Sets validation message templates */
  private setValidateMessages = (m: ValidateMessages) => {
    this._validateMessages = assign(defaultValidateMessages, m);
  };

  /** Sets global preserve flag for field values */
  private setPreserve = (preserve: boolean) => {
    this._preserve = preserve;
  };

  /** Registers a schema-level validator for use during submit */
  private setSchemaValidator = (
    validator: (state: Store, name?: string | string[]) => Promise<StandardSchemaV1NormalizedIssue[]>
  ) => {
    this._schemaValidator = validator;
  };

  // ------------------------------------------------
  // Middleware and Action Dispatch System
  // ------------------------------------------------
  /** Adds a new middleware to the middleware stack */
  private use = (mw: Middleware) => {
    this._middlewares.push(mw);
    this.rebindMiddlewares();
  };

  /**
   * Rebuilds the middleware chain and updates dispatch function Creates a new dispatch function composed of all
   * middlewares
   */
  private rebindMiddlewares = () => {
    const api = {
      dispatch: (a: Action) => this.dispatch(a),
      getState: () => this._store
    };

    const chain = this._middlewares.map(m => m(api));

    this.dispatch = compose(...chain)(this.baseDispatch);
  };

  // Action Dispatch System
  /** Base dispatch function that handles all form actions */
  private baseDispatch = (a: Action) => {
    switch (a.type) {
      case 'setFieldValue':
        return this.setFieldValue(a.name, a.value, a.validate);
      case 'setFieldsValue':
        return this.setFieldsValue(a.values, a.validate);
      case 'reset':
        return this.resetFields(a.names || []);
      case 'validateField':
        return this.validateField(a.name, a.opts);
      case 'validateFields':
        return this.validateFields(a.name, a.opts);
      case 'arrayOp':
        return this.arrayOp(a.name, a.args);
      case 'setExternalErrors': {
        const { entries } = a;

        return this.transaction(() => {
          if (entries.length === 0) {
            // ✅ Empty array means all validation passed, clear all errors
            this._errors.clear();
            this.enqueueNotify(
              Array.from(this._fieldEntities, e => e.name as string),
              ChangeTag.Errors
            );
          } else {
            const changed: string[] = [];
            entries.forEach(([k, errs]: [string, string[]]) => {
              if (errs && errs.length) {
                this._errors.set(k, errs);
              } else {
                this._errors.delete(k);
              }
              changed.push(k);
            });
            if (changed.length) {
              this.enqueueNotify(changed, ChangeTag.Errors);
            }
          }
        });
      }

      default:
        // No action matched, skip processing
        return undefined;
    }
  };

  /** Enhanced dispatch function that processes actions through middleware chain */
  private dispatch = (a: Action) => this.baseDispatch(a);

  // ------------------------------------------------
  // Store and Initial Values Management
  // ------------------------------------------------
  /** Updates the main form state store */
  private updateStore = (nextStore: Store) => {
    this._store = nextStore;
  };

  /** Sets initial form values and updates current store */
  private setInitialValues = (values: Store = {}) => {
    this._initial = values;

    const nextStore = assign(this._initial, this._store);

    this.updateStore(nextStore);
  };

  /** Gets current form state including validation status */
  private getFormState = () => {
    const errors = Object.fromEntries(this._errors);
    const warnings = Object.fromEntries(this._warnings);

    const dirtyFields = Object.fromEntries(Array.from(this._dirty).map(k => [k, true]));

    const touchedFields = Object.fromEntries(Array.from(this._touched).map(k => [k, true]));

    const validatingFields = Object.fromEntries(Array.from(this._validating).map(k => [k, true]));

    const validatedFields = Object.fromEntries(Array.from(this._validated).map(k => [k, true]));

    return {
      dirtyFields,
      // meta maps
      errors,

      initialValues: this._initial,
      // booleans
      isDirty: this._dirty.size > 0,
      isSubmitSuccessful: this._isSubmitSuccessful,
      isSubmitted: this._isSubmitted,
      isSubmitting: this._isSubmitting,
      isValid: Array.from(this._errors.values()).every(arr => !arr?.length),

      isValidating: this._validating.size > 0,
      // counters
      submitCount: this._submitCount,
      touchedFields,
      validatedFields,
      validatingFields,
      // raw values
      values: this._store,

      warnings
    };
  };

  /** Gets initial value for a field */
  private getInitialValue = (name: NamePath) => {
    return deepGet(this._initial, keyOfName(name));
  };

  /** Resets specified fields to their initial values and clears their states */
  private resetFields = (names: NonNullable<NamePath>[]) => {
    const masks =
      ChangeTag.Reset | ChangeTag.Value | ChangeTag.Touched | ChangeTag.Dirty | ChangeTag.Errors | ChangeTag.Warnings;
    if (names.length === 0) {
      this.updateStore(this._initial);

      // Clear all meta state
      this._touched.clear();
      this._dirty.clear();
      this._errors.clear();
      this._warnings.clear();
      this._validating.clear();

      this.enqueueNotify([], masks);
      return;
    }

    const keys: string[] = [];
    let nextStore = this._store;

    for (const n of names) {
      const key = keyOfName(n);
      const initialValue = deepGet(this._initial, key);

      const childKeys = collectDeepKeys(initialValue, key);

      // Collect parent field + its child fields together
      const allKeys = [key, ...childKeys];

      for (const subKey of allKeys) {
        // Reset meta state
        this._touched.delete(subKey);
        this._dirty.delete(subKey);
        this._errors.delete(subKey);
        this._warnings.delete(subKey);
        this._validating.delete(subKey);

        keys.push(subKey);
      }

      // Update only the requested parent field while keeping unrelated values intact.
      nextStore = deepSet(nextStore, key, initialValue);
    }

    this.updateStore(nextStore);

    this.enqueueNotify(keys, masks);
  };

  // ------------------------------------------------
  // Field Registration and Visibility Control
  // ------------------------------------------------

  /** Registers a new field entity and sets up its initial state and listeners */
  private registerField = (entity: FieldEntity) => {
    const name = keyOfName(entity.name);

    const preserve = this.isMergedPreserve(entity.preserve);

    const oldEntity = this._fieldEntities.find(e => e.name === name);

    if (!oldEntity) {
      this._fieldEntities.push({
        ...entity,
        name
      });

      const initialValue = this.getInitialValue(name);

      if (isNil(initialValue)) {
        this.updateStore(deepSet(this._store, name, entity.initialValue));
        this._initial = deepSet(this._initial, name, entity.initialValue);
      }
    }

    const listeners = this._exactListeners.get(name);

    if (listeners) {
      listeners.add({ cb: entity.changeValue, mask: ChangeTag.Value | ChangeTag.Disabled | ChangeTag.Hidden });
    } else {
      this._exactListeners.set(
        name,
        new Set([{ cb: entity.changeValue, mask: ChangeTag.Value | ChangeTag.Disabled | ChangeTag.Hidden }])
      );
    }

    return () => {
      if (!preserve) {
        this._fieldEntities = this._fieldEntities.filter(e => e.name !== name);
        this._initial = deepUnset(this._initial, name);
        this._store = deepUnset(this._store, name);
        this.arrayKeyMap.delete(name);
      }
      this._exactListeners.delete(name);
      this._prefixListeners.delete(name);
      this._errors.delete(name);
      this._warnings.delete(name);
      this._touched.delete(name);
      this._dirty.delete(name);
      this._validating.delete(name);
      this._validated.delete(name);
    };
  };

  /** Sets the disabled state of a field */
  private setDisabled = (name: NamePath, disabled: boolean) => {
    const k = keyOfName(name);

    const before = this._disabledKeys.has(k);
    if (before === disabled) return; // 状态没变，避免多余通知

    disabled ? this._disabledKeys.add(k) : this._disabledKeys.delete(k);

    this.enqueueNotify([k], ChangeTag.Disabled);
  };

  /** Sets the hidden state of a field */
  private setHidden = (name: NamePath, hidden: boolean) => {
    const k = keyOfName(name);

    const before = this._hiddenKeys.has(k);
    if (before === hidden) return; // 状态没变

    hidden ? this._hiddenKeys.add(k) : this._hiddenKeys.delete(k);

    this.enqueueNotify([k], ChangeTag.Hidden);
  };

  /** Checks if a field is disabled */
  private isDisabled = (name: NamePath) => {
    return this._disabledKeys.has(keyOfName(name));
  };

  /** Checks if a field is hidden */
  private isHidden = (name: NamePath) => {
    return this._hiddenKeys.has(keyOfName(name));
  };

  // ------------------------------------------------
  // Computed Fields Management
  // ------------------------------------------------
  /** Internal helper to register a reactive node (computed/effect) with dependencies and a compute function */
  private _registerReactive(id: string, deps: NamePath[], compute: (get: (n: NamePath) => any, all: Store) => any) {
    const depKeys = deps.map(keyOfName);

    this._computed.set(id, {
      compute: (getKey, all) => compute(n => getKey(keyOfName(n)), all),
      deps: depKeys
    });

    depKeys.forEach(d => {
      if (!this._depIndex.has(d)) this._depIndex.set(d, new Set());
      this._depIndex.get(d)!.add(id);
    });

    return () => {
      this._computed.delete(id);
      depKeys.forEach(d => this._depIndex.get(d)?.delete(id));
    };
  }

  /**
   * Registers a computed field with its dependencies. - Computes the next value using the provided function. - Writes
   * the result back into the store. - Returns an unregister function to remove this computed field and its dependency
   * links.
   */
  private registerComputed = (
    name: NamePath,
    deps: NamePath[],
    compute: (get: (n: NamePath) => any, all: Store) => any
  ) => {
    const id = keyOfName(name);
    return this._registerReactive(id, deps, (getKey, all) => {
      const next = compute(getKey, all);
      this.setFieldValue(id, next); // computed writes back to the store
      return next;
    });
  };

  /**
   * Registers a reactive side-effect that runs when dependencies change. - Does not write to the store. - Returns an
   * unregister function to remove this effect and its dependency links.
   */
  private registerEffect = (deps: NamePath[], effect: (get: (n: NamePath) => any, all: Store) => void) => {
    const id = `__effect_${Math.random().toString(36).slice(2)}`;
    return this._registerReactive(id, deps, (getKey, all) => {
      effect(getKey, all); // effect does not write to the store
    });
  };

  /** Finds all computed fields affected by changes in source fields */
  private collectDependents(changedKeys: string[]): string[] {
    const out = new Set<string>();
    const q = [...changedKeys];
    while (q.length) {
      const k = q.shift()!;
      const deps = this._depIndex.get(k);
      if (!deps) continue;
      for (const t of deps) {
        if (!out.has(t)) {
          out.add(t);
          // A computed target may also be a dependency of others; continue propagation
          q.push(t);
        }
      }
    }
    return Array.from(out);
  }

  /** Recomputes computed fields in dependency order */
  private recomputeTargets(targetKeys: string[]) {
    if (!targetKeys.length) return;
    const getKey = (k: string) => deepGet(this._store, keyOfName(k));
    const topo: string[] = [];
    // Simple Kahn approach: advance by dependency levels to avoid cycles causing infinite loops (in cycles, run at most N rounds)
    const seen = new Set<string>();
    const maxRounds = Math.max(1, this._computed.size);
    let rounds = 0;
    let frontier = new Set(targetKeys);
    while (frontier.size && rounds < maxRounds) {
      const next = new Set<string>();
      for (const k of frontier) {
        if (seen.has(k)) continue;
        const def = this._computed.get(k);
        if (!def) continue;
        // If its dependency is also in the target set, defer to next round
        // eslint-disable-next-line no-loop-func
        const depsInFrontier = def.deps.some(d => frontier.has(d) && d !== k);

        if (depsInFrontier) {
          next.add(k);
          continue;
        }
        topo.push(k);
        seen.add(k);
      }
      // Unprocessed items go to the next round
      for (const k of frontier) if (!seen.has(k)) next.add(k);
      frontier = next;
      rounds += 1;
    }
    // Execute: use a transaction to merge into a single flush
    this.transaction(() => {
      for (const k of topo) {
        const def = this._computed.get(k);
        if (!def) continue;
        const nextVal = def.compute(getKey, this._store);
        const prevVal = getKey(k);
        if (!isEqual(prevVal, nextVal)) {
          this.setFieldValue(keyOfName(k), nextVal);
        }
      }
    });
  }

  // ------------------------------------------------
  // Form Values Management
  // ------------------------------------------------
  private getFieldValue = (name: NamePath) => deepGet(this._store, name);

  private getFieldsValue = (names: NamePath[]) => {
    if (!names || names.length === 0) return this._store;

    return Object.fromEntries(names.map(n => [keyOfName(n), deepGet(this._store, keyOfName(n))]));
  };

  private setFieldsValue = (values: Store, validate = false) => {
    if (!values) return;

    this.transaction(() => {
      const changedKeys: string[] = [];

      const walk = (obj: any, prefix: string[] = []) => {
        Object.keys(obj || {}).forEach(k => {
          const path = [...prefix, k];
          const key = keyOfName(path);
          const v = obj[k];

          changedKeys.push(key);

          // ===== Maintain state and notify per key =====
          const initV = this.getInitialValue(key);
          const mask = this.updateMetaState(key, v, initV);
          this.enqueueNotify([key], mask);

          if (v && isArray(v)) {
            v.forEach((item, i) => {
              walk(item, [...path, String(i)]);
            });
          } else if (v && typeof v === 'object') {
            walk(v, path);
          }
        });
      };

      walk(values);

      // 1. Update store
      this.updateStore(assign(this._store, values));

      // 2. Callback
      this._callbacks.onValuesChange?.(values, this._store);
      this.triggerOnFieldsChange(changedKeys);

      // 3. Recompute dependencies
      const affected = this.collectDependents(changedKeys);
      this.recomputeTargets(affected);

      // 4. Batch validate
      if (validate) {
        this.dispatch({ name: changedKeys, type: 'validateFields' });
      }
    });
  };

  private setFieldValue = (name: string, value: StoreValue, validate = false) => {
    const key = keyOfName(name);

    const before = deepGet(this._store, key);

    if (isEqual(before, value)) return; // no change

    const initV = this.getInitialValue(key);

    // 1. Update store
    this.updateStore(deepSet(this._store, name, value));

    // 2. Update meta state (dirty/touched/validated)
    const mask = this.updateMetaState(key, value, initV);

    // 3. Notify subscribers
    this.enqueueNotify([name], mask);

    // 4. Execute callbacks
    this._callbacks.onValuesChange?.(deepSet({}, key, value), this._store);
    this.triggerOnFieldsChange([key]);

    // 5. Trigger dependency computation
    const affected = this.collectDependents([key]);
    this.recomputeTargets(affected);

    // 6. Validate immediately if requested
    if (validate) {
      this.dispatch({ name, type: 'validateField' });
    }
  };

  private updateMetaState = (key: string, value: StoreValue, initV: StoreValue): ChangeMask => {
    let mask = ChangeTag.Value;

    // touched
    if (!this._touched.has(key)) {
      this._touched.add(key);
      mask |= ChangeTag.Touched;
    }

    // dirty
    const wasDirty = this._dirty.has(key);
    const isDirty = !isEqual(value, initV);
    if (isDirty && !wasDirty) {
      this._dirty.add(key);
      mask |= ChangeTag.Dirty;
    } else if (!isDirty && wasDirty) {
      this._dirty.delete(key);
      mask |= ChangeTag.Dirty;
    }

    // Once value changes, validated becomes invalid
    if (this._validated.has(key)) {
      this._validated.delete(key);
    }

    return mask;
  };

  // ------------------------------------------------
  // Fields State (errors/touched/validating/warnings, selectors)
  // ------------------------------------------------
  private getFields = (names?: NamePath[]) => {
    let acc: Record<string, Meta<string, any>> = {};

    if (names && names.length !== 0) {
      for (const name of names) {
        acc = deepSet(acc, keyOfName(name), this.getField(name));
      }
    } else {
      for (const entity of this._fieldEntities) {
        acc = deepSet(acc, keyOfName(entity.name), this.getField(entity.name));
      }
    }

    return acc;
  };

  private getField = (name: NamePath) => {
    const key = keyOfName(name);

    return {
      errors: this.getFieldError(key),
      name: key,
      touched: this.getFieldTouched(key),
      validated: this.getFieldValidated(key),
      validating: this.getFieldValidating(key),
      value: this.getFieldValue(key),
      warnings: this.getFieldWarning(key)
    };
  };

  // ===== FieldError =====
  private getFieldError = (name: NamePath) => this._errors.get(keyOfName(name)) || [];

  private getFieldsError = (names: NamePath[]) => getValueByNames(this._errors, names);

  // ===== FieldWarning =====
  private getFieldWarning = (name: NamePath) => this._warnings.get(keyOfName(name)) || [];

  private getFieldsWarning = (names: NonNullable<NamePath>[]) => getValueByNames(this._warnings, names);

  // ===== FieldValidating =====
  private getFieldsValidating = (names: NonNullable<NamePath>[]) => getFlag(this._validating, names);

  private getFieldValidating = (name: NamePath) => isOn(this._validating, name);

  // ===== FieldValidated =====
  private getFieldsValidated = (names: NonNullable<NamePath>[]) => getFlag(this._validated, names);

  private getFieldValidated = (name: NamePath) => isOn(this._validated, name);

  // ===== FieldTouched =====
  private getFieldsTouched = (names: NonNullable<NamePath>[]) => getFlag(this._touched, names);

  private getFieldTouched = (name: NamePath) => isOn(this._touched, name);

  // ===== Rules =====
  private setFieldRules = (name: NamePath, rules?: Rule[]) => {
    if (!rules) return;

    this._rules.set(keyOfName(name), rules);
  };

  private validateField = async (name: NamePath, opts?: ValidateOptions): Promise<boolean> => {
    const key = keyOfName(name);

    const allRules = this._rules.get(key) || [];
    const rules = opts?.trigger ? allRules.filter(r => matchTrigger(r, opts?.trigger)) : allRules;
    // 1) No rules: clear old errors/warnings, but notify only if changed
    if (allRules.length === 0) {
      const prevErrors = this._errors.get(key) || [];
      const prevWarns = this._warnings.get(key) || [];

      let mask: ChangeMask = 0;
      if (prevErrors.length) {
        this._errors.delete(key);
        mask |= ChangeTag.Errors;
      }
      if (prevWarns.length) {
        this._warnings.delete(key);
        mask |= ChangeTag.Warnings;
      }

      if (mask) {
        this.enqueueNotify([key], mask);
        this.triggerOnFieldsChange([key]);
      }
      return true;
    }

    // 2) Rules exist, but none for this trigger: skip (no write/notify); return current "is error-free"
    if (opts?.trigger && rules.length === 0) {
      const hasError = (this._errors.get(key) || []).length > 0;
      return !hasError;
    }
    // Pick the smallest debounce
    const msList = rules.map(r => r?.debounceMs ?? Infinity);
    const debounceMs = Math.min(...msList) === Infinity ? 160 : Math.min(...msList);

    const prevTimer = this._debounceTimer.get(key);
    if (prevTimer) clearTimeout(prevTimer);

    const run = async (): Promise<boolean> => {
      const token = (this._validateToken.get(key) || 0) + 1;
      this._validateToken.set(key, token);

      // —— Begin validation: only notify/callback on first entering validating state
      const wasValidating = this._validating.has(key);
      if (!wasValidating) {
        this._validating.add(key);
        this._validated.delete(key);
        this.enqueueNotify([key], ChangeTag.Validating);
        this.triggerOnFieldsChange([key]);
      }

      const value = this.getFieldValue(key);

      let errors: string[] = [];
      let warns: string[] = [];

      try {
        const { errors: validErrors, warns: validWarns } = await runRulesWithMode(
          value,
          rules,
          'parallelAll',
          this._store,
          this._validateMessages
        );

        errors = validErrors;
        warns = validWarns;
      } catch (e: any) {
        // 4) Fallback: convert thrown errors into messages (avoid silent pass/hang)
        errors = [String(e?.message ?? e)];
      }

      // Concurrency elimination: if token changes, skip persisting results
      if (this._validateToken.get(key) !== token) return false;

      // === Compare new vs old; only persist & notify on change ===
      const prevErrors = this._errors.get(key) || [];
      const prevWarns = this._warnings.get(key) || [];

      const errorsChanged = !isEqual(prevErrors, errors);
      const warnsChanged = !isEqual(prevWarns, warns);

      if (errorsChanged) {
        errors.length ? this._errors.set(key, errors) : this._errors.delete(key);
      }
      if (warnsChanged) {
        warns.length ? this._warnings.set(key, warns) : this._warnings.delete(key);
      }

      let mask: ChangeMask = 0;
      let needFieldsChange = false;

      if (this._validating.has(key)) {
        this._validating.delete(key);
        this._validated.add(key);
        mask |= ChangeTag.Validated;
        needFieldsChange = true; // meta changed
      }
      if (errorsChanged) {
        mask |= ChangeTag.Errors;
        needFieldsChange = true;
      }
      if (warnsChanged) {
        mask |= ChangeTag.Warnings;
        needFieldsChange = true;
      }

      if (mask) this.enqueueNotify([key], mask);

      if (needFieldsChange) this.triggerOnFieldsChange([key]);

      return errors.length === 0;
    };

    return await new Promise<boolean>(resolve => {
      if (debounceMs > 0) {
        const t = setTimeout(async () => resolve(await run()), debounceMs);
        this._debounceTimer.set(key, t);
      } else {
        run().then(resolve);
      }
    });
  };

  private validateFields = async (names?: NamePath[], opts?: ValidateFieldsOptions) => {
    let list: string[];

    if (names && names.length > 0) {
      const normalized = names.map(n => keyOfName(n));
      if (opts?.dirty) {
        // Only take dirty ones among names
        list = normalized.filter(k => this._dirty.has(k));
      } else {
        // All names
        list = normalized;
      }
    } else if (opts?.dirty) {
      // No names provided → validate all dirty fields
      list = Array.from(this._dirty);
    } else {
      // No names provided → validate all fields

      list = this._fieldEntities.map(e => e.name as string);
    }

    if (!list.length) return true;

    // Mark validating
    this.transaction(() => {
      for (const k of list) {
        if (!this._validating.has(k)) {
          this._validating.add(k);
          this.enqueueNotify([k], ChangeTag.Validating);
        }
      }
    });

    const results = await this.transactionAsync(() => Promise.all(list.map(n => this.validateField(n, opts))));

    return results.every(Boolean);
  };

  // ------------------------------------------------
  // Transactions (begin/commit/rollback)
  // ------------------------------------------------

  private begin() {
    this._txDepth += 1;
  }

  private commit() {
    if (this._txDepth === 0) return;

    this._txDepth -= 1;

    if (this._txDepth === 0 && this._txPending.size) {
      const snap = Array.from(this._txPending.entries());
      this._txPending.clear();
      // eslint-disable-next-line no-bitwise
      for (const [k, mask] of snap) this._pending.set(k, (this._pending.get(k) || 0) | mask);

      this.scheduleFlush();
    }
  }

  private rollback() {
    this._txPending.clear();
    this._txDepth = 0;
  }

  private transaction = <T>(fn: () => T): T => {
    this.begin();
    try {
      return fn();
    } catch (e) {
      this.rollback();
      throw e;
    } finally {
      this.commit();
    }
  };

  private transactionAsync = async <T>(fn: () => Promise<T>): Promise<T> => {
    this.begin();
    try {
      return await fn();
    } catch (e) {
      this.rollback();
      throw e;
    } finally {
      this.commit();
    }
  };

  // ===== Array Operation =====

  /** Gets or creates an array key manager for tracking array field keys */
  private getArrayKeyManager = (name: string) => {
    let mgr = this.arrayKeyMap.get(name);
    if (!mgr) {
      mgr = { id: 0, keys: [] };
      this.arrayKeyMap.set(name, mgr);
    }
    return mgr;
  };

  /** Performs array operations on form fields (insert, remove, move, swap, replace) */
  private arrayOp = (name: NamePath, args: ArrayOpArgs): void => {
    const arr = this.getFieldValue(name);
    if (!Array.isArray(arr)) return;
    const next = arr.slice();
    const ak = keyOfName(name);

    const keyMgr = this.getArrayKeyManager(ak);

    const affected3 = this.collectDependents([ak]);
    this.recomputeTargets(affected3);

    const mark = (mask: ChangeMask = ChangeTag.Value) => this.enqueueNotify([name], mask);

    switch (args.op) {
      case 'insert': {
        const { index, item } = args;
        next.splice(index, 0, item);
        keyMgr.keys.splice(index, 0, (keyMgr.id += 1));
        this._store = deepSet(this._store, name, next);
        this._validated.delete(ak);
        mark();
        break;
      }
      case 'remove': {
        const { index } = args;
        next.splice(index, 1);
        keyMgr.keys.splice(index, 1);
        this._store = deepSet(this._store, name, next);
        this._validated.delete(ak);
        mark();
        break;
      }
      case 'move': {
        const { from, to } = args;
        const [x] = next.splice(from, 1);
        next.splice(to, 0, x);
        keyMgr.keys = move(keyMgr.keys, from, to);
        this._store = deepSet(this._store, name, next);
        this._validated.delete(ak);
        mark();
        break;
      }
      case 'swap': {
        const { from, to } = args;
        const tmp = next[from];
        next[from] = next[to];
        next[to] = tmp;
        [keyMgr.keys[from], keyMgr.keys[to]] = [keyMgr.keys[to], keyMgr.keys[from]];
        this._store = deepSet(this._store, name, next);
        this._validated.delete(ak);
        mark();
        break;
      }
      case 'replace': {
        const { index, item } = args;
        next[index] = item;
        this._store = deepSet(this._store, name, next);
        this._validated.delete(ak);
        mark();
        break;
      }
      default:
        break;
    }
  };

  private getArrayFields = (name: NamePath, initialValue?: StoreValue[], disabled?: boolean) => {
    const arr = (this.getFieldValue(name) as any[]) || initialValue || [];

    const ak = keyOfName(name);

    const keyMgr = this.getArrayKeyManager(ak);

    return arr.map((___, i) => {
      if (keyMgr.keys[i] === undefined) {
        keyMgr.keys[i] = keyMgr.id++;
      }
      return {
        disabled,
        key: String(keyMgr.keys[i]),
        name: `${ak}.${i}`
      };
    });
  };

  // ===== FieldChange =====
  /**
   * Triggers the onFieldsChange callback for specified fields
   *
   * @param nameList - Array of field names that have changed
   */
  triggerOnFieldsChange = (nameList: NamePath[]) => {
    if (this._callbacks?.onFieldsChange) {
      const fields = this.getFields();

      const changedFields = Object.values(fields).filter(field => {
        return nameList.includes(field.name);
      });

      this._callbacks?.onFieldsChange?.(changedFields, Object.values(fields));
    }
  };

  // ===== Submit =====

  /** Removes disabled and hidden fields from values before submission */
  private _pruneForSubmit(values: Store): Store {
    const disabled = Array.from(this._disabledKeys);
    const hidden = Array.from(this._hiddenKeys);
    const blocked = (k: string) => disabled.some(d => k.startsWith(d)) || hidden.some(h => k.startsWith(h));
    const walk = (node: any, prefix: PathTuple = []): any => {
      const k = keyOfName(prefix);
      if (blocked(k)) return undefined;
      if (Array.isArray(node)) {
        const out = node.map((it, i) => walk(it, [...prefix, String(i)])).filter(v => v !== undefined);
        return out;
      }
      if (node && typeof node === 'object') {
        const out: any = {};
        Object.keys(node).forEach(key => {
          const v = walk(node[key], [...prefix, key]);
          if (v !== undefined) out[key] = v;
        });
        return out;
      }
      return node;
    };
    return walk(values, []) ?? {};
  }

  /**
   * Builds the payload for failed form submission
   *
   * @returns Object containing error information and form state
   */
  private buildFailedPayload = () => {
    const errorMap = Object.fromEntries(this._errors);
    const warningMap = Object.fromEntries(this._warnings);

    const errorFields = Array.from(this._errors.entries()).map(([name, errors]) => ({
      errors,
      name,
      touched: this._touched.has(name),
      validating: this._validating.has(name),
      value: this.getFieldValue(name),
      warnings: this._warnings.get(name) || []
    }));

    // Note: Map iteration order is insertion order; if you want the
    // "first error field" to follow DOM order, you can sort here by
    // your field registration order (_fieldEntities).
    const firstErrorName = errorFields[0]?.name;

    return {
      errorCount: errorFields.length,
      errorFields,
      errorMap,
      firstErrorName,
      submittedAt: Date.now(),
      values: this._store,
      warningMap
    };
  };

  /** Submits the form after validation Calls onFinish if validation passes, onFinishFailed if it fails */
  private submit = async (prune: boolean = true) => {
    this._isSubmitted = true;
    this._isSubmitting = true;
    this._submitCount++;

    // Run internal rules validation
    const rulesOk = await this.validateFields();

    // Run schema validation if a schema validator is registered
    let schemaOk = true;
    if (this._schemaValidator) {
      const issues = await this._schemaValidator(this._store);
      if (issues.length > 0) {
        schemaOk = false;
        const entries = toEntries(issues);
        this.baseDispatch({ entries, type: 'setExternalErrors' });
      }
    }

    const ok = rulesOk && schemaOk;
    this._isSubmitting = false;

    if (ok) {
      this._isSubmitSuccessful = true;
      const values = prune ? this._pruneForSubmit(this._store) : this._store;
      this._callbacks.onFinish?.(values);
    } else {
      this._isSubmitSuccessful = false;
      this._callbacks.onFinishFailed?.(this.buildFailedPayload());
    }
  };

  /** Destroys the form and cleans up all state */
  private destroyForm = (clearOnDestroy?: boolean) => {
    if (clearOnDestroy) {
      // destroy form reset store
      this.updateStore({});
    }

    this._touched.clear();
    this._dirty.clear();
    this._errors.clear();
    this._warnings.clear();
    this._validating.clear();
    this._exactListeners.clear();
    this._prefixListeners.clear();
    this._pending.clear();

    this.rollback();
  };

  // ===== Batch processing notification =====

  private subscribe = (
    name: NamePath,
    cb: Listener['cb'],
    opt?: { includeChildren?: boolean; mask?: ChangeMask; notifyCurrent?: boolean }
  ) => {
    const key = keyOfName(name);

    const bucket = opt?.includeChildren ? this._prefixListeners : this._exactListeners;

    let listeners = bucket.get(key);

    if (!listeners) {
      listeners = new Set();
      bucket.set(key, listeners);
    }

    const listener: Listener = { cb, mask: opt?.mask ?? ChangeTag.All };

    listeners.add(listener);

    let done = false;
    return () => {
      if (done) return;
      done = true;
      const s = bucket.get(key);
      s?.delete(listener);
      if (s && s.size === 0) bucket.delete(key);
    };
  };

  private subscribeField = (
    names: NamePath | NamePath[] | undefined,
    cb: Listener['cb'],
    opt?: { includeChildren?: boolean; mask?: ChangeMask; notifyCurrent?: boolean }
  ) => {
    let arr: NamePath[];

    if (!names) {
      arr = ['*']; // Subscribe to all by default
    } else if (Array.isArray(names)) {
      arr = names;
    } else {
      arr = [names];
    }

    let active = true;
    const unsubs = arr.map(n => this.subscribe(n, cb, opt));

    if (opt?.notifyCurrent) {
      const currentName = arr[0] ?? '*';

      microtask(() => {
        if (!active) return;

        const currentKey = keyOfName(currentName);
        const currentValue = currentKey === '*' ? this._store : deepGet(this._store, currentKey);

        cb(currentValue, currentKey, this._store, opt.mask ?? ChangeTag.All);
      });
    }

    return () => {
      active = false;
      unsubs.forEach(fn => fn());
    };
  };

  // --- Private: Actually notify (merge triggers in a single microtask)

  private markPending = (key: string, mask: ChangeMask) => {
    if (this._txDepth > 0) {
      this._txPending.set(key, (this._txPending.get(key) ?? 0) | mask);
    } else {
      this._pending.set(key, (this._pending.get(key) ?? 0) | mask);
    }
  };

  private enqueueNotify = (names?: NamePath[] | string[], mask: ChangeMask = ChangeTag.All) => {
    if (!names || names.length === 0) this.markPending('*', mask);
    else for (const n of names) this.markPending(keyOfName(n), mask);

    this.scheduleFlush();
  };

  private scheduleFlush = () => {
    if (this._txDepth > 0) return; // During the transaction, do not flush; wait for commit.

    if (!this._flushScheduled) {
      this._flushScheduled = true;
      microtask(() => this.flushNotify());
    }
  };

  private flushNotify = () => {
    this._flushScheduled = false;

    if (this._pending.size === 0) return;

    const snapshot = Array.from(this._pending.entries());

    this._pending.clear();

    const fire = (key: string, mask: ChangeMask, listeners?: Set<Listener>) => {
      listeners?.forEach(({ cb, mask: m }) => {
        if ((m & mask) !== 0) cb(this.getFieldValue(key), key, this._store, mask);
      });
    };

    if (snapshot.some(([k]) => k === '*')) {
      for (const [k, listeners] of this._exactListeners) fire(k, ChangeTag.All, listeners);
      for (const [k, listeners] of this._prefixListeners) fire(k, ChangeTag.All, listeners);
      return;
    }

    for (const [k, mask] of snapshot) fire(k, mask, this._exactListeners.get(k));

    for (const [prefixKey, listeners] of this._prefixListeners) {
      let aggMask = 0;

      for (const [k, mk] of snapshot) {
        if (isUnderPrefix(k, prefixKey)) aggMask |= mk; // ← Only aggregate masks for matched keys
      }

      if (aggMask) {
        fire(prefixKey, aggMask, listeners);
      }
    }
  };

  getForm = () => {
    return {
      arrayOp: (name: NamePath) => ({
        insert: (index: number, item: any) => {
          this.dispatch({ args: { index, item, op: 'insert' }, name, type: 'arrayOp' });
        },
        move: (from: number, to: number) => {
          this.dispatch({ args: { from, op: 'move', to }, name, type: 'arrayOp' });
        },
        remove: (index: number) => {
          this.dispatch({ args: { index, op: 'remove' }, name, type: 'arrayOp' });
        },
        replace: (index: number, val: any) => {
          this.dispatch({ args: { index, item: val, op: 'replace' }, name, type: 'arrayOp' });
        },
        swap: (index: number, j: number) => {
          this.dispatch({ args: { from: index, op: 'swap', to: j }, name, type: 'arrayOp' });
        }
      }),
      getField: this.getField,
      getFieldError: this.getFieldError,
      getFields: this.getFields,
      getFieldsError: this.getFieldsError,
      getFieldsTouched: this.getFieldsTouched,
      getFieldsValidated: this.getFieldsValidated,
      getFieldsValidating: this.getFieldsValidating,
      getFieldsValue: this.getFieldsValue,
      getFieldsWarning: this.getFieldsWarning,
      getFieldTouched: this.getFieldTouched,
      getFieldValidated: this.getFieldValidated,
      getFieldValidating: this.getFieldValidating,
      getFieldValue: this.getFieldValue,
      getFieldWarning: this.getFieldWarning,
      getFormState: this.getFormState,
      getInternalHooks: this.getInternalHooks,
      isDisabled: this.isDisabled,
      isHidden: this.isHidden,
      resetFields: (names: string[] = []) => this.dispatch({ names, type: 'reset' }),
      setDisabled: this.setDisabled,
      setFieldsValue: (values: Store, validate = false) => this.dispatch({ type: 'setFieldsValue', validate, values }),
      setFieldValue: (name: string, value: StoreValue, validate = false) =>
        this.dispatch({ name, type: 'setFieldValue', validate, value }),
      setHidden: this.setHidden,
      submit: this.submit,
      use: this.use,
      validateField: (name: string, opts?: ValidateOptions) => this.dispatch({ name, opts, type: 'validateField' }),
      validateFields: (names?: string[], opts?: ValidateFieldsOptions) =>
        this.dispatch({ name: names, opts, type: 'validateFields' })
    };
  };

  getInternalHooks = () => {
    return {
      arrayOp: this.arrayOp,
      destroyForm: this.destroyForm,
      dispatch: this.dispatch,
      getArrayFields: this.getArrayFields,
      getInitialValue: this.getInitialValue,
      registerComputed: this.registerComputed,
      registerEffect: this.registerEffect,
      registerField: this.registerField,
      setCallbacks: this.setCallbacks,
      setFieldRules: this.setFieldRules,
      setFieldsValue: this.setFieldsValue,
      setFieldValue: this.setFieldValue,
      setInitialValues: this.setInitialValues,
      setPreserve: this.setPreserve,
      setSchemaValidator: this.setSchemaValidator,
      setValidateMessages: this.setValidateMessages,
      subscribeField: this.subscribeField,
      transaction: this.transaction,
      transactionAsync: this.transactionAsync
    };
  };
}

export default FormStore;
