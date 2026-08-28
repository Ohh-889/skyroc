'use client';

import { builtinColorMap, builtinRadiuses } from '@skyroc/tailwind-plugin';
import { cn } from '@skyroc/utils';
import type { ThemeSize } from '@skyroc/web-ui';
import { Button, Icon, Label } from '@skyroc/web-ui';
import { useState } from 'react';

const sizes: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const ThemeCustomize = () => {
  const [color, setColor] = useState('default');

  const [size, setSize] = useState('md');

  const [radius, setRadius] = useState(0.5);

  return (
    <div className="p-4">
      <div className="grid space-y-1">
        <h1 className="text-md text-foreground font-semibold">Customize</h1>
        <p className="text-muted-foreground text-xs">Pick a style and color for your components.</p>
      </div>

      <div className="space-y-1.5 pt-6">
        <Label
          className="text-xs"
          htmlFor="color"
        >
          Color
        </Label>

        <div className="grid grid-cols-3 gap-2 py-1.5">
          {Object.entries(builtinColorMap).map(([key, value]) => (
            <div
              className={key === 'default' ? 'col-span-3' : ''}
              key={key}
            >
              <Button
                className={cn('justify-start', key !== 'default' && 'w-full')}
                size="sm"
                variant={color === key ? 'outline' : 'pure'}
                onClick={() => setColor(key)}
              >
                <span
                  className="flex size-4 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `hsl(${value})` }}
                >
                  {color === key && (
                    <Icon
                      className="size-3 text-white"
                      icon="lucide:check"
                    />
                  )}
                </span>

                <span className="ml-2 text-xs capitalize">{key}</span>
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 pt-6">
          <Label
            className="text-xs"
            htmlFor="radius"
          >
            Radius
          </Label>

          <div className="grid grid-cols-5 gap-2 py-1.5">
            {builtinRadiuses.map((r, index) => (
              <Button
                key={index}
                size="sm"
                variant={r === radius ? 'outline' : 'pure'}
                onClick={() => setRadius(r)}
              >
                <span className="text-xs">{r}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-6">
          <Label
            className="text-xs"
            htmlFor="size"
          >
            Size
          </Label>

          <div className="grid grid-cols-5 gap-2 py-1.5">
            {sizes.map((s, index) => (
              <Button
                key={index}
                size="sm"
                variant={s === size ? 'outline' : 'pure'}
                onClick={() => setSize(s)}
              >
                <span className="text-xs">{s}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomize;
