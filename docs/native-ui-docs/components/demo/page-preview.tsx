'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { ensureSkiaWeb, needsSkiaWeb } from '@/lib/skia-web';

interface PagePreviewProps {
  /** Playground 里 app/components 下的路由名，如 "button" */
  slug: string;
}

/**
 * 渲染 playground 的整个组件页（app/components/<slug>.tsx）， 也就是真机上看到的那一屏：NavBar + 整页 demo。
 *
 * 页面文件里 import 的 `@/src/demos/*` 由 tsconfig paths 指回 playground。 ssr: false 的理由同 demo-preview.tsx（uniwind 要读 DOM 才能解析
 * accent-* 类）。
 */
export const PagePreview = (props: PagePreviewProps) => {
  const { slug } = props;

  const Page = useMemo(
    () =>
      dynamic(
        async () => {
          // Skia 系组件必须先把 CanvasKit wasm 挂上去，再 import 页面。详见 lib/skia-web.ts
          if (needsSkiaWeb(slug)) await ensureSkiaWeb();

          // 动态引入 PreviewRuntime 的理由同 demo-preview.tsx：别把 RN provider 拖进服务端 bundle
          const [{ PreviewRuntime }, mod] = await Promise.all([
            import('./preview-runtime'),
            import(`../../../../apps/native-ui-playground/app/components/${slug}`)
          ]);
          const Component = mod.default;

          // 整页预览撑满一屏，provider 链要跟着 flex-1，否则页面内的 ScrollView 滚不动
          return function PageWithRuntime() {
            return (
              <PreviewRuntime fill>
                <Component />
              </PreviewRuntime>
            );
          };
        },
        { loading: () => <PageFallback />, ssr: false }
      ),
    [slug]
  );

  return <Page />;
};

const PageFallback = () => {
  return (
    <div className="flex h-full w-full items-center justify-center text-xs text-fd-muted-foreground">Loading…</div>
  );
};
