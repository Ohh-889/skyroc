import { GLOBAL_HEADER_MENU_SELECTOR } from '../../../constant';

import HorizontalMenu from '../components/HorizontalMenu';
import MenuPortal from '../components/MenuPortal';
import { HorizontalMenuMode } from '../enum';

interface Props {
  /** 水平菜单显示模式 */
  readonly mode?: HorizontalMenuMode;
}

const Horizontal = (props: Props) => {
  const { mode = HorizontalMenuMode.All } = props;

  return (
    <MenuPortal container={GLOBAL_HEADER_MENU_SELECTOR}>
      <HorizontalMenu mode={mode} />
    </MenuPortal>
  );
};

export default Horizontal;
