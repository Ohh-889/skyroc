import { SvgIcon } from '@shell/ui/compose';
import React from 'react';

import ButtonIcon from './ButtonIcon';

interface Props {
  /** Button class */
  className: string;
  /** Click handler */
  onClick?: React.ComponentProps<'button'>['onClick'];
  /** Whether the item is pinned */
  pin?: boolean;
  /** Tooltip text when pinned (default: 'Unpin') */
  pinnedTooltip?: string;
  /** Tooltip text when unpinned (default: 'Pin') */
  unpinnedTooltip?: string;
}
const PinToggler = (props: Props) => {
  const { className, onClick, pin, pinnedTooltip = 'Unpin', unpinnedTooltip = 'Pin' } = props;

  const icon = pin ? 'mdi-pin-off' : 'mdi-pin';
  return (
    <ButtonIcon
      triggerParent
      className={className}
      tooltipContent={pin ? pinnedTooltip : unpinnedTooltip}
      tooltipPlacement="bottomLeft"
      onClick={onClick}
    >
      <SvgIcon icon={icon} />
    </ButtonIcon>
  );
};

export default PinToggler;
