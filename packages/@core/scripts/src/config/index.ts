import process from 'node:process';
import { loadConfig } from 'c12';
import type { CliOption } from '../types';

const defaultOptions: CliOption = {
  cwd: process.cwd(),
  cleanupDirs: ['**/dist', '**/package-lock.json', '**/yarn.lock', '**/pnpm-lock.yaml', '**/node_modules'],
  ncuCommandArgs: ['--deep', '-u'],
  changelogOptions: {},
  gitCommitVerifyIgnores: [
    /^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m,
    /^(Merge tag (.*?))(?:\r?\n)*$/m,
    /^(R|r)evert (.*)/,
    /^(amend|fixup|squash)!/,
    /^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/,
    /^Merge remote-tracking branch(\s*)(.*)/,
    /^Automatic merge(.*)/,
    /^Auto-merged (.*?) into (.*)/
  ]
};

/**
 * 加载 CLI 配置。
 *
 * 先读历史遗留的 `soybean.*`，再让 `skyroc.*` 覆盖在上面——包名早已改成 `@skyroc/scripts`，但旧配置文件不该一升级就失效。
 */
export async function loadCliOptions(overrides?: Partial<CliOption>, cwd = process.cwd()) {
  const { config: legacyConfig } = await loadConfig<Partial<CliOption>>({
    name: 'soybean',
    defaults: defaultOptions,
    cwd,
    packageJson: true
  });

  const { config } = await loadConfig<Partial<CliOption>>({
    name: 'skyroc',
    defaults: legacyConfig as Partial<CliOption>,
    overrides,
    cwd,
    packageJson: true
  });

  return config as CliOption;
}
