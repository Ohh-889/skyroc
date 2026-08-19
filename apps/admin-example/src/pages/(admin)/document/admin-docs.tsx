import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { PROJECT_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/admin-docs';

const DocumentAdminDocs = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return <IframePage title={staticData.title} url={staticData.url} />;
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentAdminDocs,
  staticData: {
    i18nKey: 'route.document_admin-docs',
    menu: {
      icon: 'mdi:book-open-page-variant',
      order: 0
    },
    title: 'admin-docs',
    url: PROJECT_DOC_URLS.adminDocs
  }
});
