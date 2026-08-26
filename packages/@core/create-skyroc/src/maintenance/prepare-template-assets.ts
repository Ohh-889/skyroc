// oxlint-disable no-console
// oxlint-disable no-continue
// oxlint-disable no-await-in-loop
import { existsSync } from 'node:fs';
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { cyan, green } from 'kolorist';

import { getTemplateAssetsDir, getWorkspaceRoot } from '../shared/paths';
import {
  ADMIN_SHELL_DIRS,
  ROOT_SPECIAL_FILES,
  ROOT_TEMPLATE_ENTRIES,
  ROOT_TEMPLATE_SYMLINKS,
  TECHNICAL_DIRS
} from '../template-rules';
import { TEMPLATE_META_FILE, stringifyTemplateMeta } from '../template/meta';
import { resolveTemplateMeta } from '../template/resolve';

export interface PrepareTemplateAssetsOptions {
  /** Admin 应用源码目录，默认 apps/admin。 */
  sourceDir?: string;
  /** 生成的模板资产目录，默认 create-skyroc/dist/template-assets。 */
  targetDir?: string;
  /** Monorepo 根目录，默认从当前目录向上查找。 */
  workspaceRoot?: string;
}

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
    basename?.endsWith('.pyc') ||
    basename?.endsWith('.tsbuildinfo') ||
    basename?.endsWith('.log') ||
    isLocalEnvFile(relativePath) ||
    segments.some(segment => TECHNICAL_DIRS.has(segment))
  );
}

function isRouteTreeFile(relativePath: string) {
  return relativePath === 'src/features/router/routeTree.gen.ts';
}

function assertSafeTarget(targetDir: string, workspaceRoot: string, sourceDir: string) {
  const root = path.parse(targetDir).root;

  if (targetDir === root || targetDir === workspaceRoot || targetDir === sourceDir) {
    throw new Error(`Refusing to replace unsafe template target: ${targetDir}`);
  }
}

function assertSourceExists(source: string) {
  if (!existsSync(source)) {
    throw new Error(`Template source is missing: ${source}`);
  }
}

async function copyRootAssets(workspaceRoot: string, targetDir: string) {
  const rootTargetDir = path.join(targetDir, 'admin-root');
  const specialTargetDir = path.join(targetDir, 'root-special');
  const symlinkPaths = new Set<string>(ROOT_TEMPLATE_SYMLINKS.map(item => item.path));

  await Promise.all([mkdir(rootTargetDir, { recursive: true }), mkdir(specialTargetDir, { recursive: true })]);

  await Promise.all(
    ROOT_TEMPLATE_ENTRIES.map(async entry => {
      const source = path.join(workspaceRoot, entry);
      const target = path.join(rootTargetDir, entry);

      assertSourceExists(source);
      await cp(source, target, {
        filter: currentSource => {
          const relativePath = normalizeRelativePath(path.relative(workspaceRoot, currentSource));

          return !isTechnicalGeneratedPath(relativePath) && !symlinkPaths.has(relativePath);
        },
        recursive: true,
        verbatimSymlinks: true
      });
    })
  );

  await Promise.all(
    ROOT_SPECIAL_FILES.map(async file => {
      const source = path.join(workspaceRoot, file.source);

      assertSourceExists(source);
      await cp(source, path.join(specialTargetDir, file.assetName));
    })
  );
}

async function copyAdminSource(sourceDir: string, targetDir: string) {
  const adminTargetDir = path.join(targetDir, 'admin');

  assertSourceExists(sourceDir);
  await cp(sourceDir, adminTargetDir, {
    filter: source => {
      const relativePath = normalizeRelativePath(path.relative(sourceDir, source));

      return !isTechnicalGeneratedPath(relativePath) && !isRouteTreeFile(relativePath);
    },
    recursive: true
  });
}

async function copyShellSource(workspaceRoot: string, targetDir: string) {
  const shellSourceDir = path.join(workspaceRoot, 'packages/web/admin');
  const shellTargetDir = path.join(targetDir, 'admin-shell');

  await Promise.all(
    ADMIN_SHELL_DIRS.map(async dir => {
      const source = path.join(shellSourceDir, dir);

      assertSourceExists(source);
      await cp(source, path.join(shellTargetDir, dir), {
        filter: currentSource => {
          const relativePath = normalizeRelativePath(path.relative(shellSourceDir, currentSource));

          return !isTechnicalGeneratedPath(relativePath);
        },
        recursive: true
      });
    })
  );
}

async function generateRouteTree(adminTargetDir: string) {
  const { configSchema, Generator } = await import('@tanstack/router-generator');
  const routeTreeTmpDir = await mkdtemp(path.join(tmpdir(), 'skyroc-route-tree-'));

  try {
    const config = configSchema.parse({
      autoCodeSplitting: true,
      disableLogging: true,
      generatedRouteTree: path.join(adminTargetDir, 'src/features/router/routeTree.gen.ts'),
      routeFileIgnorePattern: '(?:^|/)(components|modules)(?:/|$)|(?:^|/)(loading|error|not-found)(?:.tsx?|$)',
      routesDirectory: path.join(adminTargetDir, 'src/pages'),
      routeToken: 'layout',
      target: 'react',
      tmpDir: routeTreeTmpDir
    });

    await new Generator({ config, root: adminTargetDir }).run();
  } finally {
    await rm(routeTreeTmpDir, { force: true, recursive: true });
  }
}

export async function prepareTemplateAssets(options: PrepareTemplateAssetsOptions = {}) {
  const workspaceRoot = path.resolve(options.workspaceRoot || getWorkspaceRoot());
  const sourceDir = path.resolve(options.sourceDir || path.join(workspaceRoot, 'apps/admin'));
  const targetDir = path.resolve(options.targetDir || getTemplateAssetsDir());

  assertSafeTarget(targetDir, workspaceRoot, sourceDir);
  await rm(targetDir, { force: true, recursive: true });
  await mkdir(targetDir, { recursive: true });

  await Promise.all([
    copyRootAssets(workspaceRoot, targetDir),
    copyAdminSource(sourceDir, targetDir),
    copyShellSource(workspaceRoot, targetDir)
  ]);
  await generateRouteTree(path.join(targetDir, 'admin'));

  const meta = await resolveTemplateMeta({ sourceDir, workspaceRoot });
  await writeFile(path.join(targetDir, TEMPLATE_META_FILE), stringifyTemplateMeta(meta));

  return { meta, sourceDir, targetDir, workspaceRoot };
}

const isDirectExecution = Boolean(process.argv[1]) && path.resolve(process.argv[1]!) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  const result = await prepareTemplateAssets();

  console.log(green('Prepared create-skyroc template assets.'));
  console.log(`${cyan('source')} ${result.sourceDir}`);
  console.log(`${cyan('target')} ${result.targetDir}`);
}
