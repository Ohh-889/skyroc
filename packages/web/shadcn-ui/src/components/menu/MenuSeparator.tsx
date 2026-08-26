import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Separator as _Separator } from '@radix-ui/react-menu';
import { cn } from '@skyroc/utils';
import { menuVariants } from './menu-variants';
import type { MenuSeparatorProps } from './types';

const MenuSeparator = forwardRef<ComponentRef<typeof _Separator>, MenuSeparatorProps>((props, ref) => {
  const { className, component: Separator = _Separator, size, ...rest } = props;

  const { separator } = menuVariants({ size });

  const mergedCls = cn(separator(), className);

  return (
    <Separator
      className={mergedCls}
      ref={ref}
      {...rest}
    />
  );
});

MenuSeparator.displayName = 'MenuSeparator';

export default MenuSeparator;
