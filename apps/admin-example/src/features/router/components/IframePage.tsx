import { Skeleton } from 'antd';
import { useState } from 'react';

interface IframePageProps {
  /** Accessible title for the embedded external page. */
  title?: string | null;
  /** External page address rendered inside the iframe. */
  url?: string | null;
}

export const IframePage = (props: IframePageProps) => {
  const { title = 'iframe page', url } = props;
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);

  if (!url) {
    return null;
  }

  const iframeUrl = url;
  const iframeTitle = title || 'iframe page';
  const loading = loadedUrl !== iframeUrl;

  function handleLoad() {
    setLoadedUrl(iframeUrl);
  }

  return (
    <div className="relative h-full">
      {loading && (
        <Skeleton
          active
          className="p-16px"
        />
      )}
      <div className={loading ? 'h-0 overflow-hidden' : 'h-full'}>
        <iframe
          className="size-full border-0"
          id="iframePage"
          sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts"
          src={iframeUrl}
          title={iframeTitle}
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
};
