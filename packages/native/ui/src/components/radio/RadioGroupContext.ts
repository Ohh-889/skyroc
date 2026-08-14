import { createContext } from 'react';
import type { RadioGroupContextValue } from './types';

/** Context for RadioGroup to communicate with child Radio components */
const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

export { RadioGroupContext };
