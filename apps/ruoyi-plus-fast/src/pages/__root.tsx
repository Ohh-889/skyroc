import { Outlet, createRootRouteWithContext, useLocation, useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import ErrorPage from './error';
import NotFound from './not-found';
import GlobalLoading from './loading';

interface RouteMatchWithStaticData {
  /** Route metadata used by global document side effects. */
  staticData?: Router.Meta;
}

function getCurrentRouteMeta(matches: RouteMatchWithStaticData[]) {
  return matches.findLast(match => match.staticData?.i18nKey || match.staticData?.title)?.staticData ?? null;
}

const Root = () => {
  const { pathname } = useLocation();
  const matches = useMatches();
  const { t } = useTranslation();
  const routeMeta = getCurrentRouteMeta(matches);
  const documentTitle = routeMeta?.i18nKey ? t(routeMeta.i18nKey) : routeMeta?.title;

  useEffect(() => {
    if (documentTitle) {
      document.title = documentTitle;
    }
  }, [documentTitle]);

  useEffect(() => {
    globalConfig.nprogress.done();

    return () => {
      globalConfig.nprogress.start();
    };
  }, [pathname]);

  return <Outlet />;
};

export const Route = createRootRouteWithContext<Router.RouterContext>()({
  component: Root,
  notFoundComponent: NotFound,
  beforeLoad: async ({ context }) => {
    if (!context.isAuthInitialized) {
      await context.initAuth();
    }
  },
  staticData: {
    title: 'SkyrocAdmin'
  },
  errorComponent: ErrorPage,
  pendingComponent: GlobalLoading
});
