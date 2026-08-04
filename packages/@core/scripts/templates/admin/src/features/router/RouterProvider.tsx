import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';

import { useAuth } from '../auth/use-auth';

import { router } from '.';

const RouterProvider = memo(() => {
  const { getHomeRoute, homeRoute, initAuth, isAuthInitialized, isLoggedIn, logout, userInfo } = useAuth();

  return (
    <TanStackRouterProvider
      context={{ initAuth, isAuthInitialized, isLoggedIn, userInfo, logout, getHomeRoute, homeRoute }}
      router={router}
    />
  );
});

export default RouterProvider;
