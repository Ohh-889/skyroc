'use client';

import { Card, Carousel } from '@skyroc/web-ui';

const CarouselMultiple = () => {
  return (
    <div className="px-10">
      <Carousel
        classNames={{ item: 'h-[150px] basis-1/3' }}
        counts={9}
        opts={{ align: 'start' }}
      >
        {index => (
          <Card className="size-full">
            <div className="flex-center size-full text-2xl font-semibold">{index + 1}</div>
          </Card>
        )}
      </Carousel>
    </div>
  );
};

export default CarouselMultiple;
