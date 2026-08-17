import { setAtomValue } from '@skyroc/core-state';
import { cacheTabs, useMenus } from '@skyroc/web-admin-layouts';
import { atom, useAtom, useAtomValue } from 'jotai';

import { fetchLogout } from '@/service/api/auth';
import { useUserInfoQuery } from '@/service/api/system-user';
import { queryClient } from '@/service/queryClient';
import { localStg } from '@/utils/storage';

const initToken = getToken();

interface AuthState {
  /** 是否完成首轮认证初始化。 */
  initialized: boolean;
  /** 当前 access token，空值表示未登录。 */
  token: string | null;
}

const initState: AuthState = {
  token: initToken,
  initialized: false
};

const authAtom = atom(initState);

export function getToken() {
  return localStg.get('token');
}

export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
}

export function setAuth(data: Api.Auth.LoginToken) {
  setAtomValue(authAtom, prev => ({ ...prev, token: data.token }));

  localStg.set('token', data.token);
  localStg.set('refreshToken', data.refreshToken);
}

export function useAuthToken() {
  return useAtomValue(authAtom).token;
}

export function useAuth() {
  const [state, setState] = useAtom(authAtom);
  const { clearMenus, getHomeRoute, home, initMenus } = useMenus();
  const isLoggedIn = Boolean(state.token);
  const { data: userInfo, refetch } = useUserInfoQuery();

  async function initAuth() {
    try {
      const { data } = await refetch();

      if (!data) {
        return null;
      }

      await initMenus(data);

      setState(prev => ({ ...prev, initialized: true }));

      return data;
    } catch {
      return null;
    }
  }

  /**
   * 退出登录：作废服务端的令牌，再清掉本地这一整套登录状态。
   *
   * 两件事必须在一个函数里，顺序不能反：清本地是同步的，而请求拦截器要到下一个微任务才去读 token，先清了本地，发出去的就是一条没带 Authorization 的请求（后果见 fetchLogout）。
   */
  async function logout() {
    await fetchLogout();

    if (userInfo) {
      localStg.set('lastLoginUserId', userInfo.userId);
    }

    queryClient.clear();

    setState(prev => ({ ...prev, token: '' }));

    clearAuthStorage();
    clearMenus();
    cacheTabs();
  }

  return {
    token: state.token,
    userInfo: userInfo || undefined,
    isLoggedIn,
    logout,
    getHomeRoute,
    homeRoute: home,
    initMenus,
    initAuth,
    isAuthInitialized: state.initialized,
    setAuth
  };
}
