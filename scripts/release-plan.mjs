import { execFile as execFileCallback, spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const releasePlanPath = path.join(workspaceRoot, '.changeset/release-plan.json');

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function readReleasePlan() {
  try {
    return await readJson(releasePlanPath);
  } catch (error) {
    if (error?.code === 'ENOENT') return { changesets: [], releases: [] };

    throw error;
  }
}

async function isPublished(release) {
  try {
    await execFile('pnpm', ['view', `${release.name}@${release.newVersion}`, 'version', '--json'], {
      cwd: workspaceRoot
    });

    return true;
  } catch (error) {
    const output = `${error?.stdout || ''}\n${error?.stderr || ''}`;

    if (/\bE404\b|404 Not Found/.test(output)) return false;

    throw new Error(`Failed to check npm version ${release.name}@${release.newVersion}:\n${output.trim()}`, {
      cause: error
    });
  }
}

export function mergeReleases(previousReleases, currentReleases) {
  const releases = new Map();

  for (const release of [...previousReleases, ...currentReleases]) {
    if (release.type !== 'none') releases.set(release.name, release);
  }

  return [...releases.values()].toSorted((left, right) => left.name.localeCompare(right.name));
}

export function resolveBuildTargets(releases, workspacePackages) {
  const packagesByName = new Map(workspacePackages.map(pkg => [pkg.name, pkg]));

  return releases.map(release => {
    const pkg = packagesByName.get(release.name);

    if (!pkg) throw new Error(`Release package is not in the workspace: ${release.name}`);
    if (pkg.private) throw new Error(`Release package is private: ${release.name}`);
    if (pkg.version !== release.newVersion) {
      throw new Error(
        `Release plan version mismatch for ${release.name}: expected ${release.newVersion}, found ${pkg.version}`
      );
    }

    return release.name;
  });
}

async function prepareReleasePlan() {
  const statusDir = await mkdtemp(path.join(tmpdir(), 'skyroc-release-plan-'));
  const statusPath = path.join(statusDir, 'status.json');

  try {
    await execFile('pnpm', ['changeset', 'status', `--output=${statusPath}`], { cwd: workspaceRoot });

    const [currentStatus, previousPlan] = await Promise.all([readJson(statusPath), readReleasePlan()]);
    const previousPublicationStates = await Promise.all(
      previousPlan.releases.map(async release => ({ published: await isPublished(release), release }))
    );
    const pendingPreviousReleases = previousPublicationStates
      .filter(state => !state.published)
      .map(state => state.release);

    const plan = {
      changesets: currentStatus.changesets,
      releases: mergeReleases(pendingPreviousReleases, currentStatus.releases)
    };

    await writeFile(releasePlanPath, `${JSON.stringify(plan, null, 2)}\n`);
    console.log(`Prepared release plan for ${plan.releases.length} package(s).`);
  } finally {
    await rm(statusDir, { force: true, recursive: true });
  }
}

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: workspaceRoot, stdio: 'inherit' });

    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function buildReleasePlan() {
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
  const targets = resolveBuildTargets(releases, JSON.parse(stdout));
  const filters = targets.map(name => `--filter=${name}`);

  console.log(`Building release packages: ${targets.join(', ')}`);
  await run('pnpm', ['exec', 'turbo', 'run', 'build', ...filters]);
}

async function main() {
  const command = process.argv[2];

  if (command === 'prepare') {
    await prepareReleasePlan();
    return;
  }

  if (command === 'build') {
    await buildReleasePlan();
    return;
  }

  throw new Error('Usage: node scripts/release-plan.mjs <prepare|build>');
}

const isDirectExecution = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) await main();
