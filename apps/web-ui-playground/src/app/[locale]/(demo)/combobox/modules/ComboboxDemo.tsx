'use client';

import { Button, Command, Popover, cn } from '@skyroc/web-ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const ComboboxDemo = () => {
  const [value, setValue] = useState('');

  const frameworks = [
    {
      label: 'Vue',
      trailing: <Check className={cn('ml-auto', value === 'vue' ? 'opacity-100' : 'opacity-0')} />,
      value: 'vue'
    },
    {
      label: 'React',
      trailing: <Check className={cn('ml-auto', value === 'react' ? 'opacity-100' : 'opacity-0')} />,
      value: 'react'
    },
    {
      label: 'Next.js',
      trailing: <Check className={cn('ml-auto', value === 'nextjs' ? 'opacity-100' : 'opacity-0')} />,
      value: 'nextjs'
    },
    {
      label: 'SvelteKit',
      trailing: <Check className={cn('ml-auto', value === 'sveltekit' ? 'opacity-100' : 'opacity-0')} />,
      value: 'sveltekit'
    },
    {
      label: 'Nuxt',
      trailing: <Check className={cn('ml-auto', value === 'nuxt' ? 'opacity-100' : 'opacity-0')} />,
      value: 'nuxt'
    },
    {
      label: 'Remix',
      trailing: <Check className={cn('ml-auto', value === 'remix' ? 'opacity-100' : 'opacity-0')} />,
      value: 'remix'
    },
    {
      label: 'Astro',
      trailing: <Check className={cn('ml-auto', value === 'astro' ? 'opacity-100' : 'opacity-0')} />,
      value: 'astro'
    }
  ];

  return (
    <Popover
      classNames={{ content: 'p-0' }}
      trigger={
        <Button
          className="w-full justify-between md:max-w-[200px]"
          role="combobox"
          variant="pure"
        >
          {value ? frameworks.find(item => item.value === value)?.label : 'Select framework...'}
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      }
    >
      <Command
        items={frameworks}
        inputProps={{
          onValueChange(search) {
            setValue(search);
          }
        }}
      />
    </Popover>
  );
};

export default ComboboxDemo;
