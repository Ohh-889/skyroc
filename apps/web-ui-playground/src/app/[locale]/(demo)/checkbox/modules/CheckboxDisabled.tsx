'use client';

import { Checkbox } from '@skyroc/web-ui';

const CheckboxDisabled = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <Checkbox
        disabled
        id="disabled-unchecked"
      >
        Disabled Unchecked
      </Checkbox>

      <Checkbox
        defaultChecked
        disabled
        id="disabled-checked"
      >
        Disabled Checked
      </Checkbox>
    </div>
  );
};

export default CheckboxDisabled;
