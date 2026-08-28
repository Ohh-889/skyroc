# @skyroc/expo-bluetooth

蓝牙**可用性**的 Expo 模块封装：状态查询、权限申请、引导用户开启。

**不包含**扫描、连接、GATT 读写——那些属于具体的设备 SDK（华为运动健康、某某手环……），
本包只解决所有设备 SDK 共同的前置问题：「现在到底能不能用蓝牙，不能的话卡在哪一步」。

## 安装

```jsonc
// apps/xxx/package.json
{
  "dependencies": {
    "@skyroc/expo-bluetooth": "^1.0.0"
  }
}
```

仓库内开发时使用 `workspace:*`。

然后在 `app.config.ts` 里挂插件（只影响 iOS 的 Info.plist）：

```ts
plugins: [
  [
    '@skyroc/expo-bluetooth',
    {
      // 会原样展示给用户、也会被 App Store 审核，写清楚用来做什么
      bluetoothAlwaysPermission: '需要使用蓝牙来连接您的健康设备'
    }
  ]
];
```

改完跑 `pnpm install` + `npx expo prebuild --clean`。**Expo Go 用不了**，得用 dev client。

## 用法

最省事的是一次把前置条件走完：

```ts
import { ensureBluetoothReady, openAppSettings, openLocationSettings } from '@skyroc/expo-bluetooth';

const outcome = await ensureBluetoothReady();
if (!outcome.ready) {
  switch (outcome.blockedBy) {
    case 'unsupported':
      return toast('本机不支持蓝牙');
    case 'permission':
      return confirm('去设置里打开蓝牙权限', openAppSettings);
    case 'bluetoothOff':
      return toast('请打开蓝牙后重试');
    case 'locationServicesOff':
      return confirm('请打开定位服务', openLocationSettings);
  }
}
// 到这里蓝牙一定可用
```

要自己控制流程就用原子方法：

| 方法                                                                         | 说明                                |
| ---------------------------------------------------------------------------- | ----------------------------------- |
| `getBluetoothState()`                                                        | 当前状态，其余判断全是它的派生      |
| `isBluetoothSupported()` / `isBluetoothEnabled()` / `isBluetoothAvailable()` | 三个常用判断                        |
| `getBluetoothPermission()` / `requestBluetoothPermission()`                  | 权限查询 / 申请                     |
| `requestEnableBluetooth()`                                                   | 引导用户打开蓝牙                    |
| `isLocationServicesEnabled()` / `openLocationSettings()`                     | Android 12 以下扫描要求定位服务开着 |
| `openAppSettings()`                                                          | 权限被永久拒绝后的补救              |
| `addBluetoothStateListener()`                                                | 开关状态变化                        |

监听状态变化：

```ts
useEffect(() => {
  const sub = addBluetoothStateListener(({ isEnabled }) => setReady(isEnabled));
  return () => sub.remove();
}, []);
```

## 两端的差异，以及为什么

这些差异**没有**被抹平成「看起来一样」，而是显式暴露在返回值里——
抹平只会让调用方在真机上撞见和文档不符的行为。

### 打开蓝牙

|                  | Android                            | iOS                        |
| ---------------- | ---------------------------------- | -------------------------- |
| 做法             | `ACTION_REQUEST_ENABLE` 系统对话框 | 跳到本 App 的设置页        |
| `handledBy`      | `'dialog'`                         | `'settings'`               |
| `enabled`        | 用户的真实选择                     | **恒为 `false`**           |
| 能不能立刻往下走 | 能                                 | 不能，等用户切回来再查一次 |

iOS 上没有能直接开蓝牙、也没有能跳到蓝牙设置页的公开 API。
`App-Prefs:root=Bluetooth` 这类私有 scheme 会被审核拒，且在新系统上已经失效，所以本包不用它。

### 权限

- Android 12(S) 以下没有蓝牙运行时权限，恒为 `granted`
- Android 12 及以上是 `BLUETOOTH_CONNECT`，可以反复申请直到用户勾了「不再询问」
- iOS 的蓝牙隐私弹窗**一辈子只弹一次**，所以除 `undetermined` 外 `canAskAgain` 恒为 `false`

### iOS 的 `unknown` 状态

iOS 上「实例化 `CBCentralManager`」和「弹权限弹窗」是同一件事，
所以 `getBluetoothState()` 在还没问过权限时**故意不去建 manager**，返回 `unknown`。

一个只是想显示状态的页面不该把权限弹窗弹出来。想要确定值，先调
`requestBluetoothPermission()`，或者直接用 `ensureBluetoothReady()`——它内部就是先权限后状态。

同理，`addBluetoothStateListener()` 在授权之前收不到任何事件。

### 定位服务

Android 12 以下做 BLE 扫描要求**系统定位服务**（不是应用的定位权限）处于开启状态，
关着的话扫描不报错但一个设备都扫不到，是最难查的一类问题。
iOS 没这回事，`isLocationServicesEnabled()` 恒返回 `true`，`openLocationSettings()` 恒返回 `false`。

本包**不声明** `ACCESS_FINE_LOCATION` / `BLUETOOTH_SCAN`：只管开关的模块不该给所有使用方
强加一个会多一轮商店审核的位置权限。真要扫描，在应用自己的 manifest 里加。

## 错误处理

`requestEnableBluetooth()` **永远不 reject**，用户拒绝表现为 `{ ok: false, code }`：

```ts
const result = await requestEnableBluetooth();
if (!result.ok) {
  if (result.code === 'ERR_BLUETOOTH_USER_CANCELLED') return; // 静默处理，别弹错误
  console.warn(result.code, result.message);
  return;
}
```

`code` 的取值见 `BluetoothResultCode`。

## 发布

发布时 `expo-module-scripts` 的 `prepublishOnly` 会清理并重新生成 `build/`，`main` 和 `types` 均指向其中的编译产物。

```bash
pnpm typecheck
pnpm build
npm pack --dry-run
npm publish --access public --registry https://registry.npmjs.org/
```
