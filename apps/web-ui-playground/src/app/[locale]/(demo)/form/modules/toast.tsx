'use client';

import { toast } from '@skyroc/web-ui';

export function showToastCode(title: string, values: any) {
  toast(title, {
    className: '!w-[400px]',
    description: (
      <pre className="mt-2 w-[360px] rounded-md bg-neutral-950 p-4 max-sm:w-screen">
        <code className="text-white">
          {JSON.stringify(values, (_, value) => (value === undefined ? null : value), 2)}
        </code>
      </pre>
    ),
    position: 'top-center'
  });
}
