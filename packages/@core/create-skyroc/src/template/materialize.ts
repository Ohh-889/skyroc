import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { TemplateMeta } from './meta';

interface MaterializeOptions {
  /** 应用描述，写入 package.json。 */
  description: string;
  /** 同步期解析出的物化数据。 */
  meta: TemplateMeta;
  /** 包名，写入 package.json。 */
  packageName: string;
  /** 生成应用所在目录。 */
  targetDir: string;
}

interface FlattenedConfigFile {
  /** Extends 链已展平的配置内容。 */
  content: Record<string, unknown>;
  /** 目标文件相对生成目录的路径。 */
  file: string;
  /** 写入文件顶部的 `$schema`。 */
  schema: string;
}

interface StandaloneRewrite {
  /** 目标文件相对生成目录的路径。 */
  file: string;
  /** 匹配不到时的说明，用于提示模板已漂移。 */
  hint: string;
  /** 需要替换掉的 monorepo 写法。 */
  pattern: RegExp;
  /** 替换成的独立工程写法。 */
  replacement: string;
}

/**
 * 这些 script 靠 `pnpm --filter` 去构建同一个 workspace 里的 `@skyroc/web-admin-vite`。独立工程里该包直接来自 registry， 已经是构建产物，pre* 钩子只会因为
 * filter 不到包而失败。
 */
const DROPPED_PACKAGE_SCRIPTS = [
  'build:admin-vite',
  'prebuild',
  'prebuild:test',
  'predev',
  'predev:prod',
  'prepreview'
] as const;

const STANDALONE_REWRITES: StandaloneRewrite[] = [
  {
    file: 'vite.config.ts',
    hint: 'vite.config.ts 里没找到 monorepo 的 shellAlias 覆盖块，请同步更新 STANDALONE_REWRITES。',
    pattern: /,\s*\/\/ monorepo 内 shell 源码[^\n]*\n\s*resolve:\s*\{\s*shellAlias:[^}]*\}/,
    replacement: ''
  },
  {
    file: 'uno.config.ts',
    hint: 'uno.config.ts 的 filesystem 不再是预期的 monorepo 相对路径，请同步更新 STANDALONE_REWRITES。',
    pattern: /filesystem:\s*\[[^\]]*\]/,
    replacement: "filesystem: ['./node_modules/@skyroc/web-ui/dist/**/*.{js,mjs,cjs}']"
  }
];

function createReadme(packageName: string, description: string) {
  return `# ${packageName}

${description}

基于 [skyroc-admin](https://github.com/Ohh-889/skyroc-admin) 模板，由 \`pnpm create skyroc\` 生成。

## 开始

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## 命令

| 命令 | 说明 |
| --- | --- |
| \`pnpm dev\` | 启动开发服务器（test 环境变量） |
| \`pnpm build\` | 生产构建 |
| \`pnpm preview\` | 预览构建产物 |
| \`pnpm lint\` | oxlint 检查并自动修复 |
| \`pnpm typecheck\` | TypeScript 类型检查 |

## 目录

业务页面放在 \`src/pages/(admin)\` 下，路由由 TanStack Router 基于文件结构自动生成。
`;
}

async function materializePackageJson(options: MaterializeOptions) {
  const { description, meta, packageName, targetDir } = options;
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as Record<string, unknown>;

  packageJson.name = packageName;
  packageJson.description = description;
  packageJson.version = '0.0.0';
  packageJson.private = true;
  packageJson.dependencies = meta.dependencies;
  packageJson.devDependencies = meta.devDependencies;

  const scripts = packageJson.scripts as Record<string, string> | undefined;

  if (scripts) {
    for (const script of DROPPED_PACKAGE_SCRIPTS) {
      delete scripts[script];
    }
  }

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function materializeJsonConfig(targetDir: string, config: FlattenedConfigFile) {
  const content = { $schema: config.schema, ...config.content };

  await writeFile(path.join(targetDir, config.file), `${JSON.stringify(content, null, 2)}\n`);
}

/** 返回未命中的重写规则，让调用方决定是告警还是失败。 */
async function applyStandaloneRewrites(targetDir: string) {
  const missed: StandaloneRewrite[] = [];

  await Promise.all(
    STANDALONE_REWRITES.map(async rewrite => {
      const filePath = path.join(targetDir, rewrite.file);
      const content = await readFile(filePath, 'utf8');

      if (!rewrite.pattern.test(content)) {
        missed.push(rewrite);
        return;
      }

      await writeFile(filePath, content.replace(rewrite.pattern, rewrite.replacement));
    })
  );

  return missed;
}

/** Shell 源码在生成项目里位于 `src/framework`，monorepo 里位于 `packages/web/admin`。 展平后的 tsconfig 还带着 monorepo 的映射，这里改写成独立工程的路径。 */
function rewriteShellTsconfig(tsconfig: Record<string, unknown>) {
  const rewritten = structuredClone(tsconfig);
  const compilerOptions = (rewritten.compilerOptions ?? {}) as Record<string, unknown>;
  const paths = compilerOptions.paths as Record<string, string[]> | undefined;

  if (paths?.['@shell/*']) {
    paths['@shell/*'] = ['./src/framework/*'];
  }

  if (Array.isArray(rewritten.include)) {
    // src/framework 已被 `./**/*.ts` 覆盖，monorepo 的 d.ts include 直接去掉。
    rewritten.include = rewritten.include.filter(
      entry => typeof entry !== 'string' || !entry.includes('packages/web/admin')
    );
  }

  return rewritten;
}

/**
 * 把同步期解析好的数据套用到生成目录，产出一个脱离 monorepo 也能 install 的应用。
 *
 * 返回需要提醒用户的问题：命中失败的重写规则、以及依赖里仍然指向未发布 workspace 包的部分。这两类问题都不应该静默—— 它们最终会以一句莫名其妙的 install 报错砸到用户脸上。
 */
export async function materializeStandaloneApp(options: MaterializeOptions) {
  const { description, meta, packageName, targetDir } = options;

  await materializePackageJson(options);
  await materializeJsonConfig(targetDir, {
    content: rewriteShellTsconfig(meta.tsconfig),
    file: 'tsconfig.json',
    schema: 'https://json.schemastore.org/tsconfig'
  });
  await materializeJsonConfig(targetDir, {
    content: meta.oxlintConfig,
    file: '.oxlintrc.json',
    schema: './node_modules/oxlint/configuration_schema.json'
  });

  const missedRewrites = await applyStandaloneRewrites(targetDir);

  await writeFile(path.join(targetDir, 'README.md'), createReadme(packageName, description));

  return {
    missedRewrites: missedRewrites.map(rewrite => `${rewrite.file}: ${rewrite.hint}`),
    unpublishedPackages: meta.unpublishedPackages
  };
}
