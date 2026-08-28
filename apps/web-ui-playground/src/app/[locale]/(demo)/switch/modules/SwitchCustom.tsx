'use client';

import { Switch } from '@skyroc/web-ui';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const SwitchCustom = () => {
  const [checked, setChecked] = useState(true);

  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={checked}
        aria-label="Theme mode"
        classNames={{
          root: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-400 data-[state=checked]:to-sky-500',
          thumb: 'bg-white text-carbon'
        }}
        onCheckedChange={setChecked}
      >
        <span className="flex size-full items-center justify-center">
          {checked ? <Sun className="size-3" /> : <Moon className="size-3" />}
        </span>
      </Switch>
      <span className="text-sm text-muted-foreground">Theme mode</span>
    </div>
  );
};

export default SwitchCustom;
