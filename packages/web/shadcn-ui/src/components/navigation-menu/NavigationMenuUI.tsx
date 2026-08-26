'use client';

import NavigationMenuChildLink from './NavigationMenuChildLink';
import NavigationMenuChildList from './NavigationMenuChildList';
import NavigationMenuChildListItem from './NavigationMenuChildListItem';
import NavigationMenuContent from './NavigationMenuContent';
import NavigationMenuIndicator from './NavigationMenuIndicator';
import NavigationMenuItem from './NavigationMenuItem';
import NavigationMenuLink from './NavigationMenuLink';
import NavigationMenuList from './NavigationMenuList';
import NavigationMenuRoot from './NavigationMenuRoot';
import NavigationMenuTrigger from './NavigationMenuTrigger';
import NavigationMenuViewport from './NavigationMenuViewport';
import type { NavigationMenuItemChildOption, NavigationMenuItemOption, NavigationMenuLinkBaseOption, NavigationMenuProps, NavigationMenuTriggerProps } from './types';

function isLink(item: NavigationMenuItemOption): item is NavigationMenuLinkBaseOption {
  return item.type === 'link' || !item.children;
}

function getItem(itemOption: NavigationMenuItemOption): [NavigationMenuItemOption, NavigationMenuItemChildOption[]] {
  if (isLink(itemOption)) {
    return [itemOption, []];
  }

  const { children = [], ...item } = itemOption;

  return [item, children];
}

const NavigationMenuUI = (props: NavigationMenuProps) => {
  const { childLinkProps, childListItemProps, childListProps, classNames, contentProps, itemProps, items, linkProps, listProps, showArrow: _showArrow, size, triggerProps, ...rest } = props;

  return (
    <NavigationMenuRoot
      {...rest}
    >
      <NavigationMenuList
        className={classNames?.list}
        size={size}
        {...listProps}
      >
        {items.map((itemOption, index) => {
          const itemKey = String(index);

          const [item, children] = getItem(itemOption);

          return (
            <NavigationMenuItem
              className={classNames?.item}
              key={itemKey}
              {...itemProps}
            >
              {isLink(itemOption)
                ? (
                  <NavigationMenuLink
                    classNames={classNames}
                    size={size}
                    {...linkProps}
                    {...item as Omit<NavigationMenuLinkBaseOption, 'children'>}
                  >
                    {item.label}
                  </NavigationMenuLink>
                )
                : (
                  <>
                    <NavigationMenuTrigger
                      classNames={classNames}
                      size={size}
                      {...triggerProps}
                      {...item as Omit<NavigationMenuTriggerProps, 'children'>}
                    >
                      {item.label}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent
                      className={classNames?.content}
                      {...contentProps}
                    >
                      <NavigationMenuChildList
                        className={classNames?.subList}
                        size={size}
                        {...childListProps}
                      >
                        {children && children.length > 0
                          ? children.map((child, childIndex) => {
                            // Child items should be link type
                            const childItem = child;

                            return (
                              <NavigationMenuChildListItem
                                className={classNames?.subItem}
                                key={String(childIndex)}
                                {...childListItemProps}
                              >
                                <NavigationMenuChildLink
                                  classNames={classNames}
                                  size={size}
                                  {...childLinkProps}
                                  {...childItem}
                                >
                                  {childItem.label}
                                </NavigationMenuChildLink>
                              </NavigationMenuChildListItem>
                            );
                          })
                          : null}
                      </NavigationMenuChildList>
                    </NavigationMenuContent>
                  </>
                )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>

      <NavigationMenuIndicator
        classNames={classNames}
        size={size}
      />

      <NavigationMenuViewport
        classNames={classNames}
        size={size}
      />

    </NavigationMenuRoot>
  );
};

NavigationMenuUI.displayName = 'NavigationMenuUI';

export default NavigationMenuUI;