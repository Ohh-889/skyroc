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

  return (
    <>
      <ADivider className="!my-15px !text-12px !text-tertiary ">{t('page.login.enterprise.otherLogin')}</ADivider>

      <div className="grid grid-cols-2 gap-12px lt-md:grid-cols-1">
        <AButton
          className="h-40px rounded-6px border-border bg-container text-13px text-base hover:border-primary hover:bg-primary-bg"
          icon={
            <SvgIcon
              className="text-18px !text-#09bb07"
              icon="simple-icons:wechat"
            />
          }
          onClick={() => handleSocialLogin('wechat')}
        >
          {t('page.login.enterprise.socialWechat')}
        </AButton>
        <AButton
          className="h-40px rounded-6px border-border bg-container text-13px text-base hover:border-primary hover:bg-primary-bg"
          icon={
            <SvgIcon
              className="text-18px !text-#3468ff"
              icon="icon-park-outline:new-lark"
            />
          }
          onClick={() => handleSocialLogin('feishu')}
        >
          {t('page.login.enterprise.socialFeishu')}
        </AButton>
      </div>

      <p className="mb-0 mt-15px flex-center gap-7px text-center text-11px text-tertiary leading-18px lt-md:mt-26px">
        <SvgIcon
          className="shrink-0 text-14px"
          icon="ph:info"
        />
        <span>{t('page.login.enterprise.adminHint')}</span>
      </p>
    </>
  );
};

export default SocialLogin;
