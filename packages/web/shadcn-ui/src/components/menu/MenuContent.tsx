import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content as _Content, Portal as _Portal } from '@radix-ui/react-menu';
import { cn } from '@skyroc/utils';
import MenuArrow from './MenuArrow';
import { menuVariants } from './menu-variants';
import type { MenuContentProps } from './types';

const MenuContent = forwardRef<ComponentRef<typeof _Content>, MenuContentProps>((props, ref) => {
  const {
    arrowClass,
    arrowComponent: Arrow,
    children,
    className,
    component: Content = _Content,
    portalComponent: Portal = _Portal,
    showArrow,
    size,
    ...rest
  } = props;

  const { content } = menuVariants({ size });

  const mergedCls = cn(content(), className);

  return (
    <Portal>
      <Content
        className={mergedCls}
        ref={ref}
        {...rest}
      >
        {children}

        {showArrow
          ? (
            <MenuArrow
              className={arrowClass}
              component={Arrow}
            />
          )
          : null}
      </Content>
    </Portal>
  );
});

MenuContent.displayName = 'MenuContent';

export default MenuContent;
