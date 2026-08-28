# @skyroc/expo-wechat

微信开放平台 SDK 的 Expo 原生模块封装，覆盖**登录授权**与**九种分享**，iOS / Android 双端实现，基于 Expo Modules API。

> **只支持原生端**，没有 web 实现。模块含自定义原生代码，**在 Expo Go 里跑不起来**，必须用 development build（`expo prebuild` + `expo run:ios` / `run:android`）。
>
> 微信的回跳链路只有真机能走通，模拟器上登录和分享一定失败。

## 能力概览

| 分类       | 方法                                                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 环境探测   | `isWechatInstalled` `openWechat` `getWechatApiVersion` `getWechatInstallUrl`                                                                                   |
| 登录授权   | `sendWechatAuth` `consumePendingWechatAuth`                                                                                                                    |
| 分享收藏   | `shareText` `shareImage` `shareWebpage` `shareVideo` `shareMusic` `shareMusicVideo` `shareFile` `shareEmoticon` `shareMiniProgram` `consumePendingWechatShare` |
| 事件       | `addWechatRequestSentListener` `addWechatResponseListener`                                                                                                     |
| 配置与诊断 | `configureWechat` `checkWechatUniversalLink`                                                                                                                   |
| 工具       | `isWechatCancelled`                                                                                                                                            |

仓库内的可运行示例见 [`apps/expo-templete/src/pages/(app)/demo/wechat.tsx`](../../../apps/expo-templete/src/pages/%28app%29/demo/wechat.tsx)，登录接入的封装见 [`apps/expo-templete/src/feature/auth/use-wechat-login.ts`](../../../apps/expo-templete/src/feature/auth/use-wechat-login.ts)。

## 接入

### 1. 声明依赖

```json
{
  "dependencies": {
    "@skyroc/expo-wechat": "^1.0.0"
  }
}
```

仓库内开发时仍使用 `workspace:*`。

这是一个标准的 Expo 模块包，包根有 `expo-module.config.json`，装好之后 autolinking 会自动扫到，**不需要手动改 Podfile 或 settings.gradle**。可以用下面的命令确认：

```bash
npx expo-modules-autolinking search -p ios      # 应能列出 @skyroc/expo-wechat
npx expo-modules-autolinking search -p android
```

### 2. 配置插件

在宿主应用的 `app.config.ts` 里注册 config plugin：

```ts
plugins: [
  [
    '@skyroc/expo-wechat',
    {
      appId: process.env.WECHAT_APP_ID,
      universalLink: process.env.WECHAT_UNIVERSAL_LINK
    }
  ]
];
```

| 参数            | 必填 | 说明                                                                                            |
| --------------- | ---- | ----------------------------------------------------------------------------------------------- |
| `appId`         | 是   | 开放平台「移动应用」的 AppID，形如 `wx1234567890abcdef`。不以 `wx` 开头会在 prebuild 时直接报错 |
| `universalLink` | 是   | iOS Universal Link，必须是 `https://` 开头、**以 `/` 结尾**，且与开放平台后台填写的完全一致     |

原生侧从 `Info.plist` / `AndroidManifest` 读这两个值，**JS 不需要再传一次 AppID**。

<details>
<summary>插件具体做了什么</summary>

**iOS**

- 写入 `Info.plist` 的 `WXAppID`、`WXUniversalLink`
- 注册回跳 URL scheme（微信要求 scheme 必须**就是 AppID 本身**）
- 把 `weixin`、`weixinULAPI`、`weixinURLParamsAPI` 插到 `LSApplicationQueriesSchemes` **最前面**——系统只认前 50 个，排后面会被挤掉导致探测不到微信
- 往 entitlements 追加 `applinks:<universalLink 的 host>`
- 把 `EXCLUDED_ARCHS[sdk=iphonesimulator*]` 清空。`WechatOpenSDK-XCFramework` 的 podspec 仍在给使用方塞 `arm64` 排除（历史遗留，2.0.7 起已带模拟器 arm64 切片），不覆盖的话 Apple Silicon 上模拟器构建会链接失败

**Android**

