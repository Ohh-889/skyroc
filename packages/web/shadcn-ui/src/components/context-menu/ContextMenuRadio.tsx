import { Root, Trigger } from '@radix-ui/react-context-menu';
import ContextMenuContent from './ContextMenuContent';
import ContextMenuRadioGroup from './ContextMenuRadioGroup';
import type { ContextMenuRadioProps } from './types';

const ContextMenuRadio = (props: ContextMenuRadioProps) => {
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
        <ContextMenuRadioGroup
          classNames={classNames}
          size={size}
          {...rest}
        />
      </ContextMenuContent>
    </Root>
  );
};

export default ContextMenuRadio;
