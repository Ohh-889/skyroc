import type { Options } from '@better-scroll/core';
import BScroll from '@better-scroll/core';
import { useMount, useSize, useUpdateEffect } from 'ahooks';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, FC, Ref } from 'react';
import { useImperativeHandle, useRef } from 'react';

interface Props extends ComponentPropsWithoutRef<'div'> {
  /**
   * BetterScroll options
   *
   * @link https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html
   */
  options: Options;
  ref: Ref<BScroll>;
}

const BetterScroll: FC<Props> = ({ children, className, options, ref, ...rest }) => {
  const bsWrapper = useRef<HTMLDivElement>(null);
  const bsContent = useRef<HTMLDivElement>(null);
  const bsWrapperSize = useSize(bsWrapper);
  const bsContentSize = useSize(bsContent);
  const instance = useRef<BScroll | null>(null);

  const isScrollY = Boolean(options.scrollY);

  function initBetterScroll() {
    if (!bsWrapper.current) return;
    instance.current = new BScroll(bsWrapper.current, options);
  }

  useImperativeHandle(ref, () => instance.current as BScroll);

  useUpdateEffect(() => {
    instance.current?.refresh();
  }, [bsWrapperSize?.width, bsContentSize?.width]);

  useMount(() => {
    initBetterScroll();
  });

  return (
    <div ref={bsWrapper} {...rest} className={clsx('h-full text-left', className)}>
      <div className={clsx('inline-block', { 'h-full': !isScrollY })} ref={bsContent}>
        {children}
      </div>
    </div>
  );
};

export default BetterScroll;
