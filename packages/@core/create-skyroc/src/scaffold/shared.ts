import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, rm, symlink } from 'node:fs/promises';
import path from 'node:path';
import * as prompts from '@clack/prompts';

import type { PackageManager } from '../shared/package-manager';
import { ROOT_SPECIAL_FILES, ROOT_TEMPLATE_SYMLINKS } from '../template-rules';

async function isDirectoryEmpty(dir: string) {
  if (!existsSync(dir)) return true;

  return (await readdir(dir)).length === 0;
}

export async function prepareTargetDirectory(targetDir: string, force = false) {
  if (existsSync(targetDir) && !(await isDirectoryEmpty(targetDir))) {
    if (!force) {
      throw new Error(`Target directory is not empty: ${targetDir}. Use --force to overwrite it.`);
    }

    await rm(targetDir, { force: true, recursive: true });
  }

  await mkdir(path.dirname(targetDir), { recursive: true });
}

async function restoreRootSpecialFiles(templateAssetsDir: string, targetDir: string) {
  await Promise.all(
    ROOT_SPECIAL_FILES.map(async file => {
      const source = path.join(templateAssetsDir, 'root-special', file.assetName);

      if (!existsSync(source)) {
        throw new Error(`Shared root special file is missing: ${source}`);
      }

      await cp(source, path.join(targetDir, file.target));
    })
  );
}

async function restoreRootSymlinks(targetDir: string) {
  await Promise.all(
    ROOT_TEMPLATE_SYMLINKS.map(async entry => {
      const target = path.join(targetDir, entry.path);

      await mkdir(path.dirname(target), { recursive: true });
      await rm(target, { force: true, recursive: true });
      await symlink(entry.target, target);
    })
  );
}

export async function copySharedRoot(templateAssetsDir: string, targetDir: string) {
  const rootTemplateDir = path.join(templateAssetsDir, 'root');

  if (!existsSync(rootTemplateDir)) {
    throw new Error(`Shared root template is missing: ${rootTemplateDir}. Rebuild create-skyroc before packing.`);
  }

  await cp(rootTemplateDir, targetDir, { recursive: true, verbatimSymlinks: true });
  await restoreRootSpecialFiles(templateAssetsDir, targetDir);
  await restoreRootSymlinks(targetDir);
}

export async function installDependencies(cwd: string, packageManager: PackageManager) {
  const { execa } = await import('execa');
  const args = packageManager === 'yarn' ? [] : ['install'];

  await execa(packageManager, args, { cwd, stdio: 'inherit' });
}

export function reportMaterializationWarnings(missedRewrites: string[], unpublishedPackages: string[]) {
  for (const missed of missedRewrites) {
    prompts.log.warn(missed);
  }

  if (unpublishedPackages.length > 0) {
    prompts.log.warn(
      `These workspace packages are marked private and cannot be installed from the registry: ${unpublishedPackages.join(', ')}`
    );
  }
}
