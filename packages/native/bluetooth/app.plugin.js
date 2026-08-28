const { createRunOncePlugin, withInfoPlist } = require('expo/config-plugins');

/** 少了这条 iOS 会在第一次实例化 CBCentralManager 时直接崩溃（不是弹窗失败，是 crash）， 所以给一个中文兜底文案，别让忘配的人在真机上才发现。 */
const DEFAULT_BLUETOOTH_PERMISSION = '需要使用蓝牙来连接附近的设备';

const withBluetoothInfoPlist = (config, { bluetoothAlwaysPermission }) =>
  withInfoPlist(config, cfg => {
    const plist = cfg.modResults;

    plist.NSBluetoothAlwaysUsageDescription =
      bluetoothAlwaysPermission || plist.NSBluetoothAlwaysUsageDescription || DEFAULT_BLUETOOTH_PERMISSION;

    // iOS 13 以下读的是这个键。部署目标已经是 16.4 了，理论上用不到，
    // 但 App Store 的静态检查仍会因为缺它给警告，一起写上更省事
    plist.NSBluetoothPeripheralUsageDescription =
      bluetoothAlwaysPermission ||
      plist.NSBluetoothPeripheralUsageDescription ||
      plist.NSBluetoothAlwaysUsageDescription;

    return cfg;
  });

/**
 * Android 侧什么都不用做：权限和 uses-feature 都写在模块自己的 `android/src/main/AndroidManifest.xml` 里，prebuild 时由 manifest merger 合进应用。
 *
 * @param {object} props
 * @param {string} [props.bluetoothAlwaysPermission] IOS 蓝牙权限弹窗的说明文案。 会被原样展示给用户，也会被 App Store
 *   审核，写清楚「用来做什么」，别写「需要蓝牙权限」这种废话
 */
const withBluetooth = (config, props) =>
  withBluetoothInfoPlist(config, {
    bluetoothAlwaysPermission: props?.bluetoothAlwaysPermission
  });

module.exports = createRunOncePlugin(withBluetooth, '@skyroc/expo-bluetooth', '1.0.0');
