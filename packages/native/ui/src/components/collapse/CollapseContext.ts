import { createContext } from 'react';
import type { CollapseContextValue } from './types';

/** Context for Collapse to communicate with child CollapseItem components */
const CollapseContext = createContext<CollapseContextValue | undefined>(undefined);

export { CollapseContext };
