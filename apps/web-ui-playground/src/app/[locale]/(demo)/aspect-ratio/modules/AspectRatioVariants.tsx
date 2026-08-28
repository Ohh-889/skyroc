'use client';

import { AspectRatio } from '@skyroc/web-ui';

const AspectRatioVariants = () => {
  const ratios = [
    { ratio: 1 / 1, label: '1:1 (正方形)' },
    { ratio: 4 / 3, label: '4:3 (标准)' },
    { ratio: 16 / 9, label: '16:9 (宽屏)' },
    { ratio: 21 / 9, label: '21:9 (超宽屏)' }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {ratios.map(({ label, ratio }) => (
        <div key={label}>
          <AspectRatio
            className="bg-muted overflow-hidden rounded-md"
            ratio={ratio}
          >
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white">
              <span className="text-lg font-semibold">{label}</span>
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  );
};

export default AspectRatioVariants;
