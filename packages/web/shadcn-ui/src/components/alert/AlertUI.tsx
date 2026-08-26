'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@skyroc/utils';
import AlertDescription from './AlertDescription';
import AlertRoot from './AlertRoot';
import AlertTitle from './AlertTitle';
import AlertWrapper from './AlertWrapper';
import { alertVariants } from './alert-variants';
import type { AlertProps } from './types';

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const {
    children,
    className,
    classNames,
    color,
    description,
    descriptionProps,
    icon,
    leading,
    size,
    title,
    titleProps,
    trailing,
    variant,
    wrapperProps,
    ...rest
  } = props;

  const { icon: iconCls } = alertVariants({ color, size, variant });

  const mergedCls = cn(iconCls(), classNames?.icon);
  return (
    <AlertRoot
      className={className || classNames?.root}
      color={color}
      size={size}
      variant={variant}
      {...rest}
      ref={ref}
    >
      {leading}
      <Slot className={mergedCls}>{icon}</Slot>

      <AlertWrapper
        className={classNames?.wrapper}
        size={size}
        {...wrapperProps}
      >
        {title
          ? (
            <AlertTitle
              className={classNames?.title}
              size={size}
              {...titleProps}
            >
              {title}
            </AlertTitle>
          )
          : null}

        {description
          ? (
            <AlertDescription
              className={classNames?.description}
              size={size}
              {...descriptionProps}
            >
              {description}
            </AlertDescription>
          )
          : null}

        {children}
      </AlertWrapper>

      {trailing}
    </AlertRoot>
  );
});

Alert.displayName = 'Alert';

export default Alert;