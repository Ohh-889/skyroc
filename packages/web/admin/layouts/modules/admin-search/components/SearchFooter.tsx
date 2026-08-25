import { SvgIcon } from '@shell/ui/compose';
import { Divider as ADivider } from 'antd';
import { clsx } from 'clsx';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const operateIconClass = 'mr-6px p-2px text-20px';

const operateIconStyle = {
  boxShadow: 'inset 0 -2px #cdcde6, inset 0 0 1px 1px #fff, 0 1px 2px 1px #1e235a66'
};

const SearchFooter = () => {
  const { t } = useTranslation();

  return (
    <>
      <ADivider className="my-2px" />
      <div className="h-44px flex-center gap-14px">
        <span className="flex-y-center">
          <SvgIcon className={clsx(operateIconClass)} icon="mdi:keyboard-return" style={operateIconStyle} />
          <span>{t('common.confirm')}</span>
        </span>
        <span className="flex-y-center">
          <SvgIcon className={clsx(operateIconClass)} icon="mdi:arrow-up-thin" style={operateIconStyle} />
          <SvgIcon className={clsx(operateIconClass)} icon="mdi:arrow-down-thin" style={operateIconStyle} />
          <span>{t('common.switch')}</span>
        </span>
        <span className="flex-y-center">
          <SvgIcon className={clsx(operateIconClass)} icon="mdi:keyboard-esc" style={operateIconStyle} />
          <span>{t('common.close')}</span>
        </span>
      </div>
    </>
  );
};

export default memo(SearchFooter);
