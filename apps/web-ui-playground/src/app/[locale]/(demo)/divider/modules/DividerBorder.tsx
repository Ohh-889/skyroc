'use client';

import { Divider } from '@skyroc/web-ui';

const borders = ['solid', 'dashed', 'dotted'] as const;

const DividerBorder = () => {
  return (
    <div className="space-y-6">
      {borders.map(border => (
        <Divider
          border={border}
          key={border}
        >
          {border}
        </Divider>
      ))}
    </div>
  );
};

export default DividerBorder;
