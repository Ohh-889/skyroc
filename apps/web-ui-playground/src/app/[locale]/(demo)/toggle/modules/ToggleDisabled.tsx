'use client';

import { Card, Toggle } from '@skyroc/web-ui';

const ToggleDisabled = () => {
  return (
    <Card
      split
      title="Disabled"
    >
      <div className="gap-12px flex flex-wrap">
        <Toggle
          disabled
          size="md"
          variant="ghost"
        >
          disabled
        </Toggle>

        <Toggle
          disabled
          size="md"
          variant="outline"
        >
          disabled
        </Toggle>
      </div>
    </Card>
  );
};

export default ToggleDisabled;
