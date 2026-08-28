'use client';

import { Divider } from '@skyroc/web-ui';

const aligns = ['start', 'center', 'end'] as const;

const DividerAlign = () => {
  return (
    <div className="space-y-6">
      {aligns.map(align => (
        <Divider
          align={align}
          key={align}
        >
          {align}
        </Divider>
      ))}
    </div>
  );
};

export default DividerAlign;
