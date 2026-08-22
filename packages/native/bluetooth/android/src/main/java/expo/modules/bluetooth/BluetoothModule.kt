package expo.modules.bluetooth

import android.Manifest
import android.app.Activity
import android.content.Context
import android.os.Build
import android.os.Bundle
import androidx.core.content.ContextCompat
import androidx.core.os.bundleOf
import expo.modules.interfaces.permissions.PermissionsResponseListener
import expo.modules.interfaces.permissions.PermissionsStatus
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BluetoothModule : Module() {

  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  /** 有人监听 onBluetoothStateChanged 时才存在 */
  private var receiver: BluetoothStateReceiver? = null

  /**
   * 一次 `requestEnableAsync` 还没走完时挂在这里的 Promise。
   *
   * 挡的是**整个流程**（权限弹窗 + 开关对话框）而不只是开关对话框：
   * 系统同类弹窗一次只能有一个，并发调用会互相抢结果。
   * 思路和 `@skyroc/expo-wechat` 的 pending 槽一致。
   *
   * `OnActivityResult` 也靠它认领自己的结果，所以每条退出路径都必须清干净，
   * 统一走 [finishEnable]。
   */
  private var enablePromise: Promise? = null

  private fun stateBundle(state: BluetoothState) = bundleOf(
    "state" to state.value,
    "isEnabled" to (state == BluetoothState.ON)
  )

  private fun permissionBundle(status: PermissionsStatus, canAskAgain: Boolean) = bundleOf(
    "status" to status.status,
    "granted" to (status == PermissionsStatus.GRANTED),
    "canAskAgain" to canAskAgain
  )

  private fun outcomeBundle(enabled: Boolean, handledBy: String) = bundleOf(
    "enabled" to enabled,
    "handledBy" to handledBy
  )

  /**
   * 查询或申请 `BLUETOOTH_CONNECT`。
   *
   * Android 12(S) 以下没有蓝牙运行时权限（`BLUETOOTH` / `BLUETOOTH_ADMIN` 是安装期授予），
   * 直接返回 granted，不去打扰 expo 的权限模块。
   */
  private fun resolvePermission(promise: Promise, ask: Boolean, then: ((Bundle) -> Unit)? = null) {
    fun finish(bundle: Bundle) {
      if (then != null) then(bundle) else promise.resolve(bundle)
    }

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
      finish(permissionBundle(PermissionsStatus.GRANTED, canAskAgain = false))
      return
    }

    val permissions = appContext.permissions
    if (permissions == null) {
      // expo-modules-core 自带 PermissionsService，正常应用走不到这里；
      // 真到了这一步也别骗调用方，按系统的实际授予情况回一个能用的结果
      val granted = BluetoothUtils.hasConnectPermission(context)
      finish(
        permissionBundle(
          if (granted) PermissionsStatus.GRANTED else PermissionsStatus.UNDETERMINED,
          canAskAgain = !granted
        )
      )
      return
    }

    val listener = PermissionsResponseListener { result ->
      val response = result[Manifest.permission.BLUETOOTH_CONNECT]
      finish(
        permissionBundle(
          response?.status ?: PermissionsStatus.UNDETERMINED,
          canAskAgain = response?.canAskAgain ?: true
        )
      )
    }

    if (ask) {
      permissions.askForPermissions(listener, Manifest.permission.BLUETOOTH_CONNECT)
    } else {
      permissions.getPermissions(listener, Manifest.permission.BLUETOOTH_CONNECT)
    }
  }

  /**
   * 结束当前的 `requestEnableAsync`：释放槽再 resolve。
   *
   * 顺序不能反——resolve 之后 JS 可能同步发起下一次调用，槽还占着就会撞 PENDING。
   */
  private fun finishEnable(result: Bundle) {
    val promise = enablePromise ?: return
    enablePromise = null
    promise.resolve(result)
  }

  /**
   * 拉起系统的「是否打开蓝牙」对话框，结果走 `OnActivityResult`。
   * 拉不起来就地失败。
   */
  private fun launchEnableDialog(activity: Activity) {
    if (BluetoothUtils.requestEnable(activity)) return

    finishEnable(
      BluetoothResults.fail(
        "ERR_BLUETOOTH_SETTINGS_UNAVAILABLE",
        "系统没有响应打开蓝牙的请求"
      )
    )
  }

  private fun startObserving() {
    if (receiver != null) return

    val created = BluetoothStateReceiver { state ->
      sendEvent("onBluetoothStateChanged", stateBundle(state))
    }
    // ACTION_STATE_CHANGED 是受保护的系统广播，只有系统能发，
    // 用 EXPORTED 不会引入风险；Android 14 起必须显式给出这个标志
    ContextCompat.registerReceiver(
      context,
      created,
      BluetoothStateReceiver.createIntentFilter(),
      ContextCompat.RECEIVER_EXPORTED
    )
    receiver = created
  }

  private fun stopObserving() {
    val current = receiver ?: return
    receiver = null
    // Activity 先于模块销毁时可能已经被系统注销掉了
    runCatching { context.unregisterReceiver(current) }
  }

  override fun definition() = ModuleDefinition {
    Name("Bluetooth")

    Events("onBluetoothStateChanged")

    // 有人监听才注册广播，没人听就注销，调用方不需要手动 register / unregister
    OnStartObserving { startObserving() }

    OnStopObserving { stopObserving() }

    OnDestroy {
      stopObserving()
      // 弹窗结果已经没人接了，直接丢掉槽，别让下次调用永远撞 PENDING
      enablePromise = null
    }

    /**
     * `ACTION_REQUEST_ENABLE` 的回调。
     *
     * 注意不能只看 `resultCode`：部分 ROM 上用户点了「允许」也回 `RESULT_CANCELED`，
     * 所以再查一次适配器的实际状态。此刻状态可能还停在 `TURNING_ON`（系统正在开），
     * 那也算用户同意了。
     */
    OnActivityResult { _, payload ->
      if (payload.requestCode != BluetoothUtils.REQUEST_ENABLE_BT) return@OnActivityResult

      if (enablePromise == null) return@OnActivityResult

      val state = BluetoothUtils.getState(context)
      val enabled = payload.resultCode == Activity.RESULT_OK ||
        state == BluetoothState.ON ||
        state == BluetoothState.TURNING_ON

      finishEnable(
        if (enabled) {
          BluetoothResults.ok(outcomeBundle(enabled = true, handledBy = "dialog"))
        } else {
          BluetoothResults.fail("ERR_BLUETOOTH_USER_CANCELLED", "用户拒绝了打开蓝牙")
        }
      )
    }

    AsyncFunction("getStateAsync") {
      BluetoothUtils.getState(context).value
    }

    AsyncFunction("getPermissionAsync") { promise: Promise ->
      resolvePermission(promise, ask = false)
    }

    AsyncFunction("requestPermissionAsync") { promise: Promise ->
      resolvePermission(promise, ask = true)
    }

    AsyncFunction("requestEnableAsync") { promise: Promise ->
      if (enablePromise != null) {
        promise.resolve(BluetoothResults.fail("ERR_BLUETOOTH_PENDING", "上一次打开蓝牙的请求还没结束"))
        return@AsyncFunction
      }

      if (!BluetoothUtils.isSupported(context)) {
        promise.resolve(BluetoothResults.fail("ERR_BLUETOOTH_UNSUPPORTED", "本机没有蓝牙硬件"))
        return@AsyncFunction
      }

      val activity = appContext.currentActivity
      if (activity == null) {
        promise.resolve(BluetoothResults.fail("ERR_BLUETOOTH_NO_ACTIVITY", "当前没有前台 Activity，弹不出系统对话框"))
        return@AsyncFunction
      }

      // 从这里开始占槽，之后所有退出路径都走 finishEnable
      enablePromise = promise

      if (BluetoothUtils.hasConnectPermission(context)) {
        if (BluetoothUtils.isEnabled(context)) {
          finishEnable(BluetoothResults.ok(outcomeBundle(enabled = true, handledBy = "alreadyEnabled")))
        } else {
          launchEnableDialog(activity)
        }
        return@AsyncFunction
      }

      // 没有 BLUETOOTH_CONNECT 就调不起开关对话框，先把权限要到手
      resolvePermission(promise, ask = true) { permission ->
        if (!permission.getBoolean("granted")) {
          finishEnable(BluetoothResults.fail("ERR_BLUETOOTH_PERMISSION_DENIED", "用户拒绝了蓝牙权限"))
          return@resolvePermission
        }

        // 没权限时 isEnabled 只会得到 UNAUTHORIZED，拿到权限后才知道蓝牙本来就是开的，
        // 那就别再多弹一次开关对话框
        if (BluetoothUtils.isEnabled(context)) {
          finishEnable(BluetoothResults.ok(outcomeBundle(enabled = true, handledBy = "alreadyEnabled")))
          return@resolvePermission
        }

        launchEnableDialog(activity)
      }
    }

    AsyncFunction("isLocationServicesEnabledAsync") {
      BluetoothUtils.isLocationServicesEnabled(context)
    }

    AsyncFunction("openLocationSettingsAsync") {
      BluetoothUtils.openLocationSettings(appContext.currentActivity ?: context)
    }

    AsyncFunction("openAppSettingsAsync") {
      BluetoothUtils.openAppSettings(appContext.currentActivity ?: context)
    }
  }
}
