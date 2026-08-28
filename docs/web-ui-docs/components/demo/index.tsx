import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { LiveDemo } from './live-demo';

interface DemoProps {
  /** 默认是否展开代码区 */
  defaultExpanded?: boolean;
  description?: string;
  /**
   * Demo 源码定位： - "@playground/button/modules/ButtonColor" →
   * apps/web-ui-playground/src/app/[locale]/(demo)/button/modules/ButtonColor.tsx - "@/content/demos/foo" →
   * apps/web-ui-docs/content/demos/foo.tsx - 绝对/相对路径
   */
  src: string;
  title?: string;
}

const REPO_ROOT = path.resolve(process.cwd(), '../../');
const PLAYGROUND_BASE = path.join(REPO_ROOT, 'apps/web-ui-playground/src/app/[locale]/(demo)');

function resolveSrc(src: string): { filePath: string; playgroundRoute: string | null } {
  if (src.startsWith('@playground/')) {
    const rel = src.slice('@playground/'.length);
    const route = `/${rel.replace(/\/modules\/[^/]+$/, '').replace(/\\/g, '/')}`;
    return { filePath: path.join(PLAYGROUND_BASE, rel), playgroundRoute: route };
  }
  if (src.startsWith('@/')) {
    return { filePath: path.join(process.cwd(), src.slice(2)), playgroundRoute: null };
  }
  if (path.isAbsolute(src)) {
    return { filePath: src, playgroundRoute: null };
  }
  return { filePath: path.resolve(process.cwd(), src), playgroundRoute: null };
}

function ensureExt(p: string): string {
  return path.extname(p) ? p : `${p}.tsx`;
}

const PLAYGROUND_DEV_BASE = process.env.NEXT_PUBLIC_PLAYGROUND_URL ?? 'http://localhost:3000/zh';

export async function Demo({ defaultExpanded, description, src, title }: DemoProps) {
  const { filePath, playgroundRoute } = resolveSrc(src);
  const finalPath = ensureExt(filePath);

  let raw: string;
  try {
    raw = await readFile(finalPath, 'utf-8');
  } catch (err) {
    return (
      <div className="my-6 rounded-md border border-fd-border bg-fd-muted/30 p-4 text-sm text-fd-muted-foreground">
        无法读取 Demo 源码：<code>{src}</code>
        <pre className="mt-2 whitespace-pre-wrap text-xs">{(err as Error).message}</pre>
      </div>
    );
  }

  const fileName = path.basename(finalPath);
  const playgroundUrl = playgroundRoute ? `${PLAYGROUND_DEV_BASE}${playgroundRoute}` : null;

  return (
    <LiveDemo
      defaultExpanded={defaultExpanded}
      description={description}
      fileName={fileName}
      playgroundUrl={playgroundUrl}
      source={raw}
      title={title}
    />
  );
}

export default Demo;
