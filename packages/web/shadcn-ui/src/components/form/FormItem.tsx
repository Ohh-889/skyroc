import { cn } from '@skyroc/utils';
import { formVariants } from './form-variants';
import type { FormItemProps } from './types';

const FormItem = (props: FormItemProps) => {
  const { className, size, ...rest } = props;

  const { item } = formVariants({ size });

  const mergedCls = cn(item(), className);

  return (
    <div
      className={mergedCls}
      data-slot="form-item"
      {...rest}
    />
  );
};

export default FormItem;
