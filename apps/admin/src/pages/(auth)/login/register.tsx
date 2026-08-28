import { ButtonLink } from '@shell/ui/antd';
import { useCaptcha } from '@skyroc/hooks';
import { REG_PHONE } from '@skyroc/utils';
import { createFileRoute } from '@tanstack/react-router';

import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';

interface FormModel {
  code: string;
  confirmPassword: string;
  password: string;
  phone: string;
}

const Register = () => {
  const { t } = useTranslation();

  const { getCaptcha, isCounting, label, loading } = useCaptcha(t('page.login.codeLogin.getCode'), getCountingLabel);

  const [form] = AForm.useForm<FormModel>();

  const phone = AForm.useWatch('phone', form);

  const isValidPhone = REG_PHONE.test(phone);

  const { createConfirmPwdRule, formRules } = useAuthFormRules();

  function handleSubmit(_params: FormModel) {
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
      <h3 className="text-18px text-primary font-medium">{t('page.login.register.title')}</h3>
      <AForm
        className="pt-24px"
        form={form}
        onFinish={handleSubmit}
      >
        <AForm.Item
          name="phone"
          rules={formRules.phone}
        >
          <AInput
            placeholder={t('page.login.common.phonePlaceholder')}
            size="large"
          />
        </AForm.Item>
        <AForm.Item
          name="code"
          rules={formRules.code}
        >
          <div className="w-full flex-y-center gap-16px">
            <AInput
              placeholder={t('page.login.common.codePlaceholder')}
              size="large"
            />
            <AButton
              disabled={!isValidPhone || isCounting}
              loading={loading}
              size="large"
              onClick={sendCaptcha}
            >
              {label}
            </AButton>
          </div>
        </AForm.Item>
        <AForm.Item
          name="password"
          rules={formRules.pwd}
        >
          <AInput placeholder={t('page.login.common.passwordPlaceholder')} />
        </AForm.Item>
        <AForm.Item
          name="confirmPassword"
          rules={createConfirmPwdRule(form)}
        >
          <AInput
            placeholder={t('page.login.common.confirmPasswordPlaceholder')}
            size="large"
          />
        </AForm.Item>
        <ASpace
          className="w-full"
          orientation="vertical"
          size={18}
        >
          <AButton
            block
            htmlType="submit"
            shape="round"
            size="large"
            type="primary"
          >
            {t('common.confirm')}
          </AButton>

          <ButtonLink
            block
            shape="round"
            size="large"
            to=".."
          >
            {t('page.login.common.back')}
          </ButtonLink>
        </ASpace>
      </AForm>
    </>
  );
};

export const Route = createFileRoute('/(auth)/login/register')({
  component: Register,
  staticData: {
    title: 'login_register',
    i18nKey: 'route.login_register'
  }
});
