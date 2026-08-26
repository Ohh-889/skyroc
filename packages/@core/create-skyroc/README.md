# create-skyroc

> 一条命令生成可独立安装的 Skyroc Admin 应用。

```bash
pnpm create skyroc my-admin
cd my-admin && pnpm install && pnpm dev
```

## 选项

| 选项 | 说明 |
| --- | --- |
| `--target <dir>` | 目标目录，默认当前目录下的 `<name>` |
| `--title <title>` | 应用标题，写入 `.env`（默认由项目名转写） |
| `--description <desc>` | 应用描述，写入 `.env` 与 `package.json` |
| `--force` | 目标目录非空时覆盖 |
| `--install` | 生成后自动执行 `pnpm install` |
| `--workspace` | 保留 `workspace:` / `catalog:` 等 monorepo 写法 |

不带项目名运行时会交互询问。

## 模板来源

本包不在 Git 中维护 Admin 模板快照。构建或发布时会从当前 monorepo 准备模板资产：

- `apps/admin` 提供应用源码；
- `packages/web/admin` 的运行时目录进入生成项目的 `src/framework`；
- 仓库根的协作说明、编辑器配置和 skills 按白名单进入项目；
- workspace / catalog 依赖、tsconfig、oxlint 与 overrides 被解析到 `admin.meta.json`。

生成结果位于 `dist/template-assets`，随 `create-skyroc` 发布包交付。`.gitignore`、`.npmignore`、`.npmrc`
在构建资产中使用安全名称保存，创建项目时还原；约定的符号链接也在创建时重建。

仓库内新增 workspace 应用使用：

```bash
pnpm create:admin my-admin
```

## 开发验证

```bash
pnpm --filter create-skyroc lint
pnpm --filter create-skyroc typecheck
pnpm --filter create-skyroc test
pnpm --filter create-skyroc build
```

## License

MIT
