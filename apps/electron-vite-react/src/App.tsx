import { Suspense, lazy } from 'react';

import { router } from './features/router';
import RouterProvider from './features/router/RouterProvider';

interface AppProps {}

const Devtools = lazy(() => import('./features/devtools').then(module => ({ default: module.Devtools })));

const App = (_props: AppProps) => {
  return (
    <>
      <RouterProvider />

      {import.meta.env.DEV ? (
        <Suspense fallback={null}>
          <Devtools router={router} />
        </Suspense>
      ) : null}
    </>
  );
};

export default App;
