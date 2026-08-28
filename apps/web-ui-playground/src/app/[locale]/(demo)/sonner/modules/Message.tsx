'use client';

import { Button, message } from '@skyroc/web-ui';

const Message = () => {
  return (
    <div className="flex-c gap-4">
      <p className="text-muted-foreground text-sm">Lightweight global tips, with only icons and a single sentence</p>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="plain"
          onClick={() => message.success('This is a success message')}
        >
          Success
        </Button>

        <Button
          variant="plain"
          onClick={() => message.error('This is a error message')}
        >
          Error
        </Button>

        <Button
          variant="plain"
          onClick={() => message.warning('This is a warning message')}
        >
          Warning
        </Button>

        <Button
          variant="plain"
          onClick={() => message.info('This is a info message')}
        >
          Info
        </Button>

        <Button
          variant="plain"
          onClick={() => message.loading('This is a loading message')}
        >
          Loading
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="plain"
          onClick={() => {
            const id = message.loading('Loading...');
            setTimeout(() => {
              message.dismiss(id);
              message.success('Load completed');
            }, 2000);
          }}
        >
          Loading → Success
        </Button>

        <Button
          variant="plain"
          onClick={() => {
            message.promise(
              new Promise((resolve, reject) => {
                setTimeout(() => (Math.random() > 0.3 ? resolve('data') : reject(new Error('Failed'))), 2000);
              }),
              {
                loading: 'Loading data...',
                success: 'Data loaded successfully',
                error: 'Failed to load data'
              }
            );
          }}
        >
          Promise
        </Button>
      </div>
    </div>
  );
};

export default Message;
