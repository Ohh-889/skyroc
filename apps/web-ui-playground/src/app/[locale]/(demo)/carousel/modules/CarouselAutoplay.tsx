'use client';

import { Card, Carousel } from '@skyroc/web-ui';
import Autoplay from 'embla-carousel-autoplay';

const CarouselAutoplay = () => {
  return (
    <div className="flex justify-center px-10">
      <Carousel
        className="w-full max-w-xs"
        counts={5}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 2000 })]}
      >
        {index => (
          <Card className="h-[200px]">
            <div className="flex-center size-full text-4xl font-semibold">{index + 1}</div>
          </Card>
        )}
      </Carousel>
    </div>
  );
};

export default CarouselAutoplay;
