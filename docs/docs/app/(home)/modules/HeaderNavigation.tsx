import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const NAVIGATION_LINK_CLASS_NAME =
  "inline-flex items-center gap-1 rounded-[9px] px-[11px] py-2 text-[13px] font-semibold tracking-[0.005em] text-foreground/70 no-underline transition-colors hover:bg-foreground/5 hover:text-foreground [font-family:'SF_Pro_Text','SF_Pro_Display','PingFang_SC','Hiragino_Sans_GB',sans-serif]";

/**
 * 首页中间导航一律是「去往另一个页面」的入口，不放本页锚点。
 *
 * 混着锚点和目的地是之前的毛病：五个链接长得一模一样，点下去却有滚动、跳转、 假装跳转其实滚动三种结果。现在统一成跳转，点击行为可预测。
 *
 * `external` 的走原生 <a> 而不是 <Link>：跨站不需要 Next.js 预取，也要带 target/rel。 Native UI 站目前只有本地版、没有线上域名，等部署后再加进来，不要先挂个占位链接。
 */
const HOME_NAVIGATION = [
  { external: false, href: '/docs/guide', label: '指南' },
  { external: false, href: '/docs/admin', label: 'Admin' },
  { external: false, href: '/docs/packages', label: '包文档' },
  { external: true, href: 'https://web-ui-docs.skyroc.me/components/button', label: 'Web UI' }
] as const;

export const HeaderNavigation = () => {
  return (
    <nav
      aria-label="主导航"
      className="flex flex-1 items-center justify-center gap-1 max-[1020px]:hidden"
    >
      {HOME_NAVIGATION.map(item =>
        item.external ? (
          <a
            key={item.href}
            className={NAVIGATION_LINK_CLASS_NAME}
            href={item.href}
            rel="noreferrer"
            target="_blank"
          >
            {item.label}
            <ArrowUpRight
              aria-hidden="true"
              className="text-foreground/45"
              size={13}
            />
          </a>
        ) : (
          <Link
            key={item.href}
            className={NAVIGATION_LINK_CLASS_NAME}
            href={item.href}
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
};
