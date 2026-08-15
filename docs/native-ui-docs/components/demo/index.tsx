import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { DemoPreview } from './demo-preview';
import { DemoShell } from './demo-shell';

interface DemoProps {
  /** 默认展开代码页签 */
  defaultExpanded?: boolean;
  /** 预览下方的补充说明 */
  description?: string;
  /**
   * Demo 定位，只支持 playground 协议：
   * "@playground/ButtonDemo" → apps/native-ui-playground/src/demos/ButtonDemo.tsx
   *
   * 之所以不接受任意路径：预览是在浏览器里跑真实 RN 组件，模块必须能被 Turbopack
   * 静态解析到 demos 目录（见 demo-preview.tsx），docs 侧临时写的散落文件进不了那张表。
   */
  src: string;
  /** 预览区标题，缺省用 demo 名 */
  title?: string;
}

const PLAYGROUND_PREFIX = '@playground/';

/** next dev / next build 的 cwd 都是 docs/native-ui-docs，往上两级即仓库根。 */
const REPO_ROOT = path.resolve(process.cwd(), '../../');
const DEMOS_DIR = path.join(REPO_ROOT, 'apps/native-ui-playground/src/demos');

/** 设了才渲染「在 playground 打开」入口，例如 expo web 的部署地址。 */
const PLAYGROUND_BASE_URL = process.env.NEXT_PUBLIC_PLAYGROUND_URL;

/**
 * 映射到 playground 的 app/components/*.tsx 路由：
 * 嵌套 demo 取目录名（"button/ButtonColor" → /components/button），
 * 顶层 demo 去掉 Demo 后缀（"ButtonDemo" → /components/button）。
 */
function toPlaygroundRoute(name: string): string {
  const slash = name.indexOf('/');
  const segment = slash === -1 ? name.replace(/Demo$/, '') : name.slice(0, slash);

  return `/components/${segment.toLowerCase()}`;
}

export const Demo = async (props: DemoProps) => {
  const { defaultExpanded = false, description, src, title } = props;

  if (!src.startsWith(PLAYGROUND_PREFIX)) {
    return <DemoError message={`src 必须以 ${PLAYGROUND_PREFIX} 开头，当前为 "${src}"`} />;
  }

  const name = src.slice(PLAYGROUND_PREFIX.length);
  const filePath = path.join(DEMOS_DIR, `${name}.tsx`);
  // 嵌套路径（button/ButtonColor）只把文件名当标题，目录层级对读者没有意义
  const baseName = name.slice(name.lastIndexOf('/') + 1);

  let source: string;
  try {
    source = await readFile(filePath, 'utf-8');
  } catch (error) {
    return <DemoError message={`无法读取 Demo 源码 "${src}"：${(error as Error).message}`} />;
  }

  return (
    <DemoShell
      code={
        <ServerCodeBlock
          code={source.trimEnd()}
          lang="tsx"
          // 外层 figure 已经有边框圆角，代码块只留顶部分隔线，避免套两层框
          codeblock={{ className: 'rounded-none border-0 border-t shadow-none', title: `${baseName}.tsx` }}
        />
      }
      defaultExpanded={defaultExpanded}
      description={description}
      playgroundUrl={PLAYGROUND_BASE_URL ? `${PLAYGROUND_BASE_URL}${toPlaygroundRoute(name)}` : null}
      preview={<DemoPreview name={name} />}
      title={title ?? baseName}
    />
  );
};

interface DemoErrorProps {
  /** 展示给文档作者的失败原因 */
  message: string;
}

const DemoError = (props: DemoErrorProps) => {
  const { message } = props;

  return (
    <div className="my-6 rounded-lg border border-fd-border bg-fd-muted/30 p-4 text-sm text-fd-muted-foreground">
      {message}
    </div>
  );
};

export default Demo;
