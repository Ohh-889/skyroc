'use client';

import { ButtonIcon, Collapsible, CollapsibleTrigger } from '@skyroc/web-ui';
import { ChevronsUpDown } from 'lucide-react';

const CollapsibleBasic = () => {
  return (
    <Collapsible
      className="w-[350px] space-y-2 max-sm:w-auto"
      classNames={{ content: 'space-y-2' }}
      content={
        <>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">@skyroc-ui/colors</div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">skyroc-ui</div>
        </>
      }
    >
      <div className="flex items-center justify-between space-x-4 px-2">
        <h4 className="text-sm font-semibold">@skyroc starred 3 repositories</h4>

        <CollapsibleTrigger asChild>
          <ButtonIcon>
            <ChevronsUpDown />
          </ButtonIcon>
        </CollapsibleTrigger>
      </div>

      <div className="rounded-md border px-4 py-3 font-mono text-sm">@skyroc-ui/primitives</div>
    </Collapsible>
  );
};

export default CollapsibleBasic;
