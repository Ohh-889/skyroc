'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Content } from '@radix-ui/react-dialog';
import { Close, Portal, Root, Trigger } from '@radix-ui/react-dialog';
import DialogAction from './DialogAction';
import DialogClose from './DialogClose';
import DialogContent from './DialogContent';
import DialogDescription from './DialogDescription';
import DialogFooter from './DialogFooter';
import DialogHeader from './DialogHeader';
import DialogOverlay from './DialogOverlay';
import DialogTitle from './DialogTitle';
import type { DialogProps } from './types';

const DialogUI = forwardRef<ComponentRef<typeof Content>, DialogProps>((props, ref) => {
  const {
    children,
    className,
    classNames,
    closeProps,
    contentComponent: ContentComponent = DialogContent,
    contentProps,
    defaultOpen,
    description,
    descriptionProps,
    footer,
    footerProps,
    headerProps,
    modal,
    okButtonProps,
    okText = 'OK',
    onOk,
    onOpenChange,
    open,
    overlayProps,
    size,
    title,
    titleProps,
    trigger
  } = props;

  return (
    <Root
      data-slot="dialog-root"
      defaultOpen={defaultOpen}
      modal={modal}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Trigger
        asChild
        data-slot="dialog-trigger"
      >
        {trigger}
      </Trigger>

      <Portal data-slot="dialog-portal">
        <DialogOverlay
          className={classNames?.overlay}
          {...overlayProps}
        />

        <ContentComponent
          {...contentProps}
          className={className || classNames?.content}
          ref={ref}
          size={size}
        >
          <DialogHeader
            className={classNames?.header}
            size={size}
            {...headerProps}
          >
            <DialogTitle
              className={classNames?.title}
              size={size}
              {...titleProps}
            >
              {title}
            </DialogTitle>

            {description
              ? (
                <DialogDescription
                  className={classNames?.description}
                  size={size}
                  {...descriptionProps}
                >
                  {description}
                </DialogDescription>
              )
              : null}
          </DialogHeader>

          <DialogClose
            className={classNames?.close}
            component={Close}
            size={size}
            {...closeProps}
          />

          {children}

          {footer !== null && footer !== false && (
            <DialogFooter
              className={classNames?.footer}
              size={size}
              {...footerProps}
            >
              {footer || (
                <DialogAction
                  onClick={onOk}
                  {...okButtonProps}
                >
                  {okText}
                </DialogAction>
              )}
            </DialogFooter>
          )}
        </ContentComponent>
      </Portal>
    </Root>
  );
});

DialogUI.displayName = 'DialogUI';

export default DialogUI;
