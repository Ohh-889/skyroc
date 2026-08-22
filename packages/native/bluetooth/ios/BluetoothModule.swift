import CoreBluetooth
import ExpoModulesCore

public class BluetoothModule: Module {
  /// 给 `BluetoothCentral` 用的事件出口；模块之外的对象拿不到 `sendEvent`
  func emitStateChanged(_ state: BluetoothState) {
    sendEvent("onBluetoothStateChanged", [
      "state": state.rawValue,
      "isEnabled": state == .on
    ])
  }

  public func definition() -> ModuleDefinition {
    Name("Bluetooth")

    Events("onBluetoothStateChanged")

    // 有人监听才建 CBCentralManager，没人听就断开事件出口，
    // 调用方不需要手动 register / unregister
    OnStartObserving {
      BluetoothCentral.shared.startObserving(module: self)
    }

    OnStopObserving {
      BluetoothCentral.shared.stopObserving()
    }

    // 所有方法都不需要 .runOnQueue(.main)：BluetoothCentral 内部自己切主线程，
    // 正确性不依赖「新加方法的人记得标队列」这种隐式约定

    /// 查状态**不弹权限弹窗**：还没问过权限时返回 `unknown`，
    /// 想要确定值得先走 `requestPermissionAsync`
    AsyncFunction("getStateAsync") { (promise: Promise) in
      BluetoothCentral.shared.currentState(allowPrompt: false) { promise.resolve($0.rawValue) }
    }

    AsyncFunction("getPermissionAsync") { (promise: Promise) in
      promise.resolve(BluetoothPermissions.describe(CBManager.authorization))
    }

    AsyncFunction("requestPermissionAsync") { (promise: Promise) in
      BluetoothCentral.shared.requestAuthorization {
        promise.resolve(BluetoothPermissions.describe($0))
      }
    }

    /// iOS 不允许 App 代开蓝牙，这里能做的是：确保有权限 → 已经开着就直接回 →
    /// 否则跳到本 App 的设置页，由用户自己开。
    ///
    /// 所以 `handledBy: "settings"` 时 `enabled` 恒为 `false`：
    /// 系统不会告诉我们用户在设置里做了什么，得等用户切回来后自己复查状态。
    AsyncFunction("requestEnableAsync") { (promise: Promise) in
      BluetoothCentral.shared.requestAuthorization { authorization in
        guard authorization == .allowedAlways else {
          promise.resolve(
            BluetoothResults.fail("ERR_BLUETOOTH_PERMISSION_DENIED", "用户拒绝了蓝牙权限")
          )
          return
        }

        // 这里已经授权了，allowPrompt 不会真的弹窗，只是允许实例化 manager 取真实状态
        BluetoothCentral.shared.currentState(allowPrompt: true) { state in
          switch state {
          case .unsupported:
            promise.resolve(
              BluetoothResults.fail("ERR_BLUETOOTH_UNSUPPORTED", "本机没有蓝牙硬件")
            )
          case .on:
            promise.resolve(
              BluetoothResults.ok(["enabled": true, "handledBy": "alreadyEnabled"])
            )
          default:
            BluetoothCentral.shared.openAppSettings { opened in
              promise.resolve(
                opened
                  ? BluetoothResults.ok(["enabled": false, "handledBy": "settings"])
                  : BluetoothResults.fail("ERR_BLUETOOTH_SETTINGS_UNAVAILABLE", "打不开系统设置页")
              )
            }
          }
        }
      }
    }

    /// iOS 的 BLE 不依赖系统定位服务（那是 Android 12 以下的限制），恒为 true。
    /// 保留这个方法只是为了让两端的调用代码长得一样，不用到处写 `Platform.OS`
    AsyncFunction("isLocationServicesEnabledAsync") { () -> Bool in
      true
    }

    /// 同上，iOS 上没有「定位服务关着导致扫不到蓝牙设备」这回事，没有要跳的页面
    AsyncFunction("openLocationSettingsAsync") { () -> Bool in
      false
    }

    AsyncFunction("openAppSettingsAsync") { (promise: Promise) in
      BluetoothCentral.shared.openAppSettings { promise.resolve($0) }
    }
  }
}
