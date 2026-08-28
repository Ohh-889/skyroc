/* eslint-disable consistent-return */

import type { Middleware } from '../middleware';
import { createGenericResolver } from './utils';

/** The Standard Schema interface. */
export type StandardSchemaV1<Input = unknown, Output = Input> = {
  /** The Standard Schema properties. */
  readonly '~standard': StandardSchemaV1Props<Input, Output>;
};

/** The Standard Schema types interface. */
interface StandardSchemaV1Types<Input = unknown, Output = Input> {
  /** The input type of the schema. */
  readonly input: Input;
  /** The output type of the schema. */
  readonly output: Output;
}

/** The Standard Schema properties interface. */
interface StandardSchemaV1Props<Input = unknown, Output = Input> {
  /** Inferred types associated with the schema. */
  readonly types?: StandardSchemaV1Types<Input, Output> | undefined;
  /** Validates unknown input values. */
  readonly validate: (
    value: unknown,
    options?: StandardSchemaV1Options | undefined
  ) => StandardSchemaV1Result<Output> | Promise<StandardSchemaV1Result<Output>>;
  /** The vendor name of the schema library. */
  readonly vendor: string;
  /** The version number of the standard. */
  readonly version: 1;
}

/** The result interface of the validate function. */
type StandardSchemaV1Result<Output> = StandardSchemaV1SuccessResult<Output> | StandardSchemaV1FailureResult;
/** The result interface if validation succeeds. */
interface StandardSchemaV1SuccessResult<Output> {
  /** The non-existent issues. */
  readonly issues?: undefined;
  /** The typed output value. */
  readonly value: Output;
}
/** The result interface if validation fails. */
interface StandardSchemaV1FailureResult {
  /** The issues of failed validation. */
  readonly issues: ReadonlyArray<StandardSchemaV1Issue>;
}

/** The issue interface of the failure output. */
export interface StandardSchemaV1Issue {
  /** The error message of the issue. */
  readonly message: string;
  /** The path of the issue, if any. */
  readonly path?: ReadonlyArray<PropertyKey | StandardSchemaV1PathSegment> | undefined;
}

/** Internal normalized issue type Path has been flattened to string[] */
export interface StandardSchemaV1NormalizedIssue {
  /** Error message */
  readonly message: string;
  /** Flattened path */
  readonly path: readonly string[];
}
/** The path segment interface of the issue. */
/** The options interface for the validate function. */
interface StandardSchemaV1Options {
  readonly libraryOptions?: Record<string, unknown> | undefined;
}

/** The path segment interface of the issue. */
interface StandardSchemaV1PathSegment {
  /** The key representing a path segment. */
  readonly key: PropertyKey;
}

/** Type guard to check if an object implements the StandardSchemaV1 interface */
export function isStandardSchema(obj: any): obj is StandardSchemaV1 {
  return obj && obj['~standard'] && typeof obj['~standard'].validate === 'function';
}

/**
 * Creates a resolver middleware for StandardSchemaV1 schemas Supports both sync/async validation and handles
 * validateField and validateFields
 */
export function createStandardResolver<Values = any>(schema: StandardSchemaV1<Values, unknown>): Middleware<Values> {
  return createGenericResolver<Values>(async state => {
    // Execute schema validation (handles both sync and async validators)
    const result = await Promise.resolve(schema['~standard'].validate(state));

    // If validation succeeded (no issues), return empty array
    if (!('issues' in result)) return [];

    // Transform schema issues to normalized format
    const issues = result.issues?.map(issue => {
      // Flatten path segments to string array
      const path = issue.path
        ? issue.path.map(seg => (typeof seg === 'object' && 'key' in seg ? String(seg.key) : String(seg)))
        : [];
      return {
        message: issue.message,
        path
      };
    });

    return issues || [];
  });
}
