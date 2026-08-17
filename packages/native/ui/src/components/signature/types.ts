import type { Ref } from 'react';
import type { SlotClassNames } from '../../types/shared';
import type { SignatureSlots, SignatureVariantProps } from './signature-variants';

/** 签名图片导出格式 */
type SignatureImageType = 'jpeg' | 'png';

/** 签名提交数据 */
interface SignatureSubmitData {
  /** Base64 编码的签名图片数据 URI，画布为空时为空字符串 */
  image: string;

  /** 签名画布是否为空 */
  isEmpty: boolean;
}

/** 签名组件实例暴露的方法 */
interface SignatureRef {
  /** 清除画布上的所有签名内容 */
  clear: () => void;

  /** 触发提交，生成签名图片并通过 onSubmit 回调返回 */
  submit: () => void;
}

/** 签名组件属性 */
interface SignatureProps extends SignatureVariantProps {
  /** 画布背景色，默认透明 */
  backgroundColor?: string;

  /** NativeWind 类名 */
  className?: string;

  /** 覆盖各插槽的 className */
  classNames?: SlotClassNames<SignatureSlots>;

  /** 清除按钮文字 */
  clearButtonText?: string;

  /** 确认按钮文字 */
  confirmButtonText?: string;

  /** 画笔线宽（像素） */
  lineWidth?: number;

  /** 清除签名时触发 */
  onClear?: () => void;

  /** 签名结束（手指抬起）时触发 */
  onEnd?: () => void;

  /** 签名过程中（手指移动）触发 */
  onSigning?: () => void;

  /** 开始签名（手指触摸画布）时触发 */
  onStart?: () => void;

  /** 提交签名时触发，返回签名图片数据 */
  onSubmit?: (data: SignatureSubmitData) => void;

  /** 画笔颜色 */
  penColor?: string;

  /** 组件实例引用，用于调用 clear/submit 方法 */
  ref?: Ref<SignatureRef>;

  /** 是否显示底部按钮栏（清除 + 确认） */
  showFooter?: boolean;

  /** 画布为空时显示的提示文字 */
  tips?: string;

  /** 导出图片格式 */
  type?: SignatureImageType;
}

export type { SignatureImageType, SignatureProps, SignatureRef, SignatureSubmitData };
