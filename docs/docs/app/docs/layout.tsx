import { GlassLayout } from 'fumadocs-ui/layouts/glass';
import { source } from '@/lib/source';
import { DocsGlassHeader } from './DocsGlassHeader';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <GlassLayout
      slots={{ header: DocsGlassHeader }}
      tree={source.getPageTree()}
      githubUrl="https://github.com/Ohh-889/skyroc"
      nav={{
        title: <span className="text-fd-muted-foreground text-xs font-semibold tracking-[0.08em]">文档目录</span>,
        transparentMode: 'always'
      }}
    >
      {children}
    </GlassLayout>
  );
}
