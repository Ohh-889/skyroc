import type { AllPathsKeys, FormBaseProps, Rule } from '@skyroc/form';
import type { ComponentPropsWithoutRef, ElementType, ReactElement, Ref } from 'react';
import type { View } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { FieldGroupGap } from './field-variants';

// ==================== FieldGroup ====================

/** FieldGroup 可覆盖的 slot 名称 */
export type FieldGroupSlots = 'content' | 'root';

/** FieldGroup 自有属性，容器组件本身的属性由 FieldGroupProps 合并进来 */
export interface FieldGroupOwnProps<Values = any> extends FormBaseProps<Values> {
  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的 className */
  classNames?: SlotClassNames<FieldGroupSlots>;

  /** 子项间距档位，对应 Uniwind 的 `gap-*`，默认 6（24px） */
  gap?: FieldGroupGap;
}

/**
 * FieldGroup 组件属性。
 *
 * `component` 传什么，就能继续传什么属性 —— 例如 `component={ScrollView}` 之后 `contentContainerClassName`、`keyboardShouldPersistTaps`
 * 都是合法属性。
 */
export type FieldGroupProps<Values = any, As extends ElementType = typeof View> = FieldGroupOwnProps<Values> &
  Omit<ComponentPropsWithoutRef<As>, keyof FieldGroupOwnProps<Values>> & {
    /** 容器组件，默认 View，可传 ScrollView / KeyboardAwareScrollView 等 */
    component?: As;

    /** 容器组件实例的 ref，用于 scrollTo / measure 等命令式操作 */
    ref?: Ref<As>;
  };

// ==================== FieldLabel / FieldExtra（内部组件） ====================

/** FieldLabel 组件属性，两套布局共用同一段标签结构，样式一律由调用方传入 */
export interface FieldLabelProps {
  /** 排列容器的类名 */
  className?: string;

  /** 标签文本，为空时整行不渲染 */
  label?: string;

  /** 标签文本的类名 */
  labelClassName?: string;

  /** 是否显示必填星号 */
  required?: boolean;

  /** 必填星号的类名 */
  requiredClassName?: string;

  /** 标签列固定宽度，左右布局靠它对齐各行输入区；缺省则由文本撑开 */
  width?: number;
}

/** FieldExtra 组件属性，两套布局共用同一段提示结构，样式一律由调用方传入 */
export interface FieldExtraProps {
  /** 外层容器的类名 */
  className?: string;

  /** 描述文本 */
  description?: string;

  /** 描述文本的类名 */
  descriptionClassName?: string;

  /** 错误文案，`null` 表示当前字段没有错误 */
  message?: string | null;

  /** 错误文案的类名 */
  messageClassName?: string;
}

// ==================== FieldItem ====================

/** FieldItem 可覆盖的 slot 名称 */
export type FieldItemSlots = 'control' | 'description' | 'extra' | 'label' | 'message' | 'required' | 'root';

/** FieldItem slot 类名覆盖 */
export type FieldItemClassNames = SlotClassNames<FieldItemSlots>;

/**
 * FieldItem 组件属性。
 *
 * 字段配置逐条显式声明，没有直接继承 core 的 `FieldProps` —— 后者带 `Record<string, any>` 索引签名， 继承过来会让所有拼错的属性名都变成合法输入。
 */
export interface FieldItemProps<Values = any> {
  /** 子组件 — 接收注入的 value / onChange / error */
  children: ReactElement;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的 className */
  classNames?: FieldItemClassNames;

  /** 描述文本，显示在子组件下方 */
  description?: string;

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

  /** 字段名，支持 `a.b[0]` 这样的路径 */
  name: AllPathsKeys<Values>;

  /** 值变化后的归一化处理 */
  normalize?: (value: any, prevValue: any, allValues: Values) => any;

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

  /** 尺寸，只影响标签 / 错误 / 描述的排版，不会透传给子组件 */
  size?: 'lg' | 'md' | 'sm';

  /** 触发取值的回调名，默认 `onChange` */
  trigger?: string;

  /** 触发校验的回调名，缺省跟随 FieldGroup 的 validateTrigger */
  validateTrigger?: string | string[] | false;

  /** 值属性名，默认 `value` */
  valuePropName?: string;
}
