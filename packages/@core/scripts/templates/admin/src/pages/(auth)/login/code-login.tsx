import { useCaptcha } from '@skyroc/hooks';
import { ButtonLink } from '@shell/ui/antd';
import { REG_PHONE } from '@skyroc/utils';
import { createFileRoute } from '@tanstack/react-router';

import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';

type FormValues = {
  code: string;
  phone: string;
};

const CodeLogin = () => {
  const [form] = AForm.useForm<FormValues>();

  const { t } = useTranslation();

  const { getCaptcha, isCounting, label, loading } = useCaptcha(t('page.login.codeLogin.getCode'), getCountingLabel);

  const { formRules } = useAuthFormRules();

  const phone = AForm.useWatch('phone', form);

  const isValidPhone = REG_PHONE.test(phone);

  function handleSubmit(_params: FormValues) {
    // request to reset password
    showSuccessMessage(t('page.login.common.validateSuccess'));
  }

  function getCountingLabel(count: number) {
    return t('page.login.codeLogin.reGetCode', { time: count });
  }

  function sendCaptcha() {
    getCaptcha(phone);
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">{t('page.login.codeLogin.title')}</h3>
      <AForm className="pt-24px" form={form} onFinish={handleSubmit}>
        <AForm.Item name="phone" rules={formRules.phone}>
          <AInput placeholder={t('page.login.common.phonePlaceholder')} />
        </AForm.Item>

        <AForm.Item name="code" rules={formRules.code}>
          <div className="w-full flex-y-center gap-16px">
            <AInput placeholder={t('page.login.common.codePlaceholder')} />
            <AButton disabled={!isValidPhone || isCounting} loading={loading} size="large" onClick={sendCaptcha}>
              {label}
            </AButton>
          </div>
        </AForm.Item>
        <ASpace className="w-full" orientation="vertical" size={18}>
          <AButton block htmlType="submit" shape="round" size="large" type="primary">
            {t('common.confirm')}
          </AButton>

          <ButtonLink block shape="round" size="large" to="..">
            {t('page.login.common.back')}
          </ButtonLink>
        </ASpace>
      </AForm>
    </>
  );
};

export const Route = createFileRoute('/(auth)/login/code-login')({
  component: CodeLogin,
  staticData: {
    title: 'code-login',
    i18nKey: 'route.login_code-login'
  }
});
