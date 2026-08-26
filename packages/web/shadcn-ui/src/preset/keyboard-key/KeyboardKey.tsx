'use client';

import { useComponentConfig } from '../config-provider/context';
import { KeyboardKeyUI } from '../../components/keyboard-key/KeyboardKeyUI';
import type { KeyboardKeyProps } from '../../components/keyboard-key/types';

const KeyboardKey = (props: KeyboardKeyProps) => {
  const config = useComponentConfig('keyboardKey');

  const mergedProps: KeyboardKeyProps = {

    ...config,
    ...props
  };

  return (
    <KeyboardKeyUI
      {...mergedProps}
    />
  );
};

KeyboardKey.displayName = 'KeyboardKey';

export default KeyboardKey;
