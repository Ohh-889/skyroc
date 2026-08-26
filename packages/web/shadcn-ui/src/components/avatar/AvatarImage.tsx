import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Image } from '@radix-ui/react-avatar';
import { cn } from '@skyroc/utils';
import { avatarVariants } from './avatar-variants';
import type { AvatarImageProps } from './types';

const AvatarImage = forwardRef<ComponentRef<typeof Image>, AvatarImageProps>((props, ref) => {
  const { className, ...rest } = props;

  const { image } = avatarVariants();

  const mergedCls = cn(image(), className);

  return (
    <Image
      className={mergedCls}
      data-slot="avatar-image"
      ref={ref}
      {...rest}
    />
  );
});

AvatarImage.displayName = Image.displayName;

export default AvatarImage;
