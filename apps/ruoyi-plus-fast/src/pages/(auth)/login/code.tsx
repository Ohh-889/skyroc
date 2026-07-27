import { SvgIcon } from '@skyroc/web-ui-compose';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';

import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';

interface CodeLoginFormValues {
  /** 六位一次性验证码 */
  code: string;
  /** 邮箱验证码渠道中使用的邮箱 */
  email?: string;
  /** 是否延长受保护的刷新会话 */
  remember: boolean;
  /** 短信验证码渠道中使用的中国大陆手机号 */
  sms?: string;
}

type CodeChannel = 'email' | 'sms';
type SocialProvider = 'feishu' | 'wechat';

const CodeLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch({ from: '/(auth)/login/code' });

  const [form] = AForm.useForm<CodeLoginFormValues>();
  const [channel, setChannel] = useState<CodeChannel>('sms');

  const {
    formRules: { code: codeRules, email: emailRules, phone: phoneRules }
  } = useAuthFormRules();

  function switchChannel(nextChannel: CodeChannel) {
    if (nextChannel === channel) return;

    setChannel(nextChannel);
    form.setFieldValue('code', '');
    form.setFields([
      { errors: [], name: 'code' },
      { errors: [], name: channel },
      { errors: [], name: nextChannel }
    ]);
  }

  async function sendCode() {
    try {
      await form.validateFields([channel]);
      showInfoMessage(t('page.login.enterprise.notConfigured'));
    } catch {
      form.scrollToField(channel, { block: 'center' });
    }
  }

  function handleSubmit(_values: CodeLoginFormValues) {
    showInfoMessage(t('page.login.enterprise.notConfigured'));
  }

  function returnToPasswordLogin() {
    navigate({ search, to: '/login' });
  }

  function handleSocialLogin(provider: SocialProvider) {
    const authorizationUrl =
      provider === 'wechat' ? import.meta.env.VITE_AUTH_WECHAT_URL : import.meta.env.VITE_AUTH_FEISHU_URL;

    if (!authorizationUrl) {
      showInfoMessage(t('page.login.enterprise.notConfigured'));
      return;
    }

    window.location.assign(authorizationUrl);
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <header className="skyroc-auth-heading">
        <h1>{t('page.login.enterprise.codeTitle')}</h1>
        <p>{t('page.login.enterprise.codeSubtitle')}</p>
      </header>

      <div aria-label={t('page.login.enterprise.codeChannelLabel')} className="skyroc-code-tabs" role="tablist">
        <button
          aria-selected={channel === 'sms'}
          className={channel === 'sms' ? 'is-active' : ''}
          role="tab"
          type="button"
          onClick={() => switchChannel('sms')}
        >
          {t('page.login.enterprise.phoneCode')}
        </button>
        <button
          aria-selected={channel === 'email'}
          className={channel === 'email' ? 'is-active' : ''}
          role="tab"
          type="button"
          onClick={() => switchChannel('email')}
        >
          {t('page.login.enterprise.emailCode')}
        </button>
      </div>

      <AForm
        className="skyroc-login-form skyroc-code-login-form"
        form={form}
        initialValues={{ remember: false }}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
      >
        {channel === 'sms' ? (
          <AForm.Item label={t('page.login.enterprise.phoneLabel')} name="sms" rules={phoneRules}>
            <AInput
              autoComplete="tel"
              className="skyroc-login-control"
              inputMode="numeric"
              placeholder={t('page.login.enterprise.phonePlaceholder')}
              prefix={<SvgIcon icon="ph:device-mobile" />}
            />
          </AForm.Item>
        ) : (
          <AForm.Item label={t('page.login.enterprise.emailLabel')} name="email" rules={emailRules}>
            <AInput
              autoComplete="email"
              className="skyroc-login-control"
              inputMode="email"
              placeholder={t('page.login.enterprise.emailPlaceholder')}
              prefix={<SvgIcon icon="ph:envelope" />}
            />
          </AForm.Item>
        )}

        <div className="skyroc-verification-field">
          <AForm.Item label={t('page.login.enterprise.verificationLabel')} name="code" rules={codeRules}>
            <AInput
              autoComplete="one-time-code"
              className="skyroc-login-control"
              inputMode="numeric"
              maxLength={6}
              placeholder={t('page.login.enterprise.verificationPlaceholder')}
              prefix={<SvgIcon icon="ph:lock" />}
            />
          </AForm.Item>
          <AButton className="skyroc-get-code-button" onClick={sendCode}>
            {t('page.login.enterprise.getCode')}
          </AButton>
        </div>

        <div className="skyroc-form-options">
          <AForm.Item name="remember" noStyle valuePropName="checked">
            <ACheckbox>{t('page.login.enterprise.keepSignedIn')}</ACheckbox>
          </AForm.Item>
        </div>

        <AButton block className="skyroc-login-submit" htmlType="submit" type="primary">
          {t('page.login.enterprise.login')}
        </AButton>

        <div className="skyroc-switch-mode">
          <AButton type="link" onClick={returnToPasswordLogin}>
            {t('page.login.enterprise.passwordLogin')}
          </AButton>
        </div>

        <ADivider className="skyroc-login-divider">{t('page.login.enterprise.otherLogin')}</ADivider>

        <div className="skyroc-social-buttons">
          <AButton
            className="skyroc-social-button"
            icon={<SvgIcon className="skyroc-wechat-icon" icon="simple-icons:wechat" />}
            onClick={() => handleSocialLogin('wechat')}
          >
            {t('page.login.enterprise.socialWechat')}
          </AButton>
          <AButton
            className="skyroc-social-button"
            icon={<SvgIcon className="skyroc-feishu-icon" icon="simple-icons:lark" />}
            onClick={() => handleSocialLogin('feishu')}
          >
            {t('page.login.enterprise.socialFeishu')}
          </AButton>
        </div>

        <p className="skyroc-admin-hint">
          <SvgIcon icon="ph:info" />
          <span>{t('page.login.enterprise.adminHint')}</span>
        </p>
      </AForm>
    </>
  );
};

export const Route = createFileRoute('/(auth)/login/code')({
  component: CodeLogin,
  staticData: {
    i18nKey: 'route.login',
    title: 'login-code'
  }
});
