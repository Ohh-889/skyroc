import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type ReleaseType = 'major' | 'minor' | 'none' | 'patch';

export interface PlannedRelease {
  changesets?: string[];
  name: string;
  newVersion: string;
  oldVersion: string;
  type: ReleaseType;
}

/** Changesets 版本阶段生成并提交，发布阶段消费，下次版本阶段覆盖。 */
export interface ReleasePlan {
  changesets: unknown[];
  releases: PlannedRelease[];
}

export interface WorkspacePackage {
  name: string;
  path: string;
  private?: boolean;
  version?: string;
}

export const workspaceRoot = path.resolve(__dirname, '../..');
export const releasePlanPath = path.join(workspaceRoot, '.changeset/release-plan.json');

export async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

export async function readReleasePlan(): Promise<ReleasePlan> {
  try {
    return await readJson<ReleasePlan>(releasePlanPath);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return { changesets: [], releases: [] };
    }

    throw error;
  }
}

export function formatReleaseCommitMessage(releases: PlannedRelease[]): string {
  const versions = releases
    .filter(release => release.type !== 'none')
    .map(release => `${release.name}@${release.newVersion}`);

  if (versions.length === 0) return 'chore(release): 更新包版本';

  return `chore(release): 发布 ${versions.join('、')}`;
}

export function resolveBuildTargets(releases: PlannedRelease[], workspacePackages: WorkspacePackage[]): string[] {
  const packagesByName = new Map(workspacePackages.map(pkg => [pkg.name, pkg]));

  return releases.map(release => {
    const pkg = packagesByName.get(release.name);

    if (!pkg) throw new Error(`Release package is not in the workspace: ${release.name}`);
    if (pkg.private) throw new Error(`Release package is private: ${release.name}`);

    // 阻止过期计划为同名包构建并发布错误的本地版本。
    if (pkg.version !== release.newVersion) {
      throw new Error(
        `Release plan version mismatch for ${release.name}: expected ${release.newVersion}, found ${pkg.version}`
      );
    }

    return release.name;
  });
}