- 往 `AndroidManifest` 写 `WX_APP_ID` meta-data
- 声明 `.wxapi.WXEntryActivity`（`singleTask` + 与主应用同 `taskAffinity`，否则回跳会另开一个空任务）
- 在 prebuild 时生成 `${applicationId}.wxapi.WXEntryActivity`。微信是按这个**固定类名**拉起 Activity 的，而包名随 app 变，所以只能生成到应用工程里，不能预置在本包中

</details>

### 3. 重新 prebuild

改过插件参数或本包的原生代码后：

```bash
npx expo prebuild --clean
npx expo run:ios --device   # 微信回跳只有真机能测
```

## 核心约定：永远不 reject

所有方法都 resolve 成 `WechatResult`，**不会抛异常**。「用户点了取消」是正常流程分支而不是错误，不该逼调用方 `try/catch` 再比字符串；而且 Expo 的 `Promise.reject` 会把 message 吞掉，JS 侧只剩 `undefined reason`。

`WechatResult` 是**闭合的判别联合**——两个分支字段完全一致，缺的那些是 `null` 而不是不存在。所以既能直接解构 / `JSON.stringify` 上报，又能靠 `if (result.ok)` 收窄，收窄之后不用写 `!`：

```ts
const result = await sendWechatAuth();

if (!result.ok) {
  console.warn(result.code, result.message); // 这里 code / message 必然有值
  return;
}

await exchangeToken(result.payload.code); // 这里 payload 必然存在
```

## 登录

```ts
import { consumePendingWechatAuth, isWechatCancelled, sendWechatAuth } from '@skyroc/expo-wechat';

const result = await sendWechatAuth({
  scope: 'snsapi_userinfo',
  state: crypto.randomUUID(), // 建议每次传随机值，回调里比对，防串号
  onLaunched: ok => setHint(ok ? '等待微信…' : '唤起失败')
});

if (result.ok) {
  // payload.code 交给后端换 access_token / openid
  // 换 token 要用 AppSecret，绝不能放在客户端
  await api.loginByWechat(result.payload.code);
} else if (!isWechatCancelled(result)) {
  toast(result.message); // 取消类静默处理，其余才提示
}
```

### 冷启动补取

App 被系统杀掉后从微信返回时，原生先于 JS 拿到结果，此时没有挂起的 Promise，结果会被缓存在原生侧，**需要 JS 起来后主动取一次**：

```ts
useEffect(() => {
  consumePendingWechatAuth().then(pending => {
    if (pending?.ok) void api.loginByWechat(pending.payload.code);
  });
}, []);
```

分享同理，用 `consumePendingWechatShare()`。

## 分享

九个方法对应微信的九种媒体对象，除 `shareText` 外都支持 `title` / `description` / `thumb`：

```ts
import { shareMiniProgram, shareWebpage } from '@skyroc/expo-wechat';

await shareWebpage({
  url: 'https://example.com/post/1',
  title: '标题',
  description: '摘要',
  thumb: 'https://example.com/cover.png',
  scene: 'session' // 'session' | 'timeline' | 'favorite'
});

await shareMiniProgram({
  userName: 'gh_xxxxxxxx', // 小程序原始 ID
  path: '/pages/index/index',
  webpageUrl: 'https://example.com', // 低版本微信的兜底网页
  hdImage: 'file:///.../cover.png' // 卡片封面大图，上限 128KB
}); // 只能发到会话，scene 会被忽略
```

### 媒体来源

`thumb` / `image` / `file` / `emoticon` / `hdImage` 都接受三种写法：

- `https://…` / `http://…` —— 远程地址，原生下载
- `file:///…` 或裸绝对路径 —— expo-file-system、相册导出的临时文件
- `data:image/png;base64,…`

**缩略图不用自己处理**：微信限 32KB，超了原生会自动缩尺寸 + 压 JPEG。其余上限（图片 / 文件 10MB、链接 10KB、歌词 32K 等）见 [`src/Wechat.types.ts`](./src/Wechat.types.ts) 各字段注释，超限返回 `ERR_WECHAT_MEDIA_TOO_LARGE` / `ERR_WECHAT_INVALID_OPTIONS`。

