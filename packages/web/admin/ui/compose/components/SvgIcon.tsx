import { Icon } from '@iconify/react';
import type { CSSProperties } from 'react';

interface Props {
  readonly className?: string;
  /** Iconify icon name */
  readonly icon?: string | null;
  /** Local svg icon name */
  readonly localIcon?: string | null;
  /** Local icon prefix (default: 'icon-local') */
  readonly localIconPrefix?: string;
  readonly style?: CSSProperties;
}

const defaultLocalIcon = 'no-icon';
const symbolId = (localIconPrefix: string, localIcon: string | null = defaultLocalIcon) => {
  const iconName = localIcon || defaultLocalIcon;

  return `#${localIconPrefix}-${iconName}`;
};

/**
 * Props
 *
 * - Support iconify and local svg icon
 * - If icon and localIcon are passed at the same time, localIcon will be rendered first
 */
const SvgIcon = ({ icon, localIcon, localIconPrefix = 'icon-local', ...props }: Props) => {
  /** If localIcon is passed, render localIcon first */
  return localIcon || !icon ? (
    <svg height="1em" width="1em" {...props} aria-hidden="true">
      <use fill="currentColor" href={symbolId(localIconPrefix, localIcon)} />
    </svg>
  ) : (
    <Icon icon={icon} {...props} />
  );
};

export default SvgIcon;
