'use client';

import { useFieldState } from '@skyroc/web-ui';
import { type ComponentProps, memo } from 'react';

export const DemoInput = memo(
  (props: ComponentProps<'input'> & { name: string }) => {
    const { name, ...rest } = props;

    const state = useFieldState(name);

    const { touched, validated, validating } = state;

    return (
      <>
        <input
          className="border-input bg-background focus-visible:ring-offset-background focus-visible:ring-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-8 w-full rounded-md border border-solid px-2.5 text-sm file:border-0 file:bg-transparent file:py-1.25 file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...rest}
        />

        <div className="flex gap-x-4">
          {touched ? <span className="text-blue-400">touched</span> : null}
          {validated ? <span className="text-red-400">validated</span> : null}
          {validating ? <span className="text-yellow-400">validating</span> : null}
        </div>
      </>
    );
  },
  () => false
);

DemoInput.displayName = 'DemoInput';
