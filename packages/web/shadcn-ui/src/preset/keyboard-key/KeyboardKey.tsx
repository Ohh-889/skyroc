'use client';

import { KeyboardKeyUI } from '../../components/keyboard-key/KeyboardKeyUI';
import type { KeyboardKeyProps } from '../../components/keyboard-key/types';
import { useComponentConfig } from '../config-provider/context';

const KeyboardKey = (props: KeyboardKeyProps) => {
  const config = useComponentConfig('keyboardKey');

  const mergedProps: KeyboardKeyProps = {
    ...config,
    ...props
  };

  return <KeyboardKeyUI {...mergedProps} />;
};

KeyboardKey.displayName = 'KeyboardKey';

export default KeyboardKey;
