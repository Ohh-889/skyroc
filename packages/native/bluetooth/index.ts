import type { EventSubscription } from 'expo-modules-core';

import type {
  BluetoothEnableOutcome,
  BluetoothPermission,
  BluetoothReadyOutcome,
  BluetoothResult,
  BluetoothState,
  BluetoothStateChangedEvent
} from './src/Bluetooth.types';
import BluetoothModule from './src/BluetoothModule';

export type * from './src/Bluetooth.types';

// ---------------------------------------------------------------- 状态查询

/**
 * 当前蓝牙状态，本模块所有判断的唯一来源。
 *
 * IOS 上首次调用（还没问过蓝牙权限时）返回 `unknown` 且**不会弹窗**—— 想要确定值先调一次 {@link requestBluetoothPermission}，或者直接用
 * {@link ensureBluetoothReady} 走完整流程。
 */
export function getBluetoothState(): Promise<BluetoothState> {
  return BluetoothModule.getStateAsync();
}

/**
 * 本机有没有蓝牙硬件。
 *
 * 只有明确取不到适配器时才是 `false`（Android 模拟器、iOS `unsupported`）， 权限未决 / 蓝牙关着都算「支持」。
 */
export async function isBluetoothSupported(): Promise<boolean> {
  return (await getBluetoothState()) !== 'unsupported';
}

/** 蓝牙开关是不是开着。`turningOn` 这类中间态一律算未开启 */
export async function isBluetoothEnabled(): Promise<boolean> {
  return (await getBluetoothState()) === 'on';
}

/**
 * 现在能不能直接用蓝牙：有硬件、有权限、开关是开的。
 *
 * 等价于 `state === 'on'`——权限没给时 Android 读不到状态、iOS 直接是 `unauthorized`， 都到不了 `on`，所以这一个判断就够了。
 */
export async function isBluetoothAvailable(): Promise<boolean> {
  return (await getBluetoothState()) === 'on';
}

// ---------------------------------------------------------------- 权限

/** 查询蓝牙权限，不弹窗 */
export function getBluetoothPermission(): Promise<BluetoothPermission> {
  return BluetoothModule.getPermissionAsync();
}

/**
 * 申请蓝牙权限，返回用户选择后的最终状态。**不会 reject**。
 *
 * 系统只允许弹一次，之后再调直接返回既有状态： `granted` 为 `false` 且 `canAskAgain` 为 `false` 时就别再调了， 改用 {@link openAppSettings} 引导用户手动开。
 */
export function requestBluetoothPermission(): Promise<BluetoothPermission> {
  return BluetoothModule.requestPermissionAsync();
}

// ---------------------------------------------------------------- 引导开启

/**
 * 请用户把蓝牙打开。**不会 reject**，用户拒绝表现为 `{ ok: false, code }`。
 *
 * 两端落地方式不同，看 `payload.handledBy`：
 *
 * - Android 弹系统开关对话框，等用户选完才 resolve，`handledBy: 'dialog'`
 * - IOS 系统不允许 App 代开蓝牙，跳到本 App 设置页，`handledBy: 'settings'`、 `enabled` 恒为 `false`，需要在用户切回来后自己复查一次状态
 *
 * 所以 **`ok: true` 不等于蓝牙已经开了**，永远看 `payload.enabled`， 或者干脆在 {@link addBluetoothStateListener} 里等状态变成 `on`。
 */
export function requestEnableBluetooth(): Promise<BluetoothResult<BluetoothEnableOutcome>> {
  return BluetoothModule.requestEnableAsync();
}

/**
 * 系统定位服务开没开。
 *
 * **只对 Android 有意义**：Android 12 以下做 BLE 扫描要求定位服务是开的， 关着的话扫描不报错、但一个设备都扫不到。**iOS 恒返回 `true`**。
 */
export function isLocationServicesEnabled(): Promise<boolean> {
  return BluetoothModule.isLocationServicesEnabledAsync();
}

