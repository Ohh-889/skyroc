import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from '../dialog';
import type { CommandDialogProps } from './types';

const CommandDialog = (props: CommandDialogProps) => {
  const { children, className, classNames, defaultOpen, description, onOpenChange, open, title, ...rest } = props;

  return (
    <DialogRoot
      data-slot="command-dialog-root"
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogPortal data-slot="command-dialog-portal">
        <DialogOverlay
          className={classNames?.overlay}
          data-slot="command-dialog-overlay"
        />

        <DialogHeader className={classNames?.header}>
          <DialogTitle className={classNames?.title}>{title}</DialogTitle>
          <DialogDescription className={classNames?.description}>{description}</DialogDescription>
        </DialogHeader>

        <DialogContent
          className={className || classNames?.content}
          data-slot="command-dialog-content"
          {...rest}
        >
          <DialogClose
            className={classNames?.close}
            data-slot="command-dialog-close"
          />

          {children}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};

export default CommandDialog;
