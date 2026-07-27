import { SvgIcon } from '@skyroc/web-ui-compose';


type SocialProvider = 'feishu' | 'wechat';

const SocialLogin = () => {

  const { t } = useTranslation();

  function handleSocialLogin(provider: SocialProvider) {
    const authorizationUrl =
      provider === 'wechat' ? import.meta.env.VITE_AUTH_WECHAT_URL : import.meta.env.VITE_AUTH_FEISHU_URL;

    if (!authorizationUrl) {
      showInfoMessage(t('page.login.enterprise.notConfigured'));
      return;
    }

    window.location.assign(authorizationUrl);
  }

  return <>
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
  </>
}

export default SocialLogin
