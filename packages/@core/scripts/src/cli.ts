import process from 'node:process';
import { cac } from 'cac';
import { blue, lightGreen, red } from 'kolorist';

import { version } from '../package.json';

import { cleanup, genChangelog, gitCommit, gitCommitVerify, release, updatePkg } from './commands';
import { loadCliOptions } from './config';
import type { Lang } from './locales';

type Command = 'changelog' | 'cleanup' | 'git-commit' | 'git-commit-verify' | 'release' | 'update-pkg';

type CommandAction<A extends object> = (args?: A) => Promise<void> | void;

type CommandWithAction<A extends object = object> = Record<Command, { action: CommandAction<A>; desc: string }>;

interface CommandArg {
  /**
   * The glob pattern of dirs to cleanup
   *
   * If not set, it will use the default value
   *
   * Multiple values use "," to separate them
   */
  cleanupDir?: string;
  /** Execute additional command after bumping and before git commit. Defaults to 'pnpm sa changelog' */
  execute?: string;
  /**
   * Display lang of cli
   *
   * @default 'en-us'
   */
  lang?: Lang;
  /** Indicates whether to push the git commit and tag. Defaults to true */
  push?: boolean;
  /** Generate changelog by total tags */
  total?: boolean;
}

export async function setupCli() {
  const cliOptions = await loadCliOptions();

  const cli = cac(blue('skyroc-admin'));

  cli
    .version(lightGreen(version))
    .option(
      '-e, --execute [command]',
      "Execute additional command after bumping and before git commit. Defaults to 'npx soy changelog'"
    )
    .option('-p, --push', 'Indicates whether to push the git commit and tag')
    .option('-t, --total', 'Generate changelog by total tags')
    .option(
      '-c, --cleanupDir <dir>',
      'The glob pattern of dirs to cleanup, If not set, it will use the default value, Multiple values use "," to separate them'
    )
    .option('-l, --lang <lang>', 'display lang of cli', { default: 'en-us' })
    .help();

  const commands: CommandWithAction<CommandArg> = {
    changelog: {
      action: async args => {
        await genChangelog(cliOptions.changelogOptions, args?.total);
      },
      desc: 'generate changelog'
    },
    cleanup: {
      action: async () => {
        await cleanup(cliOptions.cleanupDirs);
      },
      desc: 'delete dirs: node_modules, dist, etc.'
    },
    'git-commit': {
      action: async args => {
        await gitCommit(args?.lang);
      },
      desc: 'git commit, generate commit message which match Conventional Commits standard'
    },
    'git-commit-verify': {
      action: async args => {
        await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores);
      },
      desc: 'verify git commit message, make sure it match Conventional Commits standard'
    },
    release: {
      action: async args => {
        await release(args?.execute, args?.push);
      },
      desc: 'release: update version, generate changelog, commit code'
    },
    'update-pkg': {
      action: async () => {
        await updatePkg(cliOptions.ncuCommandArgs);
      },
      desc: 'update package.json dependencies versions'
    }
  };

  for (const [command, { action, desc }] of Object.entries(commands)) {
    cli.command(command, lightGreen(desc)).action(action);
  }

  // 裸跑 `sa` 时给出帮助，而不是静默退出。
  cli.command('').action(() => {
    cli.outputHelp();
  });

  // cac 的 `parse()` 会丢掉 action 返回的 promise，必须拆成 run: false + 手动 await，异常才能被下面的 catch 接住。
  cli.parse(process.argv, { run: false });

  await cli.runMatchedCommand();
}

/**
 * 命令是异步的，而 cac 的 action 返回的 promise 不会被它自己接住。
 *
 * 不在这里收口的话，所有失败都会变成 unhandled rejection——用户看到的是一整段 Node 堆栈，而命令精心排版的错误提示被埋在里面。
 */
setupCli().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`${red('✖')} ${message}`);
  process.exit(1);
});
