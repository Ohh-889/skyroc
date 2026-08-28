// oxlint-disable no-nested-ternary
'use client';

import { Card, Icon, Tree } from '@skyroc/web-ui';
import { Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';

const items = [
  {
    value: 'composables',
    label: 'composables',
    icon: 'lucide:folder',
    children: [
      { value: 'auth', label: 'use-auth.ts', icon: 'vscode-icons:file-type-typescript' },
      { value: 'user', label: 'use-user.ts', icon: 'vscode-icons:file-type-typescript' }
    ]
  },
  {
    value: 'components',
    label: 'components',
    icon: 'lucide:folder',
    children: [
      {
        value: 'home',
        label: 'home',
        icon: 'lucide:folder',
        children: [
          { value: 'card', label: 'card.vue', icon: 'vscode-icons:file-type-vue' },
          { value: 'button', label: 'button.vue', icon: 'vscode-icons:file-type-vue' }
        ]
      }
    ]
  },
  { value: 'app', label: 'app.vue', icon: 'vscode-icons:file-type-vue' },
  { value: 'nuxt', label: 'nuxt.config.ts', icon: 'vscode-icons:file-type-nuxt' }
];

const TreeBasic = () => {
  const [value, setValue] = useState<string>('');
  const [expanded, setExpanded] = useState<string[]>(['composables', 'components', 'home']);

  return (
    <Card
      split
      title="Basic"
    >
      <div className="w-full max-w-[320px]">
        <Tree
          className="w-56 list-none rounded-lg border bg-white p-2 text-sm font-medium text-stone-700 shadow-sm select-none"
          expanded={expanded}
          items={items}
          top={<h2 className="px-2 pt-1 pb-3 text-sm font-semibold text-stone-400">Directory Structure</h2>}
          value={value}
          classNames={{
            item: 'flex items-center py-1 px-2 my-0.5 rounded outline-none focus:ring-primary/50 focus:ring-2 data-[selected]:bg-primary/15'
          }}
          renderItem={({ hasChildren, isExpanded, item }) => {
            return (
              <>
                {hasChildren ? (
                  isExpanded ? (
                    <FolderOpen />
                  ) : (
                    <Folder />
                  )
                ) : (
                  <Icon icon={item.data.icon || 'lucide:file'} />
                )}

                <div className="pl-2">{item.data.label}</div>
              </>
            );
          }}
          onExpandedChange={setExpanded}
          onValueChange={v => setValue(v as string)}
        />

        {value ? (
          <div className="text-muted-foreground mt-4 text-sm">
            Selected:
            {value}
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default TreeBasic;
