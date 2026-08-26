'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Content } from '@radix-ui/react-alert-dialog';
import { AlertDialog as AlertDialogRoot, Portal, Trigger } from '@radix-ui/react-alert-dialog';
import { Slot } from '@radix-ui/react-slot';
import { CircleAlert, CircleCheck, CircleX, Info } from 'lucide-react';
import AlertDialogAction from './AlertDialogAction';
import AlertDialogCancel from './AlertDialogCancel';
import AlertDialogContent from './AlertDialogContent';
import AlertDialogDescription from './AlertDialogDescription';
import AlertDialogFooter from './AlertDialogFooter';
import AlertDialogHeader from './AlertDialogHeader';
import AlertDialogOverlay from './AlertDialogOverlay';
import AlertDialogTitle from './AlertDialogTitle';
import type { AlertDialogProps, AlertType } from './types';

const iconRecord: Record<AlertType, React.ReactNode> = {
  destructive: <CircleX className="text-destructive" />,
  info: <Info className="text-info" />,
  success: <CircleCheck className="text-success" />,
  warning: <CircleAlert className="text-warning" />
};

const AlertDialogUI = forwardRef<ComponentRef<typeof Content>, AlertDialogProps>((props, ref) => {
  const {
    cancelButtonProps,
    cancelText = 'Cancel',
    children,
    className,
    classNames,
    contentProps,
    description,
    descriptionProps,
    footer,
    footerProps,
    forceMountOverlay,
    forceMountPortal,
    headerProps,
    icon,
    okButtonProps,
    okText = 'OK',
    onCancel,
    onOk,
    overlayProps,
    showCancel = true,
    size,
    title,
    titleProps,
    trigger,
    type,
    ...rest
  } = props;

  return (
    <AlertDialogRoot {...props}>
      <Trigger asChild>{trigger}</Trigger>

      <Portal forceMount={forceMountPortal}>
        <AlertDialogOverlay
          className={classNames?.overlay}
          forceMount={forceMountOverlay}
          {...overlayProps}
        />

        <AlertDialogContent
          {...rest}
          className={className || classNames?.content}
          ref={ref}
          size={size}
          {...contentProps}
        >
          <AlertDialogHeader
            className={classNames?.header}
            size={size}
            {...headerProps}
          >
            <AlertDialogTitle
              className={classNames?.title}
              size={size}
              {...titleProps}
            >
              {icon || (type && <Slot className={classNames?.icon || ''}>{iconRecord[type]}</Slot>)}
              {title}
            </AlertDialogTitle>

            <AlertDialogDescription
              className={classNames?.description}
              size={size}
              {...descriptionProps}
            >
              {description}
            </AlertDialogDescription>

          </AlertDialogHeader>

          {children}

          {footer !== null && footer !== false && (
            <AlertDialogFooter
              className={classNames?.footer}
              size={size}
              {...footerProps}
            >
              {footer || (
                <>
                  {showCancel
                    ? (
                      <AlertDialogCancel
                        onClick={onCancel}
                        {...cancelButtonProps}
                      >
                        {cancelText}
                      </AlertDialogCancel>
                    )
                    : null}

                  <AlertDialogAction
                    onClick={onOk}
                    {...okButtonProps}
                  >
                    {okText}
                  </AlertDialogAction>
                </>
              )}
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </Portal>
    </AlertDialogRoot>
  );
});

AlertDialogUI.displayName = 'AlertDialogUI';

export default AlertDialogUI;