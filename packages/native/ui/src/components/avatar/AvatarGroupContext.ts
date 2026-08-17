import { createContext } from 'react';
import type { AvatarGroupContextValue } from './types';

/** Context for AvatarGroup to pass shared size and ring class down to child Avatar components */
const AvatarGroupContext = createContext<AvatarGroupContextValue | undefined>(undefined);

export { AvatarGroupContext };
