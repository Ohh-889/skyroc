import { useSettingsTheme } from '@shell/theme';
import type { TooltipProps } from 'antd';
import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  LAYOUT_MODE_HORIZONTAL,
  LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST,
  LAYOUT_MODE_VERTICAL,
  LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_VERTICAL_MIX,
  VERTICAL_LAYOUT_MODES
} from '../../../constant';
import { themeLayoutModeRecord } from '../../../options';
import { useAdminState } from '../../../state/use-admin-state';

type LayoutConfig = Record<
  UnionKey.ThemeLayoutMode,
  {
    mainClass: string;
    menuClass: string;
    placement: TooltipProps['placement'];
  }
>;

type Props = Record<UnionKey.ThemeLayoutMode, React.ReactNode>;

const LAYOUT_CONFIG: LayoutConfig = {
  [LAYOUT_MODE_VERTICAL]: {
    placement: 'bottom',
    menuClass: 'w-1/3 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  [LAYOUT_MODE_VERTICAL_MIX]: {
    placement: 'bottom',
    menuClass: 'w-1/4 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  [LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST]: {
    placement: 'bottom',
    menuClass: 'w-1/4 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  [LAYOUT_MODE_HORIZONTAL]: {
    placement: 'bottom',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-full h-3/4'
  },
  [LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST]: {
    placement: 'bottom',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-2/3 h-3/4'
  },
  [LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST]: {
    placement: 'bottom',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-2/3 h-3/4'
  }
};

const LayoutModeCard = (props: Props) => {
  const { ...rest } = props;

  const { t } = useTranslation();

  const { isMobile } = useAdminState();

  const {
    layout: { mode },
    setThemeLayout
  } = useSettingsTheme();

  function handleChangeMode(modeType: UnionKey.ThemeLayoutMode) {
    if (isMobile) return;

    setThemeLayout(modeType);
  }

  return (
    <div className="grid grid-cols-2 gap-x-12px gap-y-12px md:grid-cols-3">
      {Object.entries(LAYOUT_CONFIG).map(([key, item]) => {
        const layoutMode = key as UnionKey.ThemeLayoutMode;
        const isVerticalLayout = VERTICAL_LAYOUT_MODES.includes(layoutMode);

        return (
          <div className="flex-col-center cursor-pointer" key={key} onClick={() => handleChangeMode(layoutMode)}>
            <Tooltip placement={item.placement} title={t(`theme.layout.layoutMode.${key}_detail`)}>
              <div
                className={clsx(
                  'h-64px w-96px gap-6px rd-4px p-6px shadow ring-2 ring-transparent transition-all hover:ring-primary',
                  mode === layoutMode && '!ring-primary'
                )}
              >
                <div className={clsx('h-full w-full gap-1', isVerticalLayout ? 'flex' : 'flex-col')}>
                  {rest[layoutMode]}
                </div>
              </div>
            </Tooltip>

            <p className="mt-8px text-12px">{t(themeLayoutModeRecord[layoutMode])}</p>
          </div>
        );
      })}
    </div>
  );
};

export default LayoutModeCard;
