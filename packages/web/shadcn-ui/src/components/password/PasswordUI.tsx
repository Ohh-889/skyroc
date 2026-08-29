'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef } from 'react';
import Input from '../input/InputUI';
import type { PasswordProps } from './types';

const PasswordUI = forwardRef<HTMLInputElement, PasswordProps>((props, ref) => {
  const {
    defaultVisible = false,
    hiddenIcon,
    onVisibleChange,
    trailing,
    visible: visibleProp,
    visibleIcon,
    ...rest
  } = props;

  const [visible, setVisible] = useControllableState({
    defaultProp: defaultVisible,
    onChange: onVisibleChange,
    prop: visibleProp
  });

  function toggleVisible() {
    setVisible(!visible);
  }

  const VisibleIcon = visible
    ? visibleIcon || <Eye className="cursor-pointer" />
    : hiddenIcon || <EyeOff className="cursor-pointer" />;

  return (
    <Input
      aria-roledescription="Password"
      autoComplete="off"
      data-slot="password"
      ref={ref}
      type={visible ? 'text' : 'password'}
      {...rest}
      // eslint-disable-next-line react/jsx-props-no-multi-spaces
      trailing={
        <>
          {trailing}

          <button
            aria-label={visible ? '隐藏密码' : '显示密码'}
            className="flex shrink-0 items-center justify-center border-0 bg-transparent p-0 text-inherit"
            data-slot="password-visible"
            onClick={toggleVisible}
            type="button"
          >
            {VisibleIcon}
          </button>
        </>
      }
    />
  );
});

PasswordUI.displayName = 'PasswordUI';

export default PasswordUI;
