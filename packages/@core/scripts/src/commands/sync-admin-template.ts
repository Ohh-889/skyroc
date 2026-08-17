// oxlint-disable no-console
// oxlint-disable no-continue
// oxlint-disable no-await-in-loop
import { existsSync } from 'node:fs';
import { cp, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { cyan, green, red, yellow } from 'kolorist';

import { getPackageRoot, getWorkspaceRoot } from '../shared';
import { TEMPLATE_META_FILE, stringifyTemplateMeta } from '../template/meta';
import { resolveTemplateMeta } from '../template/resolve';

export interface SyncAdminTemplateOptions {
  /** 只检查模板是否落后于 apps/admin，不写文件。 */
  check?: boolean;
  /** 源 admin 应用目录，默认 apps/admin。 */
  source?: string;
  /** 目标模板目录，默认 packages/@core/scripts/templates/admin。 */
  target?: string;
}

type DifferenceType = 'added' | 'changed' | 'removed';

interface DirectoryDifference {
  path: string;
  type: DifferenceType;
}

const TEMPLATE_NAME = 'admin';

const MAX_REPORTED_DIFFERENCES = 20;

/** 构建产物与工具缓存目录，同步时既不复制也不参与比对。 */
const TECHNICAL_DIRS = new Set(['.tanstack', '.turbo', 'coverage', 'dist', 'node_modules']);

function normalizeRelativePath(filePath: string) {
  return filePath.split(path.sep).join('/');
}

function isLocalEnvFile(relativePath: string) {
  const basename = path.posix.basename(relativePath);

  return basename === '.env.local' || /^\.env\..*\.local$/.test(basename);
}

function isTechnicalGeneratedPath(relativePath: string) {
  if (!relativePath) return false;

  const segments = relativePath.split('/');
  const basename = segments.at(-1);

  return (
    basename === '.DS_Store' ||
    basename?.endsWith('.tsbuildinfo') ||
    basename?.endsWith('.log') ||
    isLocalEnvFile(relativePath) ||
    segments.some(segment => TECHNICAL_DIRS.has(segment))
  );
}

function isRouteTreeFile(relativePath: string) {
  return relativePath === 'src/features/router/routeTree.gen.ts';
}

function shouldCopyPath(relativePath: string) {
  return !isTechnicalGeneratedPath(relativePath) && !isRouteTreeFile(relativePath);
}

function shouldComparePath(relativePath: string) {
  return !isTechnicalGeneratedPath(relativePath);
}

function resolveSourceDir(workspaceRoot: string, source?: string) {
  return path.resolve(workspaceRoot, source || 'apps/admin');
}

function resolveTargetDir(target?: string) {
  return path.resolve(process.cwd(), target || path.join(getPackageRoot(), 'templates', TEMPLATE_NAME));
}

async function copyAdminSource(sourceDir: string, targetDir: string) {
  await rm(targetDir, { force: true, recursive: true });

  await cp(sourceDir, targetDir, {
    filter: source => {
      const relativePath = normalizeRelativePath(path.relative(sourceDir, source));

      return shouldCopyPath(relativePath);
    },
    recursive: true
  });
}

async function generateRouteTree(targetDir: string) {
  // 只有仓库内的同步才需要路由生成器，独立安装 @skyroc/scripts 的用户跑不到这里，因此按需加载而不是常驻依赖。
  const { configSchema, Generator } = await import('@tanstack/router-generator').catch(() => {
    throw new Error(
      '@tanstack/router-generator is not installed. sync-admin-template only runs inside the skyroc-admin monorepo.'
    );
  });

  const routeTreeTmpDir = await mkdtemp(path.join(tmpdir(), 'skyroc-route-tree-'));

  try {
    const config = configSchema.parse({
      autoCodeSplitting: true,
      disableLogging: true,
      generatedRouteTree: path.join(targetDir, 'src/features/router/routeTree.gen.ts'),
      routeFileIgnorePattern: '(?:^|/)(components|modules)(?:/|$)|(?:^|/)(loading|error|not-found)(?:.tsx?|$)',
      routesDirectory: path.join(targetDir, 'src/pages'),
      routeToken: 'layout',
      target: 'react',
      tmpDir: routeTreeTmpDir
    });

    await new Generator({ config, root: targetDir }).run();
  } finally {
    await rm(routeTreeTmpDir, { force: true, recursive: true });
  }
}

async function collectFiles(dir: string) {
  const files: string[] = [];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = normalizeRelativePath(path.relative(dir, fullPath));

      if (!shouldComparePath(relativePath)) continue;

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  }

  if (existsSync(dir)) {
    await walk(dir);
  }

  return files.toSorted((a, b) => a.localeCompare(b));
}

