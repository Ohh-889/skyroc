'use client';

import { createContext, useContext } from 'react';
import type { CheckboxGroupContextValue } from './types';

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export const useCheckboxGroup = () => {
  const context = useContext(CheckboxGroupContext);
  return context;
};

export const CheckboxGroupProvider = CheckboxGroupContext.Provider;
