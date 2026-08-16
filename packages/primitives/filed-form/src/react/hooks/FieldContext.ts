/* eslint-disable max-params */
'use client';
/* eslint-disable no-bitwise */

/**
 * Form field context and type definitions
 * Provides comprehensive type-safe interfaces for form state management,
 * field operations, validation, and React context integration
 */

import { createContext, useContext } from 'react';
import type {
  AllPathsKeys,
  ArrayElementValue,
  ArrayKeys,
  DeepPartial,
  MergeUnion,
  PathToDeepType,
  ShapeFromPaths,
  Wrap
} from '@skyroc/type-utils';
import type { ChangeMask } from '../../form-core/event';
import type { Action, ArrayOpArgs, Middleware } from '../../form-core/middleware';
import type { FieldEntity, Meta, StoreValue } from '../../form-core/types';
import type { ValidateMessages } from '../../form-core/validate';
import type { Rule, ValidateOptions } from '../../form-core/validation';

/**
 * Interface for list item rendering in dynamic arrays
 * Provides stable keys and field names for array field management
 */
export type ListRenderItem = {
  /** Stable key for React rendering optimization */
  key: string;
  /** Field name path for this array item */
  name: string;
};

/**
 * Utility type to build hierarchical metadata structure from field paths
 * Recursively wraps each path segment with Meta information
 */
type BuildMetaShape<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? T[K] extends readonly (infer U)[]
      ? Wrap<Extract<K, string>, Array<BuildMetaShape<U, R>>>
      : Wrap<Extract<K, string>, BuildMetaShape<T[K], R>>
    : never
  : P extends `${infer K}`
    ? K extends keyof T
      ? Wrap<Extract<K, string>, Meta<P, PathToDeepType<T, P>>>
      : never
    : never;

/**
 * Converts an array of field paths into a hierarchical Meta structure
 * Provides type-safe access to field metadata based on field paths
 */
export type MetaShapeFromPaths<T, Ps extends readonly string[]> = Ps extends never[] | []
  ? { [K in keyof T]: Meta<K & string, PathToDeepType<T, K & string>> }
  : MergeUnion<Ps[number] extends infer P ? (P extends string ? BuildMetaShape<T, P> : never) : never>;

/**
 * Comprehensive form state interface
 * Contains all form-level and field-level state information
 */
export interface FormState<Values = any> {
  /** Map of fields that have been modified from initial values */
  dirtyFields: Record<AllPathsKeys<Values>, boolean>;
  /** Map of field validation errors */
  errors: Record<AllPathsKeys<Values>, string[]>;
  /** Initial form values */
  initialValues: DeepPartial<Values>;

  // === Global state flags ===
  /** Whether any field has been modified */
  isDirty: boolean;
  /** Whether the last submission was successful */
  isSubmitSuccessful: boolean;
  /** Whether the form has been submitted at least once */
  isSubmitted: boolean;
  /** Whether the form is currently being submitted */
  isSubmitting: boolean;
  /** Whether all fields pass validation */
  isValid: boolean;
  /** Whether any field is currently being validated */
  isValidating: boolean;
  /** Number of times the form has been submitted */
  submitCount: number;

  // === Field-level state maps ===
  /** Map of fields that have been interacted with */
  touchedFields: Record<AllPathsKeys<Values>, boolean>;
  /** Map of fields that have completed validation */
  validatedFields: Record<AllPathsKeys<Values>, boolean>;
  /** Map of fields currently being validated */
  validatingFields: Record<AllPathsKeys<Values>, boolean>;

  // === Form data ===
  /** Current form values */
  values: Values;
  /** Map of field validation warnings */
  warnings: Record<AllPathsKeys<Values>, string[]>;
}

/**
 * Interface for form value operations
 * Provides methods to get and set form field values
 */
export interface ValuesOptions<Values = any> {
  /** Get array operations for a specific array field */
  arrayOp: <K extends ArrayKeys<Values>>(
    name: K
  ) => {
    /** Insert item at specified index */
    insert: (index: number, item: ArrayElementValue<Values, K>) => void;
    /** Move item from one index to another */
    move: (from: number, to: number) => void;
    /** Remove item at specified index */
    remove: (index: number) => void;
    /** Replace item at index with new value */
    replace: (index: number, val: ArrayElementValue<Values, K>) => void;
    /** Swap positions of two items */
    swap: (i: number, j: number) => void;
  };
  /** Get values of specified fields or all fields */
  getFieldsValue: <K extends AllPathsKeys<Values>[]>(name?: K) => ShapeFromPaths<Values, K>;
  /** Get value of a specific field */
  getFieldValue: <T extends AllPathsKeys<Values>>(name: T) => PathToDeepType<Values, T>;
  /** Set disabled state for a specific field */
  setDisabled: (name: AllPathsKeys<Values>, disabled: boolean) => void;
  /** Set values for multiple fields */
  setFieldsValue: (values: DeepPartial<Values>) => void;
  /** Set value for a specific field */
  setFieldValue: <T extends AllPathsKeys<Values>>(name: T, value: PathToDeepType<Values, T>) => void;
  /** Set hidden state for a specific field */
  setHidden: (name: AllPathsKeys<Values>, hidden: boolean) => void;
}

