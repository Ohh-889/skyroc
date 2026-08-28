# scripts

`bin/ns.sh` 是原生侧的命令入口，`package.json` 里的 `build:apk` / `build:ipa` / `doctor` /
`clean:native` / `keystore:*` 都只是它的别名。另外两个是 TS 校验脚本（`check-routes.ts`、
`check-rtl.ts`），跟 ns 无关。

```
scripts/
├── bin/ns.sh              入口，命令分发
├── lib/utils.sh           输出、校验、交互式提问、环境文件加载、版本号自增
└── commands/
    ├── android/build-apk.sh
    ├── ios/build-ipa.sh
    ├── keystore/{generate,info,sha256}.sh
    ├── clean.sh
    └── doctor.sh
```

## 用法

```bash
pnpm doctor            # 环境自检：工具链、.env 四件套、ANDROID_HOME / xcode-select
pnpm build:apk         # 交互式问 环境 / 版本号 / 是否重装依赖，然后一路打到 APK
pnpm build:ipa
pnpm clean:native      # 删 android/ ios/ .expo/ build/ 和 Metro 缓存
pnpm keystore:generate
pnpm keystore:sha256   # 拿指纹填 assetlinks.json
```

参数不想交互输入就直接用环境变量喂进去，CI 里就是这么跑的：

```bash
env=staging version=1.2.0 pnpm build:apk
```

## 打包脚本做了什么

1. 校验参数（环境 dev/staging/prod、版本号 x.y.z）
2. `source .env` + `source .env.<环境>` 并全部导出 —— 这一步替代 dev 命令里的 dotenv-cli，
   prebuild 时 `app.config.ts` 要读 `APP_ENV` / `APP_LINK_HOST` / `WECHAT_*`，Metro 打包时要读
   `EXPO_PUBLIC_*`，都是从 `process.env` 拿，子进程继承即可
3. `.app-version.json` 里的 `versionCode` / `buildNumber` 自增，经环境变量交给 `app.config.ts`
4. `expo prebuild --clean` → `./gradlew assembleRelease` / `xcodebuild archive + exportArchive`
5. 产物复制到 `build/<平台>/<环境>/<版本>/`（根 `.gitignore` 已忽略 `build`）

**脚本只负责出包。**装依赖、上传分发、传 App Store 都不在里面 —— 跑之前自己先 `pnpm install`，
产物拿到 `build/` 下自行处理。

## 需要配置的环境变量

写进 `.env`（或 CI 的凭据），仓库里不带任何证书信息。

| 变量                                                       | 用途                                 |
| ---------------------------------------------------------- | ------------------------------------ |
| `IOS_TEAM_ID`                                              | Apple Developer Team ID，打 IPA 必填 |
| `IOS_CODE_SIGN_STYLE`                                      | 默认 `Automatic`，见下方「两个靶子」 |
| `IOS_PROVISIONING_PROFILE`                                 | 主 App 描述文件名，手动签名时必填    |
| `IOS_WIDGET_PROVISIONING_PROFILE`                          | Live Activity 扩展的描述文件名       |
| `IOS_EXPORT_METHOD`                                        | 默认 `app-store`                     |
| `KEYSTORE_NAME` / `KEY_ALIAS` / `STORE_PASSWORD` / `DNAME` | keystore 命令用                      |

## 两个靶子的 iOS 签名

`expo-widgets` 会在 prebuild 时多生成一个 Live Activity 扩展靶子，它和主 App 的 bundle id
不同、描述文件也不同。而 `xcodebuild` 命令行上的 `PROVISIONING_PROFILE_SPECIFIER` 会同时作用到
**所有**靶子——手动签名时把主 App 的描述文件套到扩展上，archive 直接失败。

所以默认 archive 走自动签名，真正需要指名道姓的地方放在导出阶段：脚本从刚生成的 `project.pbxproj`
里读出所有靶子的 bundle id，按 id 分别写进 `ExportOptions.plist` 的 `provisioningProfiles`。
非要手动签名就设 `IOS_CODE_SIGN_STYLE=Manual`，同时把两个 `*_PROVISIONING_PROFILE` 都配上。

## 已知待办

- Android 的 release 签名仍是 `expo prebuild` 生成的 debug keystore，`build:apk` 会警告。
  上架前要写一个 config plugin 把自己的 keystore 配进 `android/app/build.gradle`——
  `android/` 每次 prebuild 都会重生成，手改留不住。
- 热更新（pushy / OTA）没有搬过来，这套脚本只出完整包。
