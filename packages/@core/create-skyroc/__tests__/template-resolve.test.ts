import { describe, expect, it } from 'vitest';

import {
  matchesWorkspacePattern,
  mergeOxlintConfig,
  mergeTsconfig,
  resolveDependencies,
  resolveDependencySpecifier
} from '../src/template/resolve';

const context = {
  catalog: {
    catalogs: { dev: { oxlint: '^1.60.0' }, web: { antd: '6.5.3' } },
    defaultCatalog: { react: '19.1.0' },
    packages: []
  },
  workspacePackages: new Map([
    ['@skyroc/web-ui', { isPrivate: false, version: '0.1.3' }],
    ['@skyroc/web-admin-theme', { isPrivate: true, version: '1.0.0' }]
  ])
};

describe('resolveDependencySpecifier', () => {
  it('turns workspace:* into a caret range so generated apps still get upstream patches', () => {
    expect(resolveDependencySpecifier('@skyroc/web-ui', 'workspace:*', context)).toBe('^0.1.3');
  });

  it.each([
    ['workspace:^', '^0.1.3'],
    ['workspace:~', '~0.1.3'],
    ['workspace:>=0.1.0', '>=0.1.0']
  ])('resolves %s', (specifier, expected) => {
    expect(resolveDependencySpecifier('@skyroc/web-ui', specifier, context)).toBe(expected);
  });

  it('resolves named and default catalogs', () => {
    expect(resolveDependencySpecifier('oxlint', 'catalog:dev', context)).toBe('^1.60.0');
    expect(resolveDependencySpecifier('react', 'catalog:', context)).toBe('19.1.0');
  });

  it('passes plain semver through untouched', () => {
    expect(resolveDependencySpecifier('unocss', '^66.5.11', context)).toBe('^66.5.11');
  });

  it.each([
    ['unknown workspace package', 'nope', 'workspace:*'],
    ['unknown catalog', 'react', 'catalog:missing'],
    ['package absent from catalog', 'nope', 'catalog:dev']
  ])('throws on %s rather than emitting a broken template', (_label, name, specifier) => {
    expect(() => resolveDependencySpecifier(name, specifier, context)).toThrow();
  });
});

describe('resolveDependencies', () => {
  it('reports workspace deps that are marked private', () => {
    const result = resolveDependencies(
      { '@skyroc/web-admin-theme': 'workspace:*', '@skyroc/web-ui': 'workspace:*' },
      context
    );

    expect(result.resolved).toEqual({ '@skyroc/web-admin-theme': '^1.0.0', '@skyroc/web-ui': '^0.1.3' });
    expect(result.unpublished).toEqual(['@skyroc/web-admin-theme']);
  });

  it('omits dependencies that were inlined elsewhere', () => {
    const result = resolveDependencies({ '@skyroc/web-ui': 'workspace:*' }, context, new Set(['@skyroc/web-ui']));

    expect(result.resolved).toEqual({});
  });
});

describe('mergeTsconfig', () => {
  it('shallow-merges compilerOptions and drops chain-only fields', () => {
    const merged = mergeTsconfig(
      { $schema: 'x', compilerOptions: { strict: true, target: 'ES2020' }, display: 'Base' },
      { compilerOptions: { target: 'ESNext' }, extends: './base.json', include: ['src'] }
    );

    expect(merged).toEqual({
      compilerOptions: { strict: true, target: 'ESNext' },
      include: ['src']
    });
  });
});

describe('mergeOxlintConfig', () => {
  it('merges rules and concatenates overrides parent-first', () => {
    const merged = mergeOxlintConfig(
      { overrides: [{ files: ['a'] }], plugins: ['eslint'], rules: { a: 'error', b: 'warn' } },
      { extends: ['./base.json'], overrides: [{ files: ['b'] }], plugins: ['react'], rules: { b: 'off' } }
    );

    expect(merged).toEqual({
      overrides: [{ files: ['a'] }, { files: ['b'] }],
      plugins: ['react'],
      rules: { a: 'error', b: 'off' }
    });
  });

  it('leaves overrides absent when neither side defines any', () => {
    expect(mergeOxlintConfig({ rules: {} }, { rules: {} })).toEqual({ rules: {} });
  });
});

describe('matchesWorkspacePattern', () => {
  it.each([
    ['apps/admin', 'apps/*', true],
    ['apps/admin/src', 'apps/*', false],
    ['packages/@core/scripts', 'packages/@core/*', true],
    ['packages/web/shadcn-ui', 'packages/web/*', true],
    ['packages/web', 'packages/web/*', false],
    ['a/b/c/d', 'a/**/d', true],
    ['a/d', 'a/**/d', true],
    ['internal/tsconfig', 'internal/*', true]
  ])('%s vs %s -> %s', (relativePath, pattern, expected) => {
    expect(matchesWorkspacePattern(relativePath, pattern)).toBe(expected);
  });
});
