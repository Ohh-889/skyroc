import { existsSync } from 'node:fs';
import path from 'node:path';

/** next dev / next build 的 cwd 都是 docs/native-ui-docs，往上两级即仓库根。 */
const REPO_ROOT = path.resolve(process.cwd(), '../../');
const PAGES_DIR = path.join(REPO_ROOT, 'apps/native-ui-playground/app/components');

/**
 * 文档页 slug → playground 里对应的整页路由名。
 *
 * 右栏渲染的就是 app/components/<slug>.tsx 这一整个页面（NavBar + 整页 demo），
 * 和真机上看到的那一屏完全一致。找不到对应文件时返回 null（比如非组件页），
 * 调用方据此退回单栏。
 */
export function resolvePlaygroundPage(slugs: string[]): null | string {
  const last = slugs.at(-1);
  if (!last) return null;

  return existsSync(path.join(PAGES_DIR, `${last}.tsx`)) ? last : null;
}
