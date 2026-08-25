import { useSettingsTheme } from '@shell/theme';
import { memo } from 'react';

import {
  LAYOUT_MODE_HORIZONTAL,
  LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_VERTICAL,
  LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_VERTICAL_MIX
} from '../../constant';

import HorizontalMenu from './modules/Horizontal';
import TopHybridHeaderFirst from './modules/TopHybridHeaderFirst';
import TopHybridSidebarFirst from './modules/TopHybridSidebarFirst';
import VerticalMenu from './modules/Vertical';
import VerticalHybridHeaderFirst from './modules/VerticalHybridHeaderFirst';
import VerticalMix from './modules/VerticalMix';

const AdminMenu = memo(() => {
  const {
    layout: { mode }
  } = useSettingsTheme();

  if (mode === LAYOUT_MODE_HORIZONTAL) return <HorizontalMenu />;

  if (mode === LAYOUT_MODE_VERTICAL) return <VerticalMenu />;

  if (mode === LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST) return <TopHybridHeaderFirst />;

  if (mode === LAYOUT_MODE_VERTICAL_MIX) return <VerticalMix />;

  if (mode === LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST) return <VerticalHybridHeaderFirst />;

  return <TopHybridSidebarFirst />;
});

export default AdminMenu;
