import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { MessageCircleIcon } from 'lucide-react';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { cn } from '@/lib/cn';
import { baseOptions } from '@/lib/layout.shared';
import { type DocsSection, getSectionPageTree } from '@/lib/source';

const Layout = async (props: LayoutProps<'/[...slug]'>) => {
  const { children, params } = props;
  const { slug = [] } = await params;
  const [section] = slug;
  const docsSection: DocsSection = section === 'components' ? 'components' : 'overview';

  return (
    <DocsLayout
      sidebar={{
        collapsible: false,
        defaultOpenLevel: 10
      }}
      containerProps={{ className: 'skyroc-docs-layout' }}
      tabs={false}
      tree={getSectionPageTree(docsSection)}
      {...baseOptions()}
    >
      <AISearch>
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: 'secondary',
              className: 'text-fd-muted-foreground rounded-2xl'
            })
          )}
        >
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </AISearch>

      {children}
    </DocsLayout>
  );
};

export default Layout;
