import { SvgIcon } from '@skyroc/web-ui-compose';

import SocialLogin from './SocialLogin';

interface LoginActionsProps {
  /** 是否正在提交当前登录表单 */
  loading: boolean;
  /** 点击忘记密码时执行的处理，仅密码登录展示 */
  onForgotPassword?: () => void;
  /** 切换密码登录与验证码登录 */
  onSwitchMode: () => void;
  /** 另一种登录方式的按钮文案 */
  switchModeLabel: string;
}

const LoginActions = (props: LoginActionsProps) => {
  const { loading, onForgotPassword, onSwitchMode, switchModeLabel } = props;

  const { t } = useTranslation();

  return (
    <>
      <div className="mb-15px min-h-20px flex-y-center justify-between lt-md:mb-18px">
        <AForm.Item
          name="remember"
          className="!mb-0"
          valuePropName="checked"
        >
          <ACheckbox>{t('page.login.enterprise.keepSignedIn')}</ACheckbox>
        </AForm.Item>

        {onForgotPassword ? (
          <AButton
            variant="link"
            color="primary"
            className="!p-0"
            onClick={onForgotPassword}
          >
            {t('page.login.enterprise.forgetPassword')}
          </AButton>
        ) : null}
      </div>

      <AButton
        block
        className="rounded-full"
        size="large"
        htmlType="submit"
        icon={
          <SvgIcon
            className="text-18px"
            icon="ph:sign-in-bold"
          />
        }
        loading={loading}
        type="primary"
      >
        {t('page.login.enterprise.login')}
      </AButton>

      <AButton
        variant="link"
        block
        color="primary"
        className="mt-12px"
        onClick={onSwitchMode}
      >
        {switchModeLabel}
      </AButton>

      <SocialLogin />
    </>
  );
};

export default LoginActions;
