'use client';

import { Checkbox } from '@skyroc/web-ui';

const CheckboxIndeterminate = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <Checkbox checked={false}>Unchecked</Checkbox>

      <Checkbox
        checked="indeterminate"
        shape="rounded"
      >
        Indeterminate
      </Checkbox>

      <Checkbox
        defaultChecked
        shape="rounded"
      >
        Checked
      </Checkbox>
    </div>
  );
};

export default CheckboxIndeterminate;