async function compareFiles(leftFile: string, rightFile: string) {
  const [leftStat, rightStat] = await Promise.all([stat(leftFile), stat(rightFile)]);

  if (leftStat.size !== rightStat.size) return false;

  const [leftContent, rightContent] = await Promise.all([readFile(leftFile), readFile(rightFile)]);

  return leftContent.equals(rightContent);
}

async function compareDirectories(leftDir: string, rightDir: string) {
  const [leftFiles, rightFiles] = await Promise.all([collectFiles(leftDir), collectFiles(rightDir)]);
  const leftFileSet = new Set(leftFiles);
  const rightFileSet = new Set(rightFiles);
  const allFiles = Array.from(new Set([...leftFiles, ...rightFiles])).toSorted((a, b) => a.localeCompare(b));
  const differences: DirectoryDifference[] = [];

  for (const file of allFiles) {
    if (!leftFileSet.has(file)) {
      differences.push({ path: file, type: 'added' });
      continue;
    }

    if (!rightFileSet.has(file)) {
      differences.push({ path: file, type: 'removed' });
      continue;
    }

    const isSame = await compareFiles(path.join(leftDir, file), path.join(rightDir, file));

    if (!isSame) {
      differences.push({ path: file, type: 'changed' });
    }
  }

  return differences;
}

/**
 * 产出一份完整快照：模板目录 + 物化元数据。
 *
 * 元数据放在模板目录外层，这样 `templates/admin/` 依然是 `apps/admin` 的逐字节镜像，比对逻辑不需要为 sidecar 开特例。
 */
async function generateSnapshot(workspaceRoot: string, sourceDir: string, targetDir: string) {
  if (!existsSync(sourceDir)) {
    throw new Error(`Admin source is missing: ${sourceDir}`);
  }

  await copyAdminSource(sourceDir, targetDir);
  await generateRouteTree(targetDir);

  const meta = await resolveTemplateMeta({ sourceDir, workspaceRoot });
  const metaContent = stringifyTemplateMeta(meta);

  await writeFile(path.join(path.dirname(targetDir), TEMPLATE_META_FILE), metaContent);

  return { meta, metaContent };
}

function formatDifferences(differences: DirectoryDifference[]) {
  const detail = differences
    .slice(0, MAX_REPORTED_DIFFERENCES)
    .map(item => `  ${item.type.padEnd(7)} ${item.path}`)
    .join('\n');

  if (differences.length <= MAX_REPORTED_DIFFERENCES) return detail;

  return `${detail}\n  ...and ${differences.length - MAX_REPORTED_DIFFERENCES} more`;
}

async function readMetaContent(metaPath: string) {
  if (!existsSync(metaPath)) return '';

  return readFile(metaPath, 'utf8');
}

async function checkAdminTemplate(workspaceRoot: string, sourceDir: string, targetDir: string) {
  const tempDir = await mkdtemp(path.join(tmpdir(), 'skyroc-admin-template-'));
  const generatedDir = path.join(tempDir, TEMPLATE_NAME);

  try {
    const { metaContent } = await generateSnapshot(workspaceRoot, sourceDir, generatedDir);

    const differences = await compareDirectories(targetDir, generatedDir);
    const currentMetaContent = await readMetaContent(path.join(path.dirname(targetDir), TEMPLATE_META_FILE));

    if (currentMetaContent !== metaContent) {
      differences.push({ path: TEMPLATE_META_FILE, type: currentMetaContent ? 'changed' : 'added' });
    }

    if (differences.length > 0) {
      throw new Error(
        [
          red('Admin template is out of date.'),
          `${cyan('source')} ${sourceDir}`,
          `${cyan('target')} ${targetDir}`,
          yellow('Run pnpm sa sync-admin-template to regenerate it.'),
          formatDifferences(differences)
        ].join('\n')
      );
    }

    console.log(green('Admin template is up to date.'));
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

export async function syncAdminTemplate(options: SyncAdminTemplateOptions = {}) {
  const workspaceRoot = getWorkspaceRoot();
  const sourceDir = resolveSourceDir(workspaceRoot, options.source);
  const targetDir = resolveTargetDir(options.target);

  if (options.check) {
    await checkAdminTemplate(workspaceRoot, sourceDir, targetDir);
    return;
  }

  const { meta } = await generateSnapshot(workspaceRoot, sourceDir, targetDir);

  console.log(green('Synced admin template.'));
  console.log(`${cyan('source')} ${sourceDir}`);
  console.log(`${cyan('target')} ${targetDir}`);
  console.log(`${cyan('meta')}   ${path.join(path.dirname(targetDir), TEMPLATE_META_FILE)}`);

  if (meta.unpublishedPackages.length > 0) {
    console.log(
      yellow(
        `warning  standalone apps will not install these private workspace packages: ${meta.unpublishedPackages.join(', ')}`
      )
    );
  }
}
