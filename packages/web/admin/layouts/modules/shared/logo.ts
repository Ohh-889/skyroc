import { createElement } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import type { AdminLayoutLogoComponent } from '../../context';
import AdminLogo from '../AdminLogo';

interface LayoutLogoProps {
  /** 品牌图标，由默认 Logo 组件渲染。 */
  logo?: ReactNode;
  /** 自定义完整 Logo 插槽。 */
  logoComponent?: AdminLayoutLogoComponent;
  /** 是否展示默认 Logo 标题。 */
  showTitle?: boolean;
  /** 当前布局位置传入的 Logo 样式。 */
  style?: CSSProperties;
  /** 默认 Logo 标题内容。 */
  title?: ReactNode;
  /** 默认 Logo 点击跳转路径。 */
  to?: Router.RoutePath;
}

export function renderLogoComponent(logoComponent: AdminLayoutLogoComponent, style: CSSProperties): ReactNode {
  if (typeof logoComponent === 'function') {
    return logoComponent(style);
  }

  return logoComponent;
}

const LayoutLogo = (props: LayoutLogoProps) => {
  const { logo, logoComponent, showTitle = true, style = {}, title, to } = props;

  if (logoComponent) {
    return renderLogoComponent(logoComponent, style);
  }

  if (!logo && !title) return null;

  return createElement(AdminLogo, { logo, showTitle, style, title, to });
};

export default LayoutLogo;
