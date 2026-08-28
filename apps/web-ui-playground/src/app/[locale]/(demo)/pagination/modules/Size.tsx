'use client';

import type { PaginationProps } from '@skyroc/web-ui';
import { Card, Pagination } from '@skyroc/web-ui';

const sizes: PaginationProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const Size = () => {
  return (
    <Card
      split
      title="Size"
    >
      <div className="flex flex-col gap-4">
        {sizes.map(size => (
          <div
            className="flex flex-col gap-2"
            key={size}
          >
            <span className="text-muted-foreground text-sm">{size}</span>
            <Pagination
              itemsPerPage={10}
              showEdges
              siblingCount={1}
              size={size}
              total={200}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Size;
