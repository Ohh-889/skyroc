'use client';

import { Card, Pagination } from '@skyroc/web-ui';
import { useState } from 'react';

const Controlled = () => {
  const [page, setPage] = useState(5);

  return (
    <Card
      split
      title="Controlled"
    >
      <div className="flex flex-col gap-4">
        <span className="text-muted-foreground text-sm">
          Current Page: <strong className="text-foreground">{page}</strong>
        </span>

        <Pagination
          showEdges
          itemsPerPage={10}
          page={page}
          siblingCount={1}
          total={200}
          onPageChange={setPage}
        />
      </div>
    </Card>
  );
};

export default Controlled;
