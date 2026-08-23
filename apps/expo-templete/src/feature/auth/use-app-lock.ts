import { showFailToast } from '@skyroc/native-ui';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import {
  APP_LOCK_GRACE_MS,
  appLockEnabledAtom,
  appUnlockedAtom,
  lockApp,
  markAppUnlocked,
  setAppLockEnabled
} from './app-lock-store';

/** 生物识别的种类，只用来挑图标和文案 */
export type BiometricKind = 'face' | 'fingerprint' | 'none';

interface BiometricSupport {
  /** 有传感器**且**录入过。少一样都验不过，所以合成一个布尔值 */
  available: boolean;
  kind: BiometricKind;
}

const UNSUPPORTED: BiometricSupport = { available: false, kind: 'none' };

async function probeBiometrics(): Promise<BiometricSupport> {
  const [hasHardware, isEnrolled, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync()
  ]);

  if (!hasHardware) return UNSUPPORTED;

  const kind = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) ? 'face' : 'fingerprint';

  return { available: isEnrolled, kind };
}

/**
 * 应用锁：验证过身份才显示内容，且**不是每次进页面都验**。
 *
 * 什么时候锁上，只有两条规则：
 *
 * 1. **进程重开**——`appUnlockedAtom` 不落盘，App 被杀掉再打开时它天然是 `false`；
 * 2. **回到前台且离开超过 `APP_LOCK_GRACE_MS`**——只认真正进过后台的那种离开。
 *
 * 反过来说：切 tab、push 二级页再返回、下拉通知中心、被系统弹窗打断，都不会重新验证。 这正是「不能进一次验证一次」的那条线。
 *
 * 验证框**只在用户点「验证身份」时弹**，锁上之后不自动弹：系统验证框是模态的，页面刚出现就糊上来 一个夺焦点的框，用户连自己在哪都还没看清；取消之后再自动弹一次，就成了关不掉的东西。
 *
 * 生物识别不可用（没传感器、没录入）时**直接放行**而不是把人关在外面：应用锁是便利性的第二道门， 用户手上这台设备开不了这道门时，第一道门（登录态）说了算。真正的鉴权在服务端， 这里拦不住的东西，服务端一样拦得住。
 */
export function useAppLock() {
  const enabled = useAtomValue(appLockEnabledAtom);

  const unlocked = useAtomValue(appUnlockedAtom);

  const [support, setSupport] = useState<BiometricSupport>(UNSUPPORTED);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  /** App 不在前台。用来在多任务切换器的缩略图里把内容盖住 */
  const [isObscured, setIsObscured] = useState(false);

  // 重入锁用 ref 不用 state：同一帧内连点两次都会读到旧的 isAuthenticating
  const busyRef = useRef(false);

  // 系统验证框自己会把 App 推到 inactive/background。这段时间的状态变化不是「用户离开了」，
  // 必须整段忽略，否则验证成功回到前台的那一刻就会被当成「刚从后台回来」再判一次超时
  const skipAppStateRef = useRef(false);

  const leftAtRef = useRef<null | number>(null);

  /** 用户开了锁、这台设备也验得了，页面才归应用锁管 */
  const isProtected = enabled && support.available;

  const isLocked = isProtected && !unlocked;

  const refreshSupport = useCallback(() => {
    probeBiometrics()
      .then(setSupport)
      .catch(error => {
        // 探测失败按「不可用」处理，宁可放行也不要把用户锁死在一个验不了的门后面
        console.warn('[useAppLock] 生物识别能力探测失败', error);

        setSupport(UNSUPPORTED);
      });
  }, []);

  /** 弹一次系统验证框。返回是否通过。自己吞掉异常，调用点不用 try */
  const authenticate = useCallback(async () => {
    if (busyRef.current) return false;

    busyRef.current = true;

    skipAppStateRef.current = true;

    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        cancelLabel: '取消',
        // 不禁用设备密码兜底：戴口罩、手指有水、传感器脏了都可能连着失败，
        // 只留生物识别这一条路的话，用户就只能靠退出登录自救了
        disableDeviceFallback: false,
        promptMessage: '验证身份后继续'
      });

      if (result.success) {
        markAppUnlocked();

        return true;
      }

      // 用户自己点的取消不用提示。剩下的（连错太多次被系统锁住、超时）要说一句，
      // 否则界面上什么都没发生，用户只会以为按钮坏了
      if (result.error !== 'user_cancel' && result.error !== 'system_cancel' && result.error !== 'app_cancel') {
        showFailToast(result.error === 'lockout' ? '尝试次数过多，请稍后再试' : '验证未通过');
      }

      return false;
    } catch (error) {
      console.warn('[useAppLock] 验证失败', error);

      return false;
    } finally {
      busyRef.current = false;

      setIsAuthenticating(false);

      // 验证框关掉时 App 不一定已经回到 active，剩下的复位交给下面的 change 回调
      if (AppState.currentState === 'active') skipAppStateRef.current = false;
    }
  }, []);

  /** 开关应用锁。开启前先验一次，确认这台设备真的能验过 */
  const setEnabled = useCallback(
    async (next: boolean) => {
      if (!next) {
        setAppLockEnabled(false);

        return;
      }

      // 不验就开的话，要等到下次冷启动才发现验不过，那时候人已经被挡在外面了
      if (await authenticate()) setAppLockEnabled(true);
    },
    [authenticate]
  );

  useEffect(refreshSupport, [refreshSupport]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      if (skipAppStateRef.current) {
        if (next === 'active' && !busyRef.current) skipAppStateRef.current = false;

        return;
      }

      setIsObscured(next !== 'active');

      // 计时只认 background。iOS 上拉一下控制中心、来个电话、系统权限弹窗都会进 inactive，
      // 按 inactive 计时的话用户每划一次通知栏回来都要重新验证
      if (next === 'background') {
        leftAtRef.current = Date.now();

        return;
      }

      if (next !== 'active') return;

      const leftAt = leftAtRef.current;

      leftAtRef.current = null;

      if (leftAt !== null && Date.now() - leftAt >= APP_LOCK_GRACE_MS) lockApp();

      // 用户可能刚去系统设置里录了指纹、或者把面容删了，回来重新探一次
      refreshSupport();
    });

    return () => subscription.remove();
  }, [refreshSupport]);

  return {
    /** 生物识别是否可用（有传感器且录入过）。为 false 时开关不给点，内容也不锁 */
    available: support.available,
    authenticate,
    /** 用户开没开应用锁 */
    enabled,
    /** 正在弹系统验证框 */
    isAuthenticating,
    /** 内容该被锁住 */
    isLocked,
    /**
     * App 不在前台，内容该被盖住（防的是多任务切换器里的缩略图）。
     *
     * 跟着开关走：没开锁的用户不该在切换器里看到一块莫名其妙的空白。想让遮挡无条件生效， 把这里的 `isProtected &&` 去掉即可
     */
    isObscured: isProtected && isObscured,
    /** 面容还是指纹，用来挑图标和文案 */
    kind: support.kind,
    setEnabled
  };
}
