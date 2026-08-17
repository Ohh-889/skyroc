import type { Ref } from 'react';
import type { SlotClassNames } from '../../types';
import type { TextProps } from '../text';

/**
 * TextEllipsis 可覆盖的 slot 名称。
 *
 * `root` 是承载正文与隐藏测量文本的容器，`text` 作用于正文， `action` 作用于内联在正文尾部的展开 / 收起文本。
 */
export type TextEllipsisSlots = 'action' | 'root' | 'text';

/** TextEllipsis 组件属性 */
export interface TextEllipsisProps extends Omit<
  TextProps,
  'asChild' | 'children' | 'className' | 'numberOfLines' | 'onTextLayout' | 'ref'
> {
  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<TextEllipsisSlots>;

  /** 展开态尾部的操作文本，留空则展开后不提供收起入口 */
  collapseText?: string;

  /** 文本内容 */
  content: string;

  /** 初始是否展开（非受控） */
  defaultExpanded?: boolean;

  /**
   * 截断处的省略号。
   *
   * 只在 `expandText` 非空、需要把操作文本内联到正文尾部时生效； 没有操作文本时不做裁剪，由原生的尾部省略号接管。
   */
  dots?: string;

  /** 是否展开（受控） */
  expanded?: boolean;

  /** 收起态尾部的操作文本，留空则只做原生省略、不显示展开入口 */
  expandText?: string;

  /** 展开状态变化回调 */
  onExpandedChange?: (expanded: boolean) => void;

  /** 命令式控制的 ref，用于 toggle */
  ref?: Ref<TextEllipsisRef>;

  /** 收起态最多显示的行数，内容或行数变化后会回到收起态 */
  rows?: number;
}

/** TextEllipsis 暴露方法 */
export interface TextEllipsisRef {
  /** 切换展开 / 收起，传 true 展开、传 false 收起，不传则取反 */
  toggle: (expanded?: boolean) => void;
}
