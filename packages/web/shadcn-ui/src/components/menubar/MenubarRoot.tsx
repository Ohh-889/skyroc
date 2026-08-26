import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-menubar';
import { cn } from '@skyroc/utils';
import { menubarVariants } from './menubar-variansts';
import type { MenubarRootProps } from './types';

const MenubarRoot = forwardRef<ComponentRef<typeof Root>, MenubarRootProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { root } = menubarVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <Root
      className={mergedCls}
      ref={ref}
      {...rest}
    />
  );
});

MenubarRoot.displayName = 'MenubarRoot';

export default MenubarRoot;
