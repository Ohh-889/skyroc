'use client';

import { Card, Textarea } from '@skyroc/web-ui';

const TextareaCustomStyle = () => {
  return (
    <Card
      split
      title="Custom style"
    >
      <Textarea
        showCount
        defaultValue="Custom textarea style"
        classNames={{
          content: 'min-h-28 border-primary/60 bg-primary/5',
          count: 'font-medium text-primary',
          root: 'max-w-md'
        }}
      />
    </Card>
  );
};

export default TextareaCustomStyle;
