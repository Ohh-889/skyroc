import classNames from 'clsx';
import type { FC, TouchEvent } from 'react';
import React, { useState } from 'react';

// eslint-disable-next-line react/prop-types
const SvgClose: FC<React.ComponentProps<'div'>> = ({ className, onClick, ...props }) => {
  const [touchStart, setTouchStart] = useState(false);

  // 处理触摸开始事件
  const handleTouchStart = () => {
    setTouchStart(true);
  };

  // 处理触摸结束事件
  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStart) {
      if (onClick) onClick(event as any);
    }

    // 重置触摸状态
    setTouchStart(false);
  };

  const handleTouchMove = () => {
    // 触摸移动，认为不是点击事件
    setTouchStart(false);
  };

  return (
    <div
      className={classNames(
        ':soy: relative h-16px w-16px inline-flex items-center justify-center rd-50% text-14px',
        className
      )}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      {...props}
      onClick={onClick}
    >
      <svg
        height="1em"
        viewBox="0 0 1024 1024"
        width="1em"
      >
        <path
          d="m563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8L295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512L196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1l216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default SvgClose;
