import { createFileRoute } from '@tanstack/react-router';

import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';
import { useInitLogin } from '@/features/auth/use-login';

type AccountKey = 'admin' | 'super' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  password: string;
  userName: string;
}

type LoginParams = Pick<Account, 'password' | 'userName'>;

const INITIAL_VALUES = {
  password: '123456',
  userName: 'Soybean'
};

const Login = () => {
  const { t } = useTranslation();

  const [form] = AForm.useForm<LoginParams>();

  const { loading, login } = useInitLogin();

  const {
    formRules: { pwd, userName: userNameRules }
  } = useAuthFormRules();

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

  function handleAccountLogin(account: Account) {
    login({
      password: account.password,
      userName: account.userName
    });
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">{t('page.login.pwdLogin.title')}</h3>
      <AForm className="pt-24px" form={form} initialValues={INITIAL_VALUES} onFinish={login}>
        <AForm.Item name="userName" rules={userNameRules}>
          <AInput size="large" />
        </AForm.Item>

        <AForm.Item name="password" rules={pwd}>
          <AInput.Password autoComplete="password" size="large" />
        </AForm.Item>
        <ASpace className="w-full" orientation="vertical" size={24}>
          <AButton block color="primary" htmlType="submit" loading={loading} shape="round" size="large" type="primary">
            {t('common.confirm')}
          </AButton>
          <ADivider className="!m-0 !text-14px !text-#666">{t('page.login.pwdLogin.otherAccountLogin')}</ADivider>
          <div className="flex-center gap-12px">
            {accounts.map(item => {
              return (
                <AButton key={item.key} type="primary" onClick={() => handleAccountLogin(item)}>
                  {item.label}
                </AButton>
              );
            })}
          </div>
        </ASpace>
      </AForm>
    </>
  );
};

export const Route = createFileRoute('/(auth)/login/')({
  component: Login,
  staticData: {
    title: 'login',
    i18nKey: 'route.login'
  }
});
