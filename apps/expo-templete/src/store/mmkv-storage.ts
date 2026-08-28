import { registerStorage } from '@skyroc/core-state';
import { createMMKV } from 'react-native-mmkv';

/**
 * 注册名，`createAtomWithStorage({ storageName })` 按它解析。
 *
 * 不敏感的本地偏好（主题、引导页看没看过、列表排序……）都走这里。凭据仍然只能进 SECURE_STORAGE， MMKV 是明文文件，root 过的设备直接能读。
 */
export const MMKV_STORAGE = 'mmkv';

/** 显式给一个 id，不用默认的 `mmkv.default`：默认实例是全库共用的，第三方库（很多都依赖 MMKV） 往里写同名 key 就会互相覆盖。 */
const storage = createMMKV({ id: 'app' });

/**
 * MMKV 是 mmap + JSI 的同步读写，正好对上 core-state 的同步 `AtomStorage` 接口： 冷启动时偏好是**同步**就位的，不会先按默认值画一帧再跳成用户选的值。
 *
 * 注册放在模块顶层：`createAtomWithStorage` 是在 atom 第一次被访问时才解析 storage 的， 只要这个模块在那之前被 import 过就够了。
 */
registerStorage(MMKV_STORAGE, {
  getItem(key) {
    const raw = storage.getString(key);

    // 解析失败会被 core-state 兜住并回落到初始值，这里不用自己 try
    return raw ? JSON.parse(raw) : null;
  },
  removeItem(key) {
    storage.remove(key);
  },
  setItem(key, value) {
    storage.set(key, JSON.stringify(value));
  }
});
