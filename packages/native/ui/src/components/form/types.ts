import type { AllPathsKeys, FormBaseProps, Rule } from '@skyroc/form';
import type { ReactElement, ReactNode, Ref } from 'react';
import type { View } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { CellGroupProps } from '../cell/types';

// ==================== Form ====================

/**
 * Form 组件属性。
 *
 * 分组外观直接取自 CellGroup —— Form 只是把它接到表单上下文上， 布局属性照抄一份会在 CellGroup 演进时悄悄落后。
 */
export interface FormProps<Values = any>
  extends FormBaseProps<Values>, Pick<CellGroupProps, 'border' | 'classNames' | 'inset' | 'title'> {
  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;
}

// ==================== Form.Item ====================

/** Form.Item 可覆盖的 slot 名称 */
export type FormItemSlots = 'cell' | 'control' | 'description' | 'extra' | 'label' | 'message' | 'required' | 'root';

/** Form.Item slot 类名覆盖 */
export type FormItemClassNames = SlotClassNames<FormItemSlots>;

/**
 * Form.Item 组件属性。
 *
 * 字段配置逐条显式声明，没有直接继承 core 的 `FieldProps` —— 后者带 `Record<string, any>` 索引签名， 继承过来会让所有拼错的属性名都变成合法输入。
 */
export interface FormItemProps<Values = any> {
  /** 默认箭头的方向，showArrow 为 false 时无效 */
  arrowDirection?: 'down' | 'left' | 'right' | 'up';

  /** 子组件 — 接收注入的 value / onChange / error */
  children: ReactElement;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的 className */
  classNames?: FormItemClassNames;

  /** 描述文本，显示在输入区域下方 */
  description?: string;

  /** 是否禁用整行交互 */
  disabled?: boolean;

  /**
   * 从子组件回调参数里取值。
   *
   * 缺省实现取第一个参数，并把 TextInput 的原生事件抹平成 `nativeEvent.text`。
   */
  getValueFromEvent?: (...args: any[]) => any;

  /** 值传给子组件前的转换 */
  getValueProps?: (value: any) => any;

  /** 字段初始值 */
  initialValue?: any;

  /** 标签文本 */
  label?: string;

  /** 标签对齐方式，left 为标签与输入区左右排布，top 为标签压在输入区上方 */
  labelAlign?: 'left' | 'top';

  /** 标签列宽度，仅 labelAlign 为 left 时生效 */
  labelWidth?: number;

  /** 字段名，支持 `a.b[0]` 这样的路径 */
  name: AllPathsKeys<Values>;

  /** 值变化后的归一化处理 */
  normalize?: (value: any, prevValue: any, allValues: Values) => any;

  /** 点击回调，整行可点，通常用于打开选择器 */
  onPress?: () => void;

  /** 子组件卸载后是否保留字段值 */
  preserve?: boolean;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /**
   * 是否显示必填标记。
   *
   * 缺省时由 `rules` 里的 required 推导；显式传 `true` 会自动补一条 required 规则， 显式传 `false` 只隐藏标记，不影响已有规则。
   */
  required?: boolean;

  /** 校验规则 */
  rules?: Rule[];

  /** 是否显示右侧箭头，缺省时由 onPress 推导 */
  showArrow?: boolean;

  /** 尺寸，只影响行高与标签 / 错误 / 描述的排版，不会透传给子组件 */
  size?: 'lg' | 'md' | 'sm';

  /** 右侧自定义内容，位于输入区与箭头之间 */
  trailing?: ReactNode;

  /** 触发取值的回调名，默认 `onChange` */
  trigger?: string;

  /** 触发校验的回调名，缺省跟随 Form 的 validateTrigger */
  validateTrigger?: string | string[] | false;

  /** 值属性名，默认 `value` */
  valuePropName?: string;
}

// ==================== FormComputedField ====================

/**
 * FormComputedField 组件属性。
 *
 * 与 Form.Item 同样逐条显式声明，不继承带索引签名的 `ComputedFieldProps`。
 */
export interface FormComputedFieldProps<Values = any> {
  /** 子组件 — 接收注入的计算值，并被置为只读 */
  children: ReactElement;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的 className */
  classNames?: FormItemClassNames;

  /** 依据依赖字段计算当前值 */
  compute: (get: (name: AllPathsKeys<Values>) => any, all: Values) => any;

  /** 依赖的字段名，任一变化都会触发重算 */
  deps: AllPathsKeys<Values>[];

  /** 描述文本，显示在计算结果下方 */
  description?: string;

  /** 标签文本 */
  label?: string;

  /** 标签列宽度，与同一表单里的 Form.Item 保持一致才能对齐 */
  labelWidth?: number;

  /** 字段名，支持 `a.b[0]` 这样的路径 */
  name: AllPathsKeys<Values>;

  /** 子组件卸载后是否保留字段值 */
  preserve?: boolean;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** 是否显示必填标记，计算字段不参与推导，只作展示 */
  required?: boolean;

  /** 校验规则 */
  rules?: Rule[];

  /** 尺寸，只影响行高与标签 / 错误 / 描述的排版，不会透传给子组件 */
  size?: 'lg' | 'md' | 'sm';

  /** 值属性名，默认 `value` */
  valuePropName?: string;
}
