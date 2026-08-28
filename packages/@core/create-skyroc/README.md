# create-skyroc

> 一条命令生成可独立安装的 Skyroc Admin 或 Expo 应用。

```bash
pnpm create skyroc my-admin
cd my-admin && pnpm install && pnpm dev
```

保持兼容，不带 `--template` 且提供项目名时默认生成 Admin：

```bash
pnpm create skyroc my-admin
pnpm create skyroc my-app --template expo
```

不带项目名运行会交互选择 Admin / Expo，并询问项目名。命令由 npm、yarn 或 pnpm 调用时，完成提示会使用对应的包管理器。

## 选项

| 选项                       | 说明                                            |
| -------------------------- | ----------------------------------------------- |
| `--template <admin\|expo>` | 选择模板；带项目名时默认 `admin`                |
| `--target <dir>`           | 目标目录，默认当前目录下的 `<name>`             |
| `--title <title>`          | Admin 标题，写入 `.env`（默认由项目名转写）     |
| `--description <desc>`     | 应用描述；Admin 同时写入 `.env`                 |
| `--force`                  | 目标目录非空时覆盖                              |
| `--install`                | 使用当前调用方的包管理器安装依赖                |
| `--workspace`              | 保留 `workspace:` / `catalog:` 等 monorepo 写法 |

## 模板来源

本包不在 Git 中维护模板快照。构建或发布时会从当前 monorepo 准备模板资产：

- `apps/admin` 提供应用源码；
- `apps/expo-templete` 提供 Expo 应用源码；
- `packages/web/admin` 的运行时目录进入生成项目的 `src/framework`；
- 仓库根的协作说明、编辑器配置和 skills 进入 Admin、Expo 共用的 `root`；
- workspace / catalog 依赖、tsconfig 与 oxlint 分别解析到 `admin.meta.json`、`expo.meta.json`。

生成结果位于 `dist/template-assets`，随 `create-skyroc` 发布包交付。`.gitignore`、`.npmignore`、`.npmrc`
在构建资产中使用安全名称保存，创建项目时还原；约定的符号链接也在创建时重建。

仓库内新增 workspace 应用使用：

```bash
pnpm create:admin my-admin
pnpm create:expo my-app
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
