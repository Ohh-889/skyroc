'use client';

import { Input, Label } from '@skyroc/web-ui';

const LabelRequired = () => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="username">
        Username
        <span className="text-destructive ml-1">*</span>
      </Label>

      <Input
        required
        id="username"
        placeholder="Enter your username"
      />
    </div>
  );
};

export default LabelRequired;
