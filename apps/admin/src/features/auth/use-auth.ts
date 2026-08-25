import { setAtomValue } from '@skyroc/core-state';
import { cacheTabs, useMenus } from '@shell/layouts';
import { atom, useAtom } from 'jotai';

import { useUserInfoQuery } from '@/service/api';
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
   * 退出登录：清掉本地这一整套登录状态。
   *
   * 声明成 async 是为了给"先请求后端作废令牌、再清本地"留出位置——两件事的顺序不能反， 清本地是同步的，先清了请求就带不上 Authorization。这个 app 的后端没有登出接口， 所以眼下只有清理这一半。
   */
  async function logout() {
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
