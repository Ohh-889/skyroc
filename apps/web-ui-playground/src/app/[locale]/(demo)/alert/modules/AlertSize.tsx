'use client';

import { Alert, type ThemeColor, type ThemeSize } from '@skyroc/web-ui';

const colors: ThemeColor[] = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'];
const sizes: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const AlertSizeDemo = () => {
  return (
    <div className="flex-c-stretch flex gap-[12px]">
      {sizes.map((size, index) => (
        <Alert
          color={colors[index]}
          key={size}
          size={size}
          title={`Size: ${size}`}
          variant="soft"
        />
      ))}
    </div>
  );
};

export default AlertSizeDemo;
