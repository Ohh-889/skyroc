'use client';

import { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
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
    ? (visibleIcon || <Eye className="cursor-pointer" />)
    : (hiddenIcon || <EyeOff className="cursor-pointer" />);

  return (
    <Input
      aria-roledescription="Password"
      autoComplete="off"
      data-slot="password"
      ref={ref}
      type={visible ? 'text' : 'password'}
      {...rest}

      // eslint-disable-next-line react/jsx-props-no-multi-spaces
      trailing={(
        <>
          {trailing}

          <span
            data-slot="password-visible"
            onClick={toggleVisible}
          >
            {VisibleIcon}
          </span>
        </>
      )}
    />
  );
});

PasswordUI.displayName = 'PasswordUI';

export default PasswordUI;
