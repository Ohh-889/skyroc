import { useLoading } from '@sa/hooks';

import { globalConfig } from '@/config';
import { getIsLogin, selectUserInfo } from '@/features/auth/authStore';
import { usePreviousRoute, useRouter } from '@/features/router';
import { useCacheTabs, useClearTabs } from '@/features/tab/tabHooks';
import { fetchGetUserInfo, fetchLogin } from '@/service/api';
import { localStg } from '@/utils/storage';

import { resetAuth as resetAuthAction, setToken, setUserInfo } from './authStore';
import { clearAuthStorage } from './shared';

export function useAuth() {
  const userInfo = useAppSelector(selectUserInfo);

  const isLogin = useAppSelector(getIsLogin);

  function hasAuth(codes: string | string[]) {
    if (!isLogin) {
      return false;
    }

    if (typeof codes === 'string') {
      return userInfo.buttons.includes(codes);
    }

    return codes.some(code => userInfo.buttons.includes(code));
  }

  return {
    hasAuth
  };
}

export function useInitAuth() {
  const { endLoading, loading, startLoading } = useLoading();

  const [searchParams] = useSearchParams();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { replace } = useRouter();

  const redirectUrl = searchParams.get('redirect');

  async function toLogin({ password, userName }: { password: string; userName: string }, redirect = true) {
    if (loading) return;

    startLoading();
    const { data: loginToken, error } = await fetchLogin(userName, password);

    if (!error) {
      localStg.set('token', loginToken.token);
      localStg.set('refreshToken', loginToken.refreshToken);

      const { data: info, error: userInfoError } = await fetchGetUserInfo();

      if (!userInfoError) {
        // 2. store user info
        localStg.set('userInfo', info);

        dispatch(setToken(loginToken.token));
        dispatch(setUserInfo(info));

        if (redirect) {
          if (redirectUrl) {
            replace(redirectUrl);
          } else {
            replace(globalConfig.homePath);
          }
        }

        window.$notification?.success({
          description: t('page.login.common.welcomeBack', { userName: info.userName }),
          message: t('page.login.common.loginSuccess')
        });
      }
    }

    endLoading();
  }

  return {
    loading,
    toLogin
  };
}

export function useResetAuth() {
  const dispatch = useAppDispatch();

  const previousRoute = usePreviousRoute();

  const cacheTabs = useCacheTabs();

  const { navigate, push, resetRoutes } = useRouter();

  function resetAuth() {
    clearAuthStorage();

    dispatch(resetAuthAction());

    resetRoutes();

    cacheTabs();

    if (!previousRoute?.handle?.constant) {
      if (previousRoute?.fullPath) {
        push('/login', { redirect: previousRoute.fullPath }, null, true);
      } else {
        navigate('/login', { replace: true });
      }
    }
  }

  return resetAuth;
}

// 新增：退出登录
export function useLogout() {
  const dispatch = useAppDispatch();

  const clearTabs = useClearTabs();

  const { navigate, resetRoutes } = useRouter();

  /**
   * 用户 用户退出登录处理函数
   *
   * 功能：该函数负责处理用户的退出登录操作，包括清除本地存储中的认证信息、重置状态管理中的认证状态、清空标签页数据、重置路由权限配置，并最终导航到登录页面。
   */
  function toLogout() {
    // 清除本地存储中的认证信息
    clearAuthStorage();

    // 触发状态管理中的认证信息重置动作
    dispatch(resetAuthAction());

    // 清空标签页（tab）存储的页面列表数据，避免后续用户看到残留的上一用户标签
    clearTabs();

    // 重置路由权限配置，确保新登录用户只能正确的路由访问权限
    resetRoutes();

    // 跳转到登录页，使用replace模式替换当前历史记录，避免用户通过回退按钮返回已退出的页面
    // 此处跳转默认会清除原URL中的redirect参数（因未携带参数），使登录页恢复纯净状态
    navigate('/login', { replace: true });
  }

  return toLogout;
}
