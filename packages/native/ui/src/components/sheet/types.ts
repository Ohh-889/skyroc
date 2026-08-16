import type { ReactNode } from 'react';
import type { BottomSheetModalProps } from '@gorhom/bottom-sheet';
import type { SlotClassNames } from '../../types';

/** Sheet 组件可覆盖的 slot 名称 */
export type SheetSlots = 'body' | 'close' | 'description' | 'handle' | 'handleBar' | 'header' | 'root' | 'title';

/** 从 BottomSheetModalProps 中排除的属性，由 Sheet 内部管理 */
type SheetOmitProps = 'children' | 'enableDynamicSizing' | 'ref' | 'snapPoints';

/** Sheet 底部面板组件属性 */
export interface SheetProps extends Omit<Partial<BottomSheetModalProps>, SheetOmitProps> {
  /** 面板内容 */
  children?: ReactNode;

  /** 自定义容器样式类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<SheetSlots>;

  /** 是否显示关闭按钮 */
  closeable?: boolean;

  /** 是否允许点击遮罩关闭，默认 true */
  closeOnBackdropPress?: boolean;

  /** 描述信息，显示在标题下方 */
  description?: string;

  /** 是否允许下拉关闭 */
  enablePanDownToClose?: boolean;

  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;

  /** 是否显示面板 */
  show: boolean;

  /** 是否显示拖拽指示条 */
  showHandle?: boolean;

  /** 吸附点，如 ['25%', '50%'] */
  snapPoints?: BottomSheetModalProps['snapPoints'];

  /** 面板标题 */
  title?: string;
}
