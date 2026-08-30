import { execFile as execFileCallback } from 'node:child_process';
import { appendFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

import {
  formatReleaseCommitMessage,
  mergeReleases,
  readJson,
  readReleasePlan,
  releasePlanPath,
  workspaceRoot
} from './release-plan.ts';

import type { PlannedRelease, ReleasePlan } from './release-plan.ts';

const execFile = promisify(execFileCallback);

function getCommandOutput(error: unknown): string {
  if (!(error instanceof Error)) return String(error);

  const stdout = 'stdout' in error ? String(error.stdout || '') : '';
  const stderr = 'stderr' in error ? String(error.stderr || '') : '';

  return `${stdout}\n${stderr}`.trim();
}

async function isPublished(release: PlannedRelease): Promise<boolean> {
  try {
    await execFile('pnpm', ['view', `${release.name}@${release.newVersion}`, 'version', '--json'], {
      cwd: workspaceRoot
    });

    return true;
  } catch (error) {
    const output = getCommandOutput(error);

    if (/\bE404\b|404 Not Found/.test(output)) return false;

    throw new Error(`Failed to check npm version ${release.name}@${release.newVersion}:\n${output}`, {
      cause: error
    });
  }
}

async function prepareReleasePlan(): Promise<ReleasePlan> {
  const statusDir = await mkdtemp(path.join(tmpdir(), 'skyroc-release-plan-'));
  const statusPath = path.join(statusDir, 'status.json');

  try {
    await execFile('pnpm', ['changeset', 'status', `--output=${statusPath}`], { cwd: workspaceRoot });

    const [currentStatus, previousPlan] = await Promise.all([readJson<ReleasePlan>(statusPath), readReleasePlan()]);

    // 计划文件会保留到下一次版本更新；已发布条目在覆盖前清理，发布失败的条目继续参与重试。
    const previousPublicationStates = await Promise.all(
      previousPlan.releases.map(async release => ({ published: await isPublished(release), release }))
    );
    const pendingPreviousReleases = previousPublicationStates
      .filter(state => !state.published)
      .map(state => state.release);
    const plan: ReleasePlan = {
      changesets: currentStatus.changesets,
      releases: mergeReleases(pendingPreviousReleases, currentStatus.releases)
    };

    await writeFile(releasePlanPath, `${JSON.stringify(plan, null, 2)}\n`);
    console.log(`Prepared release plan for ${plan.releases.length} package(s).`);

    return plan;
  } finally {
    await rm(statusDir, { force: true, recursive: true });
  }
}

async function main(): Promise<void> {
  const plan = await prepareReleasePlan();

  if (process.argv.includes('--github-output')) {
    const githubOutput = process.env.GITHUB_OUTPUT;

    if (!githubOutput) throw new Error('GITHUB_OUTPUT is required when using --github-output');

    await appendFile(githubOutput, `commit-message=${formatReleaseCommitMessage(plan.releases)}\n`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
