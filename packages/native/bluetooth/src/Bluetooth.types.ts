/**
 * 蓝牙适配器状态。
 *
 * 两端的原生枚举不一样，这里取并集，各端把自己没有的值折叠掉：
 *
 * | 值 | Android（`BluetoothAdapter.getState`） | iOS（`CBManagerState`） |
 * | --- | --- | --- |
 * | `on` | `STATE_ON` | `poweredOn` |
 * | `off` | `STATE_OFF` | `poweredOff` |
 * | `turningOn` | `STATE_TURNING_ON` | 不存在 |
 * | `turningOff` | `STATE_TURNING_OFF` | 不存在 |
 * | `resetting` | 不存在 | `resetting`（系统正在重启蓝牙栈，稍后会再来一次状态变化） |
 * | `unsupported` | 取不到适配器（模拟器 / 无蓝牙硬件） | `unsupported` |
 * | `unauthorized` | 缺 `BLUETOOTH_CONNECT`，读状态被系统拒绝 | 用户拒绝了蓝牙权限 |
 * | `unknown` | 其它未知取值 | 尚未询问过权限，或适配器还没给出第一个状态 |
 *
 * `unknown` 在 iOS 上是**暂时**的：表示「还没问过用户，不主动弹窗所以查不到」，
 * 调一次 `requestBluetoothPermission` 之后再查就会变成确定值。
 */
export type BluetoothState =
  | 'off'
  | 'on'
  | 'resetting'
  | 'turningOff'
  | 'turningOn'
  | 'unauthorized'
  | 'unknown'
  | 'unsupported';

export type BluetoothPermissionStatus = 'denied' | 'granted' | 'undetermined';

/**
 * 蓝牙权限状态，形状对齐 expo 各权限模块的 `PermissionResponse`。
 *
 * - **Android 12(S) 以下**没有蓝牙运行时权限（`BLUETOOTH` / `BLUETOOTH_ADMIN` 是安装期授予），
 *   恒为 `{ granted: true, status: 'granted', canAskAgain: false }`
 * - **Android 12 及以上**指的是 `BLUETOOTH_CONNECT`
 * - **iOS** 指的是 `CBManager.authorization`
 */
export type BluetoothPermission = {
  /**
   * 还能不能再弹一次系统弹窗。
   *
   * 为 `false` 且 `granted` 为 `false` 时，只剩「引导用户去设置页手动开」这一条路，
   * 用 `openAppSettings`。
   */
  canAskAgain: boolean;
  granted: boolean;
  status: BluetoothPermissionStatus;
};

/** 失败原因。全部是本模块自己判定的，没有透传的系统错误码。 */
export type BluetoothResultCode =
  /** Android 侧当前没有前台 Activity，弹不出系统对话框 */
  | 'ERR_BLUETOOTH_NO_ACTIVITY'
  /** 上一次 `requestEnableBluetooth` 的系统弹窗还没关掉 */
  | 'ERR_BLUETOOTH_PENDING'
  /** 用户拒绝了蓝牙权限，没有权限就没法请求开启 */
  | 'ERR_BLUETOOTH_PERMISSION_DENIED'
  /** 系统设置页打不开（几乎只可能出现在被裁剪过的定制 ROM 上） */
  | 'ERR_BLUETOOTH_SETTINGS_UNAVAILABLE'
  /** 本机没有蓝牙硬件（模拟器最常见） */
  | 'ERR_BLUETOOTH_UNSUPPORTED'
  /** 用户在系统弹窗上点了拒绝 */
  | 'ERR_BLUETOOTH_USER_CANCELLED';

/**
 * 一次需要用户参与的交互的结果。**resolve 成这个形状，永远不会 reject**。
 *
 * 理由和 `@skyroc/expo-wechat` 的 `WechatResult` 一致：「用户点了取消」是正常分支
 * 而不是异常，逼调用方 try/catch 再比字符串是错的。
 *
 * 这是个**闭合的判别联合**：两个分支的字段完全一致，缺的那些是 `null` 而不是不存在，
 * 所以既能直接 `JSON.stringify` 上报，又能靠 `if (result.ok)` 收窄：
 *
 * ```ts
 * const result = await requestEnableBluetooth();
 * if (!result.ok) {
 *   console.warn(result.code, result.message); // 这里 code / message 必然有值
 *   return;
 * }
 * console.log(result.payload.enabled);         // 这里 payload 必然存在
 * ```
 */
export type BluetoothResult<T> =
  | { code: null; message: null; ok: true; payload: T }
  | { code: BluetoothResultCode; message: string; ok: false; payload: null };

/**
 * 「让用户把蓝牙打开」这件事最终是怎么落地的。
 *
 * 两端行为差异都收在 `handledBy` 上，调用方据此决定 UI：
 * - `alreadyEnabled`：本来就是开的，什么都没做，直接往下走
 * - `dialog`：Android 弹了系统开关对话框，`enabled` 就是用户的选择，可以立刻往下走
 * - `settings`：iOS 已经跳到本 App 的设置页。**`enabled` 恒为 `false`**——
 *   系统不会告诉我们用户在设置里做了什么，得等用户切回来后自己复查一次状态
 *   （监听 `AppState` 变成 `active`，或直接用 `addBluetoothStateListener`）
 */
export type BluetoothEnableOutcome = {
  enabled: boolean;
  handledBy: 'alreadyEnabled' | 'dialog' | 'settings';
};

export type BluetoothStateChangedEvent = {
  /** 等价于 `state === 'on'`，只是省掉调用方每次自己比 */
  isEnabled: boolean;
  state: BluetoothState;
};

export type BluetoothModuleEvents = {
  /**
   * 蓝牙开关状态变化。
   *
   * Android 来自 `BluetoothAdapter.ACTION_STATE_CHANGED` 广播，
   * iOS 来自 `centralManagerDidUpdateState`。
   *
   * 两端都是**有人监听才注册、没人监听就注销**（`OnStartObserving` / `OnStopObserving`），
   * 不需要手动 register / unregister。
   */
  onBluetoothStateChanged: (event: BluetoothStateChangedEvent) => void;
};

/** `ensureBluetoothReady` 的结论 */
export type BluetoothReadyOutcome = {
  /** 卡在哪一步，`ready` 为 `false` 时看这个决定提示什么 */
  blockedBy: 'bluetoothOff' | 'locationServicesOff' | 'none' | 'permission' | 'unsupported';
  /** 全部就绪，可以去扫描 / 连接设备了 */
  ready: boolean;
  /** 当前状态，方便直接展示 */
  state: BluetoothState;
};
