import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { PROJECT_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/native-ui-docs';

const DocumentNativeUiDocs = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return <IframePage title={staticData.title} url={staticData.url} />;
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentNativeUiDocs,
  staticData: {
    i18nKey: 'route.document_native-ui-docs',
    menu: {
      icon: 'mdi:cellphone-cog',
      order: 2
    },
    title: 'native-ui-docs',
    url: PROJECT_DOC_URLS.nativeUiDocs
  }
});
