import { readFile } from 'node:fs/promises';

/**
 * 模板物化元数据。
 *
 * `apps/admin` 里满是只有 monorepo 才能解析的写法：`workspace:*`、`catalog:dev`、指向 `internal/` 的 extends
 * 链。这些写法在仓库外一律无解，而 create-skyroc 恰恰要在仓库外跑。
 *
 * 解法是把「解析」和「生成」拆到两个时刻：构建 create-skyroc 时在 monorepo 内把所有协议解析成具体值，写进本文件描述的
 * sidecar；用户创建项目时只做替换，不需要 monorepo 在场。
 */
export interface TemplateMeta {
  /** 协议已解析的运行时依赖。 */
  dependencies: Record<string, string>;
  /** 协议已解析的开发依赖。 */
  devDependencies: Record<string, string>;
  /** 从 pnpm-workspace.yaml 继承的版本 overrides，写入生成应用的 `pnpm.overrides`。 */
  overrides: Record<string, string>;
  /** 展平后的 oxlint 配置，extends 链已就地合并。 */
  oxlintConfig: Record<string, unknown>;
  /** 展平后的 tsconfig，extends 链已就地合并。 */
  tsconfig: Record<string, unknown>;
  /** 依赖中标记了 `private: true` 的 workspace 包，装不上，生成时需要显式告警。 */
  unpublishedPackages: string[];
}

/** 构建期生成到 `dist/template-assets` 的物化元数据文件名。 */
export const TEMPLATE_META_FILE = 'admin.meta.json';

/** 按 key 排序，保证同样的输入产出同样的字节，`--check` 才能靠内容比对判断是否落后。 */
function sortRecord(record: Record<string, string>) {
  return Object.fromEntries(Object.entries(record).toSorted(([a], [b]) => a.localeCompare(b)));
}

export function stringifyTemplateMeta(meta: TemplateMeta) {
  const normalized: TemplateMeta = {
    dependencies: sortRecord(meta.dependencies),
    devDependencies: sortRecord(meta.devDependencies),
    oxlintConfig: meta.oxlintConfig,
    overrides: sortRecord(meta.overrides),
    tsconfig: meta.tsconfig,
    unpublishedPackages: meta.unpublishedPackages.toSorted((a, b) => a.localeCompare(b))
  };

  return `${JSON.stringify(normalized, null, 2)}\n`;
}

export async function readTemplateMeta(metaPath: string) {
  const content = await readFile(metaPath, 'utf8');

  return JSON.parse(content) as TemplateMeta;
}
