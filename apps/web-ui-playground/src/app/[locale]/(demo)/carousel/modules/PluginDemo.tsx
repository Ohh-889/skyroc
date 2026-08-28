'use client';

import { Card, Carousel } from '@skyroc/web-ui';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const PluginDemo = () => {
  return (
    <Card
      split
      title="Only one item & plugins"
    >
      <div className="p-10">
        <Carousel
          className="w-full max-w-xs"
          counts={5}
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 2000 })]}
        >
          <Card className="h-[310px] w-[310px]">
            <div className="flex-center size-full flex-col">
              <Image
                alt="1"
                height={260}
                src="https://picsum.photos/280/280"
                width={260}
              />

              <span className="mt-1 text-sm font-semibold">1</span>
            </div>
          </Card>

          <Card
            className="h-[310px] w-[310px]"
            title="2"
          >
            <div className="flex-center size-full flex-col">
              <Image
                alt="1"
                height={260}
                src="https://picsum.photos/280/280"
                width={260}
              />

              <span className="mt-1 text-sm font-semibold">2</span>
            </div>
          </Card>

          <Card
            className="h-[310px] w-[310px]"
            title="3"
          >
            <div className="flex-center size-full flex-col">
              <Image
                alt="1"
                height={260}
                src="https://picsum.photos/280/280"
                width={260}
              />

              <span className="mt-1 text-sm font-semibold">3</span>
            </div>
          </Card>

          <Card
            className="h-[310px] w-[310px]"
            title="4"
          >
            <div className="flex-center size-full flex-col">
              <Image
                alt="1"
                height={260}
                src="https://picsum.photos/280/280"
                width={260}
              />

              <span className="mt-1 text-sm font-semibold">4</span>
            </div>
          </Card>

          <Card
            className="h-[310px] w-[310px]"
            title="5"
          >
            <span className="flex-center size-full text-4xl font-semibold">5</span>
          </Card>
        </Carousel>
      </div>
    </Card>
  );
};

export default PluginDemo;
