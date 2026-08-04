import { useCaptcha } from '@skyroc/hooks';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';

import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';
import { useInitLogin } from '@/features/auth/use-login';
import { useEmailCodeMutation, useSmsCodeMutation } from '@/service/api';
import SocialLogin from './modules/SocialLogin';

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

/**
 * 重新获取验证码的等待秒数
 *
 * 和后端的 SMS_CODE_RESEND_SECONDS / EMAIL_CODE_RESEND_SECONDS 对齐。配短了按钮会先亮 起来，点下去只能拿到 429。
 */
const RESEND_SECONDS = 60;

const CodeLogin = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  // 带着 redirect 在两个登录页之间跳，登录完才回得到原来要去的那一页
  const search = useSearch({ from: '/(auth)/login' });

  const [form] = AForm.useForm<CodeLoginFormValues>();
  const [channel, setChannel] = useState<CodeChannel>('sms');

  // 发过码之后才提示"没收到怎么办"。后端对没注册的号码也回成功（否则这个不带凭据的接口
  // 就成了枚举器），所以"已发送"之后什么都收不到是正常结局，得让用户知道往哪儿找。
  const [codeSent, setCodeSent] = useState(false);

  const {
    formRules: { code: codeRules, email: emailRules, phone: phoneRules }
  } = useAuthFormRules();

  const { loading, login } = useInitLogin();

  const { mutateAsync: sendSmsCode } = useSmsCodeMutation();
  const { mutateAsync: sendEmailCode } = useEmailCodeMutation();

  // 目标已经由 validateFields 校过了，这里不再校一遍，否则两处规则会各长各的
  const {
    getCaptcha,
    isCounting,
    label: codeButtonLabel,
    loading: codeSending
  } = useCaptcha(t('page.login.enterprise.getCode'), count => t('page.login.codeLogin.reGetCode', { time: count }), {
    request: async target => {
      // 发失败会把异常抛出去，useCaptcha 那边就不会开始倒计时——让用户干等一分钟才能重试
      // 是这里最容易犯的错。
      if (channel === 'sms') {
        await sendSmsCode({ phone: target });
      } else {
        await sendEmailCode({ email: target });
      }

      // 不说"发送成功"：号码没注册时后端同样回成功，那句话对这部分人是假的
      showSuccessMessage(
        t(channel === 'sms' ? 'page.login.enterprise.codeSentPhone' : 'page.login.enterprise.codeSentEmail')
      );
      setCodeSent(true);
    },
    seconds: RESEND_SECONDS,
    validateTarget: target => target.trim() !== ''
  });

  function switchChannel(nextChannel: CodeChannel) {
    if (nextChannel === channel) return;

    setChannel(nextChannel);
    setCodeSent(false);
    form.setFieldValue('code', '');
    form.setFields([
      { errors: [], name: 'code' },
      { errors: [], name: channel },
      { errors: [], name: nextChannel }
    ]);
  }

  async function sendCode() {
    try {
      // 只校当前渠道那一栏：整表校验会先在还没填的验证码上报错
      await form.validateFields([channel]);
    } catch {
      form.scrollToField(channel, { block: 'center' });
      return;
    }

    await getCaptcha(String(form.getFieldValue(channel) ?? '').trim());
  }

  function handleSubmit(values: CodeLoginFormValues) {
    const { code, email, remember, sms } = values;

    const params: Api.Auth.LoginParams =
      channel === 'sms'
        ? { grantType: 'sms', phone: String(sms).trim(), remember, smsCode: code.trim() }
        : { email: String(email).trim(), emailCode: code.trim(), grantType: 'email', remember };

    login(params);
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
          <AButton className="skyroc-get-code-button" disabled={isCounting} loading={codeSending} onClick={sendCode}>
            {codeButtonLabel}
          </AButton>
        </div>

        <div className="mb-2 text-secondary">{codeSent ? t('page.login.enterprise.codeNotReceived') : null}</div>

        <div className="skyroc-form-options">
          <AForm.Item name="remember" noStyle valuePropName="checked">
            <ACheckbox>{t('page.login.enterprise.keepSignedIn')}</ACheckbox>
          </AForm.Item>
        </div>

        <AButton block className="rounded-xl" size="large" htmlType="submit" loading={loading} type="primary">
          {t('page.login.enterprise.login')}
        </AButton>

        <div className="skyroc-switch-mode">
          <AButton type="link" onClick={() => navigate({ search, to: '/login' })}>
            {t('page.login.enterprise.passwordLogin')}
          </AButton>
        </div>

        <SocialLogin />
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
