import { registerStorage } from '@skyroc/core-state';
import * as SecureStore from 'expo-secure-store';

/**
 * 注册名，`createAtomWithStorage({ storageName })` 按它解析。
 *
 * 凭据这类东西必须存 SecureStore（iOS Keychain / Android Keystore），不能进 AsyncStorage ——
 * 后者是明文文件，root 过的设备直接能读。
 */
export const SECURE_STORAGE = 'secure';

/**
 * core-state 的 `AtomStorage` 是同步接口，正好对上 SecureStore 的同步读写：
 * 冷启动时凭据是**同步**就位的，不需要 loading 态，也就不会闪一帧登录页。
 *
 * 注册放在模块顶层：`createAtomWithStorage` 是在 atom 第一次被访问时才解析 storage 的，
 * 只要这个模块在那之前被 import 过就够了。
 */
registerStorage(SECURE_STORAGE, {
  getItem(key) {
    const raw = SecureStore.getItem(key);

    // 解析失败会被 core-state 兜住并回落到初始值，这里不用自己 try
    return raw ? JSON.parse(raw) : null;
  },
  removeItem(key) {
    // SecureStore 没有同步删除。删除结果不影响内存里的值，失败最多是下次冷启动还能读到旧凭据
    SecureStore.deleteItemAsync(key).catch(error => {
      console.warn(`[secure-storage] 删除 "${key}" 失败`, error);
    });
  },
  setItem(key, value) {
    SecureStore.setItem(key, JSON.stringify(value));
  }
});
