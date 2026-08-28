'use client';

import { Alert, type ThemeColor } from '@skyroc/web-ui';
import { Terminal } from 'lucide-react';

const colors: ThemeColor[] = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'];

const AlertColor = () => {
  return (
    <div className="flex-c-stretch flex gap-[12px]">
      {colors.map(color => (
        <Alert
          color={color}
          icon={<Terminal />}
          key={color}
          title={color}
        />
      ))}
    </div>
  );
};

export default AlertColor;
