import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { STACK_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/unocss';

const DocumentUnoCss = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return (
    <IframePage
      title={staticData.title}
      url={staticData.url}
    />
  );
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentUnoCss,
  staticData: {
    i18nKey: 'route.document_unocss',
    menu: {
      icon: 'logos:unocss',
      order: 16
    },
    title: 'UnoCSS',
    url: STACK_DOC_URLS.unocss
  }
});
