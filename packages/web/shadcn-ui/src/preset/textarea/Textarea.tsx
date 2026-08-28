'use client';

import { forwardRef } from 'react';
import TextareaUI from '../../components/textarea/TextareaUI';
import type { TextareaProps } from '../../components/textarea/types';
import { useComponentConfig } from '../config-provider/context';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const config = useComponentConfig('textarea');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <TextareaUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
