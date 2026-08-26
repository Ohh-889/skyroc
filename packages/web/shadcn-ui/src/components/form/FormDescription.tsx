import { cn } from '@skyroc/utils';
import { formVariants } from './form-variants';
import type { FormDescriptionProps } from './types';

const FormDescription = (props: FormDescriptionProps) => {
  const { className, ...rest } = props;

  const { description } = formVariants();

  const mergedClass = cn(description(), className);

  return (
    <p
      className={mergedClass}
      data-slot="form-description"
      {...rest}
    />
  );
};

export default FormDescription;