/** 跳到系统定位设置页，返回是否成功跳转。**iOS 恒返回 `false`**（不适用） */
export function openLocationSettings(): Promise<boolean> {
  return BluetoothModule.openLocationSettingsAsync();
}

/** 跳到本 App 的系统设置页，返回是否成功跳转。权限被永久拒绝后唯一的补救路径 */
export function openAppSettings(): Promise<boolean> {
  return BluetoothModule.openAppSettingsAsync();
}

// ---------------------------------------------------------------- 事件

/**
 * 监听蓝牙开关状态变化。
 *
 * 原生侧是**有人监听才注册广播 / CBCentralManager，没人监听就注销**， 所以只要记得 `remove()` 就不会有额外开销。
 *
 * ```ts
 * useEffect(() => {
 *   const sub = addBluetoothStateListener(({ isEnabled }) => setReady(isEnabled));
 *   return () => sub.remove();
 * }, []);
 * ```
 *
 * 注意：iOS 上在用户授权之前收不到任何事件（没授权就不能实例化 `CBCentralManager`）。
 */
export function addBluetoothStateListener(listener: (event: BluetoothStateChangedEvent) => void): EventSubscription {
  return BluetoothModule.addListener('onBluetoothStateChanged', listener);
}

// ---------------------------------------------------------------- 组合流程

function blocked(blockedBy: BluetoothReadyOutcome['blockedBy'], state: BluetoothState): BluetoothReadyOutcome {
  return { blockedBy, ready: false, state };
}

/**
 * 一次把「能用蓝牙」需要的前置条件走完：权限 → 开关 →（Android）定位服务。
 *
 * 纯 JS 的组合，没有对应的原生方法，看不惯这个顺序就自己用上面的原子方法拼。 **不会 reject**，卡住时通过 `blockedBy` 告诉调用方该提示什么：
 *
 * | `blockedBy`           | 该做什么                                                      |
 * | --------------------- | --------------------------------------------------------- |
 * | `unsupported`         | 本机没蓝牙，功能整体不可用                                             |
 * | `permission`          | 权限被拒。`canAskAgain` 为 `false` 时引导去 {@link openAppSettings} |
 * | `bluetoothOff`        | 蓝牙没开。iOS 上此时已经跳到设置页了，提示用户开完再回来                            |
 * | `locationServicesOff` | Android 12 以下且定位服务关着，引导去 {@link openLocationSettings}     |
 *
 * IOS 上返回 `bluetoothOff` 时**已经跳到设置页**，调用方通常配合 {@link addBluetoothStateListener} 或 `AppState` 在用户回来时重跑一次本函数。
 *
 * @param options.requestEnable 蓝牙没开时是否主动引导开启，默认 `true`。 传 `false` 就只做检查不打扰用户（比如启动时的静默探测）
 */
export async function ensureBluetoothReady(options?: { requestEnable?: boolean }): Promise<BluetoothReadyOutcome> {
  const shouldRequestEnable = options?.requestEnable ?? true;

  let state = await getBluetoothState();
  if (state === 'unsupported') {
    return blocked('unsupported', state);
  }

  // iOS 上没问过权限时状态是 unknown，问完才拿得到真实状态，所以顺序是「先权限后开关」
  const permission = await getBluetoothPermission();
  if (!permission.granted) {
    const requested = await requestBluetoothPermission();
    if (!requested.granted) {
      return blocked('permission', await getBluetoothState());
    }
  }

  state = await getBluetoothState();
  if (state !== 'on') {
    if (shouldRequestEnable) {
      await requestEnableBluetooth();
      // Android 上用户可能刚在弹窗里点了「允许」，重查一次；
      // iOS 上这里必然还没开（只是跳了设置页），拿到的还是 off
      state = await getBluetoothState();
    }
    if (state !== 'on') {
      return blocked('bluetoothOff', state);
    }
  }

  if (!(await isLocationServicesEnabled())) {
    return blocked('locationServicesOff', state);
  }

  return { blockedBy: 'none', ready: true, state };
}
