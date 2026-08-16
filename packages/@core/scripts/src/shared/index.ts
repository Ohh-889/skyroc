import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import type { Options } from 'execa';

export async function execCommand(cmd: string, args: string[], options?: Options) {
  const { execa } = await import('execa');
  const res = await execa(cmd, args, options);
  return (res?.stdout as string)?.trim() || '';
}

/** 从当前模块位置向上找到 `@skyroc/scripts` 自身的包根，用于定位内置 templates。 */
export function getPackageRoot() {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));

  while (currentDir !== path.dirname(currentDir)) {
    if (existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error('Cannot resolve @skyroc/scripts package root.');
}

/** 从 cwd 向上找到 monorepo 根目录。只有仓库内的命令才需要它。 */
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
