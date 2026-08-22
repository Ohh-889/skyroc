package expo.modules.bluetooth

import android.os.Bundle
import androidx.core.os.bundleOf

/**
 * 蓝牙状态。`value` 是发给 JS 的字符串，必须和 `src/Bluetooth.types.ts` 的
 * `BluetoothState` 联合逐个对上。
 *
 * 这里刻意不用 `BluetoothAdapter` 的 int 常量原样透传：
 * iOS 的 `CBManagerState` 取值完全不同，两端只有统一成字符串才能给 JS 一份类型。
 */
enum class BluetoothState(val value: String) {
  ON("on"),
  OFF("off"),
  TURNING_ON("turningOn"),
  TURNING_OFF("turningOff"),

  /** 取不到适配器：模拟器或确实没有蓝牙硬件 */
  UNSUPPORTED("unsupported"),

  /** 缺 BLUETOOTH_CONNECT，读状态被系统拒绝 */
  UNAUTHORIZED("unauthorized"),

  /** 适配器给了个我们不认识的取值，当作不可用处理 */
  UNKNOWN("unknown")

  // RESETTING 是 iOS 独有的（系统在重启蓝牙栈），Android 没有对应状态
}

/**
 * `BluetoothResult` 的原生构造。
 *
 * 字段和 TS 侧的判别联合一一对应：成功分支 code / message 为 null，
 * 失败分支 payload 为 null。**两个分支的键集合必须完全一致**，
 * 否则 JS 侧解构出来会是 `undefined` 而不是 `null`，判别联合就不闭合了。
 */
internal object BluetoothResults {
  fun ok(payload: Bundle?): Bundle = bundleOf(
    "ok" to true,
    "code" to null,
    "message" to null,
    "payload" to payload
  )

  fun fail(code: String, message: String): Bundle = bundleOf(
    "ok" to false,
    "code" to code,
    "message" to message,
    "payload" to null
  )
}
