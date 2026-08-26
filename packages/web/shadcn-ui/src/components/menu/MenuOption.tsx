import { Sub } from '@radix-ui/react-dropdown-menu';
import MenuItem from '../menu/MenuItem';
import MenuLabel from './MenuLabel';
import MenuSeparator from './MenuSeparator';
import MenuSubContent from './MenuSubContent';
import MenuSubTrigger from './MenuSubTrigger';
import { isLabel, isSeparator, isSub } from './shared';
import type { MenuOptionProps } from './types';

const MenuOption = (props: MenuOptionProps) => {
  const {
    classNames,
    component: Component = MenuItem,
    item,
    labelComponent: LabelComponent = MenuLabel,
    separatorComponent: SeparatorComponent = MenuSeparator,
    size,
    subComponent: SubComponent = Sub,
    subContentComponent: SubContentComponent = MenuSubContent,
    subTriggerComponent: SubTriggerComponent = MenuSubTrigger
  } = props;

  if (isSeparator(item)) {
    return (
      <SeparatorComponent
        {...item}
        className={classNames?.separator}
        size={size}
      />
    );
  }

  if (isLabel(item)) {
    return (
      <LabelComponent
        classNames={classNames}
        size={size}
        {...item}
      >
        {item.label}
      </LabelComponent>
    );
  }

  if (isSub(item)) {
    const { label, subContentProps, subProps, ...subTriggerProps } = item;
    return (
      <SubComponent {...subProps}>
        <SubTriggerComponent {...subTriggerProps}>{label}</SubTriggerComponent>

        <SubContentComponent
          {...subContentProps}
          className={classNames?.subContent}
          size={size}
        >
          {item.children.map((child, index) => {
            return (
              <MenuOption
                classNames={classNames}
                component={Component}
                item={child}
                key={String(index)}
                labelComponent={LabelComponent}
                separatorComponent={SeparatorComponent}
                size={size}
                subComponent={SubComponent}
                subContentComponent={SubContentComponent}
                subTriggerComponent={SubTriggerComponent}
              />
            );
          })}
        </SubContentComponent>
      </SubComponent>
    );
  }

  return (
    <Component
      classNames={classNames}
      size={size}
      {...item}
    >
      {item.label}
    </Component>
  );
};

MenuOption.displayName = 'MenuOption';

export default MenuOption;
