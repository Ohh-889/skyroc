import type { ReactNode } from 'react';
import type { InputProps } from '../input';
import type { SearchVariantProps } from './search-variants';

/** Search 组件属性 */
export interface SearchProps extends Omit<InputProps, 'leading' | 'variant'>, SearchVariantProps {
  /** 右侧操作按钮文本，默认"取消" */
  actionText?: string;

  /** 搜索栏外层背景色 */
  background?: string;

  /** 外层容器自定义 className */
  className?: string;

  /** 左侧标签文本 */
  label?: string;

  /** 自定义搜索图标，默认为放大镜 */
  leftIcon?: ReactNode;

  /** 点击操作按钮回调 */
  onCancel?: () => void;

  /** 确认搜索回调（键盘搜索键触发） */
  onSearch?: (value: string) => void;

  /** 是否显示右侧操作按钮 */
  showAction?: boolean;
}
