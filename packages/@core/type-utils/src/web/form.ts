import type { Noop } from '../fn';

/**
 * 自定义表单控件的最小结构。
 *
 * 用于把第三方 / 自研控件当作原生表单元素统一处理，`T` 是该控件额外暴露的字段。
 *
 * `T` 默认是 `unknown` 而不是 `any`——交叉类型里出现 `any` 会把整个类型塌成 `any`， 那样 `CustomElement` 和 {@link FieldElement} 就彻底失去约束力了。
 */
export type CustomElement<T = unknown> = Partial<HTMLElement> &
  T & {
    /** 勾选态，checkbox / radio 用 */
    checked?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 已选文件，file 输入用 */
    files?: FileList | null;
    /** 聚焦控件 */
    focus?: Noop;
    /** 可选项集合，select 用 */
    options?: HTMLOptionsCollection;
    /** 控件类型，如 'checkbox' / 'radio' / 'file' */
    type?: string;
    /** 当前值 */
    value?: any;
  };

/** 表单收集器能接受的元素：三种原生输入元素，或符合 {@link CustomElement} 结构的自定义控件。 */
export type FieldElement<T = unknown> = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | CustomElement<T>;
