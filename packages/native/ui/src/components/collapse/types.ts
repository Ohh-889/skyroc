import type { ReactNode, Ref } from 'react';
import type { SlotClassNames } from '../../types';
import type { CellSize, CellSlots } from '../cell';

/** 面板名称类型 */
export type CollapseItemName = number | string;

/**
 * 展开值：手风琴模式下是单个面板名（`null` 表示全部收起），否则是名称数组。
 *
 * 用 `null` 而不是 `undefined` 表示空值，否则受控模式下会被判定成非受控。
 */
export type CollapseValue = CollapseItemName | CollapseItemName[] | null;

/**
 * CollapseItem 可覆盖的 slot 名称。
 *
 * `arrow` 作用于箭头图标的 `colorClassName`，只接受 `accent-*` 颜色类； `contentText` 只在 children 为纯字符串、由组件包一层 Text 时生效； 标题行由内部的 Cell
 * 渲染，细粒度覆盖走 `headerClassNames`。
 */
export type CollapseItemSlots = 'arrow' | 'content' | 'contentText' | 'root' | 'wrapper';

/** Collapse 组件属性 */
export interface CollapseProps {
  /** 是否手风琴模式（同时只能展开一个） */
  accordion?: boolean;

  /** 是否显示外边框 */
  border?: boolean;

  /** 子元素 */
  children?: ReactNode;

  /** 自定义容器 className */
  className?: string;

  /** 默认展开的面板名称（非受控） */
  defaultValue?: CollapseValue;

  /** 值变化回调 */
  onChange?: (value: CollapseValue) => void;

  /** Ref */
  ref?: Ref<CollapseRef>;

  /** 当前展开的面板名称（受控），手风琴模式下用 `null` 表示全部收起 */
  value?: CollapseValue;
}

/** Collapse 暴露方法 */
export interface CollapseRef {
  /** 切换所有面板（手风琴模式下无效） */
  toggleAll: (options?: CollapseToggleAllOptions | boolean) => void;
}

/** ToggleAll 选项 */
export interface CollapseToggleAllOptions {
  /** 是否展开 */
  expanded?: boolean;

  /** 是否跳过禁用面板 */
  skipDisabled?: boolean;
}

/** CollapseItem 组件属性 */
export interface CollapseItemProps {
  /** 子元素（面板内容），传字符串时组件会自动包一层 Text */
  children?: ReactNode;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<CollapseItemSlots>;

  /** 是否禁用 */
  disabled?: boolean;

  /** 覆盖标题行各 slot 的类名，标题行由内部的 Cell 渲染，只能从这里透传 */
  headerClassNames?: SlotClassNames<CellSlots>;

  /** 左侧图标 */
  icon?: ReactNode;

  /** 是否显示箭头 */
  isLink?: boolean;

  /** 标题下方描述 */
  label?: ReactNode;

  /** 是否懒渲染（首次展开时才渲染内容） */
  lazyRender?: boolean;

  /**
   * 唯一标识，默认取该面板在 Collapse 子元素中的序号。
   *
   * 序号只对直接子元素成立，面板外面套了容器、或需要动态增删面板时必须显式传值。
   */
  name?: CollapseItemName;

  /** 是否只读 */
  readonly?: boolean;

  /** Ref */
  ref?: Ref<CollapseItemRef>;

  /** 标题尺寸 */
  size?: CellSize;

  /** 标题文本 */
  title?: ReactNode;

  /** 标题右侧文本 */
  value?: ReactNode;
}

/** CollapseItem 暴露方法 */
export interface CollapseItemRef {
  /** 切换面板 */
  toggle: (expanded?: boolean) => void;
}

/** CollapseContext 值类型 */
export interface CollapseContextValue {
  /** 判断面板是否展开 */
  isExpanded: (name: CollapseItemName) => boolean;

  /** 注册面板（返回取消注册函数） */
  register: (item: CollapseItemRegistration) => () => void;

  /** 切换面板 */
  toggle: (name: CollapseItemName, expanded: boolean) => void;
}

/**
 * 面板注册信息，只服务于 toggleAll。
 *
 * 刻意不带展开态：展开态由 Collapse 自己的 `isExpanded` 现算， 否则每次展开都要重新注册，itemsRef 的顺序会随之漂移。
 */
export interface CollapseItemRegistration {
  /** 是否禁用 */
  disabled: boolean;

  /** 面板名称 */
  name: CollapseItemName;
}
