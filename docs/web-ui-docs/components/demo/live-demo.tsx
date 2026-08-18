'use client';

import { Check, Code2, Copy, ExternalLink, Eye, RotateCcw } from 'lucide-react';
import { themes } from 'prism-react-renderer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import { demoScope, scopeKeys } from './scope';
import { transformDemo } from './transform';

function stableTransformCode(src: string) {
  try {
    return transformDemo(src, scopeKeys).executable;
  } catch {
    return src;
  }
}

interface LiveDemoProps {
  defaultExpanded?: boolean;
  description?: string;
  fileName: string;
  playgroundUrl?: string | null;
  source: string;
  title?: string;
}

interface TabButtonProps {
  /** 当前标签是否处于选中状态 */
  active: boolean;
  /** 标签按钮内容 */
  children: React.ReactNode;
  /** 切换标签时触发 */
  onClick: () => void;
}

interface ActionButtonProps {
  /** 操作按钮图标 */
  children: React.ReactNode;
  /** 存在时将操作渲染为外部链接 */
  href?: string;
  /** 点击普通按钮时触发 */
  onClick?: () => void;
  /** 用于无障碍与悬浮提示的操作名称 */
  title: string;
}

type TabValue = 'code' | 'preview';

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    function sync() {
      setIsDark(root.classList.contains('dark'));
    }
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributeFilter: ['class'], attributes: true });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

const TabButton = (props: TabButtonProps) => {
  const { active, children, onClick } = props;

  return (
    <button
      className={
        `cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors duration-200` +
        ` focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring${
          active ? ' text-fd-foreground' : ' text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-foreground'
        }`
      }
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

const ActionButton = (props: ActionButtonProps) => {
  const { children, href, onClick, title } = props;

  const cls =
    'inline-flex cursor-pointer items-center justify-center rounded-md p-1.5' +
    ' text-fd-muted-foreground transition-colors duration-200' +
    ' hover:bg-fd-accent/50 hover:text-fd-accent-foreground' +
    ' focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring';

  if (href) {
    return (
      <a
        className={cls}
        href={href}
        rel="noreferrer"
        target="_blank"
        title={title}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={cls}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
};

const DemoLiveError = () => {
  return (
    <LiveError className="!m-0 !whitespace-pre-wrap !rounded-none !border-0 !border-t !border-red-500/40 !bg-red-500/10 !px-4 !py-3 !font-mono !text-xs !text-red-600 dark:!text-red-400" />
  );
};

export const LiveDemo = (props: LiveDemoProps) => {
  const { defaultExpanded = false, description, fileName, playgroundUrl, source, title } = props;

  const isDark = useIsDark();

  const initialDisplay = useMemo(() => transformDemo(source, scopeKeys).display, [source]);

  const [displayCode, setDisplayCode] = useState(initialDisplay);
  const [activeTab, setActiveTab] = useState<TabValue>(defaultExpanded ? 'code' : 'preview');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setDisplayCode(initialDisplay);
  }, [initialDisplay]);

  if (!mounted) {
    return (
      <div className="skyroc-demo my-8 overflow-hidden rounded-2xl border border-fd-border">
        <div className="flex items-center border-b border-fd-border px-4 py-3">
          <div className="flex items-center gap-0.5">
            <div className="rounded-md px-2.5 py-1 text-xs font-medium text-fd-foreground">预览</div>
            <div className="rounded-md px-2.5 py-1 text-xs text-fd-muted-foreground">代码</div>
          </div>
        </div>
        <div className="flex min-h-[120px] items-center justify-center px-6 py-10 text-xs text-fd-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  function onReset() {
    setDisplayCode(initialDisplay);
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }

  return (
    <LiveProvider
      code={displayCode}
      enableTypeScript
      language="tsx"
      noInline
      scope={demoScope}
      theme={isDark ? themes.vsDark : themes.oneLight}
      transformCode={stableTransformCode}
    >
      <div className="skyroc-demo my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card/35 shadow-sm">
        <div className="flex min-h-15 items-center justify-between gap-4 border-b border-fd-border px-4 py-2.5">
          <div className="min-w-0">
            <strong className="block truncate text-xs font-semibold text-fd-foreground">
              {title ?? fileName.replace(/\.tsx$/, '')}
            </strong>
            {description ? (
              <span className="mt-0.5 block truncate text-[10px] text-fd-muted-foreground">{description}</span>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center rounded-lg bg-fd-muted/65 p-0.5">
              <TabButton
                active={activeTab === 'preview'}
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="mr-1 inline-block size-3.5 align-[-2px]" />
                预览
              </TabButton>
              <TabButton
                active={activeTab === 'code'}
                onClick={() => setActiveTab('code')}
              >
                <Code2 className="mr-1 inline-block size-3.5 align-[-2px]" />
                代码
              </TabButton>
            </div>

            <div className="flex items-center gap-0.5">
              {activeTab === 'code' ? (
                <ActionButton
                  onClick={onReset}
                  title="重置代码"
                >
                  <RotateCcw className="size-3.5" />
                </ActionButton>
              ) : null}
              <ActionButton
                onClick={onCopy}
                title={copied ? '已复制' : '复制代码'}
              >
                {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
              </ActionButton>
              {playgroundUrl ? (
                <ActionButton
                  href={playgroundUrl}
                  title="在 Playground 中打开"
                >
                  <ExternalLink className="size-3.5" />
                </ActionButton>
              ) : null}
            </div>
          </div>
        </div>

        {activeTab === 'preview' ? (
          <div className="skyroc-demo-stage flex min-h-44 items-center justify-center px-6 py-12">
            <div className="w-full">
              <LivePreview />
            </div>
          </div>
        ) : null}

        {activeTab === 'code' ? (
          <div>
            <div className="skyroc-demo-stage border-b border-fd-border px-6 py-8">
              <div className="w-full">
                <LivePreview />
              </div>
            </div>
            <div>
              <div className="demo-live-editor">
                <LiveEditor
                  className="!bg-transparent !font-mono !text-[13px] leading-relaxed"
                  onChange={setDisplayCode}
                />
              </div>
              <DemoLiveError />
            </div>
          </div>
        ) : null}
      </div>
    </LiveProvider>
  );
};
