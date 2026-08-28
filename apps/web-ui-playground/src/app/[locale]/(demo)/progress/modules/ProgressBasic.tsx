'use client';

import { Progress } from '@skyroc/web-ui';

const ProgressBasic = () => {
  return (
    <div className="w-[320px] max-sm:w-auto">
      <Progress value={60} />
    </div>
  );
};

export default ProgressBasic;
