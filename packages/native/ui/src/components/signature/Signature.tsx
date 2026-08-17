import { useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Fill, ImageFormat, Path, useCanvasRef } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { cn } from '@skyroc/utils';
import { Button } from '../button/Button';
import { Text } from '../text/Typography';
import { signatureVariants } from './signature-variants';
import type { SignatureProps } from './types';

const Signature = (props: SignatureProps) => {
  const {
    backgroundColor = 'transparent',
    className,
    classNames,
    clearButtonText = '清除',
    confirmButtonText = '确认',
    lineWidth = 3,
    onClear,
    onEnd,
    onSigning,
    onStart,
    onSubmit,
    penColor = '#000',
    ref,
    showFooter = true,
    tips,
    type = 'png'
  } = props;

  const canvasRef = useCanvasRef();
  const currentPathRef = useRef('');
  const [completedPaths, setCompletedPaths] = useState<string[]>([]);
  const [drawingPath, setDrawingPath] = useState('');

  const hasContent = completedPaths.length > 0 || drawingPath !== '';

  const slots = signatureVariants();

  function handleTouchStart(x: number, y: number) {
    currentPathRef.current = `M ${x} ${y} L ${x + 0.01} ${y + 0.01}`;
    setDrawingPath(currentPathRef.current);
    onStart?.();
  }

  function handleTouchMove(x: number, y: number) {
    if (!currentPathRef.current) return;
    currentPathRef.current += ` L ${x} ${y}`;
    setDrawingPath(currentPathRef.current);
    onSigning?.();
  }

  function handleTouchEnd() {
    const pathStr = currentPathRef.current;
    if (pathStr) {
      setCompletedPaths(prev => [...prev, pathStr]);
      currentPathRef.current = '';
      setDrawingPath('');
    }
    onEnd?.();
  }

  function handleClear() {
    setCompletedPaths([]);
    setDrawingPath('');
    currentPathRef.current = '';
    onClear?.();
  }

  function handleSubmit() {
    const isEmpty = completedPaths.length === 0;
    if (isEmpty) {
      onSubmit?.({ image: '', isEmpty: true });
      return;
    }

    const snapshot = canvasRef.current?.makeImageSnapshot();
    if (snapshot) {
      const format = type === 'jpeg' ? ImageFormat.JPEG : ImageFormat.PNG;
      const quality = format === ImageFormat.JPEG ? 80 : 100;
      const base64 = snapshot.encodeToBase64(format, quality);
      const mimeType = type === 'jpeg' ? 'jpeg' : 'png';
      onSubmit?.({ image: `data:image/${mimeType};base64,${base64}`, isEmpty: false });
    }
  }

  useImperativeHandle(ref, () => ({
    clear: handleClear,
    submit: handleSubmit
  }));

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .maxPointers(1)
    .onBegin(e => {
      handleTouchStart(e.x, e.y);
    })
    .onUpdate(e => {
      handleTouchMove(e.x, e.y);
    })
    .onFinalize(() => {
      handleTouchEnd();
    });

  return (
    <View className={cn(slots.root(), className, classNames?.root)}>
      <GestureDetector gesture={panGesture}>
        <View className={cn(slots.canvas(), classNames?.canvas)}>
          <Canvas
            ref={canvasRef}
            style={StyleSheet.absoluteFill}
          >
            {backgroundColor !== 'transparent' ? <Fill color={backgroundColor} /> : null}
            {completedPaths.map((pathStr, i) => (
              <Path
                key={i}
                color={penColor}
                path={pathStr}
                strokeCap="round"
                strokeJoin="round"
                strokeWidth={lineWidth}
                style="stroke"
              />
            ))}
            {drawingPath ? (
              <Path
                color={penColor}
                path={drawingPath}
                strokeCap="round"
                strokeJoin="round"
                strokeWidth={lineWidth}
                style="stroke"
              />
            ) : null}
          </Canvas>
          {!hasContent && tips ? (
            <View
              className={cn(slots.tips(), classNames?.tips)}
              pointerEvents="none"
            >
              <Text className={cn(slots.tipsText(), classNames?.tipsText)}>{tips}</Text>
            </View>
          ) : null}
        </View>
      </GestureDetector>

      {showFooter ? (
        <View className={cn(slots.footer(), classNames?.footer)}>
          <Button
            className="flex-1"
            variant="outline"
            onPress={handleClear}
          >
            {clearButtonText}
          </Button>
          <Button
            className="flex-1"
            onPress={handleSubmit}
          >
            {confirmButtonText}
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export { Signature };
