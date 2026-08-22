import CoreBluetooth
import ExpoModulesCore
import UIKit

/// `CBCentralManager` 的单例封装。
///
/// 之所以要一个常驻单例而不是每次现开一个：iOS 上**第一次实例化 `CBCentralManager`
/// 就会触发系统的蓝牙隐私弹窗**，而且状态是异步给的（`centralManagerDidUpdateState`）。
/// 反复创建既会让弹窗时机不可控，也会让每次查询都白等一轮回调。
///
/// 所有状态都只在主线程读写（`CBCentralManager` 的队列也指定成 `.main`），
/// 所以这里不需要额外的锁。
final class BluetoothCentral: NSObject {
  static let shared = BluetoothCentral()

  /// 拿不到第一个状态时的兜底时间。正常情况下 `centralManagerDidUpdateState`
  /// 在实例化后几十毫秒内就会回来，等 3 秒还没动静就按当前值回，别把 Promise 挂死。
  private static let stateTimeout: TimeInterval = 3

  private var manager: CBCentralManager?
  private weak var module: BluetoothModule?
  private var isObserving = false

  /// 等 `manager` 给出第一个确定状态的回调
  private var stateCallbacks: [(BluetoothState) -> Void] = []
  /// 等用户在系统隐私弹窗上做出选择的回调
  private var authorizationCallbacks: [(CBManagerAuthorization) -> Void] = []

  private override init() {
    super.init()
  }

  // MARK: 对外

  /// 当前状态。
  ///
  /// - Parameter allowPrompt: 允不允许为了拿到状态而触发系统隐私弹窗。
  ///   `false`（查询场景）时，没问过权限就直接返回 `.unknown`，绝不打扰用户；
  ///   `true`（`requestEnableAsync` 这种用户主动发起的场景）才会去实例化 manager。
  func currentState(allowPrompt: Bool, _ completion: @escaping (BluetoothState) -> Void) {
    onMain {
      let authorization = CBManager.authorization

      switch authorization {
      case .notDetermined:
        guard allowPrompt else {
          completion(.unknown)
          return
        }
      case .denied, .restricted:
        // 没授权连 manager 都不该建，建了也只会回 .unauthorized
        completion(.unauthorized)
        return
      default:
        break
      }

      self.ensureManager()

      guard let manager = self.manager else {
        completion(.unknown)
        return
      }

      // 刚实例化时 state 恒为 .unknown，要等 centralManagerDidUpdateState
      guard manager.state == .unknown else {
        completion(BluetoothState.from(manager.state))
        return
      }

      self.stateCallbacks.append(completion)

      // 权限未决时这一轮等的是用户点弹窗，时长不可控，不能上超时
      if authorization != .notDetermined {
        self.scheduleStateTimeout()
      }
    }
  }

  /// 申请蓝牙权限，返回用户选择后的最终授权状态。
  ///
  /// 已经问过一次的话系统不会再弹，直接返回既有状态。
  func requestAuthorization(_ completion: @escaping (CBManagerAuthorization) -> Void) {
    onMain {
      let authorization = CBManager.authorization
      guard authorization == .notDetermined else {
        completion(authorization)
        return
      }

      self.authorizationCallbacks.append(completion)
      // 首次实例化触发系统隐私弹窗，弹窗文案来自 Info.plist 的
      // NSBluetoothAlwaysUsageDescription（由 app.plugin.js 写入）
      self.ensureManager()
    }
  }

  /// 打开本 App 的系统设置页。iOS 不允许 App 代开蓝牙，也没有能跳到蓝牙设置页的公开 API
  /// （`App-Prefs:` 是私有 scheme，会被审核拒且新系统上已失效），只能到这一层。
  func openAppSettings(_ completion: @escaping (Bool) -> Void) {
    onMain {
      guard
        let url = URL(string: UIApplication.openSettingsURLString),
        UIApplication.shared.canOpenURL(url)
      else {
        completion(false)
        return
      }

      UIApplication.shared.open(url, options: [:]) { completion($0) }
    }
  }

  func startObserving(module: BluetoothModule) {
    onMain {
      self.module = module
      self.isObserving = true

      // 权限未决时不能建 manager——那会在「只是挂了个监听」的时候弹窗。
      // 等调用方显式 requestPermissionAsync 之后，manager 建起来就有事件了
      if CBManager.authorization != .notDetermined {
        self.ensureManager()
      }
    }
  }

  func stopObserving() {
    onMain {
      self.isObserving = false
      self.module = nil
      // manager 保留：销毁它不会退还任何权限，重建反而要再等一轮状态回调
    }
  }

  // MARK: 内部

  private func ensureManager() {
    guard manager == nil else { return }

    // ShowPowerAlert=false：蓝牙关着时不要让系统自作主张弹「打开蓝牙」，
    // 什么时候引导用户由调用方通过 requestEnableAsync 决定
    manager = CBCentralManager(
      delegate: self,
      queue: .main,
      options: [CBCentralManagerOptionShowPowerAlertKey: false]
    )
  }

  private func scheduleStateTimeout() {
    DispatchQueue.main.asyncAfter(deadline: .now() + Self.stateTimeout) { [weak self] in
      guard let self, !self.stateCallbacks.isEmpty else { return }
      self.flushStateCallbacks(BluetoothState.from(self.manager?.state ?? .unknown))
    }
  }

  private func flushStateCallbacks(_ state: BluetoothState) {
    let callbacks = stateCallbacks
    stateCallbacks = []
    callbacks.forEach { $0(state) }
  }

  private func onMain(_ block: @escaping () -> Void) {
    if Thread.isMainThread {
      block()
    } else {
      DispatchQueue.main.async(execute: block)
    }
  }
}

extension BluetoothCentral: CBCentralManagerDelegate {
  /// 唯一的状态出口：首次实例化、用户答完隐私弹窗、用户在控制中心开关蓝牙，都走这里。
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    let authorization = CBManager.authorization

    // 弹窗还挂在屏幕上时也会走到这里（state 仍是 .unknown），那一轮不能当作用户已作答
    if authorization != .notDetermined, !authorizationCallbacks.isEmpty {
      let callbacks = authorizationCallbacks
      authorizationCallbacks = []
      callbacks.forEach { $0(authorization) }
    }

    let state = BluetoothState.from(central.state)

    if central.state != .unknown {
      flushStateCallbacks(state)
    }

    if isObserving {
      module?.emitStateChanged(state)
    }
  }
}
