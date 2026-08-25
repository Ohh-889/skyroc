import { useState } from 'react';

type OnClick = () => void;

export function useTap(onClick: OnClick) {
  const [touchStart, setTouchStart] = useState(false);

  // 处理触摸开始事件
  const handleTouchStart = () => {
    setTouchStart(true);
  };

  // 处理触摸结束事件
  const handleTouchEnd = () => {
    // 判断触摸开始的状态，确保这是一个点击事件，而不是滑动等其他触摸事件
    if (touchStart) {
      onClick();
    }

    // 重置触摸状态
    setTouchStart(false);
  };

  const handleTouchMove = () => {
    // 触摸移动，认为不是点击事件
    setTouchStart(false);
  };

  return {
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onTouchStart: handleTouchStart
  };
}
