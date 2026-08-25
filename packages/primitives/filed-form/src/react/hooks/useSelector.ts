'use client';
/* eslint-disable no-bitwise */

/**
 * Hook for selecting and subscribing to derived form state
 * Provides efficient re-rendering by only updating when selected data changes
 */

import type { AllPathsKeys } from '@skyroc/utils/type';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { ChangeMask } from '../../form-core/event';
import { ChangeTag } from '../../form-core/event';

import { useFieldContext } from './FieldContext';
import type { FormInstance, InternalFormInstance } from './FieldContext';

/**
 * Equality comparison function type
 */
type Eq<T> = (a: T, b: T) => boolean;

/**
 * Options for useSelector hook configuration
 */
type UseSelectorOpts<Values, R> = {
  /** Array of field names to subscribe to; if empty, subscribes to all fields */
  deps?: AllPathsKeys<Values>[];
  /** Custom equality function to determine if selected value has changed */
  eq?: Eq<R>;
  /** Optional form instance, uses context form if not provided */
  form?: FormInstance<Values>;
  /** Whether to include child field changes in subscription */
  includeChildren?: boolean;
  /** Bitmask specifying which types of changes to listen for */
  mask?: ChangeMask;
};

/**
 * Hook to select and subscribe to derived form state with optimized re-rendering
 * Only triggers re-renders when the selected value actually changes
 *
 * @example
 * ```tsx
 * // Basic usage: Compute total from two fields
 * function PriceCalculator() {
 *   const total = useSelector((get) => {
 *     const price = get('price') || 0;
 *     const quantity = get('quantity') || 0;
 *     return price * quantity;
 *   }, { deps: ['price', 'quantity'] });
 *
 *   return (
 *     <Form initialValues={{ price: 0, quantity: 1 }}>
 *       <Field name="price">
 *         <Input type="number" placeholder="Price" />
 *       </Field>
 *       <Field name="quantity">
 *         <Input type="number" placeholder="Quantity" />
 *       </Field>
 *       <div>Total: ${total}</div>
 *     </Form>
 *   );
 * }
 * ```
 *
 */
export function useSelector<Values = any, R = unknown>(
  selector: (get: (n: AllPathsKeys<Values>) => any, all: Values) => R,
  opts?: UseSelectorOpts<Values, R>
): R {
  // Get form context from React context
  const ctxForm = useFieldContext<Values>();
  // Use provided form instance or fall back to context form
  const form = opts?.form ?? ctxForm;

  // Use custom equality function or default to Object.is
  const eq = opts?.eq ?? Object.is;

  // Ensure form instance is available
  if (!form) {
    throw new Error('Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.');
  }

  // Extract internal hooks for field subscription
  const { getInternalHooks } = form as unknown as InternalFormInstance<Values>;
  const { subscribeField } = getInternalHooks();

  // Extract configuration options
  const deps = opts?.deps;
  const mask = opts?.mask ?? ChangeTag.Value; // Default to value changes only
  const includeChildren = opts?.includeChildren;

  // Function to compute the selected value from current form state
  const compute = () => {
    const getField = form.getFieldValue;
    const all = form.getFieldsValue() as Values;
    return selector(getField, all);
  };

  // Initialize state with computed value
  const [val, setVal] = useState<R>(compute);

  // Reference to track previous value for equality comparison
  const prevRef = useRef<R>(val);

  // Set up subscription to form field changes
  useEffect(() => {
    // Change handler that recomputes and updates state if value changed
    function updateSelectedValue() {
      const next = compute();
      // Only update if the selected value has actually changed
      if (!eq(prevRef.current, next)) {
        prevRef.current = next;
        // Use flushSync to ensure synchronous updates and reduce visual flicker
        flushSync(() => setVal(next));
      }
    }

    // Subscribe to field changes and return cleanup function
    const unregister = subscribeField(deps, () => updateSelectedValue(), {
      includeChildren,
      mask,
      notifyCurrent: Boolean(opts?.form)
    });

    return unregister;
  }, []);

  // Return the current selected value
  return val;
}
