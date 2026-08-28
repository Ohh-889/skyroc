import { docs } from 'collections/server';
import type { Folder } from 'fumadocs-core/page-tree';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()]
});

/**
 * 取文件夹里第一个能跳转的页面。
 *
 * Fumadocs 内置的 `getLayoutTabs` 只认 `node.index` 或直接子级里的 page， 而 `components/` 的直接子级全是 `(general)`
 * 这类分组文件夹，会被判成「没有落地页」而整项丢弃。 这里往下递归一层层找，让没有 index.mdx 的模块也能出现在切换器里。
 *
 * 一旦哪天给 `components/` 补了 index.mdx，这个文件里的两个函数就可以整体删掉， 直接用 fumadocs 默认的 tabs（layout 里不传 `tabs` 即可）。
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
        url
      }
    ];
  });
}

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
