'use client';

import { Code2, ExternalLink, Eye } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type TabValue = 'code' | 'preview';

interface DemoShellProps {
  /** 服务端高亮好的代码块 */
  code: ReactNode;
  /** 默认展开代码页签 */
  defaultExpanded?: boolean;
  /** 预览下方的补充说明 */
  description?: string;
  /** playground 中同一 demo 的地址，未配置时不渲染入口 */
  playgroundUrl?: string | null;
  /** 手机框内的真实 demo */
  preview: ReactNode;
  /** 顶部左侧标题 */
  title?: string;
}

export const DemoShell = (props: DemoShellProps) => {
  const { code, defaultExpanded = false, description, playgroundUrl, preview, title } = props;

  const [tab, setTab] = useState<TabValue>(defaultExpanded ? 'code' : 'preview');

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <div className="flex items-center justify-between gap-2 border-b border-fd-border px-3 py-1.5">
        <div className="flex items-center gap-0.5">
          <TabButton
            active={tab === 'preview'}
            onClick={() => setTab('preview')}
          >
            <Eye className="size-3.5" />
            Preview
          </TabButton>
          <TabButton
            active={tab === 'code'}
            onClick={() => setTab('code')}
          >
            <Code2 className="size-3.5" />
            Code
          </TabButton>
        </div>

        <div className="flex items-center gap-2 text-xs text-fd-muted-foreground">
          {title ? <span className="truncate">{title}</span> : null}
          {playgroundUrl ? (
            <a
              className="inline-flex items-center justify-center rounded-md p-1.5 transition-colors duration-200 hover:bg-fd-accent/50 hover:text-fd-accent-foreground"
              href={playgroundUrl}
              rel="noreferrer"
              target="_blank"
              title="在 playground 中打开"
            >
              <ExternalLink className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>

      {/* 两个页签都常驻 DOM，只切显示：预览重新挂载会丢掉 demo 里的交互状态 */}
      <div className={cn(tab === 'preview' ? 'bg-fd-muted/30' : 'hidden')}>{preview}</div>
      <div className={cn(tab === 'code' ? '' : 'hidden')}>{code}</div>

      {description ? (
        <figcaption className="border-t border-fd-border px-4 py-2 text-xs text-fd-muted-foreground">
          {description}
        </figcaption>
      ) : null}
    </figure>
  );
};

interface TabButtonProps {
  /** 是否为当前页签 */
  active: boolean;
  /** 图标 + 文案 */
  children: ReactNode;
  /** 切换到该页签 */
  onClick: () => void;
}

const TabButton = (props: TabButtonProps) => {
  const { active, children, onClick } = props;

  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
        active ? 'text-fd-foreground' : 'text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-foreground'
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};
