import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover
} from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DemoStage, DemoStageProvider } from '@/components/demo/stage';
import { getMDXComponents } from '@/components/mdx';
import { resolvePlaygroundPage } from '@/lib/playground-demo';
import { gitConfig } from '@/lib/shared';
import { getPageImageUrl, getPageMarkdownUrl, source } from '@/lib/source';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  // playground 里有对应整页路由的才分栏，纯文字页保持常规单栏 + 右侧目录
  const playgroundPage = resolvePlaygroundPage(page.slugs);

  const body = (
    <MDX
      components={getMDXComponents({
        // this allows you to link to other pages with relative file paths
        a: createRelativeLink(source, page)
      })}
    />
  );

  return (
    <DocsPage
      toc={page.data.toc}
      className="max-w-none"
      full={Boolean(playgroundPage) || page.data.full}
      tableOfContent={{ enabled: !playgroundPage }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      {playgroundPage ? (
        <DemoStageProvider>
          <div className="skyroc-split">
            <DocsBody className="skyroc-split-doc">{body}</DocsBody>

            <DemoStage
              label={`${page.data.title} · 完整示例`}
              slug={playgroundPage}
            />
          </div>
        </DemoStageProvider>
      ) : (
        <DocsBody>{body}</DocsBody>
      )}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url
    }
  };
}
