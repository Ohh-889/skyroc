/**
 * `sa create-admin` 端到端冒烟测试。
 *
 * 独立模式此前在「20 个依赖装不上」的状态下静默存活了很久，根因就是没有任何测试真的跑生成流程。
 * 这里对 standalone / workspace 两种模式各生成一次，校验生成物的关键不变量。
 *
 * 不做 `pnpm install`：standalone 的 registry 依赖要等底座包发布后才装得上
 * （见 packages/MIGRATION-ADMIN-SHELL.md §3.2），装不上是发布问题，不是生成问题。
 */
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createAdminTemplate } from '../src/commands/create-admin';

const SHELL_DIRS = ['i18n', 'layouts', 'notification', 'runtime', 'styles', 'theme', 'types', 'ui'];

let tempRoot: string;
let standaloneDir: string;
let workspaceDir: string;

async function readJson(filePath: string) {
  return JSON.parse(await readFile(filePath, 'utf8')) as Record<string, any>;
}

beforeAll(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), 'skyroc-create-admin-smoke-'));
  standaloneDir = path.join(tempRoot, 'standalone-app');
  workspaceDir = path.join(tempRoot, 'workspace-app');

  await createAdminTemplate('smoke-standalone', { target: standaloneDir });
  await createAdminTemplate('smoke-workspace', { target: workspaceDir, workspace: true });
}, 120_000);

afterAll(async () => {
  await rm(tempRoot, { force: true, recursive: true });
});

describe('standalone 模式', () => {
  it('shell 源码被完整复制进 src/framework', () => {
    for (const dir of SHELL_DIRS) {
      expect(existsSync(path.join(standaloneDir, 'src/framework', dir)), `src/framework/${dir}`).toBe(true);
    }

    // 抽查 @shell/* 说明符的落点真实存在
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
    const pkg = await readJson(path.join(standaloneDir, 'package.json'));
    const all = { ...pkg.dependencies, ...pkg.devDependencies } as Record<string, string>;

    for (const [name, specifier] of Object.entries(all)) {
      expect(specifier, name).not.toMatch(/^workspace:|^catalog:/);
    }

    expect(all['@skyroc/web-admin-shell']).toBeUndefined();

    // 旧的六个 admin 包一个都不该出现（vite / devtools 是仍走 registry 的例外）
    const legacy = Object.keys(all).filter(
      name =>
        name.startsWith('@skyroc/web-admin-') &&
        name !== '@skyroc/web-admin-vite' &&
        name !== '@skyroc/web-admin-devtools'
    );

    expect(legacy).toEqual([]);
  });

  it('tsconfig 的 @shell 指向 src/framework，且不再引用 monorepo 路径', async () => {
    const tsconfig = await readJson(path.join(standaloneDir, 'tsconfig.json'));

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

    for (const file of files) {
      const content = await readFile(path.join(standaloneDir, file), 'utf8');

      for (const match of content.matchAll(/from '@shell\/([^']+)'/g)) {
        const specifier = match[1]!;
        const base = path.join(standaloneDir, 'src/framework', specifier);
        const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')];

        if (!candidates.some(candidate => existsSync(candidate))) {
          missing.push(`${file}: @shell/${specifier}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});

describe('workspace 模式', () => {
  it('不复制 shell，走 packages/web/admin 的共享副本', async () => {
    expect(existsSync(path.join(workspaceDir, 'src/framework'))).toBe(false);

    const pkg = await readJson(path.join(workspaceDir, 'package.json'));

    // shell 经 @shell 别名按目录访问，不需要任何人声明依赖：
    // pnpm 对 workspace 包一律安装其自身依赖，turbo 上 shell 也没有 build 任务可依赖
    expect(pkg.dependencies['@skyroc/web-admin-shell']).toBeUndefined();

    const viteConfig = await readFile(path.join(workspaceDir, 'vite.config.ts'), 'utf8');

    expect(viteConfig).toContain("shellAlias: '../../packages/web/admin'");
  });
});
