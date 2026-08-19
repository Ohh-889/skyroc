import type { ReactNode } from 'react';

interface HomeLayoutProps {
  /** 首页内容 */
  children: ReactNode;
}

const HomeLayout = (props: HomeLayoutProps) => {
  const { children } = props;

  return children;
};

export default HomeLayout;
