'use client';

import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { PhoneFrame } from './phone-frame';
import { useDemoStage } from './stage';

interface DemoShellProps {
  /** 服务端高亮好的代码块 */
  code: ReactNode;
  /** 预览下方的补充说明 */
  description?: string;
  /** Playground 中同一 demo 的地址，未配置时不渲染入口 */
  playgroundUrl?: string | null;
  /** 手机屏幕里的真实 demo，仅窄屏内联时用得上 */
  preview: ReactNode;
  /** 顶部左侧标题 */
  title: string;
}

export const DemoShell = (props: DemoShellProps) => {
  const { code, description, playgroundUrl, preview, title } = props;

  const { splitEnabled } = useDemoStage();

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <div className="flex items-center justify-between gap-2 border-b border-fd-border px-3 py-1.5">
        <span className="truncate font-mono text-xs text-fd-muted-foreground">{title}.tsx</span>

        {playgroundUrl ? (
          <a
            className="inline-flex items-center justify-center rounded-md p-1.5 text-fd-muted-foreground transition-colors duration-200 hover:bg-fd-accent/50 hover:text-fd-accent-foreground"
            href={playgroundUrl}
            rel="noreferrer"
            target="_blank"
            title="在 playground 中打开"
          >
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </div>

      {/* 分栏时右侧常驻整页预览，这里只留代码；窄屏没有右栏，预览回到代码上方 */}
      {splitEnabled ? null : (
        <div className="flex justify-center bg-fd-muted/30 px-4 py-8">
          <PhoneFrame>{preview}</PhoneFrame>
        </div>
      )}

      {code}

      {description ? (
        <figcaption className="border-t border-fd-border px-4 py-2 text-xs text-fd-muted-foreground">
          {description}
        </figcaption>
      ) : null}
    </figure>
  );
};
