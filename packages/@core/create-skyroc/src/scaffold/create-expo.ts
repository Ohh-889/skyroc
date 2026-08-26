import { existsSync } from 'node:fs';
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import type { PackageManager } from '../shared/package-manager';
import { getTemplateAssetsDir, getWorkspaceRoot } from '../shared/paths';
import { materializeStandaloneExpo } from '../template/materialize-expo';
import { getTemplateMetaFile, readTemplateMeta } from '../template/meta';
import { normalizePackageName, toTitle } from './create-admin';
import { copySharedRoot, installDependencies, prepareTargetDirectory, reportMaterializationWarnings } from './shared';

export interface CreateExpoTemplateOptions {
  /** 应用描述，写入 package.json。 */
  description?: string;
  /** 目标目录存在时先删除再生成。 */
  force?: boolean;
  /** 生成后安装依赖。 */
  install?: boolean;
  /** 安装依赖时使用的包管理器。 */
  packageManager?: PackageManager;
  /** 目标目录，默认 apps/<name>。 */
  target?: string;
  /** 内部测试与仓库命令可覆盖模板资产目录。 */
  templateAssetsDir?: string;
  /** 保留 workspace/catalog 协议，用于仓库内部应用。 */
  workspace?: boolean;
}

interface PackageJson {
  description?: string;
  name?: string;
  [key: string]: unknown;
}

async function updatePackageJson(targetDir: string, packageName: string, description: string) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson;

  packageJson.name = packageName;
  packageJson.description = description;

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

export async function createExpoTemplate(name: string, options: CreateExpoTemplateOptions = {}) {
  const packageName = normalizePackageName(name);
  const description = options.description || `${toTitle(packageName)} Expo application`;
  const directoryName = packageName.replace(/^@[^/]+\//, '');
  const targetDir = path.resolve(process.cwd(), options.target || path.join('apps', directoryName));
  const templateAssetsDir = path.resolve(options.templateAssetsDir || getTemplateAssetsDir());
  const templateDir = path.join(templateAssetsDir, 'expo');

  if (!existsSync(templateDir)) {
    throw new Error(`Expo template is missing: ${templateDir}. Build create-skyroc to prepare template assets.`);
  }

  await prepareTargetDirectory(targetDir, options.force);
  await copySharedRoot(templateAssetsDir, targetDir);
  await cp(templateDir, targetDir, { recursive: true });

  if (options.workspace) {
    await updatePackageJson(targetDir, packageName, description);
  } else {
    const metaPath = path.join(templateAssetsDir, getTemplateMetaFile('expo'));

    if (!existsSync(metaPath)) {
      throw new Error(`Expo template metadata is missing: ${metaPath}. Rebuild create-skyroc before packing.`);
    }

    const meta = await readTemplateMeta(metaPath);
    const result = await materializeStandaloneExpo({ description, meta, packageName, targetDir });

    reportMaterializationWarnings(result.missedRewrites, result.unpublishedPackages);
  }

  if (options.install) {
    await installDependencies(
      options.workspace ? getWorkspaceRoot(targetDir) : targetDir,
      options.packageManager ?? 'pnpm'
    );
  }
}
