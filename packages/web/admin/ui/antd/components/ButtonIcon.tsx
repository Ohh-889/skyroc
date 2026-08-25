// oxlint-disable import/no-unassigned-import
import { SvgIcon } from '@shell/ui/compose';
import { Button, Tooltip } from 'antd';
import type { ButtonProps, TooltipProps } from 'antd';
import { clsx } from 'clsx';
import type { CSSProperties } from 'react';

import type { ButtonLinkComponentProps } from './ButtonLink';
import ButtonLink from './ButtonLink';
import './styles/button-icon-animations.css';

/** Icon hover animation types */
export type IconHoverAnimation =
  | 'bounce' // 弹跳 - 活泼有趣
  | 'flip' // 3D翻转 - 酷炫效果
  | 'pulse' // 脉冲缩放 - 呼吸效果
  | 'rotate' // 旋转 - 适合刷新、设置等图标
  | 'scale' // 缩放放大 - 经典的交互反馈
  | 'shake' // 左右抖动 - 吸引注意力
  | 'spin' // 持续旋转 - 适合加载、刷新
  | 'swing' // 摇摆 - 类似钟摆
  | 'tada' // 惊喜效果 - 多维度组合动画
  | 'wiggle'; // 扭动 - 俏皮可爱

type BaseProps = {
  children?: React.ReactNode;
  /** Button class */
  className?: string;
  /** Tooltip class names */
  classNames?: {
    button?: string;
    icon?: string;
    tooltip?: TooltipProps['classNames'];
  };
  /** Icon hover animation effect */
  hoverAnimation?: IconHoverAnimation;
  /** Iconify icon name */
  icon?: string;
  styles?: {
    button?: ButtonProps['styles'];
    icon?: CSSProperties;
    tooltip?: TooltipProps['styles'];
  };

  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: TooltipProps['placement'];
  /** Tooltip props */
  tooltipProps?: Omit<TooltipProps, 'children' | 'classNames' | 'getPopupContainer' | 'placement' | 'title' | 'zIndex'>;
  /** Trigger tooltip on parent */
  triggerParent?: boolean;
  /** Z-index */
  zIndex?: number;
};

type WithButtonProps = Omit<ButtonProps, 'icon' | 'iconPosition'> & BaseProps;

type WithLinkProps = Partial<Omit<ButtonLinkComponentProps, 'icon' | 'iconPosition'>> & BaseProps;

export type ButtonIconProps = WithButtonProps | WithLinkProps;

/** - 动态计算class */
const computeClass = (className: string) => {
  let clsStr = className;

  if (!clsStr.includes('h-')) {
    clsStr += ' h-2xl';
  }

  if (!clsStr.includes('text-')) {
    clsStr += ' text-lg';
  }

  return clsStr;
};

const ButtonIcon = ({
  children,
  className = 'h-2xl text-lg',
  classNames,
  hoverAnimation,
  icon,
  styles,
  tooltipContent,
  tooltipPlacement = 'bottom',
  tooltipProps,
  triggerParent,
  zIndex = 98,
  ...rest
}: ButtonIconProps) => {
  const cls = computeClass(className);

  function getPopupContainer(triggerNode: HTMLElement) {
    return triggerParent ? triggerNode.parentElement! : document.body;
  }

  const Comp = 'to' in rest ? ButtonLink : Button;

  const typeProps = 'to' in rest ? { btnType: 'text' as const } : { type: 'text' as const };

  // 根据动画类型添加对应的动画类名
  const animationClass = hoverAnimation ? `btn-icon-hover-${hoverAnimation}` : '';

  return (
    <Tooltip
      classNames={classNames?.tooltip}
      getPopupContainer={getPopupContainer}
      placement={tooltipPlacement}
      styles={styles?.tooltip}
      title={tooltipContent}
      zIndex={zIndex}
      {...tooltipProps}
    >
      <Comp className={clsx(cls, classNames?.button)} {...typeProps} {...rest} styles={styles?.button}>
        <div className={clsx('flex-center gap-8px', animationClass)}>
          {children || <SvgIcon className={classNames?.icon} icon={icon} style={styles?.icon} />}
        </div>
      </Comp>
    </Tooltip>
  );
};
export default ButtonIcon;
