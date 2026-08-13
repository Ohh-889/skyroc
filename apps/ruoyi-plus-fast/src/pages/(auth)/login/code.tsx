import { useCaptcha } from '@skyroc/hooks';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';

import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';
import { useInitLogin } from '@/features/auth/use-login';
import { useLoginTenant } from '@/features/auth/use-login-tenant';
import { useEmailCodeMutation, useSmsCodeMutation } from '@/service/api';
import LoginActions from './modules/LoginActions';
import LoginHeader from './modules/LoginHeader';
import TenantSelect from './modules/TenantSelect';

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
  const [codeSentByChannel, setCodeSentByChannel] = useState<Record<CodeChannel, boolean>>({
    email: false,
    sms: false
  });

  const {
    formRules: { code: codeRules, email: emailRules, phone: phoneRules }
  } = useAuthFormRules();

  const { loading, login } = useInitLogin();

  const { selectTenant, showTenantSelect, tenantId, tenantLoading, tenantOptions } = useLoginTenant();

  const { mutateAsync: sendSmsCode } = useSmsCodeMutation();
  const { mutateAsync: sendEmailCode } = useEmailCodeMutation();

  // 目标已经由 validateFields 校过了，这里不再校一遍，否则两处规则会各长各的。
  // 短信和邮箱各自有后端限流，前端倒计时也必须分开，否则切换渠道时会像没切换。
  const {
    getCaptcha: getSmsCaptcha,
    isCounting: isSmsCounting,
    label: smsCodeButtonLabel,
    loading: smsCodeSending
  } = useCaptcha(t('page.login.enterprise.getCode'), count => t('page.login.codeLogin.reGetCode', { time: count }), {
    request: async target => {
      // 发失败会把异常抛出去，useCaptcha 那边就不会开始倒计时——让用户干等一分钟才能重试
      // 是这里最容易犯的错。
      // 带上租户：两家租户绑同一个手机号时，后端要靠它才知道该给谁发码
      await sendSmsCode({ phone: target, tenantId });

      // 不说"发送成功"：号码没注册时后端同样回成功，那句话对这部分人是假的
      showSuccessMessage(t('page.login.enterprise.codeSentPhone'));
      setCodeSentByChannel(prev => ({ ...prev, sms: true }));
    },
    seconds: RESEND_SECONDS,
    validateTarget: target => target.trim() !== ''
  });

  const {
    getCaptcha: getEmailCaptcha,
    isCounting: isEmailCounting,
    label: emailCodeButtonLabel,
    loading: emailCodeSending
  } = useCaptcha(t('page.login.enterprise.getCode'), count => t('page.login.codeLogin.reGetCode', { time: count }), {
    request: async target => {
      await sendEmailCode({ email: target, tenantId });

      showSuccessMessage(t('page.login.enterprise.codeSentEmail'));
      setCodeSentByChannel(prev => ({ ...prev, email: true }));
    },
    seconds: RESEND_SECONDS,
    validateTarget: target => target.trim() !== ''
  });

  const codeButtonLabel = channel === 'sms' ? smsCodeButtonLabel : emailCodeButtonLabel;
  const codeSending = channel === 'sms' ? smsCodeSending : emailCodeSending;
  const codeSent = codeSentByChannel[channel];
  const getCaptcha = channel === 'sms' ? getSmsCaptcha : getEmailCaptcha;
  const isCounting = channel === 'sms' ? isSmsCounting : isEmailCounting;

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
        ? { grantType: 'sms', phone: String(sms).trim(), remember, smsCode: code.trim(), tenantId }
        : { email: String(email).trim(), emailCode: code.trim(), grantType: 'email', remember, tenantId };

    login(params);
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <LoginHeader
        subtitle={t('page.login.enterprise.codeSubtitle')}
        title={t('page.login.enterprise.codeTitle')}
      />

      {/* 排在渠道之前：先确定是哪家企业，验证码才知道往哪个账号发 */}
      {showTenantSelect ? (
        <TenantSelect
          loading={tenantLoading}
          options={tenantOptions}
          value={tenantId}
          onChange={selectTenant}
        />
      ) : null}

      <ASegmented<CodeChannel>
        aria-label={t('page.login.enterprise.codeChannelLabel')}
        block
        className="mb-20px"
        size="large"
        options={[
          { label: t('page.login.enterprise.phoneCode'), value: 'sms' },
          { label: t('page.login.enterprise.emailCode'), value: 'email' }
        ]}
        value={channel}
        onChange={switchChannel}
      />

      <AForm
        className="[&_.ant-form-item]:mb-15px [&_.ant-form-item-label]:pb-6px [&_.ant-form-item-label>label]:h-18px [&_.ant-form-item-label>label]:text-13px [&_.ant-form-item-label>label]:text-base [&_.ant-form-item-label>label]:font-500 [&_.ant-form-item-label>label]:leading-18px lt-md:[&_.ant-form-item]:mb-18px"
        form={form}
        initialValues={{ remember: false }}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
      >
        {channel === 'sms' ? (
          <AForm.Item
            label={t('page.login.enterprise.phoneLabel')}
            name="sms"
            rules={phoneRules}
          >
            <AInput
              autoComplete="tel"
              className="h-40px rounded-6px border-border bg-container text-base shadow-none [&_.ant-input]:bg-transparent [&_.ant-input]:text-13px [&_.ant-input-prefix]:me-9px [&_.ant-input-prefix]:text-17px [&_.ant-input-prefix]:text-tertiary hover:border-primary focus:border-primary"
              inputMode="numeric"
              placeholder={t('page.login.enterprise.phonePlaceholder')}
              prefix={<SvgIcon icon="ph:device-mobile" />}
            />
          </AForm.Item>
        ) : (
          <AForm.Item
            label={t('page.login.enterprise.emailLabel')}
            name="email"
            rules={emailRules}
          >
            <AInput
              autoComplete="email"
              className="h-40px rounded-6px border-border bg-container text-base shadow-none [&_.ant-input]:bg-transparent [&_.ant-input]:text-13px [&_.ant-input-prefix]:me-9px [&_.ant-input-prefix]:text-17px [&_.ant-input-prefix]:text-tertiary hover:border-primary focus:border-primary"
              inputMode="email"
              placeholder={t('page.login.enterprise.emailPlaceholder')}
              prefix={<SvgIcon icon="ph:envelope" />}
            />
          </AForm.Item>
        )}

        <div className="grid grid-cols-[minmax(0,1fr)_118px] items-end gap-10px">
          <AForm.Item
            label={t('page.login.enterprise.verificationLabel')}
            name="code"
            rules={codeRules}
          >
            <AInput
              autoComplete="one-time-code"
              className="h-40px rounded-6px border-border bg-container text-base shadow-none [&_.ant-input]:bg-transparent [&_.ant-input]:text-13px [&_.ant-input-prefix]:me-9px [&_.ant-input-prefix]:text-17px [&_.ant-input-prefix]:text-tertiary hover:border-primary focus:border-primary"
              inputMode="numeric"
              maxLength={6}
              placeholder={t('page.login.enterprise.verificationPlaceholder')}
              prefix={<SvgIcon icon="ph:lock" />}
            />
          </AForm.Item>
          <AButton
            className="mb-15px h-40px rounded-8px border-primary-border bg-container text-12px text-primary hover:border-primary hover:bg-primary-bg lt-md:mb-18px"
            disabled={isCounting}
            loading={codeSending}
            onClick={sendCode}
          >
            {codeButtonLabel}
          </AButton>
        </div>

        <div className="mb-2 text-secondary">{codeSent ? t('page.login.enterprise.codeNotReceived') : null}</div>

        <LoginActions
          loading={loading}
          onSwitchMode={() => navigate({ search, to: '/login' })}
          switchModeLabel={t('page.login.enterprise.passwordLogin')}
        />
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
