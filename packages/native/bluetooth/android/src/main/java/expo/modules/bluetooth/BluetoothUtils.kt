package expo.modules.bluetooth

import android.Manifest
import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat

/**
 * 对 `BluetoothAdapter` / `LocationManager` / 系统设置页的薄封装。
 *
 * 全是无状态的静态方法，跨越的都是「系统 API 有版本差异 / 会抛异常」这类脏活；
 * 真正的流程（等弹窗结果、等权限回调）放在 `BluetoothModule`。
 */
internal object BluetoothUtils {

  /** `ACTION_REQUEST_ENABLE` 的 requestCode，`OnActivityResult` 里靠它认领 */
  const val REQUEST_ENABLE_BT = 0xB1E0

  private fun adapter(context: Context): BluetoothAdapter? =
    (context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager)?.adapter

  /**
   * Android 12(S) 起读适配器状态需要 `BLUETOOTH_CONNECT`；12 以下是安装期权限，恒为 true。
   */
  fun hasConnectPermission(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true
    return ContextCompat.checkSelfPermission(
      context,
      Manifest.permission.BLUETOOTH_CONNECT
    ) == PackageManager.PERMISSION_GRANTED
  }

  /**
   * 当前状态。
   *
   * `getState()` 在 API 31+ 标了 `@RequiresPermission(BLUETOOTH_CONNECT)`，
   * 但各家 ROM 的实际执行不一致——有的照常返回，有的直接抛 `SecurityException`。
   * 与其赌，不如先自己查权限、再兜一层 catch，两条路都归到 `UNAUTHORIZED`，
   * 让 JS 侧永远拿到一个确定的状态而不是崩溃。
   */
  fun getState(context: Context): BluetoothState {
    val adapter = adapter(context) ?: return BluetoothState.UNSUPPORTED
    if (!hasConnectPermission(context)) return BluetoothState.UNAUTHORIZED

    val state = try {
      adapter.state
    } catch (_: SecurityException) {
      return BluetoothState.UNAUTHORIZED
    }

    return when (state) {
      BluetoothAdapter.STATE_ON -> BluetoothState.ON
      BluetoothAdapter.STATE_OFF -> BluetoothState.OFF
      BluetoothAdapter.STATE_TURNING_ON -> BluetoothState.TURNING_ON
      BluetoothAdapter.STATE_TURNING_OFF -> BluetoothState.TURNING_OFF
      else -> BluetoothState.UNKNOWN
    }
  }

  fun isSupported(context: Context): Boolean = adapter(context) != null

  fun isEnabled(context: Context): Boolean = getState(context) == BluetoothState.ON

  /**
   * 拉起系统的「是否允许打开蓝牙」对话框。
   *
   * 调用方必须先确保有 `BLUETOOTH_CONNECT`，否则 API 31+ 会抛 `SecurityException`。
   * 结果通过 `Activity.onActivityResult` 回来，见 `BluetoothModule` 的 `OnActivityResult`。
   */
  fun requestEnable(activity: Activity): Boolean {
    return try {
      activity.startActivityForResult(
        Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE),
        REQUEST_ENABLE_BT
      )
      true
    } catch (_: SecurityException) {
      false
    } catch (_: android.content.ActivityNotFoundException) {
      false
    }
  }

  /**
   * 系统定位服务开没开。
   *
   * 注意这查的是**设备的定位开关**，不是应用的定位权限，两者互不相关。
   * Android 12 以下做 BLE 扫描要求它是开的，关着的话扫描不报错但扫不到任何设备。
   */
  fun isLocationServicesEnabled(context: Context): Boolean {
    val manager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
      ?: return false

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      return manager.isLocationEnabled
    }

    @Suppress("DEPRECATION")
    return manager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
      manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
  }

  fun openLocationSettings(context: Context): Boolean =
    startSettings(context, Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS))

  fun openAppSettings(context: Context): Boolean =
    startSettings(
      context,
      Intent(
        Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
        Uri.fromParts("package", context.packageName, null)
      )
    )

  /**
   * 从可能不是 Activity 的 context 里打开设置页。
   *
   * 拿不到前台 Activity 时只能用 application context，此时必须带 `NEW_TASK`，
   * 否则系统直接抛 `AndroidRuntimeException`。
   */
  private fun startSettings(context: Context, intent: Intent): Boolean {
    if (context !is Activity) {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    return try {
      context.startActivity(intent)
      true
    } catch (_: android.content.ActivityNotFoundException) {
      false
    }
  }
}
