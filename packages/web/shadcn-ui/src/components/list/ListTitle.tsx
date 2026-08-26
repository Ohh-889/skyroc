import { cn } from '@skyroc/utils';
import { listVariants } from './list-variants';
import type { ListTitleProps } from './types';

export const ListTitle = (props: ListTitleProps) => {
  const { children, className, size, ...rest } = props;

  const { title } = listVariants({ size });

  return (
    <h3
      className={cn(title(), className)}
      data-slot="list-title"
      {...rest}
    >
      {children}
    </h3>
  );
};
