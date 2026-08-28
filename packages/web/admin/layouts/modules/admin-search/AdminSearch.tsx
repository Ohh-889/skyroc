import { useSettingsTheme } from '@shell/theme';
import { ButtonIcon } from '@shell/ui/antd';
import { SvgIcon } from '@shell/ui/compose';
import { useBoolean } from 'ahooks';
import { Suspense, lazy, memo } from 'react';
import { useTranslation } from 'react-i18next';

const SearchModal = lazy(() => import('./components/SearchModal'));

const GlobalSearch = memo(() => {
  const { t } = useTranslation();

  const [show, { setFalse, toggle }] = useBoolean();

  const {
    header: {
      globalSearch: { visible }
    }
  } = useSettingsTheme();

  if (!visible) return null;

  return (
    <>
      <ButtonIcon
        className="px-12px"
        hoverAnimation="scale"
        tooltipContent={t('common.search')}
        onClick={toggle}
      >
        <SvgIcon icon="uil:search" />
      </ButtonIcon>

      <Suspense>
        <SearchModal
          show={show}
          onClose={setFalse}
        />
      </Suspense>
    </>
  );
});

export default GlobalSearch;
