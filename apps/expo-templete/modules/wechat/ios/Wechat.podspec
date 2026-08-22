Pod::Spec.new do |s|
  s.name           = 'Wechat'
  s.version        = '1.0.0'
  s.summary        = '微信开放平台 SDK 的 Expo 模块封装（登录授权）'
  s.description    = '封装 WechatOpenSDK，提供微信登录（SendAuthReq/SendAuthResp）能力。'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'WechatOpenSDK-XCFramework', '~> 2.0.7'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
