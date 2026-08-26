import { forwardRef } from 'react';
import { Icon } from '../icon';
import Button from './ButtonUI';
import type { ButtonIconProps } from './types';

const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>((props, ref) => {
  const {
    children,
    color = 'accent',
    fitContent = true,
    icon,
    iconProps,
    shape = 'square',
    variant = 'ghost',
    ...rest
  } = props;

  return (
    <Button
      color={color}
      fitContent={fitContent}
      ref={ref}
      shape={shape}
      variant={variant}
      {...rest}
    >
      {children || (
        <Icon
          icon={String(icon)}
          {...iconProps}
        />
      )}
    </Button>
  );
});

ButtonIcon.displayName = 'ButtonIcon';

export default ButtonIcon;
