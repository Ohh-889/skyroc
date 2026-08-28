import { createFileRoute, useMatch } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

import { STACK_DOC_URLS } from './modules/shared';

const ROUTE_PATH = '/(admin)/document/ant-design';

const DocumentAntDesign = () => {
  const { staticData } = useMatch({ from: ROUTE_PATH });

  return (
    <IframePage
      title={staticData.title}
      url={staticData.url}
    />
  );
};

export const Route = createFileRoute(ROUTE_PATH)({
  component: DocumentAntDesign,
  staticData: {
    i18nKey: 'route.document_ant-design',
    menu: {
      icon: 'logos:ant-design',
      order: 12
    },
    title: 'Ant Design',
    url: STACK_DOC_URLS.antDesign
  }
});
