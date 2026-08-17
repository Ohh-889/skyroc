import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';
import type { InputProps, InputSlots } from '../input';
import type { SearchVariantProps } from './search-variants';

/** Search slot 名称，`input` 落在内部 Input 的根节点上 */
export type SearchSlots = 'action' | 'actionText' | 'input' | 'label' | 'root';

/** Search 组件属性 */
export interface SearchProps
  extends Omit<InputProps, 'className' | 'classNames' | 'leading' | 'variant'>, SearchVariantProps {
  /** 右侧操作按钮内容，string / number 自动包裹 Text，也可传图标节点，默认「取消」 */
  action?: ReactNode;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的 className */
  classNames?: SlotClassNames<SearchSlots>;

  /** 覆盖内部 Input 各 slot 的 className，输入框根节点用 classNames.input 即可，这里管的是 control / action */
  inputClassNames?: SlotClassNames<InputSlots>;

  /** 左侧标签内容，string / number 自动包裹 Text */
  label?: ReactNode;

  /** 左侧内容，默认为放大镜图标；传入后完全取代默认图标 */
  leading?: ReactNode;

  /** 点击操作按钮回调 */
  onCancel?: () => void;

  /** 确认搜索回调（键盘搜索键触发），参数为提交时输入框内的文本 */
  onSearch?: (value: string) => void;

  /** 是否显示右侧操作按钮 */
  showAction?: boolean;
}
