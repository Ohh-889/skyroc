import { clsx } from 'clsx';

import skyrocAvatar from '@/assets/imgs/skyroc.jpg';

const SkyrocAvatar = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={clsx('size-72px overflow-hidden rd-1/2', className)}>
      <img className="size-full" src={skyrocAvatar} />
    </div>
  );
};

export default SkyrocAvatar;
