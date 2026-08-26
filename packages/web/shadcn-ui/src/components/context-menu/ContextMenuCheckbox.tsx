import { Root, Trigger } from '@radix-ui/react-context-menu';
import ContextMenuCheckboxGroup from './ContextMenuCheckboxGroup';
import ContextMenuContent from './ContextMenuContent';
import type { ContextMenuCheckboxProps } from './types';

const ContextMenuCheckbox = (props: ContextMenuCheckboxProps) => {
  const { children, className, classNames, contentProps, dir, modal, onOpenChange, size, ...rest } = props;

  return (
    <Root
      dir={dir}
      modal={modal}
      onOpenChange={onOpenChange}
    >
      <Trigger asChild>{children}</Trigger>

      <ContextMenuContent
        arrowClass={classNames?.arrow}
        className={className || classNames?.content}
        size={size}
        {...contentProps}
      >
        <ContextMenuCheckboxGroup
          classNames={classNames}
          size={size}
          {...rest}
        />
      </ContextMenuContent>
    </Root>
  );
};

export default ContextMenuCheckbox;
