import { execFile as execFileCallback, spawn } from 'node:child_process';
import process from 'node:process';
import { promisify } from 'node:util';

import { readReleasePlan, resolveBuildTargets, workspaceRoot } from './release-plan.ts';

import type { WorkspacePackage } from './release-plan.ts';

const execFile = promisify(execFileCallback);

async function run(command: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd: workspaceRoot, stdio: 'inherit' });

    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function buildReleasePlan(): Promise<void> {
  const plan = await readReleasePlan();
  const releases = plan.releases.filter(release => release.type !== 'none');

  if (releases.length === 0) {
    console.log('Release plan is empty; skipping package build.');
    return;
  }

  const { stdout } = await execFile('pnpm', ['list', '--recursive', '--depth', '-1', '--json'], {
    cwd: workspaceRoot,
    maxBuffer: 10 * 1024 * 1024
  });
  const targets = resolveBuildTargets(releases, JSON.parse(stdout) as WorkspacePackage[]);
  const filters = targets.map(name => `--filter=${name}`);

  // Turbo 根据 dependsOn: ^build 补齐目标包真正需要的 workspace 依赖。
  console.log(`Building release packages: ${targets.join(', ')}`);
  await run('pnpm', ['exec', 'turbo', 'run', 'build', ...filters]);
}

buildReleasePlan().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
