import { createFileRoute, useParams } from '@tanstack/react-router';

import { IframePage } from '@/features/router/components/IframePage';

function decodeIframeUrl(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const BuiltinIframePage = () => {
  const { url } = useParams({ from: '/(admin)/_builtin/iframe-page/$url' });
  const iframeUrl = decodeIframeUrl(url);

  return (
    <IframePage
      title={iframeUrl}
      url={iframeUrl}
    />
  );
};

export const Route = createFileRoute('/(admin)/_builtin/iframe-page/$url')({
  component: BuiltinIframePage,
  staticData: {
    menu: {
      hide: true
    },
    title: 'iframe-page'
  }
});
