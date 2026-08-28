import { useLoading } from '@skyroc/hooks';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import type { DescriptionsProps } from 'antd';
import { useState } from 'react';

import { useAuth } from '@/features/auth/use-auth';
import { useLoginMutation, useUserInfoQuery } from '@/service/api';

type AccountKey = 'admin' | 'super' | 'user';

interface Account {
  /** 账号按钮的稳定标识，用于控制加载态。 */
  key: AccountKey;

  /** 账号按钮展示文案。 */
  label: string;

  /** 示例账号登录密码。 */
  password: string;

  /** 示例账号登录用户名。 */
  userName: string;
}

const ToggleAuth = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();
  const { hasAuth, initAuth, setAuth } = useAuth();
  const { mutateAsync: login } = useLoginMutation();
  const { endLoading, loading, startLoading } = useLoading();
  const [loginAccount, setLoginAccount] = useState<AccountKey>('super');

  const accounts: Account[] = [
    {
      key: 'super',
      label: t('page.login.pwdLogin.superAdmin'),
      password: '123456',
      userName: 'Super'
    },
    {
      key: 'admin',
      label: t('page.login.pwdLogin.admin'),
      password: '123456',
      userName: 'Admin'
    },
    {
      key: 'user',
      label: t('page.login.pwdLogin.user'),
      password: '123456',
      userName: 'User'
    }
  ];

  async function handleToggleAccount(account: Account) {
    if (loading) return;

    setLoginAccount(account.key);
    startLoading();

    try {
      const tokens = await login({
        password: account.password,
        userName: account.userName
      });

      setAuth(tokens);
      await initAuth();
      await router.invalidate();
    } finally {
      endLoading();
    }
  }

  const roleItems: DescriptionsProps['items'] = [
    {
      children: (
        <ASpace>
          {(userInfo?.roles ?? []).map(role => (
            <ATag key={role}>{role}</ATag>
          ))}
        </ASpace>
      ),
      key: '1',
      label: t('page.manage.user.userRole')
    },
    {
      children: (
        <ASpace>
          {accounts.map(account => (
            <AButton
              disabled={loading && loginAccount !== account.key}
              key={account.key}
              loading={loading && loginAccount === account.key}
              onClick={() => {
                handleToggleAccount(account).catch(() => undefined);
              }}
            >
              {account.label}
            </AButton>
          ))}
        </ASpace>
      ),
      key: '2',
      label: t('page.function.toggleAuth.toggleAccount')
    }
  ];

  return (
    <ASpace
      className="w-full"
      direction="vertical"
      size={16}
    >
      <ACard
        className="card-wrapper"
        size="small"
        title={t('request.logout')}
      >
        <ADescriptions
          bordered
          column={1}
          items={roleItems}
          layout="vertical"
          size="small"
        />

        <ACard
          className="card-wrapper"
          size="small"
          title={t('page.function.toggleAuth.authHook')}
          variant="borderless"
        >
          <ASpace>
            {hasAuth('B_CODE1') && <AButton>{t('page.function.toggleAuth.superAdminVisible')}</AButton>}
            {hasAuth('B_CODE2') && <AButton>{t('page.function.toggleAuth.adminVisible')}</AButton>}
            {hasAuth('B_CODE3') && <AButton>{t('page.function.toggleAuth.adminOrUserVisible')}</AButton>}
          </ASpace>
        </ACard>
      </ACard>
    </ASpace>
  );
};

export const Route = createFileRoute('/(admin)/function/toggle-auth')({
  component: ToggleAuth,
  staticData: {
    i18nKey: 'route.function_toggle-auth',
    menu: {
      icon: 'ic:round-construction',
      order: 4
    },
    title: 'function_toggle-auth'
  }
});
