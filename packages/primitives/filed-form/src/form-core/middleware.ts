/**
 * Form middleware system for action processing and validation Provides type-safe action definitions and middleware
 * composition utilities
 */

import type { NamePath } from '@skyroc/utils';
import type { AllPathsKeys, PathToDeepType } from '@skyroc/utils/type';

import type { ValidateOptions } from './validation';

/** Extended validation options for validating multiple fields */
export interface ValidateFieldsOptions extends ValidateOptions {
  /** Only validate fields that have been modified (dirty) */
  dirty?: boolean;
}

/** Available array operations for form field arrays */
export type ArrayOp = 'insert' | 'move' | 'remove' | 'replace' | 'swap';

/** Arguments for different array operations Each operation type has its own specific argument structure */
export type ArrayOpArgs =
  | { index: number; item: any; op: 'insert' } // Insert item at index
  | { index: number; op: 'remove' } // Remove item at index
  | { from: number; op: 'move'; to: number } // Move item from one index to another
  | { from: number; op: 'swap'; to: number } // Swap items at two indices
  | { index: number; item: any; op: 'replace' }; // Replace item at index

/** Utility type to extract arguments for a specific array operation */
export type ArgsOf<T extends ArrayOp> = Extract<ArrayOpArgs, { op: T }>;

/** Action type for array operations on form fields */
export type ArrayOpAction = { args: ArgsOf<ArrayOp>; name: NamePath; type: 'arrayOp' };

/** Union type representing all possible form actions Each action type corresponds to a specific form operation */
export type Action<Values = any, T extends AllPathsKeys<Values> = AllPathsKeys<Values>> =
  | { name: T; type: 'setFieldValue'; validate?: boolean; value: PathToDeepType<Values, T> } // Set single field value
  | { type: 'setFieldsValue'; validate?: boolean; values: Values } // Set multiple field values
  | { names?: T[]; type: 'reset' } // Reset fields to initial values
  | { name: T; opts?: ValidateOptions; type: 'validateField' } // Validate single field
  | { name?: T[]; opts?: ValidateFieldsOptions; type: 'validateFields' } // Validate multiple fields
  | { entries: Array<[T, string[]]>; type: 'setExternalErrors' } // Set external validation errors
  | ArrayOpAction; // Array operations

/** Context object provided to middleware functions Contains methods to interact with the form state and dispatch actions */
export type MiddlewareCtx<Values, T extends AllPathsKeys<Values> = AllPathsKeys<Values>> = {
  /** Dispatch an action to the form store */
  dispatch(a: Action<Values, T>): void;
  /** Get current form state values */
  getState(): Values;
};

/**
 * Middleware function type for form action processing Follows the standard middleware pattern: (ctx) => (next) =>
 * (action) => void Allows intercepting and modifying form actions before they reach the store
 */
export type Middleware<Values = any, T extends AllPathsKeys<Values> = AllPathsKeys<Values>> = (
  ctx: MiddlewareCtx<Values, T>
) => (next: (a: Action<Values, T>) => void) => (a: Action<Values, T>) => void;

/**
 * Composes multiple functions into a single function Used to combine multiple middleware functions into a single
 * middleware chain
 */
export function compose(...fns: ((...args: any[]) => any)[]) {
  // No functions provided, return identity function
  if (fns.length === 0) return (arg: any) => arg;
  // Single function, return it directly
  if (fns.length === 1) return fns[0];
  // Multiple functions, compose them right-to-left
  return fns.reduce(
    (a, b) =>
      (...args: any[]) =>
        a(b(...args))
  );
}
