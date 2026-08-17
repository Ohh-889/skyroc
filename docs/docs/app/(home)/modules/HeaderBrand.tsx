import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderBrandProps {
  /** 主文档入口地址，用于构造搜索入口 */
  docsUrl: string;
}

export const HeaderBrand = (props: HeaderBrandProps) => {
  const { docsUrl } = props;

  return (
    <>
      <Link
        className="inline-flex flex-none items-center gap-2 text-[17px] font-bold tracking-[-0.025em] text-foreground no-underline [font-family:'Avenir_Next','SF_Pro_Display','PingFang_SC',sans-serif]"
        href="/"
      >
        <span className="inline-flex size-[34px] items-center justify-center rounded-[10px]">
          <Image
            alt=""
            height={32}
            priority
            src="/favicon.svg"
            width={32}
          />
        </span>
        <span className="max-[760px]:hidden">SkyrocAdmin</span>
      </Link>

      <Link
        className="flex h-[34px] w-44 items-center gap-2 rounded-[10px] border border-border/80 bg-background/60 px-[9px] text-xs text-muted-foreground no-underline max-[1020px]:ml-auto max-[1020px]:max-w-62.5 max-[1020px]:flex-1 max-[760px]:hidden"
        href={`${docsUrl}?q=`}
      >
        <Search
          aria-hidden="true"
          size={15}
        />
        <span className="flex-1">搜索文档</span>
        <kbd className="rounded-[5px] border border-border bg-background/70 px-[5px] py-0.5 font-[inherit] text-muted-foreground">
          ⌘ K
        </kbd>
      </Link>
    </>
  );
};
