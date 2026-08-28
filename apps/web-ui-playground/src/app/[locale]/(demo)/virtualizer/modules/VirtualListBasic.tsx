'use client';

import { Card, VirtualList } from '@skyroc/web-ui';

interface ListItem {
  id: number;
  name: string;
}

const data: ListItem[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`
}));

const VirtualListBasic = () => {
  return (
    <Card
      split
      title="基础虚拟列表"
    >
      <p className="text-muted-foreground mb-4 text-sm">渲染 10,000 条数据，只有可见项会被渲染到 DOM 中</p>

      <div className="flex  gap-4 max-md:flex-col">
        <VirtualList
          data={data}
          height={300}
          itemSize={40}
          width={300}
          classNames={{
            root: 'border rounded-lg'
          }}
          renderItem={({ index, item }) => (
            <div
              className="hover:bg-accent flex items-center border-b px-4 transition-colors"
              key={item.id}
            >
              <span className="text-muted-foreground font-mono text-xs">{String(index + 1).padStart(5, '0')}</span>
              <span className="ml-4">{item.name}</span>
            </div>
          )}
        />

        <VirtualList
          horizontal
          data={data}
          height={60}
          itemSize={120}
          width={375}
          classNames={{
            root: 'border rounded-lg'
          }}
          renderItem={({ item }) => (
            <div
              className="hover:bg-accent border-r px-2 py-1 transition-colors"
              key={item.id}
            >
              <span className="ml-4">{item.name}</span>
            </div>
          )}
        />
      </div>
    </Card>
  );
};

export default VirtualListBasic;
