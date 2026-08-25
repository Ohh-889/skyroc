'use client';

/* eslint-disable react/hook-use-state */
import type { AllPathsKeys, PathToDeepType } from '@skyroc/utils/type';
import { deepGet, isArray, isNil, isObject } from '@skyroc/utils';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import type { SubscribeMaskOptions } from '../../form-core/event';
import { toMask } from '../../form-core/event';
import type { Meta } from '../../form-core/types';

import type { FormInstance, InternalFormInstance, MetaShapeFromPaths } from './FieldContext';
import { useFieldContext } from './FieldContext';

type UseFormFieldsStateOpts<Values> = {
  form?: FormInstance<Values>;
  includeChildren?: boolean;
  mask?: SubscribeMaskOptions;
};

function useFieldState<Values = any, T extends AllPathsKeys<Values> = AllPathsKeys<Values>>(
  names: T,
  opts?: UseFormFieldsStateOpts<Values>
): Meta<T, PathToDeepType<Values, T>>;

function useFieldState<Values = any, T extends AllPathsKeys<Values> = AllPathsKeys<Values>>(
  names: T[],
  opts?: UseFormFieldsStateOpts<Values>
): MetaShapeFromPaths<Values, T[]>;

// No arguments: return the full nested object
function useFieldState<Values = any>(): MetaShapeFromPaths<Values, []>;

// With a form instance: return the full nested object
function useFieldState<Values = any>(form: FormInstance<Values>): MetaShapeFromPaths<Values, []>;

function useFieldState<Values = any>(
  names?: AllPathsKeys<Values> | AllPathsKeys<Values>[] | FormInstance<Values>,
  opts?: UseFormFieldsStateOpts<Values>
) {
  const context = useFieldContext<Values>();

  const isFormInstance = isObject(names) && 'getFields' in names;

  const form = isFormInstance ? names : (opts?.form ?? context); // Prefer external form, otherwise use context

  if (!form) {
    throw new Error('Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.');
  }

  let subscribeNames: AllPathsKeys<Values>[] | undefined;

  if (isFormInstance) {
    // External form provided → subscribe to all
    subscribeNames = undefined;
  } else if (isNil(names)) {
    // No names provided → subscribe to all
    subscribeNames = undefined;
  } else if (isArray(names)) {
    // Multiple fields
    subscribeNames = names;
  } else {
    // Single field
    subscribeNames = [names];
  }

  const { getInternalHooks } = form as unknown as InternalFormInstance<Values>;

  const { subscribeField } = getInternalHooks();

  const state = form.getFields(subscribeNames);

  const mask = opts?.mask ?? {
    disabled: true,
    errors: true,
    hidden: true,
    touched: true,
    validated: true,
    validating: true,
    warnings: true
  };

  const includeChildren = opts?.includeChildren ?? (isFormInstance || !subscribeNames);

  const [_, forceUpdate] = useState({});

  useEffect(() => {
    const unregister = subscribeField(
      subscribeNames,
      () => {
        flushSync(() => forceUpdate({}));
      },
      {
        includeChildren,
        mask: toMask(mask),
        notifyCurrent: isFormInstance || Boolean(opts?.form)
      }
    );

    return unregister;
  }, []);

  if (!subscribeNames) {
    // names empty → return Map shape
    return state;
  }
  if (subscribeNames.length === 1) {
    // Single field → return that field's meta directly
    return deepGet(state, subscribeNames[0]);
  }
  // Multiple fields → return object
  return state;
}

export { useFieldState };
