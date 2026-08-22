Pod::Spec.new do |s|
  s.name           = 'Bluetooth'
  s.version        = '1.0.0'
  s.summary        = '蓝牙可用性的 Expo 模块封装（状态查询、权限、引导用户开启）'
  s.description    = '基于 CoreBluetooth 提供蓝牙状态查询、权限申请与「引导用户去设置页打开蓝牙」的能力，不含扫描与连接。'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  # 只依赖系统的 CoreBluetooth，没有第三方 SDK
  s.dependency 'ExpoModulesCore'
  s.frameworks = 'CoreBluetooth'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
