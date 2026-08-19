import { createFileRoute } from '@tanstack/react-router';

import { PROJECT_REPOSITORY_URL } from './modules/shared';

const DocumentRepository = () => {
  return null;
};

export const Route = createFileRoute('/(admin)/document/repository')({
  component: DocumentRepository,
  staticData: {
    href: PROJECT_REPOSITORY_URL,
    i18nKey: 'route.document_repository',
    menu: {
      icon: 'mdi:github',
      order: 3
    },
    title: 'repository'
  }
});
