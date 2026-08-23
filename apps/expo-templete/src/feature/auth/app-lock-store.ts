import { createAtomWithStorage, getAtomValue, setAtomValue } from '@skyroc/core-state';
import { atom } from 'jotai';

import { MMKV_STORAGE } from '@/store/mmkv-storage';

const APP_LOCK_STORAGE_KEY = 'auth.appLock.enabled';

/**
 * 回到前台的宽限期：切出去不超过这么久，回来不用重新验证。
 *
 * 这个数是整个应用锁体验的关键。给 0 就变成「切出去截个验证码回来又要验一次」，给太长（半小时） 又等于没锁——手机借人五分钟就够了。银行类 App 普遍落在 1~5 分钟，这里取 3 分钟。
 *
 * 注意它只对「进过后台」生效，见 `use-app-lock` 里对 `background` / `inactive` 的区分。
 */
export const APP_LOCK_GRACE_MS = 3 * 60 * 1000;

/**
 * 用户有没有开启应用锁。
 *
 * 落 MMKV 而不是 SecureStore：它只是个偏好，不是凭据。也因此它挡不住 root 过的设备—— 应用锁防的是「手机短暂落在别人手里」，不是防逆向，真正的鉴权始终在服务端。
 */
export const appLockEnabledAtom = createAtomWithStorage<boolean>(APP_LOCK_STORAGE_KEY, false, {
  storageName: MMKV_STORAGE,
  validate: raw => (typeof raw === 'boolean' ? raw : undefined)
});

/**
 * 本次进程内验证过没有。**故意不落盘**。
 *
 * 「App 被杀掉后重开要验一次」这条规则不需要记录任何东西：进程没了，这个 atom 就回到 `false`， 冷启动天然是锁着的。反过来，一旦把它存进 MMKV，杀进程重开就会带着上次的已解锁状态起来，
 * 规则立刻失效——所以别顺手给它加持久化。
 */
export const appUnlockedAtom = atom(false);

export function isAppLockEnabled() {
  return getAtomValue(appLockEnabledAtom);
}

export function setAppLockEnabled(enabled: boolean) {
  setAtomValue(appLockEnabledAtom, enabled);
}

/** 标记本次进程已验证。生物识别通过、以及刚登录成功时调 */
export function markAppUnlocked() {
  setAtomValue(appUnlockedAtom, true);
}

/** 重新锁上。回前台超过宽限期时调 */
export function lockApp() {
  setAtomValue(appUnlockedAtom, false);
}
