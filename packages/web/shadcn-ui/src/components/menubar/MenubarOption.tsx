import { Sub } from '@radix-ui/react-menubar';
import MenuOption from '../menu/MenuOption';
import MenubarItem from './MenubarItem';
import MenubarLabel from './MenubarLabel';
import MenubarSeparator from './MenubarSeparator';
import MenubarSubContent from './MenubarSubContent';
import MenubarSubTrigger from './MenubarSubTrigger';
import type { MenubarOptionProps } from './types';

const MenubarOption = (props: MenubarOptionProps) => {
  return (
    <MenuOption
      {...props}
      component={MenubarItem}
      labelComponent={MenubarLabel}
      separatorComponent={MenubarSeparator}
      subComponent={Sub}
      subContentComponent={MenubarSubContent}
      subTriggerComponent={MenubarSubTrigger}
    />
  );
};

MenubarOption.displayName = 'MenubarOption';

export default MenubarOption;
