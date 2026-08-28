'use client';

import { Progress } from '@skyroc/web-ui';
import { useEffect, useState } from 'react';

const ProgressAnimated = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-[320px] max-sm:w-auto">
      <Progress value={progress} />
    </div>
  );
};

export default ProgressAnimated;
