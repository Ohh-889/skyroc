'use client';

import { Button, message, notification } from '@skyroc/web-ui';

const Notification = () => {
  return (
    <div className="flex-c gap-4">
      <p className="text-muted-foreground text-sm">
        Notification reminder box with title, description, icon, and even buttons
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="plain"
          onClick={() =>
            notification.success({ title: 'Success', description: 'Your operation has been completed successfully' })
          }
        >
          Success
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            notification.error({ title: 'Error', description: 'Please check your network connection and try again' })
          }
        >
          Error
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            notification.warning({
              title: 'Warning',
              description: 'Your account is about to expire, please renew in time'
            })
          }
        >
          Warning
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            notification.info({ title: 'New Message', description: 'You have a new message, please check' })
          }
        >
          Info
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="plain"
          onClick={() =>
            notification.info({
              title: 'Confirm Action',
              description: 'Are you sure you want to perform this action?',
              action: { label: 'Confirm', onClick: () => message.success('Confirmed') },
              cancel: { label: 'Cancel', onClick: () => message.info('Cancelled') }
            })
          }
        >
          Double Buttons
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            notification.info({
              title: 'Single Button Test',
              description: 'When there is only one button, it should be on the far right',
              action: { label: 'OK', onClick: () => message.success('OK') }
            })
          }
        >
          Single Button
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            notification.info({
              title: 'Notification',
              description: 'Click the top right corner to close this notification',
              closeButton: true,
              duration: 0
            })
          }
        >
          With Close Button
        </Button>

        <Button
          variant="plain"
          onClick={() =>
            notification.success({
              title: 'Custom Duration',
              description: 'This notification will be displayed for 10 seconds',
              duration: 10000
            })
          }
        >
          Custom Duration
        </Button>
      </div>
    </div>
  );
};

export default Notification;
