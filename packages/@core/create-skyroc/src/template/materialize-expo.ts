import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { TemplateMeta } from './meta';

interface MaterializeExpoOptions {
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
  /** 展平后的配置内容。 */
  content: Record<string, unknown>;
  /** 生成目录下的相对文件路径。 */
  file: string;
  /** 写入配置顶部的 schema。 */
  schema: string;
}

async function materializePackageJson(options: MaterializeExpoOptions) {
  const { description, meta, packageName, targetDir } = options;
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as Record<string, unknown>;

  packageJson.name = packageName;
  packageJson.description = description;
  packageJson.version = '0.0.0';
  packageJson.private = true;
  packageJson.dependencies = meta.dependencies;
  packageJson.devDependencies = meta.devDependencies;

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function materializeJsonConfig(targetDir: string, config: FlattenedConfigFile) {
  await writeFile(
    path.join(targetDir, config.file),
    `${JSON.stringify({ $schema: config.schema, ...config.content }, null, 2)}\n`
  );
}

async function rewriteNativeUiSource(targetDir: string) {
  const globalCssPath = path.join(targetDir, 'src/global.css');
  const content = await readFile(globalCssPath, 'utf8');
  const source = '@source "../node_modules/@skyroc/native-ui/src";';

  if (!content.includes(source)) {
    return ['src/global.css: 没找到 @skyroc/native-ui/src，请确认发布包的样式扫描路径。'];
  }

  await writeFile(globalCssPath, content.replace(source, '@source "../node_modules/@skyroc/native-ui/dist";'));

  return [];
}

/** 把 Expo 模板里的 workspace/catalog 与内部配置引用物化成仓库外可解析的内容。 */
export async function materializeStandaloneExpo(options: MaterializeExpoOptions) {
  const { meta, targetDir } = options;

  await materializePackageJson(options);
  await materializeJsonConfig(targetDir, {
    content: meta.tsconfig,
    file: 'tsconfig.json',
    schema: 'https://json.schemastore.org/tsconfig'
  });
  await materializeJsonConfig(targetDir, {
    content: meta.oxlintConfig,
    file: '.oxlintrc.json',
    schema: './node_modules/oxlint/configuration_schema.json'
  });

  return {
    missedRewrites: await rewriteNativeUiSource(targetDir),
    unpublishedPackages: meta.unpublishedPackages
  };
}
