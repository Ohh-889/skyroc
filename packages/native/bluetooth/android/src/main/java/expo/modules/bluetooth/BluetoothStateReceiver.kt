package expo.modules.bluetooth

import android.bluetooth.BluetoothAdapter
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter

/**
 * 监听系统蓝牙开关的广播，把 int 状态翻成 [BluetoothState] 回调出去。
 *
 * 只在有人监听 `onBluetoothStateChanged` 时才注册（见 `BluetoothModule` 的
 * `OnStartObserving` / `OnStopObserving`），没人听就不占系统资源。
 */
internal class BluetoothStateReceiver(
  private val onStateChanged: (state: BluetoothState) -> Unit
) : BroadcastReceiver() {

  companion object {
    fun createIntentFilter(): IntentFilter = IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED)
  }

  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != BluetoothAdapter.ACTION_STATE_CHANGED) return

    val state = when (intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR)) {
      BluetoothAdapter.STATE_ON -> BluetoothState.ON
      BluetoothAdapter.STATE_OFF -> BluetoothState.OFF
      BluetoothAdapter.STATE_TURNING_ON -> BluetoothState.TURNING_ON
      BluetoothAdapter.STATE_TURNING_OFF -> BluetoothState.TURNING_OFF
      else -> BluetoothState.UNKNOWN
    }

    onStateChanged(state)
  }
}
