import { cn } from '@skyroc/utils';
import { listVariants } from './list-variants';
import type { ListItemProps } from './types';

export const ListItem = (props: ListItemProps) => {
  const { children, className, size, ...rest } = props;

  const { item } = listVariants({ size });

  return (
    <li
      className={cn(item(), className)}
      data-slot="list-item"
      {...rest}
    >
      {children}
    </li>
  );
}
;

ListItem.displayName = 'ListItem';
