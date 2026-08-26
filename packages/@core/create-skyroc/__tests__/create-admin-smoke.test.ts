/**
 * `pnpm create skyroc` 端到端冒烟测试。
 *
 * 独立模式此前在「20 个依赖装不上」的状态下静默存活了很久，根因就是没有任何测试真的跑生成流程。 这里对 standalone / workspace 两种模式各生成一次，校验生成物的关键不变量。
 *
 * 不做 `pnpm install`：该测试只验证生成过程和产物结构，registry 依赖可用性由发布流程验证。
 */
import { existsSync } from 'node:fs';
import { lstat, mkdtemp, readFile, readlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { prepareTemplateAssets } from '../src/maintenance/prepare-template-assets';
import { createAdminTemplate } from '../src/scaffold/create-admin';
import { getWorkspaceRoot } from '../src/shared/paths';

const SHELL_DIRS = ['devtools', 'i18n', 'layouts', 'notification', 'runtime', 'styles', 'theme', 'types', 'ui'];

let tempRoot: string;
let standaloneDir: string;
let templateAssetsDir: string;
let workspaceDir: string;

interface GeneratedPackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  name: string;
  scripts: Record<string, string>;
}

interface GeneratedTsconfig {
  compilerOptions: {
    paths: Record<string, string[]>;
  };
}

async function readJson<T>(filePath: string) {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

beforeAll(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), 'skyroc-create-admin-smoke-'));
  standaloneDir = path.join(tempRoot, 'standalone-app');
  templateAssetsDir = path.join(tempRoot, 'template-assets');
  workspaceDir = path.join(tempRoot, 'workspace-app');

  await prepareTemplateAssets({ targetDir: templateAssetsDir, workspaceRoot: getWorkspaceRoot() });
  await createAdminTemplate('smoke-standalone', { target: standaloneDir, templateAssetsDir });
  await createAdminTemplate('smoke-workspace', { target: workspaceDir, templateAssetsDir, workspace: true });
}, 120_000);

afterAll(async () => {
  await rm(tempRoot, { force: true, recursive: true });
});

