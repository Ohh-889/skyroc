import { useLoading } from '@skyroc/hooks';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';

import { useLoginMutation } from '@/service/api';
import { localStg } from '@/utils/storage';

import { useAuth } from './use-auth';

export function useInitLogin() {
  const { endLoading, loading, startLoading } = useLoading();

  const search = useSearch({ from: '/(auth)/login/' });

  const { t } = useTranslation();

  const { initAuth, setAuth } = useAuth();

  const navigate = useNavigate();
  const router = useRouter();

  const { mutate: toLogin } = useLoginMutation();

  async function login(params: Api.Auth.LoginParams, redirect = true) {
    if (loading) return;

    startLoading();

    toLogin(params, {
      onError: () => {
        endLoading();
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
