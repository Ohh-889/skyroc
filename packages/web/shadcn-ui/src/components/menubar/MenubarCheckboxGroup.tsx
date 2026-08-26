import { Group } from '@radix-ui/react-menubar';
import MenuCheckboxGroup from '../menu/MenuCheckboxGroup';
import MenubarCheckboxItem from './MenubarCheckboxItem';
import MenubarLabel from './MenubarLabel';
import MenubarSeparator from './MenubarSeparator';
import type { MenubarCheckboxGroupProps } from './types';

const MenubarCheckboxGroup = (props: MenubarCheckboxGroupProps) => {
  return (
    <MenuCheckboxGroup
      component={MenubarCheckboxItem}
      groupComponent={Group}
      labelComponent={MenubarLabel}
      separatorComponent={MenubarSeparator}
      {...props}
    />
  );
};

MenubarCheckboxGroup.displayName = 'MenubarCheckboxGroup';

export default MenubarCheckboxGroup;
