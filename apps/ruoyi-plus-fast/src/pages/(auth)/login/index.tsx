import { noop } from '@skyroc/utils';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';
import { useInitLogin } from '@/features/auth/use-login';
import { useCaptchaQuery } from '@/service/api';
import SocialLogin from './modules/SocialLogin';

interface LoginFormValues {
  /** 图形验证码内容 */
  code?: string;
  /** 登录密码 */
  password: string;
  /** 是否保持登录 */
  remember: boolean;
  /** 用户名、手机号或邮箱 */
  userName: string;
}

const CAPTCHA_ENABLED = import.meta.env.VITE_AUTH_CAPTCHA_ENABLED === 'Y';

const Login = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const search = useSearch({ from: '/(auth)/login/' });

  const [passwordForm] = AForm.useForm<LoginFormValues>();

  const { loading, login } = useInitLogin();

  const {
    data: captcha,
    error: captchaError,
    isFetching: captchaLoading,
    refetch: refetchCaptcha
  } = useCaptchaQuery(CAPTCHA_ENABLED);

  const {
    formRules: { pwd }
  } = useAuthFormRules();

  const captchaEnabled = CAPTCHA_ENABLED;
  const captchaSrc = captcha?.img ? `data:image/png;base64,${captcha.img}` : '';

  const requiredAccountRule = {
    required: true,
    message: t('page.login.enterprise.accountRequired')
  };

  const requiredCaptchaRule = {
    required: true,
    message: t('page.login.enterprise.captchaRequired')
  };

  function handlePasswordSubmit(values: LoginFormValues) {
    const form: Api.Auth.PwdLoginParams = {
      password: values.password,
      remember: values.remember,
      userName: values.userName.trim()
    };

    if (captchaEnabled) {
      form.code = values?.code?.trim();
      form.uuid = String(captcha?.uuid);
    }

    login(form, {
      onError: captchaEnabled ? refreshCaptcha : noop
    });
  }

  function refreshCaptcha() {
    passwordForm.setFieldValue('code', '');

    refetchCaptcha();
  }

  function handleUnavailableAction() {
    showInfoMessage(t('page.login.enterprise.notConfigured'));
  }

  useKeyPress('enter', () => {
    passwordForm.submit();
  });

  return (
    <>
      <header className="skyroc-auth-heading">
        <h1>{t('page.login.enterprise.title')}</h1>
        <p>{t('page.login.enterprise.subtitle')}</p>
      </header>

      <AForm
        className="skyroc-login-form"
        form={passwordForm}
        initialValues={{ remember: false }}
        layout="vertical"
        requiredMark={false}
        onFinish={handlePasswordSubmit}
      >
        <AForm.Item label={t('page.login.enterprise.accountLabel')} name="userName" rules={[requiredAccountRule]}>
          <AInput
            autoComplete="username"
            className="skyroc-login-control"
            placeholder={t('page.login.enterprise.accountPlaceholder')}
            prefix={<SvgIcon icon="ph:user" />}
          />
        </AForm.Item>

        <AForm.Item label={t('page.login.enterprise.passwordLabel')} name="password" rules={pwd}>
          <AInput.Password
            autoComplete="current-password"
            className="skyroc-login-control"
            placeholder={t('page.login.enterprise.passwordPlaceholder')}
            prefix={<SvgIcon icon="ph:lock" />}
          />
        </AForm.Item>

        {captchaEnabled ? (
          <div className="skyroc-captcha-field">
            <AForm.Item label={t('page.login.enterprise.captchaLabel')} name="code" rules={[requiredCaptchaRule]}>
              <AInput
                autoComplete="off"
                className="skyroc-login-control"
                disabled={!captchaSrc}
                placeholder={t('page.login.enterprise.captchaPlaceholder')}
              />
            </AForm.Item>

            <button
              aria-label={t('page.login.enterprise.captchaRefresh')}
              className="skyroc-captcha-image"
              disabled={captchaLoading}
              type="button"
              onClick={refreshCaptcha}
            >
              {captchaLoading ? <SvgIcon className="skyroc-captcha-loading" icon="ph:circle-notch" /> : null}
              {!captchaLoading && captchaSrc ? (
                <img alt={t('page.login.enterprise.captchaAlt')} src={captchaSrc} />
              ) : null}
              {!captchaLoading && !captchaSrc ? (
                <span>
                  {captchaError
                    ? t('page.login.enterprise.captchaLoadError')
                    : t('page.login.enterprise.captchaRefresh')}
                </span>
              ) : null}
            </button>

            <button className="skyroc-captcha-refresh" type="button" onClick={refreshCaptcha}>
              <SvgIcon icon="ph:arrows-clockwise" />
              <span>{t('page.login.enterprise.captchaRefreshShort')}</span>
            </button>
          </div>
        ) : null}

        <div className="skyroc-form-options">
          <AForm.Item name="remember" noStyle valuePropName="checked">
            <ACheckbox>{t('page.login.enterprise.keepSignedIn')}</ACheckbox>
          </AForm.Item>
          <AButton type="link" onClick={handleUnavailableAction}>
            {t('page.login.enterprise.forgetPassword')}
          </AButton>
        </div>

        <AButton block className="rounded-xl" size="large" htmlType="submit" loading={loading} type="primary">
          {t('page.login.enterprise.login')}
        </AButton>

        <div className="skyroc-switch-mode">
          <AButton type="link" onClick={() => navigate({ search, to: '/login/code' })}>
            {t('page.login.enterprise.codeLogin')}
          </AButton>
        </div>

        <SocialLogin />
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
