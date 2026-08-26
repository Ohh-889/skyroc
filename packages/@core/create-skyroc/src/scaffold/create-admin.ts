import { existsSync } from 'node:fs';
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import type { PackageManager } from '../shared/package-manager';
import { getTemplateAssetsDir, getWorkspaceRoot } from '../shared/paths';
import { materializeStandaloneApp } from '../template/materialize';
import { TEMPLATE_META_FILE, readTemplateMeta } from '../template/meta';
import { copySharedRoot, installDependencies, prepareTargetDirectory, reportMaterializationWarnings } from './shared';

export interface CreateAdminTemplateOptions {
  /** 应用描述，写入 .env 和 package.json。 */
  description?: string;
  /** 目标目录存在时先删除再生成。 */
  force?: boolean;
  /** 生成后执行 pnpm install。 */
  install?: boolean;
  /** 安装依赖时使用的包管理器。 */
  packageManager?: PackageManager;
  /** 目标目录，默认 apps/<name>。 */
  target?: string;
  /** 内部测试与仓库命令可覆盖模板资产目录；公开 CLI 不暴露此选项。 */
  templateAssetsDir?: string;
  /** 应用标题，写入 .env。 */
  title?: string;
  /**
   * 保留模板里的 monorepo 写法（`workspace:*`、`catalog:`、指向 internal/ 的 extends）。
   *
   * 仅当生成的应用要留在本仓库里时才该开启；默认会把这些协议物化成 registry 能解析的具体值。
   */
  workspace?: boolean;
}

interface PackageJson {
  description?: string;
  name?: string;
  [key: string]: unknown;
}

interface EnvFileUpdate {
  /** 应用描述，写入 VITE_APP_DESC。 */
  description: string;
  /** 本地存储键名前缀，写入 VITE_STORAGE_PREFIX。 */
  storagePrefix: string;
  /** 环境文件所在的目标应用目录。 */
  targetDir: string;
  /** 应用标题，写入 VITE_APP_TITLE。 */
  title: string;
}

interface StandaloneMaterializationOptions {
  /** 应用描述。 */
  description: string;
  /** 生成应用的包名。 */
  packageName: string;
  /** 生成应用目录。 */
  targetDir: string;
  /** 构建期准备的模板资产目录。 */
  templateAssetsDir: string;
}

const TEMPLATE_NAME = 'admin';

export function normalizePackageName(name: string) {
  const normalizedName = name
    .trim()
    .replaceAll('_', '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-@/.]/g, '')
    .toLowerCase();

  if (!normalizedName) {
    throw new Error('App name is required.');
  }

  if (!/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(normalizedName)) {
    throw new Error(`Invalid package name: ${name}`);
  }

  return normalizedName;
}

export function toTitle(name: string) {
  return name
    .replace(/^@[^/]+\//, '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(item => `${item.charAt(0).toUpperCase()}${item.slice(1)}`)
    .join(' ');
}

export function toStoragePrefix(name: string) {
  const prefix = name
    .replace(/^@[^/]+\//, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();

  return `${prefix || 'ADMIN'}_`;
}

export function replaceEnvValue(content: string, key: string, value: string) {
  const escapedValue = value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  const regexp = new RegExp(`^${key}=.*$`, 'm');

  if (!regexp.test(content)) {
    return `${content.trimEnd()}\n${key}=${escapedValue}\n`;
  }

  return content.replace(regexp, `${key}=${escapedValue}`);
}

async function updatePackageJson(targetDir: string, packageName: string, description: string) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson;

  packageJson.name = packageName;

  packageJson.description = description;

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function updateEnvFile(options: EnvFileUpdate) {
  const { description, storagePrefix, targetDir, title } = options;
  const envPath = path.join(targetDir, '.env');
  let env = await readFile(envPath, 'utf8');

  env = replaceEnvValue(env, 'VITE_APP_TITLE', title);
  env = replaceEnvValue(env, 'VITE_APP_DESC', description);
  env = replaceEnvValue(env, 'VITE_STORAGE_PREFIX', storagePrefix);

  await writeFile(envPath, env);
}

/** 独立模式下把 monorepo 协议物化掉，并把物化过程中发现的隐患打印出来。 */
async function applyStandaloneMaterialization(options: StandaloneMaterializationOptions) {
  const { description, packageName, targetDir, templateAssetsDir } = options;
  const metaPath = path.join(templateAssetsDir, TEMPLATE_META_FILE);

  if (!existsSync(metaPath)) {
    throw new Error(`Template metadata is missing: ${metaPath}. Rebuild create-skyroc before packing or publishing.`);
  }

  const meta = await readTemplateMeta(metaPath);
  const { missedRewrites, unpublishedPackages } = await materializeStandaloneApp({
    description,
    meta,
    packageName,
    targetDir
  });

  reportMaterializationWarnings(missedRewrites, unpublishedPackages);
}

export async function createAdminTemplate(name: string, options: CreateAdminTemplateOptions = {}) {
  const packageName = normalizePackageName(name);
  const title = options.title || toTitle(packageName);
  const description = options.description || `${title} admin application`;
  const storagePrefix = toStoragePrefix(packageName);
  const directoryName = packageName.replace(/^@[^/]+\//, '');
  const targetDir = path.resolve(process.cwd(), options.target || path.join('apps', directoryName));
  const templateAssetsDir = path.resolve(options.templateAssetsDir || getTemplateAssetsDir());
  const templateDir = path.join(templateAssetsDir, TEMPLATE_NAME);

  if (!existsSync(templateDir)) {
    throw new Error(`Admin template is missing: ${templateDir}. Build create-skyroc to prepare template assets.`);
  }

  await prepareTargetDirectory(targetDir, options.force);
  // 生成目录同时是独立项目根：先复制仓库根级约定，再让 apps/admin 的应用配置覆盖 package.json、README 等同名文件。
  await copySharedRoot(templateAssetsDir, targetDir);
  await cp(templateDir, targetDir, { recursive: true });

  if (options.workspace) {
    // workspace 模式共用 packages/web/admin 的那份 shell（vite/tsconfig 里的 @shell 已指向它）。
    await updatePackageJson(targetDir, packageName, description);
  } else {
    // 独立模式把 shell 源码复制进项目，@shell 走 admin-vite 的默认别名 src/framework。
    const shellTemplateDir = path.join(templateAssetsDir, 'admin-shell');

    if (!existsSync(shellTemplateDir)) {
      throw new Error(`Admin shell template is missing: ${shellTemplateDir}. Rebuild create-skyroc before packing.`);
    }

    await cp(shellTemplateDir, path.join(targetDir, 'src', 'framework'), { recursive: true });
    await applyStandaloneMaterialization({ description, packageName, targetDir, templateAssetsDir });
  }

  await updateEnvFile({ description, storagePrefix, targetDir, title });

  if (options.install) {
    await installDependencies(
      options.workspace ? getWorkspaceRoot(targetDir) : targetDir,
      options.packageManager ?? 'pnpm'
    );
  }
}
