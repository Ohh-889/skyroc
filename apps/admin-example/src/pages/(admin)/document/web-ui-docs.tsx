import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { PROJECT_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/web-ui-docs';

const DocumentWebUiDocs = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return (
    <IframePage
      title={staticData.title}
      url={staticData.url}
    />
  );
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentWebUiDocs,
  staticData: {
    i18nKey: 'route.document_web-ui-docs',
    menu: {
      icon: 'mdi:palette-swatch-outline',
      order: 1
    },
    title: 'web-ui-docs',
    url: PROJECT_DOC_URLS.webUiDocs
  }
});
