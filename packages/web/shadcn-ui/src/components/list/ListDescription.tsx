import { cn } from '@skyroc/utils';
import { listVariants } from './list-variants';
import type { ListDescriptionProps } from './types';

export const ListDescription = (props: ListDescriptionProps) => {
  const { children, className, size, ...rest } = props;

  const { description } = listVariants({ size });

  return (
    <p
      className={cn(description(), className)}
      data-slot="list-description"
      {...rest}
    >
      {children}
    </p>
  );
}
;

ListDescription.displayName = 'ListDescription';
