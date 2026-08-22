// oxlint-disable react/only-export-components
import { type PropsWithChildren, createContext, use, useCallback, useMemo } from 'react';

import { useStorageState } from '@/hooks/use-storage-state';

const SESSION_KEY = 'session';

type AuthValue = {
  /** 是否仍在从本地存储读取凭证 */
  isLoading: boolean;
  /** 是否已登录，等价于 `session !== null` */
  isLoggedIn: boolean;
  /** 登录凭证；`null` 表示未登录 */
  session: string | null;
  signIn: (token: string) => void;

  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const { isLoading, setValue: setSession, value: session } = useStorageState(SESSION_KEY);

  const signIn = useCallback((token: string) => setSession(token), [setSession]);

  const signOut = useCallback(() => setSession(null), [setSession]);

  const isLoggedIn = Boolean(session);

  const value = useMemo<AuthValue>(
    () => ({ isLoading, isLoggedIn, session, signIn, signOut }),
    [isLoading, isLoggedIn, session, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
