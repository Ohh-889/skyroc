/** 从 packages/web/admin 进入独立项目 src/framework 的运行时目录。 */
export const ADMIN_SHELL_DIRS = [
  'devtools',
  'i18n',
  'layouts',
  'notification',
  'runtime',
  'styles',
  'theme',
  'types',
  'ui'
] as const;

/** 仓库根中明确随脚手架交付的普通文件和目录。 */
export const ROOT_TEMPLATE_ENTRIES = [
  '.agents',
  '.claude',
  '.cursor',
  '.editorconfig',
  '.gitattributes',
  '.oxfmtrc.json',
  '.vscode',
  'AGENTS.md',
  'skills-lock.json'
] as const;

/** Npm 会忽略或改写这些名称，发布资产中用安全名称保存，创建项目时再还原。 */
export const ROOT_SPECIAL_FILES = [
  { assetName: 'gitignore', source: '.gitignore', target: '.gitignore' },
  { assetName: 'npmignore', source: '.npmignore', target: '.npmignore' },
  { assetName: 'npmrc', source: '.npmrc', target: '.npmrc' }
] as const;

/** Npm 包内不依赖符号链接语义，创建项目时按仓库约定重建。 */
export const ROOT_TEMPLATE_SYMLINKS = [
  { path: 'CLAUDE.md', target: 'AGENTS.md' },
  { path: '.claude/skills/migrate-oxfmt', target: '../../.agents/skills/migrate-oxfmt' },
  { path: '.claude/skills/migrate-oxlint', target: '../../.agents/skills/migrate-oxlint' }
] as const;

/** 构建产物与工具缓存目录，不进入模板资产。 */
export const TECHNICAL_DIRS = new Set(['.tanstack', '.turbo', '__pycache__', 'coverage', 'dist', 'node_modules']);
