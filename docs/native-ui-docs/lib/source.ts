import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import type { Folder } from 'fumadocs-core/page-tree';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

/**
 * 取文件夹里第一个能跳转的页面。
 *
 * fumadocs 内置的 `getLayoutTabs` 只认 `node.index` 或直接子级里的 page，
 * 遇到只有分组文件夹、没有 index.mdx 的模块会被判成「没有落地页」而整项丢弃。
 * 这里往下递归一层层找，让这类模块也能出现在切换器里。
 */
function findFirstPageUrl(folder: Folder): string | undefined {
  if (folder.index) return folder.index.url;

  for (const child of folder.children) {
    if (child.type === 'page') return child.url;

    if (child.type === 'folder') {
      const url = findFirstPageUrl(child);
      if (url) return url;
    }
  }

  return undefined;
}

/** 侧栏顶部的模块切换器数据源：每个 `root: true` 的顶层文件夹一项 */
export function getRootTabs(): LayoutTab[] {
  return source.getPageTree().children.flatMap<LayoutTab>(node => {
    if (node.type !== 'folder' || !node.root) return [];

    const url = findFirstPageUrl(node);
    if (!url) return [];

    return [
      {
        $folder: node,
        description: node.description,
        icon: node.icon,
        title: node.name,
        url,
      },
    ];
  });
}

export function getPageImageUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: '/' + [page.locale, ...docsImageRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
