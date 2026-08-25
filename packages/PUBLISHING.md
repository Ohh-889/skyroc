# 发布现状

本文是一份**快照**，记录各包的 npm 发布状态与独立模式（`sa create-admin` 不带
`--workspace`）的实际可用性。

它和 [`ARCHITECTURE.md`](./ARCHITECTURE.md) 的分工：架构文档记录相对稳定的边界规则，
本文记录会随时间漂移的事实。**读之前先看采集日期，过期就按文末的命令重新跑一遍。**

- 采集日期：2026-08-26（同日随 shell 零包化刷新，见 MIGRATION-ADMIN-SHELL.md 执行记录）
- 采集方式：见文末「复核命令」
- 结论状态：方向已定，见第三节；具体执行见 [`MIGRATION-ADMIN-SHELL.md`](./MIGRATION-ADMIN-SHELL.md)。

## 一、可发布包的 npm 状态

> shell 零包化落地后，可发布包从 23 个减为 **15 个**（含 `internal/` 的
> `@skyroc/uno-config`）：`web-admin-layouts` / `theme` / `i18n` / `notification` /
> `runtime` / `styles` 六包、`@skyroc/types`，以及第二轮并入的
> `@skyroc/web-ui-compose` / `@skyroc/web-ui-antd`，都已进入 `packages/web/admin`
> （private，不发布），不再出现在下面的清单里。

「可发布」指 `package.json` 里没有 `private: true`。

### 在 npm 上且版本一致（3）

| 包 | 本地 | npm |
| --- | --- | --- |
| `@skyroc/web-ui` | 0.1.3 | 0.1.3 |
| `@skyroc/tailwind-plugin` | 0.0.1 | 0.0.1 |
| `@skyroc/form` | 0.0.2 | 0.0.2 |

> ⚠️ 「版本一致」只说明版本号相同，**不代表内容相同**。`web-ui@0.1.3` 与
> `form@0.0.2` 的发布内容对应的是提交 `a1b551b`（合并 `ui-types` / `type-utils`
> 两个纯类型包）之前的源码：
>
> ```text
> npm 上 web-ui@0.1.3 的依赖：@skyroc/ui-types@0.1.0  @skyroc/color@2.5.0
>                             @skyroc/utils@2.0.2     @skyroc/form@0.0.2
> npm 上 form@0.0.2 的依赖：  @skyroc/type-utils@0.0.1  @skyroc/utils@0.0.1
> ```
>
> `ui-types` / `type-utils` 已从仓库删除（npm 上仍在，所以旧版本还能装）。
> 这两个版本号**已被占用且内容不同**，下次发布必须升版本号，不能原地重发。

### 在 npm 上但已过期（4）

| 包 | 本地 | npm | 差距 |
| --- | --- | --- | --- |
| `@skyroc/utils` | **4.0.0** | 2.0.2 | 落后 2 个大版本 |
| `@skyroc/hooks` | 1.0.0 | 0.2.0 | 落后 1 个大版本 |
| `@skyroc/native-ui` | 1.0.0 | 0.1.0 | 落后 1 个大版本 |
| `@skyroc/color` | 2.6.0 | 2.5.0 | 落后 1 个小版本 |

### 从未发布过（8）

标着 `private: false` 和版本号，但 registry 上不存在：

```text
Web Kit（仍走 registry 的两个）
  @skyroc/web-admin-vite          @skyroc/web-admin-devtools

跨端内核
  @skyroc/axios                   @skyroc/logger
  @skyroc/core-state              @skyroc/service

CLI 与配置
  @skyroc/scripts                 @skyroc/uno-config
```

这 8 个里除 `@skyroc/scripts`（已于 2026-08-26 发布 2.5.0 ✅）外都在
`sa create-admin` 生成项目的依赖里。另有新建的 `create-skyroc@0.1.0`
（`pnpm create skyroc` 入口，registry 上的 0.0.1 是 2025-10 的一次坏发布——tarball
缺 `dist/index.js`，bin 指向不存在的文件）。独立模式可安装的完整前提是
**13 次发布**：这 8 个首发 + `utils` / `hooks` / `color` 补发 + `web-ui` 升版重发
（0.1.4，版本号被旧内容占用）+ 传递依赖 `form` 升版（0.0.3，同理）。逐包明细见
[`MIGRATION-ADMIN-SHELL.md`](./MIGRATION-ADMIN-SHELL.md) 执行记录。

