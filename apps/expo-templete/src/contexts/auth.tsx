import { type PropsWithChildren, createContext, use } from 'react';

import { useStorageState } from '@/hooks/use-storage-state';

const SESSION_KEY = 'session';

type AuthValue = {
  /** 是否仍在从本地存储读取凭证 */
  isLoading: boolean;
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
  const [[isLoading, session], setSession] = useStorageState(SESSION_KEY);

  return (
    <AuthContext
      value={{
        session,
        isLoading,
        signIn: token => setSession(token),
        signOut: () => setSession(null)
      }}
    >
      {children}
    </AuthContext>
  );
}
