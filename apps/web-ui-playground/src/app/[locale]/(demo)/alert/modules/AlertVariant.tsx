'use client';

import { Alert, type AlertVariant, type ThemeColor } from '@skyroc/web-ui';
import { Terminal } from 'lucide-react';

const colors: ThemeColor[] = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'];
const variants: AlertVariant[] = ['solid', 'pure', 'outline', 'soft', 'ghost'];

const AlertVariantDemo = () => {
  return (
    <div className="flex-c-stretch flex gap-[12px]">
      {variants.map((variant, index) => (
        <Alert
          color={colors[index]}
          icon={<Terminal />}
          key={variant}
          title={variant}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default AlertVariantDemo;
