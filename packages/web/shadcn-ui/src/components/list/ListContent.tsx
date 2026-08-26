import { cn } from '@skyroc/utils';
import { listVariants } from './list-variants';
import type { ListContentProps } from './types';

export const ListContent = (props: ListContentProps) => {
  const { children, className, size, ...rest } = props;

  const { content } = listVariants({ size });

  return (
    <div
      className={cn(content(), className)}
      data-slot="list-content"
      {...rest}
    >
      {children}
    </div>
  );
}
;
