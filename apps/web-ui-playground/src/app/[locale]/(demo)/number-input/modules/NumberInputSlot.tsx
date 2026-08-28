'use client';

import { Icon, NumberInput } from '@skyroc/web-ui';

const NumberInputSlot = () => {
  return (
    <div className="flex-c w-80 gap-3 max-sm:w-auto">
      <NumberInput
        decrementIcon={<Icon icon="lucide:dollar-sign" />}
        incrementIcon={<Icon icon="lucide:percent" />}
      />
      <NumberInput
        center
        decrementIcon={<Icon icon="lucide:arrow-down" />}
        incrementIcon={<Icon icon="lucide:arrow-up" />}
      />
    </div>
  );
};

export default NumberInputSlot;
