import CoreBluetooth
import ExpoModulesCore

/// 蓝牙状态。`rawValue` 是发给 JS 的字符串，必须和 `src/Bluetooth.types.ts` 的
/// `BluetoothState` 联合逐个对上，也和 Android 的 `BluetoothState` 枚举保持一致。
enum BluetoothState: String {
  case on
  case off
  case resetting
  case turningOn
  case turningOff
  case unauthorized
  case unknown
  case unsupported

  /// `turningOn` / `turningOff` 是 Android 独有的中间态，iOS 永远不会返回。
  static func from(_ state: CBManagerState) -> BluetoothState {
    switch state {
    case .poweredOn: return .on
    case .poweredOff: return .off
    case .resetting: return .resetting
    case .unauthorized: return .unauthorized
    case .unsupported: return .unsupported
    case .unknown: return .unknown
    @unknown default: return .unknown
    }
  }
}

/// 把 `CBManager.authorization` 翻成 JS 侧的 `BluetoothPermission`。
enum BluetoothPermissions {
  /// iOS 的蓝牙隐私弹窗**一辈子只弹一次**，用户做过选择之后系统不会再弹，
  /// 所以除 `notDetermined` 外 `canAskAgain` 一律是 `false`——
  /// 再调 `requestPermissionAsync` 也只是原样返回，得引导用户去设置页。
  static func describe(_ authorization: CBManagerAuthorization) -> [String: Any] {
    switch authorization {
    case .allowedAlways:
      return ["status": "granted", "granted": true, "canAskAgain": false]
    case .notDetermined:
      return ["status": "undetermined", "granted": false, "canAskAgain": true]
    case .denied:
      return ["status": "denied", "granted": false, "canAskAgain": false]
    case .restricted:
      // 家长控制 / MDM 限制，用户自己在设置里也改不了
      return ["status": "denied", "granted": false, "canAskAgain": false]
    @unknown default:
      return ["status": "undetermined", "granted": false, "canAskAgain": true]
    }
  }
}

/// `BluetoothResult` 的原生构造。
///
/// 字段和 TS 侧的判别联合一一对应：成功分支 code / message 为 null，失败分支 payload 为 null。
/// **两个分支的键集合必须完全一致**，缺的那些要显式给 `NSNull()` 而不是不写，
/// 否则 JS 侧拿到的是 `undefined`，判别联合就不闭合了。
enum BluetoothResults {
  static func ok(_ payload: [String: Any]) -> [String: Any] {
    ["ok": true, "code": NSNull(), "message": NSNull(), "payload": payload]
  }

  static func fail(_ code: String, _ message: String) -> [String: Any] {
    ["ok": false, "code": code, "message": message, "payload": NSNull()]
  }
}
