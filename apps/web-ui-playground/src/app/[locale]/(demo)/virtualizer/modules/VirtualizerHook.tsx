'use client';

import type { VirtualizerList } from '@skyroc/web-ui';
import { Button, Card, VirtualList } from '@skyroc/web-ui';
import { useRef } from 'react';

interface ListItem {
  id: number;
  name: string;
}

const data: ListItem[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`
}));

const VirtualizerHook = () => {
  const parentRef = useRef<VirtualizerList>(null);

  function scrollToIndex(index: number, { align = 'start' }: { align?: 'center' | 'end' | 'start' }) {
    parentRef.current?.scrollToIndex(index, { align });
  }

  return (
    <Card
      split
      title="使用 Hook"
    >
      <p className="text-muted-foreground mb-4 text-sm">直接使用 useVirtualizer hook，获得更多控制能力</p>

      <div className="mb-4 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => scrollToIndex(0, { align: 'start' })}
        >
          滚动到顶部
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => scrollToIndex(4999, { align: 'center' })}
        >
          滚动到中间 (5000)
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => scrollToIndex(9999, { align: 'end' })}
        >
          滚动到底部
        </Button>
      </div>

      <VirtualList
        data={data}
        height={300}
        itemSize={40}
        ref={parentRef}
        width={300}
        renderItem={({ index, item }) => (
          <div className="hover:bg-accent absolute top-0 left-0 flex w-full items-center border-b px-4 transition-colors">
            <span className="text-muted-foreground font-mono text-xs">{String(index + 1).padStart(5, '0')}</span>
            <span className="ml-4">{item.name}</span>
          </div>
        )}
      />
    </Card>
  );
};

export default VirtualizerHook;
