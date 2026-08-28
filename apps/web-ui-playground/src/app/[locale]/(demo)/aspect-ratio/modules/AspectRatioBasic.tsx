'use client';

import { AspectRatio } from '@skyroc/web-ui';

const AspectRatioBasic = () => {
  return (
    <div className="w-[600px] max-sm:w-full">
      <AspectRatio
        className="bg-muted overflow-hidden rounded-md"
        ratio={16 / 9}
      >
        <img
          alt="Photo by Drew Beamer"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        />
      </AspectRatio>
    </div>
  );
};

export default AspectRatioBasic;