/**
 * Interface for form state query operations
 * Provides methods to access field metadata and form state
 */
export interface StateOptions<Values = any> {
  /** Get complete metadata for a specific field */
  getField: <T extends AllPathsKeys<Values>>(name: T) => Meta<T, PathToDeepType<Values, T>>;
  /** Get validation errors for a specific field */
  getFieldError: (name: AllPathsKeys<Values>) => string[];
  /** Get metadata for specified fields or all fields */
  getFields: <T extends AllPathsKeys<Values>[]>(names?: T) => MetaShapeFromPaths<Values, T>;
  /** Get validation errors for specified fields */
  getFieldsError: (names?: AllPathsKeys<Values>[]) => Record<AllPathsKeys<Values>, string[]>;
  /** Check if any of the specified fields have been touched */
  getFieldsTouched: (names?: AllPathsKeys<Values>[]) => boolean;
  /** Check if any of the specified fields have been validated */
  getFieldsValidated: (names?: AllPathsKeys<Values>[]) => boolean;
  /** Check if any of the specified fields are currently validating */
  getFieldsValidating: (names?: AllPathsKeys<Values>[]) => boolean;
  /** Get validation warnings for specified fields */
  getFieldsWarning: (names?: AllPathsKeys<Values>[]) => Record<AllPathsKeys<Values>, string[]>;
  /** Check if a specific field has been touched */
  getFieldTouched: (name: AllPathsKeys<Values>) => boolean;
  /** Check if a specific field has been validated */
  getFieldValidated: (name: AllPathsKeys<Values>) => boolean;
  /** Check if a specific field is currently validating */
  getFieldValidating: (name: AllPathsKeys<Values>) => boolean;
  /** Get validation warnings for a specific field */
  getFieldWarning: (name: AllPathsKeys<Values>) => string[];
  /** Get complete form state snapshot */
  getFormState: () => FormState;
  /** Check if a specific field is disabled */
  isDisabled: (name: AllPathsKeys<Values>) => boolean;
  /** Check if a specific field is hidden */
  isHidden: (name: AllPathsKeys<Values>) => boolean;
}

/**
 * Extended validation options for multiple fields
 */
export interface ValidateFieldsOptions extends ValidateOptions {
  /** Only validate fields that have been modified */
  dirty?: boolean;
}

/**
 * Interface for form operation methods
 * Provides methods to perform form actions like validation, reset, and submission
 */
export interface OperationOptions<Values = any> {
  /** Reset specified fields to their initial values */
  resetFields: (names?: AllPathsKeys<Values>[]) => void;
  /** Submit the form after validation */
  submit: () => void;
  /** Add middleware to the form processing pipeline */
  use: (mw: Middleware<Values, AllPathsKeys<Values>>) => void;
  /** Validate a specific field */
  validateField: (name: AllPathsKeys<Values>, opts?: ValidateOptions) => Promise<boolean>;
  /** Validate multiple fields */
  validateFields: (names?: AllPathsKeys<Values>[], opts?: ValidateFieldsOptions) => Promise<boolean>;
}

/**
 * Interface for validation error information
 * Used when form submission fails validation
 */
export interface ValidateErrorEntity<Values = any> {
  /** Total number of fields with validation errors */
  errorCount: number;
  /** Array of field metadata with errors (for UI scrolling and display) */
  errorFields: Meta<string, any>[];
  /** Map of field names to their error messages */
  errorMap: Record<string, string[]>;
  /** Name of the first field with an error (for auto-focus) */
  firstErrorName?: string;
  /** Timestamp when validation failed */
  submittedAt: number;
  /** Current form values at time of validation failure */
  values: Values;
  /** Map of field names to their warning messages */
  warningMap: Record<string, string[]>;
}

/**
 * Interface for form lifecycle callback options
 * Defines callbacks that can be registered to respond to form events
 */
export interface RegisterCallbackOptions<Values = any> {
  /** Called when field metadata changes (errors, validation state, etc.) */
  onFieldsChange?: (
    changedFields: Meta<AllPathsKeys<Values>, PathToDeepType<Values, AllPathsKeys<Values>>>[],
    allFields: Meta<AllPathsKeys<Values>, PathToDeepType<Values, AllPathsKeys<Values>>>[]
  ) => void;

  /** Called when form submission succeeds validation */
  onFinish?: (values: Values) => void;

  /** Called when form submission fails validation */
  onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void;

  /** Called when form values change */
  onValuesChange?: (changedValues: Partial<Values>, values: Values) => void;
}

