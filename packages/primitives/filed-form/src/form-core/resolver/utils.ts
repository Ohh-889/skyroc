/* eslint-disable consistent-return */

/**
 * Utility functions for form validation resolver
 * Provides helper functions to transform validation issues and create generic resolvers
 */

import type { AllPathsKeys } from '@skyroc/utils/type';
import { keyOfName } from '@skyroc/utils';
import type { Action, Middleware } from '../middleware';
import type { StandardSchemaV1NormalizedIssue } from './standard';

/**
 * Converts an array of validation issues into entries format
 * Groups issues by field path and collects error messages for each field
 */
export function toEntries<Values = any>(issues: StandardSchemaV1NormalizedIssue[]): [AllPathsKeys<Values>, string[]][] {
  // Create a map to group error messages by field path
  const map = new Map<string, string[]>();
  for (const { message, path } of issues) {
    // Convert path array to dot-notation string key
    const k = keyOfName(path);

    // Get existing messages for this field or create new array
    const arr = map.get(k) || [];
    arr.push(message);
    map.set(k, arr);
  }
  // Convert map to array of entries with proper typing
  return Array.from(map.entries()) as [AllPathsKeys<Values>, string[]][];
}

/**
 * Dispatches validation issues to the form state
 * Converts issues to entries format and triggers setExternalErrors action
 */
export function dispatchIssues<Values = any>(
  dispatch: (a: Action<Values>) => void,
  issues: StandardSchemaV1NormalizedIssue[]
) {
  // Convert issues to field entries format
  const entries = toEntries<Values>(issues);

  // Dispatch action to update form errors
  dispatch({ entries, type: 'setExternalErrors' });
}

/**
 * Creates a generic validation resolver middleware
 * Handles both single field validation and multiple fields validation
 */
export function createGenericResolver<Values = any>(
  validate: (state: Values, name?: string | string[]) => Promise<StandardSchemaV1NormalizedIssue[]>
): Middleware<Values> {
  return ({ dispatch, getState }) =>
    next =>
    async action => {
      // Only handle validation actions, pass through others
      if (action.type !== 'validateField' && action.type !== 'validateFields') {
        return next(action);
      }

      // Get current form state for validation
      const state = getState();

      // Handle single field validation
      if (action.type === 'validateField') {
        // Convert field name to dot-notation string
        const name = keyOfName(action.name) as AllPathsKeys<Values>;
        // Run validation for the specific field
        const issues = await validate(state, name);

        // Filter issues to only include ones for this specific field
        const filtered = issues.filter(it => it.path.join('.') === name);

        if (filtered.length > 0) {
          // Dispatch validation errors if any found
          dispatchIssues(dispatch, filtered);
        } else {
          // Clear errors for this field if validation passed
          dispatch({ entries: [[name, []]], type: 'setExternalErrors' });
        }

        return;
      }

      // Handle multiple fields validation
      if (action.type === 'validateFields') {
        // Run validation for all specified fields (or all fields if none specified)
        const issues = await validate(state, action.name?.map(keyOfName));
        // Dispatch all validation issues
        dispatchIssues(dispatch, issues);
      }
    };
}