## 二、独立模式：生成已通、安装待发布

`sa create-admin`（不带 `--workspace`）把模板里的 `workspace:*` 物化成 `^<本地版本>`，
并把 shell 源码整目录复制进生成项目的 `src/framework/`（`@shell/*` 别名，零 `@skyroc`
shell 依赖）。生成物由 `packages/@core/scripts/__tests__/create-admin-smoke.test.ts`
持续校验。

生成项目仍需从 registry 安装 **12 个** `@skyroc` / `@sa` 包：上一节「从未发布过」的
8 个 + 过期的 `utils` / `hooks` / `color` + 需升版重发的 `web-ui`。发布完成前，
`pnpm install` 仍会失败——这是独立模式最后一块缺口，也是唯一一块。

> shell 零包化前的快照：21 个依赖里 20 个装不上，且 CLI 只对 `private: true` 打
> warning，缺口完全静默。当时的明细见 git 历史中本文件的上一版。

## 三、已选定的方向

**不是「全发」或「全不发」，而是按性质分两层**。完整方案见
[`MIGRATION-ADMIN-SHELL.md`](./MIGRATION-ADMIN-SHELL.md)。

| | admin shell | UI / 工具底座 |
| --- | --- | --- |
| 包 | `web-admin-layouts` `web-admin-theme` `web-admin-i18n` `web-admin-notification` `web-admin-runtime` `web-admin-styles` | `web-ui` `web-ui-antd` `web-ui-compose` `utils` `hooks` `color` `form` `core-state` |
| 通用性 | 绑死 admin 形态 | 与 admin 无关 |
| 消费者会改吗 | 会 | 不会 |
| 处置 | **零包化**，CLI 生成时复制进项目 | **补发 npm** |

`web-admin-vite`（21 个构建期依赖）和 `web-admin-devtools`（dev-only 依赖）
保持包形态不变。

生成项目实际需要从 registry 安装的 `@skyroc` / `@sa` 包共 **12 个**（含
`web-admin-vite` / `web-admin-devtools`，两者按「先不动」的决策继续走 registry）。
其中 11 个待发布或待补发（`web-ui` 另需升版重发），加上传递依赖 `form` 共
**13 次发布**，明细见 [`MIGRATION-ADMIN-SHELL.md`](./MIGRATION-ADMIN-SHELL.md) 执行记录。

仓库目前**没有 CI 发布工作流**（`.github/workflows` 不存在），发布全靠
`sa release` 手动跑。

## 四、复核命令

重新采集本文数据（下面的脚本连 `internal/` 一起扫，会比第一节的 23 个多出
`@skyroc/uno-config` 一行）：

```bash
# 各可发布包的本地版本 vs npm 版本
node -e "
const fs=require('fs'),path=require('path');
const roots=['packages','packages/@core','packages/web','packages/web/ui',
             'packages/native','packages/native/ui','packages/primitives',
             'packages/hooks','internal'];
for(const r of roots){ if(!fs.existsSync(r))continue;
  for(const d of fs.readdirSync(r)){
    const f=path.join(r,d,'package.json'); if(!fs.existsSync(f))continue;
    const p=JSON.parse(fs.readFileSync(f,'utf8'));
    if(p.name&&p.private!==true)console.log(p.name,p.version);}}
" | while read -r n v; do
  echo "$(printf '%-34s' "$n") 本地:$v  npm:$(npm view "$n" version 2>/dev/null || echo 未发布)"
done

# 模板是否与 apps/admin 同步
pnpm check:admin-template
```

发布链断点（可发布的包依赖了 `private: true` 的包）另有一套检查，
2026-08-26 的结果是 0 处断点。
