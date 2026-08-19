import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

/**
 * 量出「铺满父容器」那一层的实际尺寸，量到之前回落到窗口尺寸。
 *
 * 浮层类组件（FloatingButton / BackTop）的位置最终落在 transform 上，坐标原点是父容器左上角， 可边界一直按 `useWindowDimensions`
 * 算——两者在真机上恰好重合，于是这层错位一直没暴露。 一旦宿主不是整块屏幕（文档站的手机框预览、平板分栏、任何被包在定宽容器里的场景）， 窗口宽高就会比容器大出一大截，按钮被推到容器外侧，滚多远都看不见。
 *
 * 所以尺寸改为向父容器要：调用方把 `handleLayout` 挂到一个 `absolute inset-0` 的测量层上， 拿到的就是真实可视区。首帧 layout 还没回来时用窗口尺寸兜底，避免按钮先塌到左上角。
 *
 * `measured` 供调用方区分「兜底值」与「真实值」：从兜底切到真实是一次位置补正，不该播放动画。
 */
export function useContainerSize() {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const [size, setSize] = useState<{ height: number; width: number } | null>(null);

  // onLayout 在滚动、键盘弹出等场景会重复回调同一组尺寸，比对后再 setState，免得每次都触发重渲染
  function handleLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;

    setSize(prev => (prev && prev.height === height && prev.width === width ? prev : { height, width }));
  }

  return {
    handleLayout,
    height: size?.height ?? windowHeight,
    measured: size !== null,
    width: size?.width ?? windowWidth
  };
}
