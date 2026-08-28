'use client';

import type { TreeItemData } from '@skyroc/web-ui';
import { Card, Icon, TreeVirtualizer } from '@skyroc/web-ui';
import { useState } from 'react';

interface DemoTreeItem extends TreeItemData {
  /** Nested children with the same demo-specific metadata. */
  children?: DemoTreeItem[];
  /** Icon name used by the custom item renderer. */
  icon?: string;
  /** Text label for the tree item. */
  label: string;
}

function generateLargeTreeData(count: number = 40): DemoTreeItem[] {
  const items: DemoTreeItem[] = [];

  for (let index = 0; index < count; index += 1) {
    items.push({
      value: `folder-${index}`,
      label: `Folder ${index + 1}`,
      icon: 'lucide:folder',
      children: [
        { value: `folder-${index}-overview`, label: 'Overview.md', icon: 'lucide:file-text' },
        { value: `folder-${index}-config`, label: 'Config.ts', icon: 'lucide:file-code' },
        {
          value: `folder-${index}-assets`,
          label: 'Assets',
          icon: 'lucide:folder',
          children: [
            { value: `folder-${index}-assets-logo`, label: 'Logo.svg', icon: 'lucide:image' },
            { value: `folder-${index}-assets-cover`, label: 'Cover.png', icon: 'lucide:image' }
          ]
        }
      ]
    });
  }

  return items;
}

const largeData = generateLargeTreeData();

function getTreeItemIcon(hasChildren: boolean, isExpanded: boolean, icon?: string) {
  if (!hasChildren) {
    return icon || 'lucide:file';
  }

  if (isExpanded) {
    return 'lucide:folder-open';
  }

  return 'lucide:folder';
}

const TreeVirtualizerDemo = () => {
  const [value, setValue] = useState<string | undefined>();
  const [expanded, setExpanded] = useState<string[]>(['folder-0', 'folder-1']);

  return (
    <Card
      split
      title="Virtualizer"
    >
      <div className="w-full max-w-[360px]">
        <p className="text-muted-foreground mb-2 text-sm">40 folders with nested children</p>

        <TreeVirtualizer
          expanded={expanded}
          height={300}
          items={largeData}
          itemSize={36}
          value={value}
          classNames={{
            item: 'flex items-center gap-2 px-2 py-1.5 outline-none data-[selected]:bg-primary/15'
          }}
          renderItem={({ hasChildren, isExpanded, item }) => {
            const data = item.data as DemoTreeItem;
            return (
              <>
                {hasChildren ? (
                  <Icon
                    className="size-4 shrink-0 transition-transform"
                    icon={isExpanded ? 'lucide:chevron-down' : 'lucide:chevron-right'}
                  />
                ) : (
                  <span className="w-4" />
                )}

                <Icon
                  className={`size-4 shrink-0 ${hasChildren ? 'text-amber-500' : 'text-blue-500'}`}
                  icon={getTreeItemIcon(hasChildren, isExpanded, data.icon)}
                />

                <span className="truncate">{data.label}</span>
              </>
            );
          }}
          onExpandedChange={setExpanded}
          onValueChange={v => setValue(v as string | undefined)}
        />
      </div>
    </Card>
  );
};

export default TreeVirtualizerDemo;
