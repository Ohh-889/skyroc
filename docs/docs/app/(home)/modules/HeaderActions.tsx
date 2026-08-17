import { Button, Icon } from '@skyroc/web-ui';
import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

interface HeaderActionsProps {
  /** 主文档入口地址 */
  docsUrl: string;
  /** GitHub 仓库地址 */
  githubUrl: string;
}

export const HeaderActions = (props: HeaderActionsProps) => {
  const { docsUrl, githubUrl } = props;

  return (
    <div className="flex flex-none items-center gap-[7px] max-[760px]:ml-auto">
      <Button
        asChild
        className="size-[34px] rounded-[10px] text-foreground/70 max-[760px]:hidden"
        color="carbon"
        fitContent
        shape="rounded"
        size="sm"
        variant="ghost"
      >
        <a
          aria-label="GitHub"
          href={githubUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Icon
            aria-hidden="true"
            className="size-4.5"
            icon="lucide:github"
          />
        </a>
      </Button>

      <Button
        asChild
        className="h-[34px] gap-[7px] rounded-[10px] border-0 bg-foreground/5 px-3 text-[13px] font-medium tracking-[0.005em] text-foreground shadow-none hover:bg-foreground/10"
        color="carbon"
        shape="rounded"
        size="sm"
        variant="ghost"
      >
        <Link href={docsUrl}>
          <BookOpenText
            aria-hidden="true"
            size={16}
          />
          <span>文档</span>
        </Link>
      </Button>
    </div>
  );
};
