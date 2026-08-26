import path from 'node:path';
import process from 'node:process';
import * as prompts from '@clack/prompts';
import { cac } from 'cac';

import { version } from '../package.json';
import { createAdminTemplate, normalizePackageName } from './scaffold/create-admin';
import { createExpoTemplate } from './scaffold/create-expo';
import { detectPackageManager, getPackageManagerCommands } from './shared/package-manager';
import { TEMPLATE_NAMES, TEMPLATES, type TemplateName, isTemplateName } from './templates';

interface CreateSkyrocOptions {
  description?: string;
  force?: boolean;
  install?: boolean;
  target?: string;
  template?: string;
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

function cancel() {
  prompts.cancel('Operation cancelled.');
}

async function promptTemplate(): Promise<TemplateName | undefined> {
  const template = await prompts.select<TemplateName>({
    initialValue: 'admin',
    message: 'Select a template:',
    options: TEMPLATE_NAMES.map(name => ({ label: TEMPLATES[name].label, value: name }))
  });

  if (prompts.isCancel(template)) {
    cancel();
    return undefined;
  }

  return template;
}

async function promptProjectName(initial: string): Promise<string | undefined> {
  const name = await prompts.text({
    defaultValue: initial,
    message: 'Project name:',
    placeholder: initial,
    validate(value) {
      try {
        normalizePackageName(value || initial);
        return undefined;
      } catch (error) {
        return error instanceof Error ? error.message : String(error);
      }
    }
  });

  if (prompts.isCancel(name)) {
    cancel();
    return undefined;
  }

  return name;
}

export function resolveTemplateName(value: string | undefined, shouldPrompt: boolean): TemplateName | undefined {
  if (!value) return shouldPrompt ? undefined : 'admin';

  if (!isTemplateName(value)) {
    throw new Error(`Unknown template "${value}". Available templates: ${TEMPLATE_NAMES.join(', ')}.`);
  }

  return value;
}

async function createProject(
  rawName: string | undefined,
  options: CreateSkyrocOptions,
  cliOptions: RunCreateSkyrocCliOptions
) {
  const cwd = path.resolve(cliOptions.cwd || process.cwd());
  let template = resolveTemplateName(options.template, !rawName);

  prompts.intro('create-skyroc');

  if (!template) {
    template = await promptTemplate();
    if (!template) return;
  }

  const name = rawName?.trim() || (await promptProjectName(TEMPLATES[template].projectName));
  if (!name) return;

  const packageName = normalizePackageName(name);
  const directoryName = packageName.replace(/^@[^/]+\//, '');
  const workspace = Boolean(cliOptions.defaultWorkspace || options.workspace);
  const defaultTarget = workspace ? path.join('apps', directoryName) : directoryName;
  const targetDir = path.resolve(cwd, options.target || defaultTarget);
  const packageManager = detectPackageManager();
  const sharedOptions = {
    description: options.description,
    force: options.force,
    install: options.install,
    packageManager,
    target: targetDir,
    templateAssetsDir: cliOptions.templateAssetsDir,
    workspace
  };

  prompts.log.step(`Scaffolding ${TEMPLATES[template].label} in ${targetDir}...`);

  if (template === 'expo') {
    await createExpoTemplate(packageName, sharedOptions);
  } else {
    await createAdminTemplate(packageName, { ...sharedOptions, title: options.title });
  }

  if (!options.install) {
    const relativeTarget = path.relative(cwd, targetDir) || '.';
    const commands = getPackageManagerCommands(packageManager, TEMPLATES[template].startScript);

    prompts.outro(`Done. Now run:\n\n  cd ${relativeTarget}\n  ${commands.install}\n  ${commands.start}`);
  } else {
    prompts.outro(`Created ${TEMPLATES[template].label}: ${packageName}`);
  }
}

export async function runCreateSkyrocCli(options: RunCreateSkyrocCliOptions = {}) {
  const cli = cac('create-skyroc');

  cli
    .command('[name]', 'create a Skyroc Admin or Expo app')
    .option('--template <template>', 'Template to use: admin or expo (defaults to admin when a name is provided)')
    .option('--target <dir>', 'Target directory (defaults to <cwd>/<name>, or apps/<name> in workspace mode)')
    .option('--title <title>', 'Admin title written to .env (defaults to a title-cased name)')
    .option('--description <description>', 'App description written to package.json (and Admin .env)')
    .option('--force', 'Overwrite the target directory if it is not empty')
    .option('--install', 'Install dependencies with the invoking package manager after generating')
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
    prompts.log.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
