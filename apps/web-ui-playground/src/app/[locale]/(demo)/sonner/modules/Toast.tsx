'use client';

import { Button, toast } from '@skyroc/web-ui';

const Toast = () => {
  return (
    <div className="flex-c gap-4">
      <p className="text-muted-foreground text-sm">Directly using sonner&apos;s toast API</p>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="plain"
          onClick={() =>
            toast.success('Hello', {
              action: { label: 'Click me', onClick: () => toast.success('Hello') },
              description: 'This is a description'
            })
          }
        >
          Toast with Action
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            toast.promise(
              new Promise(resolve => {
                setTimeout(resolve, 2000);
              }),
              { loading: 'Loading...', success: 'Load succeeded', error: 'Load failed' }
            )
          }
        >
          Promise Toast
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            toast('Default toast', {
              description: 'This is a default toast notification'
            })
          }
        >
          Default
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            toast.error('Error toast', {
              description: 'Something went wrong'
            })
          }
        >
          Error
        </Button>
      </div>
    </div>
  );
};

export default Toast;
