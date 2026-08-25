/* eslint-disable react-hooks/exhaustive-deps */
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  /** 是否在容器不存在时自动创建 */
  autoCreate?: boolean;
  children: ReactNode;
  /** 容器 ID 或 CSS 选择器 */
  container: string | HTMLElement;

  /** 容器不存在时的回退内容 */
  fallback?: ReactNode;
  /** 自动创建时的标签名 */
  tagName?: keyof HTMLElementTagNameMap;
}

const Portal = (props: PortalProps) => {
  const { autoCreate = false, children, container, fallback = null, tagName = 'div' } = props;

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  const createdElementRef = useRef<HTMLElement | null>(null);

  function findTargetElement() {
    let element: HTMLElement | null = null;

    // 支持直接传入 HTMLElement
    if (container instanceof HTMLElement) {
      element = container;
    }
    // 支持 ID（#id）
    else if (typeof container === 'string') {
      if (container.startsWith('#')) {
        element = document.getElementById(container.slice(1));
      }
      // 支持 CSS 选择器
      else {
        element = document.querySelector<HTMLElement>(container);
      }
    }

    // 自动创建容器
    if (!element && autoCreate && typeof container === 'string') {
      element = document.createElement(tagName);
      element.id = container.startsWith('#') ? container.slice(1) : container;
      document.body.appendChild(element);
      createdElementRef.current = element;
    }

    setTargetElement(element);
  }

  useEffect(() => {
    findTargetElement();

    // 清理：移除自动创建的元素
    return () => {
      if (createdElementRef.current) {
        document.body.removeChild(createdElementRef.current);
        createdElementRef.current = null;
      }
    };
  }, []);

  // 容器不存在时渲染回退内容
  if (!targetElement) {
    return fallback;
  }

  return createPortal(children, targetElement);
};

export default Portal;
