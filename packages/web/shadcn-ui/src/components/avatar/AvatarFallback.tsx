import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Fallback } from '@radix-ui/react-avatar';
import { cn } from '@skyroc/utils';
import { avatarVariants } from './avatar-variants';
import type { AvatarFallbackProps } from './types';

const AvatarFallback = forwardRef<ComponentRef<typeof Fallback>, AvatarFallbackProps>((props, ref) => {
  const { className, ...rest } = props;

  const { fallback } = avatarVariants();

  const mergedCls = cn(fallback(), className);

  return (
    <Fallback
      className={mergedCls}
      data-slot="avatar-fallback"
      ref={ref}
      {...rest}
    />
  );
});

AvatarFallback.displayName = Fallback.displayName;

export default AvatarFallback;
