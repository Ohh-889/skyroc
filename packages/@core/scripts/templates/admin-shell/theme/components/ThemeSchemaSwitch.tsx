import { ButtonIcon } from '@shell/ui/antd';
import type { ButtonProps, TooltipProps } from 'antd';
import type { CSSProperties } from 'react';
import { memo } from 'react';
import { useTheme } from '../hooks/use-theme';
import { icons } from './shared';

interface ThemeSchemaSwitchProps {
  /** Custom class name */
  className?: string;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Custom style */
  style?: CSSProperties;
  /** Tooltip content text */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: TooltipProps['placement'];
}

const DEFAULT_ANIMATION_DURATION = 400;
const DEFAULT_ANIMATION_EASING = 'ease-in-out';

const ThemeSchemaSwitch = memo((props: ThemeSchemaSwitchProps) => {
  const { className, showTooltip = true, style, tooltipContent = 'Theme Schema', tooltipPlacement = 'bottom' } = props;

  const { themeScheme, toggleThemeScheme } = useTheme();

  const resolvedTooltip = showTooltip ? tooltipContent : '';
  const hoverAnimation = themeScheme === 'light' ? 'rotate' : 'scale';

  const toggleDark: ButtonProps['onClick'] = async event => {
    const isAppearanceTransition = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isAppearanceTransition) {
      toggleThemeScheme();
      return;
    }

    await document.startViewTransition(() => {
      toggleThemeScheme();
    }).ready;

    if (themeScheme === 'auto') return;

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

    document.documentElement.animate(
      {
        clipPath
      },
      {
        duration: DEFAULT_ANIMATION_DURATION,
        easing: DEFAULT_ANIMATION_EASING,
        pseudoElement: '::view-transition-new(root)'
      }
    );
  };

  return (
    <ButtonIcon
      className={className}
      hoverAnimation={hoverAnimation}
      icon={icons[themeScheme]}
      style={style}
      tooltipContent={resolvedTooltip}
      tooltipPlacement={tooltipPlacement}
      onClick={toggleDark}
    />
  );
});

export default ThemeSchemaSwitch;
