'use client';

import { Input, Label } from '@skyroc/web-ui';

const LabelBasic = () => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>

      <Input
        id="email"
        placeholder="Enter your email"
        type="email"
      />
    </div>
  );
};

export default LabelBasic;
