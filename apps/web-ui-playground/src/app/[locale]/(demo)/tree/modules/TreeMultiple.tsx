'use client';

import type { TreeItemData } from '@skyroc/web-ui';
import { Card, Tree } from '@skyroc/web-ui';
import { useState } from 'react';

const treeData: TreeItemData[] = [
  {
    value: 'documents',
    label: 'Documents',
    children: [
      { value: 'resume', label: 'Resume.pdf' },
      { value: 'cover-letter', label: 'Cover Letter.docx' },
      {
        value: 'projects',
        label: 'Projects',
        children: [
          { value: 'project-a', label: 'Project A' },
          { value: 'project-b', label: 'Project B' }
        ]
      }
    ]
  },
  {
    value: 'photos',
    label: 'Photos',
    children: [
      {
        value: 'vacation',
        label: 'Vacation',
        children: [
          { value: 'beach', label: 'Beach.jpg' },
          { value: 'mountain', label: 'Mountain.jpg' }
        ]
      },
      { value: 'family', label: 'Family.jpg' }
    ]
  },
  {
    value: 'music',
    label: 'Music',
    children: [
      {
        value: 'rock',
        label: 'Rock',
        children: [
          { value: 'classic-rock', label: 'Classic Rock' },
          { value: 'alternative', label: 'Alternative' }
        ]
      },
      { value: 'jazz', label: 'Jazz' }
    ]
  }
];

const TreeMultiple = () => {
  const [value, setValue] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>(['documents', 'photos']);

  return (
    <Card
      split
      title="Multiple Selection"
    >
      <div className="w-full max-w-[320px]">
        <Tree
          multiple
          expanded={expanded}
          items={treeData}
          value={value}
          onExpandedChange={setExpanded}
          onValueChange={v => setValue(v as string[])}
        />

        {value.length > 0 && (
          <div className="text-muted-foreground mt-4 text-sm">
            Selected:
            {value.join(',')}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TreeMultiple;
