import { createContext } from 'react';
import type { CheckboxGroupContextValue } from './types';

/** Context for CheckboxGroup to communicate with child Checkbox components */
const CheckboxGroupContext = createContext<CheckboxGroupContextValue | undefined>(undefined);

export { CheckboxGroupContext };
