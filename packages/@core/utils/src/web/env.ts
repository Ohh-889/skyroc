/**
 * 浏览器环境探测。
 *
 * 这些函数依赖 `window` / `navigator`，只能在浏览器里用，因此归在 `@skyroc/utils/web` 下。 UA 嗅探本身是不可靠的降级手段，能用特性检测就不要用它们。
 */

/** 检查传入的值是否为 window 对象 */
export function isWindow(value: any): value is Window {
  return typeof window !== 'undefined' && value !== null && value === value.window;
}

/** 当前是否运行在 macOS（基于 UA 嗅探） */
export function isMacOs(): boolean {
  const macRegex = /macintosh|mac os x/i;
  return macRegex.test(navigator.userAgent);
}

/** 当前是否运行在 Windows（基于 UA 嗅探） */
export function isWindowsOs(): boolean {
  const windowsRegex = /windows|win32/i;
  return windowsRegex.test(navigator.userAgent);
}

/** 移动端 UA 关键字，命中任意一个即判定为非 PC */
const MOBILE_AGENTS = ['Android', 'iPhone', 'webOS', 'BlackBerry', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];

/** 当前是否运行在 PC（基于 UA 嗅探，命中移动端关键字即为 false） */
export function isPC(): boolean {
  const isMobile = MOBILE_AGENTS.some(agent => window.navigator.userAgent.includes(agent));

  return !isMobile;
}
