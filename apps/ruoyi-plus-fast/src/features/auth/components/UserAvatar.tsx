import { showConfirmModal } from '@skyroc/web-admin-theme';
import { ButtonIcon } from '@skyroc/web-ui-antd';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Button as AButton, Dropdown as ADropdown, type MenuProps } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserInfoQuery } from '@/service/api';

import { useAuth } from '../use-auth';

const UserAvatar = () => {
  const { isLoggedIn } = useAuth();

  const { data: userInfo } = useUserInfoQuery();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const location = useLocation();

  const fullPath = location.href;

  function logout() {
    showConfirmModal({
      cancelText: t('common.cancel'),
      content: t('common.logoutConfirm'),
      okText: t('common.confirm'),
      onOk: () => {
        navigate({ to: '/login-out', search: { redirect: fullPath } });
      },
      title: t('common.tip')
    });
  }

  function onClick({ key }: { key: string }) {
    if (key === 'logout') {
      logout();
    }
  }

  function loginOrRegister() {
    navigate({ to: '/login' });
  }

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon className="text-lg" icon="ph:sign-out" />
          {t('common.logout')}
        </div>
      )
    }
  ];

  if (isLoggedIn) {
    return (
      <ADropdown menu={{ items, onClick }} placement="bottomRight" trigger={['click']}>
        <div>
          <ButtonIcon className="px-12px">
            <SvgIcon className="text-2xl" icon="ph:user-circle" />
            <span className="text-md font-medium">{userInfo?.userName}</span>
          </ButtonIcon>
        </div>
      </ADropdown>
    );
  }

  return <AButton onClick={loginOrRegister}>{t('page.login.common.loginOrRegister')}</AButton>;
};

export default memo(UserAvatar);
