'use client';

import { Skeleton } from '@skyroc/web-ui';

const DefaultDemo = () => {
  return (
    <div className="flex-col items-center space-y-4">
      <Skeleton className="size-12 rounded-full" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] max-sm:w-[150px]" />
        <Skeleton className="h-4 w-[200px] max-sm:w-auto" />
      </div>

      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    </div>
  );
};

export default DefaultDemo;
