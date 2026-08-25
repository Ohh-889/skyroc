import { Icon } from '@iconify/react';

import ButtonIcon from './ButtonIcon';

interface Props {
  /** Button class */
  className?: string;
  /** Tooltip text when entering fullscreen (default: 'Fullscreen') */
  enterTooltip?: string;
  /** Tooltip text when exiting fullscreen (default: 'Exit Fullscreen') */
  exitTooltip?: string;
  /** Whether currently in fullscreen */
  full?: boolean;
  /** Toggle fullscreen callback */
  toggleFullscreen: () => void;
}

const FullScreen = (props: Props) => {
  const { className, enterTooltip = 'Fullscreen', exitTooltip = 'Exit Fullscreen', full, toggleFullscreen } = props;

  return (
    <ButtonIcon
      className={className}
      hoverAnimation="scale"
      tooltipContent={full ? exitTooltip : enterTooltip}
      onClick={toggleFullscreen}
    >
      <Icon icon={full ? 'gridicons:fullscreen-exit' : 'gridicons:fullscreen'} />
    </ButtonIcon>
  );
};

export default FullScreen;
