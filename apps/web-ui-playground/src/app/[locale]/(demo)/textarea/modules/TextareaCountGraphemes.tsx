'use client';

import { Card, Textarea } from '@skyroc/web-ui';
import type { TextareaProps } from '@skyroc/web-ui';
import { useState } from 'react';

const countGraphemes = (text: TextareaProps['value']) => {
  if (!text) {
    return 0;
  }

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  return Array.from(segmenter.segment(String(text))).length;
};

const TextareaCountGraphemes = () => {
  const [value, setValue] = useState<TextareaProps['value']>('🌷🇨🇳');

  return (
    <Card
      split
      title="Count graphemes"
    >
      <Textarea
        showCount
        countGraphemes={countGraphemes}
        value={value}
        onTextChange={setValue}
      />
    </Card>
  );
};

export default TextareaCountGraphemes;
