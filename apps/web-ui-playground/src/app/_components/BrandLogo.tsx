import { Tag } from '@skyroc/web-ui';
import Image from 'next/image';
import Link from 'next/link';

const BrandLogo = () => {
  return (
    <Link
      className="flex items-center gap-3"
      href="/"
    >
      <div className="from-primary/20 to-primary/5 flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br p-1.5 ring-1 ring-black/5 dark:ring-white/10">
        <Image
          alt="Skyroc UI"
          className="h-full w-full"
          height={28}
          src="/logo.svg"
          width={28}
        />
      </div>

      <div className="flex flex-col">
        <span className="from-foreground via-foreground/80 to-foreground bg-linear-to-r bg-clip-text text-base font-bold tracking-tight">
          Skyroc UI
        </span>

        <span className="text-muted-foreground -mt-0.5 text-[10px] font-medium tracking-wide">Playground</span>
      </div>

      <Tag
        className="ml-1"
        variant="pure"
      >
        v1.0
      </Tag>
    </Link>
  );
};

export default BrandLogo;
