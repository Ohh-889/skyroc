'use client';

import { Card } from '@skyroc/web-ui';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
const RowVirtualizerDynamic = dynamic(() => import('./VirtualListDynamic'), {
  ssr: false
});

const LazyModules = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Card
        split
        title="虚拟列表"
      >
        <RowVirtualizerDynamic />
      </Card>
    </Suspense>
  );
};

export default LazyModules;
