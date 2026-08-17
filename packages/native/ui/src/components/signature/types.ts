import type { Ref } from 'react';
import type { SlotClassNames } from '../../types/shared';
import type { SignatureSlots, SignatureVariantProps } from './signature-variants';

/** 签名图片导出格式 */
type SignatureImageType = 'jpeg' | 'png';

/** 签名提交数据 */
interface SignatureSubmitData {
  /**
   * Base64 编码的签名图片 data URI。
   *
   * 画布为空时为空字符串；`isEmpty` 为 false 却拿到空字符串，说明快照生成失败（画布尚未上屏等）。
   */
  image: string;

  /** 签名画布是否为空 */
  isEmpty: boolean;
}

/** 签名组件实例暴露的方法 */
interface SignatureRef {
  /** 清除画布上的所有签名内容 */
  clear: () => void;

  /** 触发提交，等价于点击确认按钮，结果通过 onSubmit 回调返回 */
  submit: () => void;

  /** 生成签名图片的 data URI，画布为空或快照失败时返回空字符串 */
  toDataURL: () => Promise<string>;

  /** 撤销最后一笔 */
  undo: () => void;
}

/** 签名组件属性 */
interface SignatureProps extends SignatureVariantProps {
  /**
   * 画布填充色，会一并烘进导出的图片，默认透明。
   *
   * JPEG 没有 alpha 通道，导出格式为 jpeg 且此项为空（或 `transparent`）时， 会自动回落到画布的 `bg-background`，避免透明区域被压成纯黑。
   */
  backgroundColor?: string;

  /** Uniwind 类名，作用于根容器；各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的 className */
  classNames?: SlotClassNames<SignatureSlots>;

  /** 清除按钮文字 */
  clearButtonText?: string;

  /** 确认按钮文字 */
  confirmButtonText?: string;

  /** 是否禁用，禁用后整体置灰、画布与底部按钮均不响应 */
  disabled?: boolean;

  /** 画笔线宽（px） */
  lineWidth?: number;

  /** 清除签名时触发 */
  onClear?: () => void;

  /** 签名结束（手指抬起）时触发 */
  onEnd?: () => void;

  /**
   * 签名过程中（手指移动）持续触发。
   *
   * 绘制本身跑在 UI 线程、不经过 React；传了这个回调就意味着每一帧都要跨回 JS 线程， 只在确实需要「正在书写」指示时才传。
   */
  onSigning?: () => void;

  /** 开始签名（手指触摸画布）时触发 */
  onStart?: () => void;

  /** 提交签名时触发，无论成功与否每次提交都恰好回调一次 */
  onSubmit?: (data: SignatureSubmitData) => void;

  /** 画笔颜色，传入后覆盖 `color` 变体解析出的主题色；仅在需要脱离主题时使用 */
  penColor?: string;

  /** 导出图片质量，取值 0–100，缺省时 png 用 100、jpeg 用 80 */
  quality?: number;

  /** 是否只读，只读时画布不接受输入但仍可提交已有内容 */
  readonly?: boolean;

  /** 组件实例引用，用于命令式调用 clear / undo / submit / toDataURL */
  ref?: Ref<SignatureRef>;

  /** 是否显示底部按钮栏（清除 + 确认） */
  showFooter?: boolean;

  /** 画布为空时显示的提示文字 */
  tips?: string;

  /** 导出图片格式 */
  type?: SignatureImageType;
}

export type { SignatureImageType, SignatureProps, SignatureRef, SignatureSubmitData };