## 两段式回调

一次调用会经历两个阶段，耗时来源完全不同：

```
调用 ──本地准备（下载媒体、压缩缩略图，几百 ms ~ 几秒）──> onLaunched ──用户在微信里操作（不可控）──> resolve
```

`onLaunched` 就是用来在这两段之间切 loading 文案的（`准备中…` → `等待微信…`），它**只表示唤起成功，不是最终结果**。

跨调用的全局观察用 `addWechatRequestSentListener` / `addWechatResponseListener`。注意 `onResponse` 是全量通道，和方法返回的 Promise **同时触发**，别重复处理。

## 排错

| 现象                                  | 处理                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `ERR_WECHAT_NO_RESPONSE` 偶发         | 用户按 Home 放弃了，和取消一视同仁（`isWechatCancelled` 已覆盖这两种）        |
| `ERR_WECHAT_NO_RESPONSE` **大量出现** | 多半是 Universal Link 配置有问题，回调丢了。先跑 `checkWechatUniversalLink()` |
| `ERR_WECHAT_NOT_CONFIGURED`           | `app.config.ts` 里插件没配，或配完没重新 prebuild                             |
| `ERR_WECHAT_PENDING`                  | 同类型的上一个请求还没结束。原生侧每种 kind 只有一个 pending 槽               |
| 模拟器构建链接失败                    | 见上文 `EXCLUDED_ARCHS`，确认插件生效且已 prebuild                            |

完整错误码含义见 `WechatResultCode` 的逐条注释。

### Universal Link 自检

```ts
const check = await checkWechatUniversalLink();
if (!check.ok) {
  const failed = check.steps.at(-1);
  console.log(failed?.step, failed?.errorInfo, failed?.suggestion);
}
```

依次检查参数 → 系统版本 → 微信版本 → SDK 内部操作 → 拉起微信 → 从微信返回六步，`steps` 最后一条就是卡住的地方，`suggestion` 是微信给的修正建议。

**仅调试用**（微信头文件原话：「请勿在正式环境的调用」），过程中会真的切到微信再跳回来，所以只能在真机上跑。

### 回调宽限期

从微信切回本 App 后，再等多久还没收到回调就判定这次请求没有结果（返回 `ERR_WECHAT_NO_RESPONSE` 并释放槽位）。默认 **500ms**，会被钳制到 `[100, 5000]`：

```ts
await configureWechat({ resumeGraceMs: 1200 });
```

调大的场景：Universal Link 走了较慢的跳转链路，实测回调经常晚于 500ms 到达，默认值会把正常结果误判成「没有结果」。

这是环境属性而不是单次请求的属性（回调延迟跟你分享什么没关系），所以做成全局配置，一般在 App 启动时调一次即可。

## 包结构

```
packages/native/wechat/
├── expo-module.config.json   # autolinking 入口，必须在包根
├── app.plugin.js             # config plugin，CJS
├── index.ts                  # 公开 API 源码
├── build/                    # npm 包的 JavaScript 与类型声明
├── src/                      # TS 类型与 NativeModule 声明
├── ios/                      # Swift 实现 + Wechat.podspec
└── android/                  # Kotlin 实现 + build.gradle
```

发布时 `expo-module-scripts` 的 `prepublishOnly` 会清理并重新生成 `build/`，`main` 和 `types` 均指向其中的编译产物。

发布预检：

```bash
pnpm typecheck
pnpm build
npm pack --dry-run
```

确认内容无误后发布：

```bash
npm publish --access public --registry https://registry.npmjs.org/
```

`ios/` `android/` 里是**手写的原生源码不是 prebuild 产物**，仓库根 `.gitignore` 对 `packages/native/*/` 有对应的放行规则，新增原生文件时留意别被忽略掉。

原生依赖：iOS `WechatOpenSDK-XCFramework ~> 2.0.7`，Android `com.tencent.mm.opensdk:wechat-sdk-android:6.8.34`。

改动 Swift / Kotlin 后必须重新 `expo prebuild --clean` 才会生效，改 TS 走 Metro 热更即可。
