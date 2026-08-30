import assert from 'node:assert/strict';
import test from 'node:test';

import { mergeReleases, resolveBuildTargets } from './release-plan.mjs';

test('current release replaces an older plan entry and keeps an unpublished package', () => {
  const previous = [
    { name: 'create-skyroc', newVersion: '2.0.1', type: 'patch' },
    { name: '@skyroc/web-ui', newVersion: '0.2.0', type: 'patch' }
  ];
  const current = [{ name: '@skyroc/web-ui', newVersion: '0.2.1', type: 'patch' }];

  assert.deepEqual(mergeReleases(previous, current), [
    { name: '@skyroc/web-ui', newVersion: '0.2.1', type: 'patch' },
    { name: 'create-skyroc', newVersion: '2.0.1', type: 'patch' }
  ]);
});

test('build targets must match public workspace package versions', () => {
  const releases = [{ name: '@skyroc/web-ui', newVersion: '0.2.1', type: 'patch' }];
  const workspacePackages = [{ name: '@skyroc/web-ui', private: false, version: '0.2.1' }];

  assert.deepEqual(resolveBuildTargets(releases, workspacePackages), ['@skyroc/web-ui']);
  assert.throws(
    () => resolveBuildTargets(releases, [{ ...workspacePackages[0], version: '0.2.0' }]),
    /version mismatch/
  );
});
