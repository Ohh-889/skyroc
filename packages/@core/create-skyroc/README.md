# create-skyroc

> `pnpm create skyroc` 的入口——一条命令生成 Skyroc admin 应用。

```bash
pnpm create skyroc my-admin
cd my-admin && pnpm install && pnpm dev
```

## 选项

| 选项 | 说明 |
| --- | --- |
| `--title <title>` | 应用标题，写入 `.env`（默认由项目名转写） |
| `--description <desc>` | 应用描述，写入 `.env` 与 `package.json` |
| `--force` | 目标目录非空时覆盖 |
| `--install` | 生成后自动执行 `pnpm install` |

不带项目名运行时会交互询问。

## 它只是一层薄壳

模板本体、依赖物化、admin shell 源码复制全部住在
[`@skyroc/scripts`](https://www.npmjs.com/package/@skyroc/scripts) 里，本包只负责
命令行入口。模板更新只需发布 `@skyroc/scripts`，本包无需跟着动。

生成的项目里 `src/framework/` 是完整的后台 shell 源码（布局 / 主题 / i18n /
通知 / UI 复合组件…），经 `@shell/*` 别名引用，代码归你所有、可随意修改。

## License

MIT
