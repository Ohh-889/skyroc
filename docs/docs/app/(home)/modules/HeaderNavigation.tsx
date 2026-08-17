import Link from 'next/link';

const NAVIGATION_LINK_CLASS_NAME =
  "rounded-[9px] px-[11px] py-2 text-[13px] font-semibold tracking-[0.005em] text-foreground/70 no-underline transition-colors hover:bg-foreground/5 hover:text-foreground [font-family:'SF_Pro_Text','SF_Pro_Display','PingFang_SC','Hiragino_Sans_GB',sans-serif]";

interface HeaderNavigationProps {
  /** 主文档入口地址 */
  docsUrl: string;
}

export const HeaderNavigation = (props: HeaderNavigationProps) => {
  const { docsUrl } = props;

  return (
    <nav
      aria-label="主导航"
      className="flex flex-1 items-center justify-center gap-1 max-[1020px]:hidden"
    >
      <Link
        className={NAVIGATION_LINK_CLASS_NAME}
        href="#documentation-map"
      >
        文档版图
      </Link>
      <Link
        className={NAVIGATION_LINK_CLASS_NAME}
        href={docsUrl}
      >
        Admin
      </Link>
      <Link
        className={NAVIGATION_LINK_CLASS_NAME}
        href={docsUrl}
      >
        Packages
      </Link>
      <Link
        className={NAVIGATION_LINK_CLASS_NAME}
        href="#documentation-map"
      >
        Web UI
      </Link>
      <Link
        className={NAVIGATION_LINK_CLASS_NAME}
        href="#documentation-map"
      >
        Native UI
      </Link>
    </nav>
  );
};
