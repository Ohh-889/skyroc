import { LangSwitch } from '@skyroc/web-admin-i18n';
import { ThemeSchemaSwitch, useSettingsTheme } from '@skyroc/web-admin-theme';

interface LoginHeaderProps {
  /** 当前登录方式的说明文字 */
  subtitle: string;
  /** 当前登录方式的标题 */
  title: string;
}

const LoginHeader = (props: LoginHeaderProps) => {
  const { subtitle, title } = props;

  const { t } = useTranslation();
  const { header } = useSettingsTheme();

  return (
    <header className="relative mb-28px min-h-58px text-center lt-md:mb-34px lt-md:text-left">
      <div className="absolute right--5 top-0 flex-y-center gap-6px">
        <ThemeSchemaSwitch
          className="size-30px border border-border-secondary bg-layout text-base hover:border-primary hover:bg-primary-bg"
          tooltipContent={t('icon.themeSchema')}
          tooltipPlacement="bottom"
        />
        <LangSwitch
          className="size-30px border border-border-secondary  bg-layout text-base hover:border-primary hover:bg-primary-bg"
          visible={header.multilingual.visible}
        />
      </div>

      <h1 className="m-0 px-68px text-27px text-heading font-650 leading-36px tracking-[-0.4px] lt-md:px-0 lt-md:pr-76px lt-md:text-24px">
        {title}
      </h1>
      <p className="mb-0 mt-5px text-13px text-secondary leading-20px">{subtitle}</p>
    </header>
  );
};

export default LoginHeader;
