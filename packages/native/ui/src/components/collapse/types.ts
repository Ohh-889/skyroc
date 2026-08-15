import type { ReactNode, Ref } from 'react';

/** 面板名称类型 */
export type CollapseItemName = number | string;

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
  defaultValue?: CollapseItemName | CollapseItemName[];

  /** 值变化回调 */
  onChange?: (value: CollapseItemName | CollapseItemName[]) => void;

  /** ref */
  ref?: Ref<CollapseRef>;

  /** 当前展开的面板名称（受控） */
  value?: CollapseItemName | CollapseItemName[];
}

/** Collapse 暴露方法 */
export interface CollapseRef {
  /** 切换所有面板（手风琴模式下无效） */
  toggleAll: (options?: CollapseToggleAllOptions | boolean) => void;
}

/** toggleAll 选项 */
export interface CollapseToggleAllOptions {
  /** 是否展开 */
  expanded?: boolean;

  /** 是否跳过禁用面板 */
  skipDisabled?: boolean;
}

/** CollapseItem 组件属性 */
export interface CollapseItemProps {
  /** 子元素（面板内容） */
  children?: ReactNode;

  /** 自定义容器 className */
  className?: string;

  /** 是否禁用 */
  disabled?: boolean;

  /** 左侧图标 */
  icon?: ReactNode;

  /** 是否显示箭头 */
  isLink?: boolean;

  /** 标题下方描述 */
  label?: ReactNode;

  /** 是否懒渲染（首次展开时才渲染内容） */
  lazyRender?: boolean;

  /** 唯一标识，默认为索引 */
  name?: CollapseItemName;

  /** 是否只读 */
  readonly?: boolean;

  /** ref */
  ref?: Ref<CollapseItemRef>;

  /** 标题尺寸 */
  size?: 'lg' | 'md';

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

/** 面板注册信息 */
export interface CollapseItemRegistration {
  /** 是否禁用 */
  disabled: boolean;

  /** 是否展开 */
  expanded: boolean;

  /** 面板名称 */
  name: CollapseItemName;
}
