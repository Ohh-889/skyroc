import { execFile as execFileCallback } from 'node:child_process';
import { appendFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

import { formatReleaseCommitMessage, readJson, releasePlanPath, workspaceRoot } from './release-plan.ts';

import type { ReleasePlan } from './release-plan.ts';

const execFile = promisify(execFileCallback);

async function prepareReleasePlan(): Promise<ReleasePlan> {
  const statusDir = await mkdtemp(path.join(tmpdir(), 'skyroc-release-plan-'));
  const statusPath = path.join(statusDir, 'status.json');

  try {
    await execFile('pnpm', ['changeset', 'status', `--output=${statusPath}`], { cwd: workspaceRoot });

    const plan = await readJson<ReleasePlan>(statusPath);

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
