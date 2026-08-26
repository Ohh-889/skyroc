import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-avatar';
import { cn } from '@skyroc/utils';
import { avatarVariants } from './avatar-variants';
import type { AvatarRootProps } from './types';

const AvatarRoot = forwardRef<ComponentRef<typeof Root>, AvatarRootProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { root } = avatarVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <Root
      className={mergedCls}
      data-slot="avatar-root"
      ref={ref}
      {...rest}
    />
  );
});

AvatarRoot.displayName = Root.displayName;

export default AvatarRoot;
