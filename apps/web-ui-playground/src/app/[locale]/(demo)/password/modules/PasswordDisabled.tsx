'use client';

import { Password } from '@skyroc/web-ui';

const PasswordDisabled = () => {
  return (
    <div className="w-80 max-sm:w-auto">
      <Password
        disabled
        defaultValue="abc123"
        placeholder="Please input password"
      />
    </div>
  );
};

export default PasswordDisabled;
