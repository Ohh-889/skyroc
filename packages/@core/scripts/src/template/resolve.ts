import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { parseYAML } from 'confbox';

import type { TemplateMeta } from './meta';

interface WorkspacePackage {
  /** package.json 中的 `private` 字段，为 true 表示不会发布到 registry。 */
  isPrivate: boolean;
  /** package.json 中的 `version` 字段。 */
  version: string;
}

interface WorkspaceCatalog {
  /** 命名 catalog，对应 `catalog:<name>`。 */
  catalogs: Record<string, Record<string, string>>;
  /** 默认 catalog，对应裸写的 `catalog:`。 */
  defaultCatalog: Record<string, string>;
  /** 根级版本 overrides。 */
  overrides: Record<string, string>;
  /** workspace 包目录的 glob 模式。 */
  packages: string[];
}

interface PnpmWorkspaceFile {
  catalog?: Record<string, string>;
  catalogs?: Record<string, Record<string, string>>;
  overrides?: Record<string, string>;
  packages?: string[];
}

interface ResolveContext {
  /** 名称 → catalog 版本映射。 */
  catalog: WorkspaceCatalog;
  /** 名称 → workspace 包信息。 */
  workspacePackages: Map<string, WorkspacePackage>;
}

interface ResolveTemplateMetaOptions {
  /** 源 admin 应用目录。 */
  sourceDir: string;
  /** monorepo 根目录。 */
  workspaceRoot: string;
}

const SKIP_DIRS = new Set(['.git', '.turbo', 'dist', 'node_modules']);

/**
 * `@skyroc/tsconfig` 的内容已经被展平进生成应用的 tsconfig.json，再留一条依赖只会指向一个装不上的私有包。
 * 其余 workspace 依赖都必须保留——vite.config、uno.config 真的会 import 它们。
 */
const INLINED_DEV_DEPENDENCIES = new Set(['@skyroc/tsconfig']);

/**
 * 把 pnpm 的依赖协议解析成 registry 能识别的版本区间。
 *
 * `workspace:*` 走 `^version` 而不是 pnpm publish 时的精确版本——脚手架产出的是一个新项目，它应该能跟着上游收补丁。
 */
export function resolveDependencySpecifier(name: string, specifier: string, context: ResolveContext) {
  if (specifier.startsWith('workspace:')) {
    const range = specifier.slice('workspace:'.length);
    const workspacePackage = context.workspacePackages.get(name);

    if (!workspacePackage) {
      throw new Error(`Cannot resolve workspace dependency "${name}": no such package in the workspace.`);
    }

    if (range === '*') return `^${workspacePackage.version}`;
    if (range === '^' || range === '~') return `${range}${workspacePackage.version}`;

    return range;
  }

  if (specifier.startsWith('catalog:')) {
    const catalogName = specifier.slice('catalog:'.length).trim();
    const catalog = catalogName ? context.catalog.catalogs[catalogName] : context.catalog.defaultCatalog;

    if (!catalog) {
      throw new Error(`Cannot resolve "${name}": catalog "${catalogName || 'default'}" is not defined.`);
    }

    const version = catalog[name];

    if (!version) {
      throw new Error(`Cannot resolve "${name}": not listed in catalog "${catalogName || 'default'}".`);
    }

    return version;
  }

  return specifier;
}

export function resolveDependencies(
  dependencies: Record<string, string> | undefined,
  context: ResolveContext,
  omit: Set<string> = new Set()
) {
  const resolved: Record<string, string> = {};
  const unpublished: string[] = [];

  const entries = Object.entries(dependencies ?? {}).filter(([name]) => !omit.has(name));

  for (const [name, specifier] of entries) {
    resolved[name] = resolveDependencySpecifier(name, specifier, context);

    if (specifier.startsWith('workspace:') && context.workspacePackages.get(name)?.isPrivate) {
      unpublished.push(name);
    }
  }

  return { resolved, unpublished };
}

/** tsconfig 的 extends 是「compilerOptions 浅合并、其余字段子覆盖父」。 */
export function mergeTsconfig(base: Record<string, unknown>, child: Record<string, unknown>) {
  const merged: Record<string, unknown> = { ...base, ...child };

  merged.compilerOptions = {
    ...((base.compilerOptions as Record<string, unknown>) ?? {}),
    ...((child.compilerOptions as Record<string, unknown>) ?? {})
  };

  delete merged.extends;
  delete merged.$schema;
  delete merged.display;

  return merged;
}

/** oxlint 的 extends 是「rules 浅合并、overrides 按父→子拼接、其余字段子覆盖父」。 */
export function mergeOxlintConfig(base: Record<string, unknown>, child: Record<string, unknown>) {
  const merged: Record<string, unknown> = { ...base, ...child };

  merged.rules = {
    ...((base.rules as Record<string, unknown>) ?? {}),
    ...((child.rules as Record<string, unknown>) ?? {})
  };

  const baseOverrides = (base.overrides as unknown[]) ?? [];
  const childOverrides = (child.overrides as unknown[]) ?? [];

  if (baseOverrides.length > 0 || childOverrides.length > 0) {
    merged.overrides = [...baseOverrides, ...childOverrides];
  }

  delete merged.extends;
  delete merged.$schema;

  return merged;
}

async function readJsonFile(filePath: string) {
  const content = await readFile(filePath, 'utf8');

  // oxlint 配置允许带注释，tsconfig 同理；剥掉行注释和尾逗号再交给 JSON.parse。
  const withoutComments = content.replaceAll(/^\s*\/\/.*$/gm, '').replaceAll(/,(\s*[\]}])/g, '$1');

  return JSON.parse(withoutComments) as Record<string, unknown>;
}

