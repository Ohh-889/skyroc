'use client';

import { Button, DropdownMenuCheckbox } from '@skyroc/web-ui';
import { useState } from 'react';

const checkboxItems = [
  { type: 'label' as const, label: 'JS Frameworks' },
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
  { label: 'Preact', value: 'preact' }
];

const DropdownMenuCheckboxDemo = () => {
  const [checks, setChecks] = useState<string[]>(['vue', 'solid']);

  return (
    <DropdownMenuCheckbox
      checks={checks}
      items={checkboxItems}
      onChecksChange={setChecks}
    >
      <Button variant="plain">Checkbox</Button>
    </DropdownMenuCheckbox>
  );
};

export default DropdownMenuCheckboxDemo;
