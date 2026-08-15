import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { View } from 'react-native';
import { Text } from '../text/Typography';
import type { CountDownProps, CountDownRef } from './types';
import { useCountDown } from './useCountDown';
import { parseFormat } from './utils';

const CountDown = forwardRef<CountDownRef, CountDownProps>((props, ref) => {
  const {
    autoStart = true,
    children,
    className,
    format = 'HH:mm:ss',
    millisecond = false,
    onChange,
    onFinish,
    time = 0,
  } = props;

  const { current, pause, reset, start } = useCountDown({
    millisecond,
    onChange,
    onFinish,
    time,
  });

  useImperativeHandle(ref, () => ({
    pause,
    reset: (totalTime?: number) => {
      reset(totalTime);
      if (autoStart) {
        start();
      }
    },
    start,
  }));

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart]);

  if (children) {
    return children(current);
  }

  return (
    <View className={className}>
      <Text>{parseFormat(format, current)}</Text>
    </View>
  );
});

CountDown.displayName = 'CountDown';

export { CountDown };
