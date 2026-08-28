'use client';

import { Card, Textarea } from '@skyroc/web-ui';

const TextareaBasic = () => {
  return (
    <Card
      split
      title="Basic"
    >
      <Textarea placeholder="Write a note..." />
    </Card>
  );
};

export default TextareaBasic;