/**
 * Interface for internal form configuration callbacks
 * Used internally to configure form behavior and lifecycle
 */
export interface InternalCallbacks<Values = any> {
  /** Destroy form instance and optionally clear data */
  destroyForm: (clearOnDestroy?: boolean) => void;
  /** Set form lifecycle callbacks */
  setCallbacks: (callbacks: RegisterCallbackOptions<Values>) => void;
  /** Set initial form values */
  setInitialValues: (values?: DeepPartial<Values>) => void;
  /** Set field preservation behavior */
  setPreserve: (preserve: boolean) => void;
  /** Set schema-level validator for submit validation */
  setSchemaValidator: (
    validator: (state: Values, name?: string | string[]) => Promise<{ message: string; path: readonly string[] }[]>
  ) => void;
  /** Set custom validation messages */
  setValidateMessages: (messages: ValidateMessages) => void;
}

/**
 * Interface for internal field management hooks
 * Provides low-level field operations and state management
 */
export interface InternalFieldHooks<Values = any> {
  /** Perform array operations on array fields */
  arrayOp: (name: AllPathsKeys<Values>, args: ArrayOpArgs) => void;
  /** Dispatch actions to the form store */
  dispatch: (action: Action) => void;
  /** Get array field items with stable keys */
  getArrayFields: (name: ArrayKeys<Values>, initialValue?: StoreValue[], disabled?: boolean) => ListRenderItem[];
  /** Get initial value for a field */
  getInitialValue: <T extends AllPathsKeys<Values>>(name: T) => PathToDeepType<Values, T>;
  /** Register a computed field with dependencies */
  registerComputed: <T extends AllPathsKeys<Values>>(
    name: T,
    deps: AllPathsKeys<Values>[],
    compute: (get: (n: AllPathsKeys<Values>) => any, all: Values) => PathToDeepType<Values, T>
  ) => () => void;
  /** Register a reactive effect with dependencies */
  registerEffect: (
    deps: AllPathsKeys<Values>[],
    effect: (get: (n: AllPathsKeys<Values>) => any, all: Values) => void
  ) => () => void;
  /** Register a field entity for state management */
  registerField: (entity: FieldEntity) => () => void;
  /** Set validation rules for a field */
  setFieldRules: (name: AllPathsKeys<Values>, rules?: Rule[]) => void;
  /** Set values for multiple fields */
  setFieldsValue: (values: DeepPartial<Values>) => void;
  /** Set value for a specific field */
  setFieldValue: (name: AllPathsKeys<Values>, value: PathToDeepType<Values, AllPathsKeys<Values>>) => void;
  /** Set validation rules for a field (alias for setFieldRules) */
  setRules: (name: AllPathsKeys<Values>, rules?: Rule[]) => void;
  /** Subscribe to field changes with optional filtering */
  subscribeField: <T extends AllPathsKeys<Values>>(
    name: T | T[] | undefined,
    cb: (value: PathToDeepType<Values, T>, name: T, values: Values, mask: ChangeMask) => void,
    opt?: { includeChildren?: boolean; mask?: ChangeMask; notifyCurrent?: boolean }
  ) => () => void;
  /** Execute function within a transaction for batched updates */
  transaction: <T>(fn: () => T) => T;
  /** Execute async function within a transaction for batched updates */
  transactionAsync: <T>(fn: () => Promise<T>) => Promise<T>;
}

/**
 * Main form instance interface
 * Combines all form operation interfaces for external API
 */
export interface FormInstance<Values = any>
  extends ValuesOptions<Values>, StateOptions<Values>, OperationOptions<Values> {}

/**
 * Combined interface for all internal form hooks
 * Used internally for form configuration and field management
 */
export interface InternalFormHooks<Values = any> extends InternalCallbacks<Values>, InternalFieldHooks<Values> {}

/**
 * Internal form context interface
 * Extends FormInstance with additional context-specific properties
 */
export interface InternalFormContext<Values = any> extends FormInstance<Values> {
  /** Default validation trigger events for fields */
  validateTrigger: string | string[];
}

/**
 * Complete internal form instance interface
 * Provides access to both public API and internal hooks
 */
export interface InternalFormInstance<Values = any> extends InternalFormContext<Values> {
  /** Internal API for accessing low-level form operations - not recommended for external use */
  getInternalHooks: () => InternalFormHooks<Values>;
}

/**
 * React context for form field management
 * Provides form instance and configuration to child components
 */
export const FieldContext = createContext<InternalFormContext | null>(null);

/**
 * Context provider component for form fields
 * Wraps form components to provide form context
 */
export const FieldContextProvider = FieldContext.Provider;

/**
 * Hook to access form context from child components
 * Returns the form instance and configuration from the nearest Form provider
 */
export const useFieldContext = <Values = any>(): InternalFormContext<Values> | null => {
  const context = useContext(FieldContext);

  return context;
};
