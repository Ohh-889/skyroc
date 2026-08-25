#!/usr/bin/env node
/**
 * `pnpm create skyroc` 的入口。
 *
 * 只做一层薄壳：解析参数、缺省时交互补齐，然后调 `@skyroc/scripts` 的
 * `createAdminTemplate`。模板本体、物化逻辑、shell 复制全部住在 `@skyroc/scripts`
 * 里——模板更新只需要发那一个包，本包不需要跟着动。
 */
import path from 'node:path';
import process from 'node:process';
import { createAdminTemplate, normalizePackageName } from '@skyroc/scripts';
import { cac } from 'cac';
import { cyan, lightGreen, red } from 'kolorist';

import { version } from '../package.json';

interface CreateSkyrocOptions {
  description?: string;
  force?: boolean;
  install?: boolean;
  title?: string;
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

async function run(rawName: string | undefined, options: CreateSkyrocOptions) {
  const name = rawName?.trim() || (await promptProjectName());
  const packageName = normalizePackageName(name);
  // createAdminTemplate 的默认 target 是 monorepo 语义的 apps/<name>；
  // 脚手架场景要落在用户当前目录下。
  const directoryName = packageName.replace(/^@[^/]+\//, '');
  const targetDir = path.resolve(process.cwd(), directoryName);

  await createAdminTemplate(packageName, {
    description: options.description,
    force: options.force,
    install: options.install,
    target: targetDir,
    title: options.title
  });

  if (!options.install) {
    console.log('');
    console.log(lightGreen('Next steps:'));
    console.log(`  ${cyan(`cd ${directoryName}`)}`);
    console.log(`  ${cyan('pnpm install')}`);
    console.log(`  ${cyan('pnpm dev')}`);
  }
}

function setupCli() {
  const cli = cac('create-skyroc');

  cli
    .command('[name]', lightGreen('create a Skyroc admin app in <cwd>/<name>'))
    .option('--title <title>', 'App title written to .env (defaults to a title-cased name)')
    .option('--description <description>', 'App description written to .env and package.json')
    .option('--force', 'Overwrite the target directory if it is not empty')
    .option('--install', 'Run pnpm install after generating')
    .action(async (name: string | undefined, options: CreateSkyrocOptions) => {
      try {
        await run(name, options);
      } catch (error) {
        console.error(red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
      }
    });

  cli.help();
  cli.version(version);
  cli.parse();
}

setupCli();
