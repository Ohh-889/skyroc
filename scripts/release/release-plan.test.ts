import assert from 'node:assert/strict';
import test from 'node:test';

import { formatReleaseCommitMessage, resolveBuildTargets } from './release-plan.ts';

test('release commit message includes package names and versions', () => {
  const releases = [
    { name: '@skyroc/web-ui', newVersion: '0.2.1', oldVersion: '0.2.0', type: 'patch' as const },
    { name: 'create-skyroc', newVersion: '2.0.2', oldVersion: '2.0.1', type: 'patch' as const }
  ];

  assert.equal(formatReleaseCommitMessage(releases), 'chore(release): 发布 @skyroc/web-ui@0.2.1、create-skyroc@2.0.2');
  assert.equal(formatReleaseCommitMessage([]), 'chore(release): 更新包版本');
});

test('build targets must match public workspace package versions', () => {
  const releases = [{ name: '@skyroc/web-ui', newVersion: '0.2.1', oldVersion: '0.2.0', type: 'patch' as const }];
  const workspacePackages = [
    { name: '@skyroc/web-ui', path: '/workspace/packages/web/shadcn-ui', private: false, version: '0.2.1' }
  ];

  assert.deepEqual(resolveBuildTargets(releases, workspacePackages), ['@skyroc/web-ui']);
  assert.throws(
    () => resolveBuildTargets(releases, [{ ...workspacePackages[0], version: '0.2.0' }]),
    /version mismatch/
  );
});
