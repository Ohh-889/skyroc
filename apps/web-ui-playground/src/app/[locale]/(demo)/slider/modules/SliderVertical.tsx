'use client';

import { Card, Slider } from '@skyroc/web-ui';

const SliderVertical = () => {
  return (
    <Card
      split
      title="Vertical"
    >
      <div className="h-40">
        <Slider
          defaultValue={[10, 60]}
          max={100}
          orientation="vertical"
          step={1}
        />
      </div>
    </Card>
  );
};

export default SliderVertical;
