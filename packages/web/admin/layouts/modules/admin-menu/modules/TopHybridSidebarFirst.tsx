import { GLOBAL_SIDER_MENU_SELECTOR, LAYOUT_MODE_HORIZONTAL } from '../../../constant';

import FirstLevelMenu from '../components/FirstLevelMenu';
import { HorizontalMenuMode } from '../enum';
import MenuPortal from '../components/MenuPortal';

import Horizontal from './Horizontal';

const HorizontalMix = () => {
  return [
    <Horizontal key={LAYOUT_MODE_HORIZONTAL} mode={HorizontalMenuMode.Child} />,
    <MenuPortal container={GLOBAL_SIDER_MENU_SELECTOR} key="first-level-menu">
      <FirstLevelMenu key="first-level-menu" />
    </MenuPortal>
  ];
};

export default HorizontalMix;
