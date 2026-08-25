import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { cyan, green, yellow } from 'kolorist';

import { getPackageRoot } from '../shared';
import { materializeStandaloneApp } from '../template/materialize';
import { TEMPLATE_META_FILE, readTemplateMeta } from '../template/meta';

export interface CreateAdminTemplateOptions {
  /** 应用描述，写入 .env 和 package.json。 */
  description?: string;
  /** 目标目录存在时先删除再生成。 */
  force?: boolean;
  /** 生成后执行 pnpm install。 */
  install?: boolean;
  /** 目标目录，默认 apps/<name>。 */
  target?: string;
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

const TEMPLATE_NAME = 'admin';

export function normalizePackageName(name: string) {
  const normalizedName = name
    .trim()
    .replaceAll('_', '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-@/.]/g, '')
    .toLowerCase();

  if (!normalizedName) {
    throw new Error('Admin app name is required.');
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

function getTemplateDir() {
  return path.join(getPackageRoot(), 'templates', TEMPLATE_NAME);
}

function getShellTemplateDir() {
  return path.join(getPackageRoot(), 'templates', 'admin-shell');
}

function getTemplateMetaPath() {
  return path.join(getPackageRoot(), 'templates', TEMPLATE_META_FILE);
}

async function isDirectoryEmpty(dir: string) {
  if (!existsSync(dir)) return true;

  const files = await readdir(dir);

  return files.length === 0;
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

async function installDependencies(cwd: string) {
  const { execa } = await import('execa');
  await execa('pnpm', ['install'], { cwd, stdio: 'inherit' });
}

/** 独立模式下把 monorepo 协议物化掉，并把物化过程中发现的隐患打印出来。 */
async function applyStandaloneMaterialization(targetDir: string, packageName: string, description: string) {
  const metaPath = getTemplateMetaPath();

  if (!existsSync(metaPath)) {
    throw new Error(
      `Template metadata is missing: ${metaPath}\nRun "pnpm sa sync-admin-template" to regenerate it, or pass --workspace to keep the monorepo protocols.`
    );
  }

  const meta = await readTemplateMeta(metaPath);
  const { missedRewrites, unpublishedPackages } = await materializeStandaloneApp({
    description,
    meta,
    packageName,
    targetDir
  });

  for (const missed of missedRewrites) {
    console.log(yellow(`warning  ${missed}`));
  }

  if (unpublishedPackages.length > 0) {
    console.log(
      yellow(
        `warning  these workspace packages are marked "private": true and cannot be installed from the registry: ${unpublishedPackages.join(', ')}`
      )
    );
  }
}

export async function createAdminTemplate(name: string, options: CreateAdminTemplateOptions = {}) {
  const packageName = normalizePackageName(name);
  const title = options.title || toTitle(packageName);
  const description = options.description || `${title} admin application`;
  const storagePrefix = toStoragePrefix(packageName);
  const directoryName = packageName.replace(/^@[^/]+\//, '');
  const targetDir = path.resolve(process.cwd(), options.target || path.join('apps', directoryName));
  const templateDir = getTemplateDir();

  if (!existsSync(templateDir)) {
    throw new Error(`Admin template is missing: ${templateDir}`);
  }

  if (existsSync(targetDir) && !(await isDirectoryEmpty(targetDir))) {
    if (!options.force) {
      throw new Error(`Target directory is not empty: ${targetDir}. Use --force to overwrite it.`);
    }

    await rm(targetDir, { force: true, recursive: true });
  }

  await mkdir(path.dirname(targetDir), { recursive: true });
  await cp(templateDir, targetDir, { recursive: true });

  if (options.workspace) {
    // workspace 模式共用 packages/web/admin 的那份 shell（vite/tsconfig 里的 @shell 已指向它）。
    await updatePackageJson(targetDir, packageName, description);
  } else {
    // 独立模式把 shell 源码复制进项目，@shell 走 admin-vite 的默认别名 src/framework。
    const shellTemplateDir = getShellTemplateDir();

    if (!existsSync(shellTemplateDir)) {
      throw new Error(`Admin shell template is missing: ${shellTemplateDir}\nRun "pnpm sa sync-admin-template" to regenerate it.`);
    }

    await cp(shellTemplateDir, path.join(targetDir, 'src', 'framework'), { recursive: true });
    await applyStandaloneMaterialization(targetDir, packageName, description);
  }

  await updateEnvFile({ description, storagePrefix, targetDir, title });

  if (options.install) {
    await installDependencies(options.workspace ? process.cwd() : targetDir);
  }

  console.log(green(`Created admin app: ${packageName}`));
  console.log(`${cyan('mode')}   ${options.workspace ? 'workspace (monorepo protocols kept)' : 'standalone'}`);
  console.log(`${cyan('target')} ${targetDir}`);

  if (!options.install) {
    console.log(
      `${cyan('next')}   ${options.workspace ? 'pnpm install (from the workspace root)' : `pnpm --dir ${targetDir} install`}`
    );
  }

  console.log(yellow('The template starts with a minimal Home page; add product routes under src/pages/(admin).'));
}
