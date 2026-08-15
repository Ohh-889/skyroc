import { useEffect, useRef } from 'react';
import { mountPortal } from './mount-portal';
import type { PortalHandle, PortalProps } from './types';

/** 声明式 Portal，把 children 渲染到应用根节点的 PortalHost 上 */
const Portal = (props: PortalProps) => {
  const { children, zIndex } = props;

  const handleRef = useRef<PortalHandle | null>(null);

  // 挂载与卸载只发生一次：内容和层级交给下面的 effect 同步。
  // 若把 children 放进依赖，节点会随内容变化被重建，浮层动画会被打断、子树 state 会丢失。
  useEffect(() => {
    const handle = mountPortal(null);

    handleRef.current = handle;

    return () => {
      handle.unmount();
      handleRef.current = null;
    };
  }, []);

  // 与上面的 effect 处于同一次提交，React 会把两次 store 更新批处理掉，不会出现空帧
  useEffect(() => {
    handleRef.current?.update(children, { zIndex });
  }, [children, zIndex]);

  return null;
};

export { Portal };
