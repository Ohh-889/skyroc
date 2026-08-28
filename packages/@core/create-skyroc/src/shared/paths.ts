import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/** 定位 create-skyroc 包根；源码运行和构建后的 dist 入口都适用。 */
export function getPackageRoot() {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));

  while (currentDir !== path.dirname(currentDir)) {
    if (existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error('Cannot resolve create-skyroc package root.');
}

/** 从指定目录向上定位 pnpm workspace 根。 */
export function getWorkspaceRoot(startDir = process.cwd()) {
  let currentDir = path.resolve(startDir);

  while (currentDir !== path.dirname(currentDir)) {
    if (existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error('Cannot resolve workspace root. Run this command inside the monorepo.');
}

/** Create-skyroc 发布包内的模板资产目录。 */
export function getTemplateAssetsDir() {
  return path.join(getPackageRoot(), 'dist', 'template-assets');
}
