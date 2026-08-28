import { Provider } from 'jotai';
import type { ReactNode } from 'react';

import { globalStore } from '../store/global';

export interface JotaiProviderProps {
  /** 需要绑定到全局 Jotai store 的 React 子树。 */
  children?: ReactNode;
}

/**
 * Jotai Provider component bound to the package-level `globalStore`.
 *
 * @example
 *   ```tsx
 *   function App() {
 *     return (
 *       <JotaiProvider>
 *         <YourApp />
 *       </JotaiProvider>
 *     );
 *   }
 *   ```;
 */
const JotaiProvider = (props: JotaiProviderProps) => {
  const { children } = props;

  return <Provider store={globalStore}>{children}</Provider>;
};

export { JotaiProvider };
