import { useLang } from '@shell/i18n';
import { AntdProvider } from '@shell/theme';
import type { PropsWithChildren } from 'react';

import { antdLocales } from '@/locales/antd';
import { useUserInfoQuery } from '@/service/api';

const AppAntdProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const { locale } = useLang();
  const { data: userInfo } = useUserInfoQuery();

  return (
    <AntdProvider locale={antdLocales[locale]} userName={userInfo?.userName}>
      {children}
    </AntdProvider>
  );
};

export default AppAntdProvider;
