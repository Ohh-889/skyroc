import * as Slot from '@rn-primitives/slot';
import { cn } from '@skyroc/utils';
import { createContext, useContext } from 'react';
import { Text as RNText } from 'react-native';
import { textBaseClass, textVariants } from './text-variants';
import type { TextProps } from './types';

/** 父组件（如 Button）通过此 Context 向下传递文字样式 */
const TextClassContext = createContext<string | undefined>(undefined);

const Text = (props: TextProps) => {
  const { asChild = false, className, color, size, weight, ...rest } = props;

  const textClass = useContext(TextClassContext);

  const Component = asChild ? Slot.Text : RNText;

  /** 变体类与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    // 优先级：兜底样式 < 父级继承（Context） < 显式 variant props < className
    return {
      root: cn(textBaseClass, textClass, textVariants({ color, size, weight }), className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <Component
      className={slotClassNames.root}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      {...rest}
    />
  );
};

export { Text, TextClassContext };
