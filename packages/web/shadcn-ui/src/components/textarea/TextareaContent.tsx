import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { textareaVariants } from './textarea-variants';
import type { TextareaContentProps } from './types';

const TextareaContent = forwardRef<HTMLTextAreaElement, TextareaContentProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { content } = textareaVariants({ size });

  const mergedCls = cn(content(), className);

  return (
    <textarea
      className={mergedCls}
      data-size={size}
      data-slot="textarea"
      ref={ref}
      {...rest}
    />
  );
});

TextareaContent.displayName = 'TextareaContent';

export default TextareaContent;
