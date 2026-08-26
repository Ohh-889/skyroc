'use client';

import { createContext, useContext } from 'react';
import type { ComponentConfig } from './types';

export const ConfigContext = createContext<ComponentConfig>({});

export const useComponentConfig = <T extends keyof ComponentConfig>(component: T): ComponentConfig[T] => {
  const config = useContext(ConfigContext);

  return config?.[component] ?? {};
};
