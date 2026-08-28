'use client';
import { AlertDialog, Button } from '@skyroc/web-ui';
import { Heart } from 'lucide-react';

const AlertDialogCustomIcon = () => {
  return (
    <AlertDialog
      description="You can customize the icon displayed in the dialog"
      icon={<Heart className="text-destructive" />}
      title="Custom Icon"
      trigger={
        <Button
          color="destructive"
          variant="outline"
        >
          Custom Icon
        </Button>
      }
      onCancel={() => console.log('cancel')}
      onOk={() => console.log('ok')}
    />
  );
};

export default AlertDialogCustomIcon;
