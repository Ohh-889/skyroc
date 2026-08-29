# expo-templete

Expo SDK 57 + React Native 0.86 + expo-router 的业务模板。

不是脚手架 demo —— 登录态、网络层、主题、国际化、深链、离线提示、原生打包脚本都已经立好了，
新项目从这里 fork 出去，删掉 `demo` 分组就能开始写业务。

|            |                                                                                  |
| ---------- | -------------------------------------------------------------------------------- |
| 路由       | expo-router（typed routes + React Compiler 已开）                                |
| 服务端状态 | TanStack Query，和 web 端共用 `@skyroc/service`                                  |
| 客户端状态 | jotai（`@skyroc/core-state`），持久化走 SecureStore / MMKV                       |
| 样式       | uniwind（Tailwind 语法），语义色 token 在 `src/global.css`                       |
| UI         | `@skyroc/native-ui`                                                              |
| 原生模块   | `@skyroc/expo-bluetooth`、`@skyroc/expo-wechat`、`expo-widgets`（Live Activity） |

## 快速开始

需要 Node 22.11+、pnpm 11+。在仓库根目录装依赖，不要在这个目录单独装：

```bash
pnpm install
pnpm --filter expo-templete doctor   # 环境自检：工具链 / .env 四件套 / ANDROID_HOME / xcode-select
```

然后在 `apps/expo-templete` 下：

```bash
pnpm start            # dev server，加载 .env.dev
pnpm start:staging    # 加载 .env.staging
pnpm start:prod       # 加载 .env.production

pnpm ios              # 装到真机（--device）
pnpm android
```

**Expo Go 跑不起来。** 模板里有蓝牙、微信、Live Activity 三个自定义原生模块，第一次必须
`pnpm ios` / `pnpm android` 出一个 development build。之后改 JS 只要 `pnpm start`，
改了 `app.config.ts`、`.env` 里的非 `EXPO_PUBLIC_` 变量、或装了新的原生依赖才要重新出包。

## 目录结构

```
src/
├── app/            路由骨架 —— 只放 _layout、expo-router 特殊文件、一行转发文件
├── pages/          页面实现，和 app/ 严格一一对应；modules/ 放页面私有组件
├── feature/        领域逻辑：auth / linking / network / theme / i18n / list / query ...
├── service/        网络层，目录结构和 web 端 apps/admin-example/src/service 一致
├── store/          SecureStore / MMKV 适配器（注册进 core-state）
├── components/     全局通用组件
├── hooks/          全局通用 hooks
└── constants/      主题常量
```

`src/app` 和 `src/pages` 分开不是洁癖：expo-router 会把 `src/app` 下每个 `.tsx` 都注册成路由，
页面私有组件写进去就会变成幽灵路由，污染 `Href` 类型和 `/_sitemap`。

其余目录：

```
scripts/            原生打包工具箱（ns），见 scripts/README.md
plugins/            自己写的 config plugin
app.config.ts       动态配置，按 APP_ENV 决定应用名 / scheme / 关联域名
metro.config.js     jotai 单例钉死 + uniwind 接线
```

## 环境配置

四个 `.env` 文件，`.env` 是三套环境共用的兜底，其余三个按环境覆盖：

| 文件              | 何时加载                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| `.env`            | 永远加载，只放三套环境**完全相同**的值                                       |
| `.env.dev`        | `pnpm start` / `pnpm ios` / `pnpm android`，打包时 `env=dev`                 |
| `.env.staging`    | `pnpm start:staging`，打包时 `env=staging`                                   |
| `.env.production` | `pnpm start:prod`，打包时 `env=prod`；EAS / `expo export` 也会自动认这个名字 |

dev / staging 故意不叫 `.env.development` / `.env.stage`：dev server 下 `EXPO_PUBLIC_*` 是
Metro 现场拼的虚拟模块，文件值会盖掉 dotenv-cli 设进 `process.env` 的值。只有避开 Metro 的
`additionalExts`（`env` / `local` / `development`），`pnpm start:staging` 才切得动。

变量分两类，**前缀决定它能被谁看见**：

| 前缀            | 谁读                            | 注意                                                                                   |
| --------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_*` | JS 运行时                       | 编译期被 babel 替换成字面量，**解包就能看到，绝不放密钥**；改了要 `expo start --clear` |
| 无前缀          | 只有 `app.config.ts`（Node 侧） | 写进 Info.plist / AndroidManifest，**改了必须重新 prebuild，OTA 覆盖不到**             |

目前用到的：

```ini
# JS 侧
EXPO_PUBLIC_API_BASE_URL             # 留空则登录页走一份本地假凭据，方便没后端时跑起来
EXPO_PUBLIC_API_TIMEOUT              # 默认 10000
EXPO_PUBLIC_SERVICE_SUCCESS_CODE     # 后端业务码，逗号分隔
EXPO_PUBLIC_SERVICE_LOGOUT_CODES
EXPO_PUBLIC_SERVICE_MODAL_LOGOUT_CODES
EXPO_PUBLIC_SERVICE_EXPIRED_TOKEN_CODES
EXPO_PUBLIC_TENCENT_MAP_KEY          # 腾讯地图 web 兜底链接用，不配就少一个跳转选项

