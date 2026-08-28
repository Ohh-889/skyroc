import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { STACK_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/vite';

const DocumentVite = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return (
    <IframePage
      title={staticData.title}
      url={staticData.url}
    />
  );
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentVite,
  staticData: {
    i18nKey: 'route.document_vite',
    menu: {
      icon: 'logos:vitejs',
      order: 15
    },
    title: 'Vite',
    url: STACK_DOC_URLS.vite
  }
});
