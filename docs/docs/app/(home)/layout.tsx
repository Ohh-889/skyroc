interface HomeLayoutProps {
  /** 首页内容 */
  children: React.ReactNode;
}

const HomeLayout = (props: HomeLayoutProps) => {
  const { children } = props;

  return children;
};

export default HomeLayout;
