import { showDialog, showFailToast } from '@skyroc/native-ui';
import type { RequestAdapter } from '@skyroc/service';

import { getRefreshToken, getToken, resetAuth, setAuth } from '@/feature/auth/auth-store';

import { fetchRefreshToken } from './api/auth/refresh';
import { AUTH_URLS } from './api/auth/urls';

/**
 * 请求层用到的少量文案。
 *
 * 模板没接 i18n，接了之后把这个映射换成 `i18n.t(key)` 即可，其余代码不用动。
 */
const REQUEST_TEXTS: Record<string, string> = {
  'common.error': '提示',
  'request.logoutMsg': '登录状态已失效，请重新登录'
};

/**
 * React Native 平台适配器。
 *
 * 错误处理、令牌续签、并发去重这些逻辑都在 `@skyroc/service` 里跨端复用，这里只提供平台差异：
 * 用什么弹提示、凭据存在哪、登录页怎么跳。
 */
export const nativeAdapter: RequestAdapter = {
  fetchRefreshToken,
  /**
   * RN 端跳登录是守卫式的（见 `src/app/_layout.tsx`），没有「带 redirect 参数回跳」这一步，
   * 也就没有要交给 `redirectToLogin` 的现场。
   *
   * 想做「登录后回到刚才那页」：用 `usePathname()` 把当前路径写进一个模块级变量，这里返回它，
   * 再在登录成功后 `router.replace` 回去。
   */
  getCurrentPath() {
    return '';
  },
  getRefreshToken,
  getToken,
  redirectToLogin() {
    // 这里刻意什么都不做：上一步的 resetAuth 已经把凭据清了，`Stack.Protected` 的守卫会自己
    // 切到 (auth)。再 router.replace 一次会和守卫的切换打架，表现为登录页闪两下。
  },
  refreshTokenUrl: AUTH_URLS.REFRESH_TOKEN,
  resetAuth,
  setAuth,
  showErrorMessage(msg, onClose) {
    showFailToast({ message: msg, onClose });
  },
  showErrorModal(options) {
    showDialog({
      // 强制登出的弹窗不给「点遮罩取消」这条路，除非调用方明确允许
      closeOnBackdropPress: options.maskClosable ?? false,
      confirmButtonText: '我知道了',
      message: options.content,
      title: options.title
      // 安卓返回键关闭时 showDialog 结算成 cancel，但登出这件事不该因为关闭方式不同而跳过，
      // 所以不区分 action，一律执行 onConfirm
    }).then(() => {
      options.onConfirm();
    });
  },
  t(key: string) {
    return REQUEST_TEXTS[key] ?? key;
  }
};
