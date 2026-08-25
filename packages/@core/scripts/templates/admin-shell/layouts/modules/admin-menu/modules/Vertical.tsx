import { GLOBAL_SIDER_MENU_SELECTOR } from '../../../constant';

import MenuPortal from '../components/MenuPortal';
import VerticalMenu from '../components/VerticalMenu';

const Vertical = () => {
  return (
    <MenuPortal container={GLOBAL_SIDER_MENU_SELECTOR}>
      <VerticalMenu />
    </MenuPortal>
  );
};

export default Vertical;