# 原生构建期
APP_ENV                              # development / staging / production，决定应用名后缀和 scheme
APP_LINK_HOST                        # Universal Link / App Links 的域名，不配深链不生效
WECHAT_APP_ID                        # 微信开放平台「移动应用」AppID，必须 wx 开头
WECHAT_UNIVERSAL_LINK                # 自己域名下、https、以 / 结尾，且与开放平台后台完全一致
LIVE_ACTIVITY_PUSH                   # 1 = Live Activity 走后端远程推送（会加 aps-environment 权限）
```

## 打包

```bash
pnpm build:apk        # 交互式问环境和版本号，一路打到 APK
pnpm build:ipa
pnpm clean:native     # 删 android/ ios/ .expo/ build/ 和 Metro 缓存
pnpm keystore:sha256  # 拿指纹去填 assetlinks.json / 微信开放平台
```

不想交互就用环境变量喂参数，CI 里就是这么跑的：

```bash
env=staging version=1.2.0 pnpm build:apk
```

脚本会 `source .env` + `source .env.<环境>` 并全部导出，prebuild 和 Metro 都从
`process.env` 继承，所以打出来的包确实带的是那套环境的配置。产物落在
`build/<平台>/<环境>/<版本>/`。签名配置、iOS 两个靶子的描述文件、`.app-version.json`
的自增规则见 [scripts/README.md](./scripts/README.md)。

> **换环境重打之前先 `pnpm clean:native`。** `EXPO_PUBLIC_*` 是 babel 在编译期
> inline 成字面量的，但 Metro 的 transform 缓存不把它们算进 cache key，`prebuild --clean`
> 又只删 `android/` / `ios/`，删不掉 `$TMPDIR` 下的缓存 —— 源码没动的情况下连着打
> staging 和 prod，后一个包里可能还是前一个的接口地址。

## 模板自带的能力

登录后进「发现」tab 就是完整的能力目录，每一条都是可以真机点的页面：

- **四种真实列表场景** —— 分段筛选分页、就地标已读、防抖搜索 + 服务端组头、折叠加载
- **地基** —— 主题三态与语义色 token、中英国际化、表单解决方案（含五种校验）
- **原生能力** —— 地图选 App 起导航、蓝牙状态与权限引导、微信登录与九种分享、灵动岛排队叫号

演示页全部在 `src/app/(app)/demo` + `src/pages/(app)/demo`，业务项目上线前连同
`explore/modules/entries.ts` 一起删掉即可，删了不影响任何地基代码。

## 写代码前

[AGENTS.md](./AGENTS.md) 是这个模板的硬约束，动手前过一遍。几条最容易踩的：

- **`src/app` 只放转发文件**，页面实现在 `src/pages`，私有组件在 `modules/`
- **`(app)` 整组 `headerShown: false`**，头部由页面自己用 `NavBar` / `TabHeader` 拼，不写 `options.title`
- **服务端状态只放 TanStack Query**，别把接口数据塞进全局 store（未读数角标就是反例警告）
- **页面间只传标量**，详情数据由详情页按 id 自己查
- **新增可被外部打开的页面**，要往 `feature/linking/resolve-link.ts` 的 `ALLOWED_PREFIXES` 加一条
- **每个 tab 页的滚动容器要套 `ScrollViewMarker`**，少了它 iOS 上 tab bar 会变成一条死色带

## 换成自己的项目

fork 之后按顺序改：

1. `app.config.ts` 顶部的 `BUNDLE_ID`、`APP_NAME`、`slug`；`assets/` 下的图标和启动图
2. `.env*` 里的 `EXPO_PUBLIC_API_BASE_URL`（三套环境现在指向同一个 mock 地址）
3. `.env` 里的 `WECHAT_APP_ID` / `WECHAT_UNIVERSAL_LINK` 换成自己开放平台的
4. 补 `APP_LINK_HOST`（当前四个 `.env` 里都没有，深链和 Universal Link 现在不生效），
   并在域名下放好 `/.well-known/apple-app-site-association` 与 `/.well-known/assetlinks.json`
5. `pnpm keystore:generate` 生成自己的 keystore —— `expo prebuild` 生成的 release 签名默认指向
   `debug.keystore`，那样的包**能装不能发**；`android/` 每次 prebuild 都重生成，要靠 config plugin 写进去
6. 删掉 `demo` 分组和 `src/feature/demo`
