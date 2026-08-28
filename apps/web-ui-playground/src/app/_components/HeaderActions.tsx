'use client';

import { ButtonIcon, Icon, Popover, Tooltip } from '@skyroc/web-ui';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../../components/LocaleSwitcher';
import ThemeCustomize from '../../components/ThemeCustomize';
import ThemeSchemaToggler from '../../components/ThemeSchemaToggler';
import config from '../../config';

const HeaderActions = () => {
  const t = useTranslations('header');

  return (
    <div className="flex items-center gap-1">
      <Tooltip content={t('docs')}>
        <ButtonIcon
          asChild
          aria-label={t('docsAriaLabel')}
          size="lg"
          variant="ghost"
        >
          <a
            href="https://docs.skyroc-ui.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon icon="lucide:book-open" />
          </a>
        </ButtonIcon>
      </Tooltip>

      <Popover
        align="end"
        classNames={{ content: 'z-15' }}
        side="bottom"
        trigger={
          <ButtonIcon
            aria-label={t('customizeTheme')}
            icon="lucide:palette"
            size="lg"
            variant="ghost"
          />
        }
      >
        <ThemeCustomize />
      </Popover>

      <Tooltip content={t('github')}>
        <ButtonIcon
          asChild
          aria-label={t('githubAriaLabel')}
          size="lg"
          variant="ghost"
        >
          <a
            href={config.githubUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon icon="lucide:github" />
          </a>
        </ButtonIcon>
      </Tooltip>

      <div className="bg-border mx-1 h-5 w-px" />
      <LocaleSwitcher />
      <ThemeSchemaToggler />
    </div>
  );
};

export default HeaderActions;
