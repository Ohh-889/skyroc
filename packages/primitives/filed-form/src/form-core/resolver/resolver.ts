/** Form schema resolver module Provides functionality to resolve different types of form schemas into middleware */

import type { Middleware } from '../middleware';
import type { StandardSchemaV1, StandardSchemaV1NormalizedIssue } from './standard';
import { createStandardResolver, isStandardSchema } from './standard';
import { createGenericResolver } from './utils';

/** Union type representing supported form schema types */
export type FormSchema<Values = any> =
  | StandardSchemaV1<unknown, unknown> // Standard schema v1 implementation
  | ((state: Values, name: string | string[] | undefined) => Promise<StandardSchemaV1NormalizedIssue[]>); // Custom validation function

/**
 * Creates a no-operation middleware that passes through all actions unchanged Used as a fallback when schema resolution
 * fails
 */
function noopMiddleware<Values = any>(): Middleware<Values> {
  return () => next => action => next(action);
}

/** Extracts a raw validate function from a schema Returns a function that validates state and returns normalized issues */
export function extractSchemaValidator<Values = any>(
  schema: FormSchema<Values>
): ((state: Values, name?: string | string[]) => Promise<StandardSchemaV1NormalizedIssue[]>) | null {
  if (isStandardSchema(schema)) {
    return async (state: Values) => {
      const result = await Promise.resolve(schema['~standard'].validate(state));
      if (!('issues' in result)) return [];
      return (
        result.issues?.map(issue => {
          const path = issue.path
            ? issue.path.map(seg => (typeof seg === 'object' && 'key' in seg ? String(seg.key) : String(seg)))
            : [];
          return { message: issue.message, path };
        }) || []
      );
    };
  }

  if (typeof schema === 'function') {
    return schema as (state: Values, name?: string | string[]) => Promise<StandardSchemaV1NormalizedIssue[]>;
  }

  return null;
}

/**
 * Resolves a form schema into appropriate middleware based on its type Supports StandardSchemaV1 and custom validation
 * functions
 */
export function resolveSchema<Values = any>(schema: FormSchema<Values>): Middleware<Values> {
  // Check if schema follows StandardSchemaV1 interface
  if (isStandardSchema(schema)) {
    return createStandardResolver<Values>(schema as StandardSchemaV1<Values, unknown>);
  }

  // Check if schema is a custom validation function
  if (typeof schema === 'function') {
    return createGenericResolver(schema);
  }

  // Log warning for unsupported schema types
  console.warn('[resolveSchema] Unsupported schema type, ignored:', schema);

  // Return no-op middleware as fallback
  return noopMiddleware();
}
