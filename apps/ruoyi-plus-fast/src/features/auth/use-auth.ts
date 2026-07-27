import { globalStore, updateAtomValue } from '@skyroc/core-state';
import { cacheTabs, useMenus } from '@skyroc/web-admin-layouts';
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
  updateAtomValue(authAtom, prev => ({ ...prev, token: data.token }));

  localStg.set('token', data.token);
  localStg.set('refreshToken', data.refreshToken);
}

export function useAuth() {
  const [state, setState] = useAtom(authAtom, { store: globalStore });
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

  function clearAuth() {
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
    clearAuth,
    getHomeRoute,
    homeRoute: home,
    initMenus,
    initAuth,
    isAuthInitialized: state.initialized,
    setAuth
  };
}