function resolveExtendsPath(specifier: string, fromDir: string) {
  if (specifier.startsWith('.')) {
    return path.resolve(fromDir, specifier);
  }

  // `@skyroc/tsconfig/web-app.json` 这类包内路径，交给 Node 的解析算法。
  return createRequire(path.join(fromDir, 'package.json')).resolve(specifier);
}

/** 沿 extends 链自底向上展平一份 JSON 配置。 */
async function flattenJsonConfig(
  filePath: string,
  merge: (base: Record<string, unknown>, child: Record<string, unknown>) => Record<string, unknown>
): Promise<Record<string, unknown>> {
  const config = await readJsonFile(filePath);
  const extendsField = config.extends;
  const parents = Array.isArray(extendsField) ? extendsField : [extendsField].filter(Boolean);

  let merged: Record<string, unknown> = {};

  for (const parent of parents) {
    const parentPath = resolveExtendsPath(parent as string, path.dirname(filePath));
    // eslint-disable-next-line no-await-in-loop -- extends 链是有序的，父配置必须先于子配置合并
    const parentConfig = await flattenJsonConfig(parentPath, merge);

    merged = merge(merged, parentConfig);
  }

  return merge(merged, config);
}

function segmentToRegExp(segment: string) {
  const source = segment
    .split('*')
    .map(part => part.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`))
    .join('[^/]*');

  return new RegExp(`^${source}$`);
}

/** 逐段匹配 pnpm-workspace.yaml 的 packages glob，支持 `*` 与 `**`。 */
export function matchesWorkspacePattern(relativePath: string, pattern: string) {
  const pathSegments = relativePath.split('/');
  const patternSegments = pattern.split('/');

  function match(pathIndex: number, patternIndex: number): boolean {
    if (patternIndex === patternSegments.length) return pathIndex === pathSegments.length;

    const patternSegment = patternSegments[patternIndex]!;

    if (patternSegment === '**') {
      // `**` 可以吞掉任意段数，含零段。
      for (let skip = pathIndex; skip <= pathSegments.length; skip += 1) {
        if (match(skip, patternIndex + 1)) return true;
      }

      return false;
    }

    if (pathIndex === pathSegments.length) return false;

    return segmentToRegExp(patternSegment).test(pathSegments[pathIndex]!) && match(pathIndex + 1, patternIndex + 1);
  }

  return match(0, 0);
}

async function readWorkspaceCatalog(workspaceRoot: string): Promise<WorkspaceCatalog> {
  const workspaceFilePath = path.join(workspaceRoot, 'pnpm-workspace.yaml');
  const workspaceFile = parseYAML<PnpmWorkspaceFile>(await readFile(workspaceFilePath, 'utf8'));

  return {
    catalogs: workspaceFile.catalogs ?? {},
    defaultCatalog: workspaceFile.catalog ?? {},
    overrides: workspaceFile.overrides ?? {},
    packages: workspaceFile.packages ?? []
  };
}

async function collectWorkspacePackages(workspaceRoot: string, patterns: string[]) {
  const isWorkspaceDir = (relativePath: string) =>
    patterns.some(pattern => matchesWorkspacePattern(relativePath, pattern));
  const maxDepth = Math.max(...patterns.map(pattern => pattern.split('/').length), 1);
  const packages = new Map<string, WorkspacePackage>();

  async function walk(currentDir: string, depth: number) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    const directories = entries.filter(entry => entry.isDirectory() && !SKIP_DIRS.has(entry.name));

    await Promise.all(
      directories.map(async entry => {
        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.relative(workspaceRoot, fullPath).split(path.sep).join('/');

        if (isWorkspaceDir(relativePath)) {
          const packageJsonPath = path.join(fullPath, 'package.json');

          if (existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
              name?: string;
              private?: boolean;
              version?: string;
            };

            if (packageJson.name) {
              packages.set(packageJson.name, {
                isPrivate: Boolean(packageJson.private),
                version: packageJson.version ?? '0.0.0'
              });
            }
          }
        }

        if (depth < maxDepth) {
          await walk(fullPath, depth + 1);
        }
      })
    );
  }

  await walk(workspaceRoot, 1);

  return packages;
}

/** 在 monorepo 内解析出模板的全部物化数据。只能在仓库内调用。 */
export async function resolveTemplateMeta(options: ResolveTemplateMetaOptions): Promise<TemplateMeta> {
  const { sourceDir, workspaceRoot } = options;

  const catalog = await readWorkspaceCatalog(workspaceRoot);
  const workspacePackages = await collectWorkspacePackages(workspaceRoot, catalog.packages);
  const context: ResolveContext = { catalog, workspacePackages };

  const packageJson = JSON.parse(await readFile(path.join(sourceDir, 'package.json'), 'utf8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const dependencies = resolveDependencies(packageJson.dependencies, context);
  const devDependencies = resolveDependencies(packageJson.devDependencies, context, INLINED_DEV_DEPENDENCIES);

  const [tsconfig, oxlintConfig] = await Promise.all([
    flattenJsonConfig(path.join(sourceDir, 'tsconfig.json'), mergeTsconfig),
    flattenJsonConfig(path.join(sourceDir, '.oxlintrc.json'), mergeOxlintConfig)
  ]);

  return {
    dependencies: dependencies.resolved,
    devDependencies: devDependencies.resolved,
    oxlintConfig,
    overrides: catalog.overrides,
    tsconfig,
    unpublishedPackages: Array.from(new Set([...dependencies.unpublished, ...devDependencies.unpublished]))
  };
}