describe('standalone 模式', () => {
  it('包含仓库根级工程文件与点目录', () => {
    const rootPaths = [
      '.agents',
      '.claude',
      '.cursor',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.npmignore',
      '.npmrc',
      '.oxfmtrc.json',
      '.vscode',
      'AGENTS.md',
      'CLAUDE.md',
      'skills-lock.json'
    ];

    for (const relativePath of rootPaths) {
      expect(existsSync(path.join(standaloneDir, relativePath)), relativePath).toBe(true);
    }

    expect(existsSync(path.join(standaloneDir, '.git'))).toBe(false);
    expect(existsSync(path.join(standaloneDir, '.turbo'))).toBe(false);
    expect(existsSync(path.join(standaloneDir, '.tanstack'))).toBe(false);
  });

  it('还原 npm 特殊点文件与约定符号链接', async () => {
    await expect(readFile(path.join(standaloneDir, '.gitignore'), 'utf8')).resolves.toContain('node_modules');
    await expect(readFile(path.join(standaloneDir, '.npmignore'), 'utf8')).resolves.toContain('*.jks');
    await expect(readFile(path.join(standaloneDir, '.npmrc'), 'utf8')).resolves.toContain('registry');

    await Promise.all(
      ([
        ['.claude/skills/migrate-oxfmt', '../../.agents/skills/migrate-oxfmt'],
        ['.claude/skills/migrate-oxlint', '../../.agents/skills/migrate-oxlint']
      ] as const).map(async ([relativePath, target]) => {
        const fullPath = path.join(standaloneDir, relativePath);

        expect((await lstat(fullPath)).isSymbolicLink(), relativePath).toBe(true);
        await expect(readlink(fullPath)).resolves.toBe(target);
      })
    );
  });

  it('package.json 使用 admin 应用版本', async () => {
    const pkg = await readJson<GeneratedPackageJson>(path.join(standaloneDir, 'package.json'));

    expect(pkg.name).toBe('smoke-standalone');
    expect(pkg.scripts.dev).toBe('vite --mode test');
  });

  it('shell 源码被完整复制进 src/framework', () => {
    for (const dir of SHELL_DIRS) {
      expect(existsSync(path.join(standaloneDir, 'src/framework', dir)), `src/framework/${dir}`).toBe(true);
    }

    // 抽查 @shell/* 说明符的落点真实存在
    expect(existsSync(path.join(standaloneDir, 'src/framework/devtools/index.ts'))).toBe(true);
    expect(existsSync(path.join(standaloneDir, 'src/framework/devtools/jotai.ts'))).toBe(true);
    expect(existsSync(path.join(standaloneDir, 'src/framework/theme/index.ts'))).toBe(true);
    expect(existsSync(path.join(standaloneDir, 'src/framework/layouts/index.ts'))).toBe(true);
    expect(existsSync(path.join(standaloneDir, 'src/framework/styles/global.css'))).toBe(true);
    expect(existsSync(path.join(standaloneDir, 'src/framework/theme/types/theme.d.ts'))).toBe(true);
  });

  it('测试与包配置不进入生成物', () => {
    expect(existsSync(path.join(standaloneDir, 'src/framework/__tests__'))).toBe(false);
    expect(existsSync(path.join(standaloneDir, 'src/framework/package.json'))).toBe(false);
    expect(existsSync(path.join(standaloneDir, 'src/framework/tsconfig.json'))).toBe(false);
  });

  it('package.json 没有 monorepo 协议，也没有已内联的 shell 包', async () => {
    const pkg = await readJson<GeneratedPackageJson>(path.join(standaloneDir, 'package.json'));
    const all = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const [name, specifier] of Object.entries(all)) {
      expect(specifier, name).not.toMatch(/^workspace:|^catalog:/);
    }

    expect(all['@skyroc/web-admin-shell']).toBeUndefined();

    // 已内联的 admin shell 模块不应继续以独立包出现，只有构建预设仍走 registry。
    const legacy = Object.keys(all).filter(
      name => name.startsWith('@skyroc/web-admin-') && name !== '@skyroc/web-admin-vite'
    );

    expect(legacy).toEqual([]);
  });

  it('tsconfig 的 @shell 指向 src/framework，且不再引用 monorepo 路径', async () => {
    const tsconfig = await readJson<GeneratedTsconfig>(path.join(standaloneDir, 'tsconfig.json'));

    expect(tsconfig.compilerOptions.paths['@shell/*']).toEqual(['./src/framework/*']);

    const raw = JSON.stringify(tsconfig);

    expect(raw).not.toContain('packages/web/admin');
    expect(raw).not.toContain('@skyroc/tsconfig');
  });

  it('vite.config 不再覆盖 shellAlias（吃 admin-vite 的默认值 src/framework）', async () => {
    const viteConfig = await readFile(path.join(standaloneDir, 'vite.config.ts'), 'utf8');

    expect(viteConfig).not.toContain('shellAlias');
  });

  it('业务源码里的 @shell import 在 src/framework 下都能落到实际文件', async () => {
    // 生成物自查：src 里每个 `from '@shell/...'` 的说明符都必须能映射到 framework 里的真实路径
    const { readdirSync } = await import('node:fs');

    function collectSourceFiles(dir: string): string[] {
      return readdirSync(path.join(standaloneDir, dir), { withFileTypes: true }).flatMap(entry => {
        const relativePath = `${dir}/${entry.name}`;

        if (entry.isDirectory()) return collectSourceFiles(relativePath);

        return /\.tsx?$/.test(entry.name) ? [relativePath] : [];
      });
    }

    const files = collectSourceFiles('src');
    const missing: string[] = [];

    await Promise.all(
      files.map(async file => {
        const content = await readFile(path.join(standaloneDir, file), 'utf8');

        for (const match of content.matchAll(/from '@shell\/([^']+)'/g)) {
          const specifier = match[1]!;
          const base = path.join(standaloneDir, 'src/framework', specifier);
          const candidates = [
            base,
            `${base}.ts`,
            `${base}.tsx`,
            path.join(base, 'index.ts'),
            path.join(base, 'index.tsx')
          ];

          if (!candidates.some(candidate => existsSync(candidate))) {
            missing.push(`${file}: @shell/${specifier}`);
          }
        }
      })
    );

    expect(missing).toEqual([]);
  });
});

describe('workspace 模式', () => {
  it('不复制 shell，走 packages/web/admin 的共享副本', async () => {
    expect(existsSync(path.join(workspaceDir, 'src/framework'))).toBe(false);

    const pkg = await readJson<GeneratedPackageJson>(path.join(workspaceDir, 'package.json'));

    // shell 经 @shell 别名按目录访问，不需要任何人声明依赖：
    // pnpm 对 workspace 包一律安装其自身依赖，turbo 上 shell 也没有 build 任务可依赖
    expect(pkg.dependencies['@skyroc/web-admin-shell']).toBeUndefined();

    const viteConfig = await readFile(path.join(workspaceDir, 'vite.config.ts'), 'utf8');

    expect(viteConfig).toContain("shellAlias: '../../packages/web/admin'");
  });
});
