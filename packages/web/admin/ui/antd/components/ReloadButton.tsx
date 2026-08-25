import { Icon } from '@iconify/react';

import type { ButtonIconProps } from './ButtonIcon';
import ButtonIcon from './ButtonIcon';

type Props = ButtonIconProps & {
  isReload: boolean;
};

const ReloadButton = (props: Props) => {
  const { isReload, ...rest } = props;

  return (
    <ButtonIcon {...rest}>
      <Icon className={isReload ? '' : 'animate-spin animate-duration-750'} icon="ant-design:reload-outlined" />
    </ButtonIcon>
  );
};

export default ReloadButton;
