'use client';

import { Input, Label } from '@skyroc/web-ui';

const LabelDisabled = () => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="disabled-input">Disabled Field</Label>

      <Input
        disabled
        id="disabled-input"
        placeholder="This field is disabled"
      />
    </div>
  );
};

export default LabelDisabled;
