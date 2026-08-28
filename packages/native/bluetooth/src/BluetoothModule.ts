import { NativeModule, requireNativeModule } from 'expo';

import type {
  BluetoothEnableOutcome,
  BluetoothModuleEvents,
  BluetoothPermission,
  BluetoothResult,
  BluetoothState
} from './Bluetooth.types';

/**
 * 原生模块的直接映射，是「原始契约」，不做任何默认值和易用性包装。 业务代码请用 `index.ts` 导出的友好函数。
 *
 * 通用约定： - 所有方法都在原生侧自行切主线程，调用方不用关心线程 - 只有 `requestEnableAsync` 会 resolve 成 `BluetoothResult`（它需要用户参与，会失败）；
 * 其余方法要么返回确定值，要么把「不可用」表达成 `BluetoothState`，都不会 reject
 */
declare class BluetoothModule extends NativeModule<BluetoothModuleEvents> {
  /**
   * 当前蓝牙状态。这是本模块唯一的状态来源，`isEnabled` / `isSupported` 都是它的派生。
   *
   * **Android**：读 `BluetoothAdapter.getState()`。取不到适配器返回 `unsupported`； 缺 `BLUETOOTH_CONNECT` 被系统拒绝时返回
   * `unauthorized`（部分 ROM 会抛 `SecurityException`）。
   *
   * **iOS**：读 `CBManager.authorization`，只有已授权时才会去实例化 `CBCentralManager` 取真实状态——**这个方法不会弹权限弹窗**。没问过权限时返回 `unknown`，
   * 想拿到确定值必须先调 `requestPermissionAsync`。
   */
  getStateAsync(): Promise<BluetoothState>;

  /** 查询蓝牙权限，不弹窗 */
  getPermissionAsync(): Promise<BluetoothPermission>;

  /**
   * 申请蓝牙权限，必要时弹系统弹窗，返回用户选择后的最终状态。
   *
   * **Android 12(S) 以下**没有运行时蓝牙权限，直接返回 granted，不弹窗。 **Android 12 及以上**申请 `BLUETOOTH_CONNECT`。 **iOS** 首次实例化
   * `CBCentralManager` 会触发系统的蓝牙隐私弹窗， 弹窗文案来自 `Info.plist` 的 `NSBluetoothAlwaysUsageDescription`（由 app.plugin.js 写入）。
   *
   * 已经问过一次的情况下系统不会再弹，此时直接返回既有状态， `canAskAgain` 为 `false` 就只能引导用户去设置页。
   */
  requestPermissionAsync(): Promise<BluetoothPermission>;

  /**
   * 请用户把蓝牙打开。
   *
   * **Android**：先确保有 `BLUETOOTH_CONNECT`，再用 `ACTION_REQUEST_ENABLE` 弹系统开关对话框， 并**等到用户做出选择**才 resolve（`handledBy:
   * 'dialog'`）。
   *
   * **iOS**：系统不允许 App 代开蓝牙，也没有可用的公开 API 直达蓝牙设置页 （`App-Prefs:` 是私有 scheme，会被审核拒且新系统上已失效）。 因此这里跳到**本 App
   * 的设置页**（`UIApplication.openSettingsURLString`）， resolve 出 `handledBy: 'settings'`、`enabled: false`，由调用方在用户切回来后复查状态。
   */
  requestEnableAsync(): Promise<BluetoothResult<BluetoothEnableOutcome>>;

  /**
   * 系统定位服务开没开。
   *
   * **只对 Android 有意义**：Android 12 以下做 BLE 扫描要求定位服务处于开启状态， 关着的话扫描不报错但一个设备都扫不到，是最难查的一类问题。 **iOS 上 BLE 不依赖定位服务，恒返回
   * `true`**。
   */
  isLocationServicesEnabledAsync(): Promise<boolean>;

  /** 跳到系统定位设置页，返回是否成功跳转。 **iOS 恒返回 `false`**（不适用，见 `isLocationServicesEnabledAsync`）。 */
  openLocationSettingsAsync(): Promise<boolean>;

  /** 跳到本 App 的系统设置页，返回是否成功跳转。 权限被永久拒绝（`canAskAgain: false`）后唯一的补救路径。 */
  openAppSettingsAsync(): Promise<boolean>;
}

export default requireNativeModule<BluetoothModule>('Bluetooth');
