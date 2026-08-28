'use client';

import { Card, Textarea } from '@skyroc/web-ui';

const TextCustomCount = () => {
  return (
    <Card
      split
      title="Custom count"
    >
      <Textarea
        showCount
        countRender={count => <span className="text-[red]">count is {count}</span>}
      />
    </Card>
  );
};

export default TextCustomCount;
