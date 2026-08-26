import { Root, Trigger } from '@radix-ui/react-dropdown-menu';
import DropdownMenuContent from './DropdownMenuContent';
import DropdownMenuRadioGroup from './DropdownMenuRadioGroup';
import type { DropdownMenuRadioProps } from './types';

const DropdownMenuRadio = (props: DropdownMenuRadioProps) => {
  const { children, className, classNames, contentProps, defaultOpen, dir, modal, onOpenChange, open, size, ...rest }
    = props;

  return (
    <Root
      defaultOpen={defaultOpen}
      dir={dir}
      modal={modal}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Trigger asChild>{children}</Trigger>

      <DropdownMenuContent
        arrowClass={classNames?.arrow}
        className={className || classNames?.content}
        size={size}
        {...contentProps}
      >
        <DropdownMenuRadioGroup
          classNames={classNames}
          size={size}
          {...rest}
        />
      </DropdownMenuContent>
    </Root>
  );
};

export default DropdownMenuRadio;
