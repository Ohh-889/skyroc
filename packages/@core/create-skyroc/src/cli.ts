import path from 'node:path';
import process from 'node:process';
import { cac } from 'cac';
import { cyan, lightGreen, red } from 'kolorist';

import { version } from '../package.json';
import { createAdminTemplate, normalizePackageName } from './scaffold/create-admin';

interface CreateSkyrocOptions {
  description?: string;
  force?: boolean;
  install?: boolean;
  target?: string;
  title?: string;
  workspace?: boolean;
}

export interface RunCreateSkyrocCliOptions {
  /** CLI 的工作目录；仓库内部入口用 workspace 根覆盖。 */
  cwd?: string;
  /** 仓库内部入口默认创建 workspace 应用。 */
  defaultWorkspace?: boolean;
  /** 内部入口与测试可注入刚生成的模板资产。 */
  templateAssetsDir?: string;
}

async function promptProjectName() {
  const { prompt } = await import('enquirer');

  const { name } = await prompt<{ name: string }>({
    initial: 'skyroc-admin',
    message: 'Project name',
    name: 'name',
    type: 'input'
  });

  return name;
}

async function createProject(
  rawName: string | undefined,
  options: CreateSkyrocOptions,
  cliOptions: RunCreateSkyrocCliOptions
) {
  const cwd = path.resolve(cliOptions.cwd || process.cwd());
  const name = rawName?.trim() || (await promptProjectName());
  const packageName = normalizePackageName(name);
  const directoryName = packageName.replace(/^@[^/]+\//, '');
  const workspace = Boolean(cliOptions.defaultWorkspace || options.workspace);
  const defaultTarget = workspace ? path.join('apps', directoryName) : directoryName;
  const targetDir = path.resolve(cwd, options.target || defaultTarget);

  await createAdminTemplate(packageName, {
    description: options.description,
    force: options.force,
    install: options.install,
    target: targetDir,
    templateAssetsDir: cliOptions.templateAssetsDir,
    title: options.title,
    workspace
  });

  if (!options.install) {
    const relativeTarget = path.relative(cwd, targetDir) || '.';

    console.log('');
    console.log(lightGreen('Next steps:'));
    console.log(`  ${cyan(`cd ${relativeTarget}`)}`);
    console.log(`  ${cyan('pnpm install')}`);
    console.log(`  ${cyan('pnpm dev')}`);
  }
}

export async function runCreateSkyrocCli(options: RunCreateSkyrocCliOptions = {}) {
  const cli = cac('create-skyroc');

  cli
    .command('[name]', lightGreen('create a Skyroc admin app'))
    .option('--target <dir>', 'Target directory (defaults to <cwd>/<name>, or apps/<name> in workspace mode)')
    .option('--title <title>', 'App title written to .env (defaults to a title-cased name)')
    .option('--description <description>', 'App description written to .env and package.json')
    .option('--force', 'Overwrite the target directory if it is not empty')
    .option('--install', 'Run pnpm install after generating')
    .option('--workspace', 'Keep workspace/catalog protocols for an app inside this monorepo')
    .action(async (name: string | undefined, commandOptions: CreateSkyrocOptions) => {
      await createProject(name, commandOptions, options);
    });

  cli.help();
  cli.version(version);
  cli.parse(process.argv, { run: false });

  try {
    await cli.runMatchedCommand();
  } catch (error) {
    console.error(red(error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}
