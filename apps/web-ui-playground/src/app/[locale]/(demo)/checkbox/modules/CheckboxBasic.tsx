'use client';

import type { CheckedState } from '@skyroc/web-ui';
import { Checkbox } from '@skyroc/web-ui';
import { useState } from 'react';

const CheckboxBasic = () => {
  const [checked, setChecked] = useState<CheckedState>(false);

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
    >
      Accept terms and conditions
    </Checkbox>
  );
};

export default CheckboxBasic;
