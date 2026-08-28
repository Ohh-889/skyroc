import { SvgIcon } from '@shell/ui/compose';
import { noop } from '@skyroc/utils';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';
import { useInitLogin } from '@/features/auth/use-login';
import { useLoginTenant } from '@/features/auth/use-login-tenant';
import { useCaptchaQuery } from '@/service/api';
import LoginActions from './modules/LoginActions';
import LoginHeader from './modules/LoginHeader';
import TenantSelect from './modules/TenantSelect';

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

/** 表单默认值：预填演示账号，便于开发调试 */
const DEFAULT_FORM_VALUES: LoginFormValues = {
  password: 'admin123',
  remember: false,
  userName: 'admin'
};

const Login = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const search = useSearch({ from: '/(auth)/login/' });

  const [passwordForm] = AForm.useForm<LoginFormValues>();

  const { loading, login } = useInitLogin();

  const { selectTenant, showTenantSelect, tenantId, tenantLoading, tenantOptions } = useLoginTenant();

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
      tenantId,
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
      <LoginHeader
        subtitle={t('page.login.enterprise.subtitle')}
        title={t('page.login.enterprise.title')}
      />

      <AForm
        className="[&_.ant-form-item]:mb-15px [&_.ant-form-item-label]:pb-6px [&_.ant-form-item-label>label]:h-18px [&_.ant-form-item-label>label]:text-13px [&_.ant-form-item-label>label]:text-base [&_.ant-form-item-label>label]:font-500 [&_.ant-form-item-label>label]:leading-18px lt-md:[&_.ant-form-item]:mb-18px"
        form={passwordForm}
        initialValues={DEFAULT_FORM_VALUES}
        layout="vertical"
        requiredMark={false}
        onFinish={handlePasswordSubmit}
      >
        {showTenantSelect ? (
          <TenantSelect
            loading={tenantLoading}
            options={tenantOptions}
            value={tenantId}
            onChange={selectTenant}
          />
        ) : null}

        <AForm.Item
          label={t('page.login.enterprise.accountLabel')}
          name="userName"
          rules={[requiredAccountRule]}
        >
          <AInput
            autoComplete="username"
            className="h-40px rounded-6px border-border bg-container text-base shadow-none [&_.ant-input]:bg-transparent [&_.ant-input]:text-13px [&_.ant-input-prefix]:me-9px [&_.ant-input-prefix]:text-17px [&_.ant-input-prefix]:text-tertiary hover:border-primary focus:border-primary"
            placeholder={t('page.login.enterprise.accountPlaceholder')}
            prefix={<SvgIcon icon="ph:user" />}
          />
        </AForm.Item>

        <AForm.Item
          label={t('page.login.enterprise.passwordLabel')}
          name="password"
          rules={pwd}
        >
          <AInput.Password
            autoComplete="current-password"
            className="h-40px rounded-6px border-border bg-container text-base shadow-none [&_.ant-input]:bg-transparent [&_.ant-input]:text-13px [&_.ant-input-prefix]:me-9px [&_.ant-input-prefix]:text-17px [&_.ant-input-prefix]:text-tertiary hover:border-primary focus:border-primary"
            placeholder={t('page.login.enterprise.passwordPlaceholder')}
            prefix={<SvgIcon icon="ph:lock" />}
          />
        </AForm.Item>

        {captchaEnabled ? (
          <div className="mb-15px grid grid-cols-[minmax(0,1fr)_96px_64px] items-end gap-10px lt-md:mb-18px lt-xs:grid-cols-[minmax(0,1fr)_92px_58px] lt-xs:gap-8px">
            <AForm.Item
              className="!mb-0"
              label={t('page.login.enterprise.captchaLabel')}
              name="code"
              rules={[requiredCaptchaRule]}
            >
              <AInput
                autoComplete="off"
                className="h-40px rounded-6px border-border bg-container text-base shadow-none hover:border-primary focus:border-primary"
                disabled={!captchaSrc}
                placeholder={t('page.login.enterprise.captchaPlaceholder')}
              />
            </AForm.Item>

            <button
              aria-label={t('page.login.enterprise.captchaRefresh')}
              className="relative h-40px grid cursor-pointer place-items-center overflow-hidden rounded-5px border border-border-secondary border-solid bg-layout p-0 text-10px text-tertiary disabled:cursor-wait"
              disabled={captchaLoading}
              type="button"
              onClick={refreshCaptcha}
            >
              {captchaLoading ? (
                <SvgIcon
                  className="animate-spin text-20px motion-reduce:animate-none"
                  icon="ph:circle-notch"
                />
              ) : null}
              {!captchaLoading && captchaSrc ? (
                <img
                  className="size-full object-cover"
                  alt={t('page.login.enterprise.captchaAlt')}
                  src={captchaSrc}
                />
              ) : null}
              {!captchaLoading && !captchaSrc ? (
                <span>
                  {captchaError
                    ? t('page.login.enterprise.captchaLoadError')
                    : t('page.login.enterprise.captchaRefresh')}
                </span>
              ) : null}
            </button>

            <button
              className="h-40px i-flex-y-center cursor-pointer gap-4px whitespace-nowrap border-0 bg-transparent p-0 text-12px text-secondary hover:text-primary"
              type="button"
              onClick={refreshCaptcha}
            >
              <SvgIcon
                className="text-15px"
                icon="ph:arrows-clockwise"
              />
              <span>{t('page.login.enterprise.captchaRefreshShort')}</span>
            </button>
          </div>
        ) : null}

        <LoginActions
          loading={loading}
          onForgotPassword={handleUnavailableAction}
          onSwitchMode={() => navigate({ search, to: '/login/code' })}
          switchModeLabel={t('page.login.enterprise.codeLogin')}
        />
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
