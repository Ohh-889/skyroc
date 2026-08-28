'use client';

import type { ThemeColor } from '@skyroc/web-ui';
import { Card, Slider } from '@skyroc/web-ui';

const colors: ThemeColor[] = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'];

const SliderColor = () => {
  return (
    <Card
      split
      title="Color"
    >
      <div className="flex-c-stretch flex w-[480px] gap-6 max-sm:w-auto">
        {colors.map(color => (
          <Slider
            color={color}
            defaultValue={[33]}
            key={color}
            max={100}
            step={1}
          />
        ))}
      </div>
    </Card>
  );
};

export default SliderColor;
