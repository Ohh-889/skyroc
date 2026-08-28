import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { STACK_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/react';

const DocumentReact = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return (
    <IframePage
      title={staticData.title}
      url={staticData.url}
    />
  );
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentReact,
  staticData: {
    i18nKey: 'route.document_react',
    menu: {
      icon: 'logos:react',
      order: 10
    },
    title: 'React',
    url: STACK_DOC_URLS.react
  }
});
