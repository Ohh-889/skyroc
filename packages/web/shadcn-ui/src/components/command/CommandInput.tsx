import { CommandInput as _CommandInput } from 'cmdk';
import { cn } from '@skyroc/utils';
import { Icon } from '../icon';
import { commandVariants } from './command-variants';
import type { CommandInputProps } from './types';

const CommandInput = (props: CommandInputProps) => {
  const { className, classNames, leading, size, trailing, ...rest } = props;

  const { input, inputIcon, inputWrapper } = commandVariants({ size });

  const mergedClass = cn(input(), className || classNames?.input);
  const mergedIconClass = cn(inputIcon(), classNames?.inputIcon);
  const mergedWrapperClass = cn(inputWrapper(), classNames?.inputWrapper);

  return (
    <div className={mergedWrapperClass}>
      {leading || (
        <Icon
          className={mergedIconClass}
          icon="lucide:search"
        />
      )}

      <_CommandInput
        className={mergedClass}
        data-slot="command-input"
        {...rest}
      />

      {trailing}
    </div>
  );
};

export default CommandInput;
