import { Sonner } from '@skyroc/web-ui';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import ErrorPage from './error';
import LoadingPage from './loading';
import NotFoundPage from './not-found';

const RootLayout = () => {
  return (
    <div className="min-h-screen w-full  text-foreground">
      <Sonner />

      <Outlet />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
  pendingComponent: LoadingPage
});
