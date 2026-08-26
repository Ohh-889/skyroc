import { cn } from '@skyroc/utils';
import { textareaVariants } from './textarea-variants';
import type { TextareaCountProps } from './types';

const TextareaCount = (props: TextareaCountProps) => {
  const { children, className, countGraphemes, maxLength, size, value, ...rest } = props;

  const { count } = textareaVariants({ size });

  const mergedCls = cn(count(), className);

  const getCount = () => {
    if (!value) {
      return 0;
    }

    return countGraphemes?.(value) || String(value).length;
  };

  const countWithMaxLength = () => {
    const _count = getCount();
    if (maxLength) {
      return `${_count} / ${maxLength}`;
    }

    return String(_count);
  };

  const text = countWithMaxLength();

  return (
    <div
      {...rest}
      className={mergedCls}
      data-size={size}
      data-slot="textarea-count"
    >
      {children?.(text) || text}
    </div>
  );
};

export default TextareaCount;
