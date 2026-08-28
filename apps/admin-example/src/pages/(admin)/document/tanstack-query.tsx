import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { STACK_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/tanstack-query';

const DocumentTanStackQuery = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return (
    <IframePage
      title={staticData.title}
      url={staticData.url}
    />
  );
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentTanStackQuery,
  staticData: {
    i18nKey: 'route.document_tanstack-query',
    menu: {
      icon: 'simple-icons:reactquery',
      order: 14
    },
    title: 'TanStack Query',
    url: STACK_DOC_URLS.tanstackQuery
  }
});
