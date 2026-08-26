import { cn } from '@skyroc/utils';
import { textareaVariants } from './textarea-variants';
import type { TextareaRootProps } from './types';

const TextareaRoot = (props: TextareaRootProps) => {
  const { className, size, ...rest } = props;

  const { root } = textareaVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <div
      {...rest}
      className={mergedCls}
      data-size={size}
      data-slot="textarea-root"
    />
  );
};

export default TextareaRoot;
