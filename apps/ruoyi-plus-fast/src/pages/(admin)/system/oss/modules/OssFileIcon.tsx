import { SvgIcon } from '@shell/ui/compose';

import { getFileVisual } from './oss-utils';
import type { OssFileTone } from './oss-utils';

/**
 * 类型配色。
 *
 * 这些类名必须写在 tsx 里：UnoCSS 的扫描管道只包含 .tsx，写进 .ts 的字符串不会生成样式。 用的都是数字色阶（xx-50 / xx-600），预设色没有裸变量可用。
 */
const TONE_CLASS_NAMES: Record<OssFileTone, string> = {
  archive: 'bg-warning-50 text-warning-600',
  audio: 'bg-magenta-50 text-magenta-600',
  code: 'bg-cyan-50 text-cyan-600',
  doc: 'bg-primary-50 text-primary-600',
  image: 'bg-success-50 text-success-600',
  pdf: 'bg-error-50 text-error-600',
  sheet: 'bg-green-50 text-green-600',
  slide: 'bg-orange-50 text-orange-600',
  text: 'bg-info-50 text-info-600',
  unknown: 'bg-layout text-secondary',
  video: 'bg-purple-50 text-purple-600'
};

const SIZE_CLASS_NAMES = {
  large: 'size-64px rounded-16px text-28px',
  medium: 'size-40px rounded-8px text-18px',
  small: 'size-32px rounded-6px text-15px'
};

interface OssFileIconProps {
  /** 图标方块尺寸。 */
  size?: keyof typeof SIZE_CLASS_NAMES;
  /** 文件后缀，带不带点都可以。 */
  suffix?: null | string;
}

/** 按文件类型渲染一个带底色的图标方块。类型名同时挂在 aria-label 上，不让状态只靠颜色表达。 */
const OssFileIcon = (props: OssFileIconProps) => {
  const { size = 'medium', suffix } = props;

  const visual = getFileVisual(suffix);

  return (
    <span
      aria-label={visual.label}
      role="img"
      className={`grid shrink-0 place-items-center ${SIZE_CLASS_NAMES[size]} ${TONE_CLASS_NAMES[visual.tone]}`}
    >
      <SvgIcon icon={visual.icon} />
    </span>
  );
};

export default OssFileIcon;
