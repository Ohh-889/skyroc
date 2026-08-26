'use client';

import { type ChangeEvent, forwardRef } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import TextareaContent from './TextareaContent';
import TextareaCount from './TextareaCount';
import TextareaRoot from './TextareaRoot';
import type { TextareaProps } from './types';

const TextareaUI = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const {
    classNames,
    countGraphemes,
    countRender,
    defaultValue,
    maxLength,
    onChange,
    onTextChange,
    showCount,
    size,
    value,
    ...rest
  } = props;

  const [_value, setValue] = useControllableState({
    caller: 'textarea',
    defaultProp: defaultValue,
    onChange: onTextChange,
    prop: value
  });

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    onChange?.(e);
  }

  return (
    <TextareaRoot
      className={classNames?.root}
      size={size}
    >
      <TextareaContent
        className={classNames?.content}
        maxLength={maxLength}
        ref={ref}
        size={size}
        value={_value}
        onChange={handleChange}
        {...rest}
      />

      {showCount
        ? (
          <TextareaCount
            className={classNames?.count}
            countGraphemes={countGraphemes}
            maxLength={maxLength}
            size={size}
            value={_value}
          >
            {countRender}
          </TextareaCount>
        )
        : null}
    </TextareaRoot>
  );
});

TextareaUI.displayName = 'TextareaUI';

export default TextareaUI;
