import { cn } from '@skyroc/utils';
import { formVariants } from './form-variants';
import type { FormMessageProps } from './types';

const FormMessage = (props: FormMessageProps) => {
  const { className, error, ...rest } = props;

  const { message } = formVariants();

  const mergedCls = cn(message(), className);

  const body = error?.length ? error[0] : props.children;

  if (!body)
    return null;

  return (
    <p
      className={mergedCls}
      data-slot="form-message"
      {...rest}
    >
      {body}
    </p>
  );
};

export default FormMessage;
