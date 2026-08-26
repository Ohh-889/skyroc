import { Root, Trigger } from '@radix-ui/react-dropdown-menu';
import DropdownMenuCheckboxGroup from './DropdownMenuCheckboxGroup';
import DropdownMenuContent from './DropdownMenuContent';
import type { DropdownMenuCheckboxProps } from './types';

const DropdownMenuCheckbox = (props: DropdownMenuCheckboxProps) => {
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
        <DropdownMenuCheckboxGroup
          classNames={classNames}
          size={size}
          {...rest}
        />
      </DropdownMenuContent>
    </Root>
  );
};

export default DropdownMenuCheckbox;
