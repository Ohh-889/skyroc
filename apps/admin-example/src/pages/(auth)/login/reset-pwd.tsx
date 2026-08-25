import { ButtonLink } from '@shell/ui/antd';
import { createFileRoute } from '@tanstack/react-router';

import { useAuthFormRules } from '@/features/auth/use-auth-form-rules';

interface FormModel {
  code: string;
  confirmPassword: string;
  password: string;
  phone: string;
}

const ResetPwd = () => {
  const { t } = useTranslation();

  const [form] = AForm.useForm<FormModel>();

  const { createConfirmPwdRule, formRules } = useAuthFormRules();

  function handleSubmit(_params: FormModel) {
    // request to reset password
    showSuccessMessage(t('page.login.common.validateSuccess'));
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">{t('page.login.register.title')}</h3>
      <AForm className="pt-24px" form={form} onFinish={handleSubmit}>
        <AForm.Item name="phone" rules={formRules.phone}>
          <AInput placeholder={t('page.login.common.phonePlaceholder')} size="large" />
        </AForm.Item>
        <AForm.Item name="code" rules={formRules.code}>
          <AInput placeholder={t('page.login.common.codePlaceholder')} size="large" />
        </AForm.Item>
        <AForm.Item name="password" rules={formRules.pwd}>
          <AInput.Password
            autoComplete="password"
            placeholder={t('page.login.common.passwordPlaceholder')}
            size="large"
          />
        </AForm.Item>
        <AForm.Item name="confirmPassword" rules={createConfirmPwdRule(form)}>
          <AInput.Password
            autoComplete="confirm-password"
            placeholder={t('page.login.common.confirmPasswordPlaceholder')}
            size="large"
          />
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

export const Route = createFileRoute('/(auth)/login/reset-pwd')({
  component: ResetPwd,
  staticData: {
    title: 'login_reset-pwd',
    i18nKey: 'route.login_reset-pwd'
  }
});
