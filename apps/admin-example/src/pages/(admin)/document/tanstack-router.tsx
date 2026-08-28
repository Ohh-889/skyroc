import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { STACK_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/tanstack-router';

const DocumentTanStackRouter = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return (
    <IframePage
      title={staticData.title}
      url={staticData.url}
    />
  );
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentTanStackRouter,
  staticData: {
    i18nKey: 'route.document_tanstack-router',
    menu: {
      icon: 'mdi:routes',
      order: 13
    },
    title: 'TanStack Router',
    url: STACK_DOC_URLS.tanstackRouter
  }
});
