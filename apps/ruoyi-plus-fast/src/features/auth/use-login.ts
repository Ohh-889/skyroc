import { useLoading } from '@skyroc/hooks';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';

import { useLoginMutation } from '@/service/api';
import { localStg } from '@/utils/storage';

import { useAuth } from './use-auth';

interface LoginOptions {
  /** 登录失败后的处理 */
  onError?: () => void;
  /** 登录成功后是否跳转到目标页面 */
  redirect?: boolean;
}

export function useInitLogin() {
  const { endLoading, loading, startLoading } = useLoading();

  const search = useSearch({ from: '/(auth)/login/' });

  const { t } = useTranslation();

  const { initAuth, setAuth } = useAuth();

  const navigate = useNavigate();
  const router = useRouter();

  const { mutate: toLogin } = useLoginMutation();

  async function login(params: Api.Auth.LoginParams, options: LoginOptions = {}) {
    if (loading) return;

    const { onError, redirect = true } = options;

    startLoading();

    // clientId / grantType / tenantId 由 fetchLogin 补，这里只管用户填的那几项
    toLogin(params, {
      onError: () => {
        endLoading();
        onError?.();
      },
      onSuccess: async data => {
        setAuth(data);

        const info = await initAuth();

        if (info) {
          await router.invalidate();

          const lastLoginUserId = localStg.get('lastLoginUserId');

          let needRedirect = redirect;

          if (!lastLoginUserId || lastLoginUserId !== info.userId) {
            needRedirect = false;

            localStg.remove('globalTabs');
            localStg.remove('lastLoginUserId');
          }

          if (needRedirect) {
            await navigate({ to: search.redirect || '/', replace: true });
          } else {
            await navigate({ to: '/', replace: true });
          }

          showSuccessNotification({
            description: t('page.login.common.welcomeBack', { userName: info.userName }),
            title: t('page.login.common.loginSuccess')
          });
        } else {
          endLoading();
        }
      }
    });
  }

  return {
    login,
    loading
  };
}
