import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { STACK_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/jotai';

const DocumentJotai = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return (
    <IframePage
      title={staticData.title}
      url={staticData.url}
    />
  );
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentJotai,
  staticData: {
    i18nKey: 'route.document_jotai',
    menu: {
      icon: 'mdi:atom',
      order: 11
    },
    title: 'Jotai',
    url: STACK_DOC_URLS.jotai
  }
});
