'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface PagePreviewProps {
  /** playground 里 app/components 下的路由名，如 "button" */
  slug: string;
}

/**
 * 渲染 playground 的整个组件页（app/components/<slug>.tsx），
 * 也就是真机上看到的那一屏：NavBar + 整页 demo。
 *
 * 页面文件里 import 的 `@/src/demos/*` 由 tsconfig paths 指回 playground。
 * ssr: false 的理由同 demo-preview.tsx（uniwind 要读 DOM 才能解析 accent-* 类）。
 */
export const PagePreview = (props: PagePreviewProps) => {
  const { slug } = props;

  const Page = useMemo(
    () =>
      dynamic(
        async () => {
          const mod = await import(`../../../../apps/native-ui-playground/app/components/${slug}`);

          return mod.default;
        },
        { loading: () => <PageFallback />, ssr: false }
      ),
    [slug]
  );

  return <Page />;
};

const PageFallback = () => {
  return <div className="flex h-full w-full items-center justify-center text-xs text-fd-muted-foreground">Loading…</div>;
};
