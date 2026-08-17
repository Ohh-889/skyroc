import { cn } from '@skyroc/utils';
import { useImperativeHandle } from 'react';
import { View } from 'react-native';
import { Text } from '../text/Typography';
import type { CountDownProps } from './types';
import { useCountDown } from './useCountDown';
import { parseFormat } from './utils';

const CountDown = (props: CountDownProps) => {
  const {
    autoStart = true,
    children,
    className,
    classNames,
    format = 'HH:mm:ss',
    millisecond = false,
    onChange,
    onFinish,
    ref,
    time = 0
  } = props;

  const { current, pause, reset, start } = useCountDown({
    autoStart,
    millisecond,
    onChange,
    onFinish,
    time
  });

  useImperativeHandle(ref, () => ({
    pause,
    reset,
    start
  }));

  /** slot 级与根级覆盖合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    // 优先级：slot 级覆盖（classNames）< 根级覆盖（className）
    return {
      root: cn(classNames?.root, className),
      text: cn(classNames?.text)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** children 只替换文本内容，根容器始终渲染，className 才不会因为传了 children 就静默失效 */
  function renderContent() {
    if (children) {
      return children(current);
    }

    return <Text className={slotClassNames.text}>{parseFormat(format, current)}</Text>;
  }

  return <View className={slotClassNames.root}>{renderContent()}</View>;
};

export { CountDown };
