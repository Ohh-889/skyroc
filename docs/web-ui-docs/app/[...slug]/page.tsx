import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover
} from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { Accessibility, Code2, Component, PackageOpen } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { gitConfig } from '@/lib/shared';
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';

const Page = async (props: PageProps<'/[...slug]'>) => {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const isComponentPage = page.slugs[0] === 'components';

  return (
    <DocsPage
      className={isComponentPage ? 'skyroc-component-page' : 'skyroc-guide-page'}
      full={page.data.full}
      toc={page.data.toc}
    >
      <div className="skyroc-docs-hero">
        <div className="skyroc-docs-kicker">
          {isComponentPage ? (
            <Component
              aria-hidden="true"
              size={14}
            />
          ) : (
            <Code2
              aria-hidden="true"
              size={14}
            />
          )}
          <span>{isComponentPage ? 'SKYROC UI · COMPONENT' : 'SKYROC UI · GUIDE'}</span>
        </div>

        <DocsTitle className="skyroc-docs-title">{page.data.title}</DocsTitle>
        <DocsDescription className="skyroc-docs-description mb-0">{page.data.description}</DocsDescription>

        {isComponentPage ? (
          <div
            className="skyroc-component-meta"
            aria-label="组件文档特性"
          >
            <span>
              <PackageOpen
                aria-hidden="true"
                size={14}
              />
              @skyroc/web-ui
            </span>
            <span>
              <Code2
                aria-hidden="true"
                size={14}
              />
              TypeScript
            </span>
            <span>
              <Accessibility
                aria-hidden="true"
                size={14}
              />
              Radix foundation
            </span>
          </div>
        ) : null}

        <div className="skyroc-docs-actions flex flex-row items-center gap-2 border-t pt-5">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
            markdownUrl={markdownUrl}
          />
        </div>
      </div>

      <DocsBody className="skyroc-docs-body">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page)
          })}
        />
      </DocsBody>
    </DocsPage>
  );
};

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/[...slug]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url
    }
  };
}

export default Page;
