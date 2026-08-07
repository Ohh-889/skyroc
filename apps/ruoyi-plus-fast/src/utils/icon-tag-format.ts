const browserOptions = [
  { icon: 'logos:chrome', value: 'chrome' },
  { icon: 'logos:microsoft-edge', value: 'edge' },
  { icon: 'logos:firefox', value: 'firefox' },
  { icon: 'logos:opera', value: 'opera' },
  { icon: 'logos:safari', value: 'safari' },
  { icon: 'ic:baseline-wechat', value: 'micromessenger' },
  { icon: 'ic:baseline-wechat', value: 'windowswechat' },
  { icon: 'arcticons:quark-browser', value: 'quark' },
  { icon: 'ic:baseline-wechat', value: 'wxwork' },
  { icon: 'simple-icons:tencentqq', value: 'qq' },
  { icon: 'arcticons:dingtalk', value: 'dingtalk' },
  { icon: 'arcticons:uc-browser', value: 'uc' },
  { icon: 'ri:baidu-fill', value: 'baidu' }
] as const;

const osOptions = [
  { icon: 'devicon:windows8', value: 'windows' },
  { icon: 'cbi:imac', value: 'osx' },
  { icon: 'devicon:linux', value: 'linux' },
  { icon: 'logos:android-icon', value: 'android' },
  { icon: 'file-icons:apple', value: 'ios' }
] as const;

export function getBrowserIcon(browser: string): string {
  const icon = browserOptions.find(item => browser.toLocaleLowerCase().includes(item.value));
  return icon?.icon ?? 'stash:browser-light';
}

export function getOsIcon(os: string): string {
  const icon = osOptions.find(item => os.toLocaleLowerCase().includes(item.value));
  return icon?.icon ?? 'mingcute:device-fill';
}
