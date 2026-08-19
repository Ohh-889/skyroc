import { Button, Icon } from '@skyroc/web-ui';
import { MonitorPlay } from 'lucide-react';

/**
 * 落地页访客的第一诉求是「先看看长什么样」，而 hero 的两个 CTA（快速开始 / 查看 Admin 文档） 都通向文档，没人管这件事，所以预览入口放在 header 右侧。
 *
 * V3 管理端是主推的 demo，用 primary 底色；RuoYi 是对接示例，走描边样式， 并在 1020px 以下随中间导航一起收起，避免窄屏右侧堆四个控件。
 *
 * RuoYi 那台是临时云服务器，走 HTTP 且直接暴露公网 IP：链接进了公开首页就会被搜索引擎 和镜像站长期留存，换机器后也不会自动失效。已知并接受，换机器或下线时记得回来删这一条。
 */
const HOME_PREVIEWS = [
  { href: 'https://admin.skyroc.me/', label: 'Admin 预览', primary: true },
  { href: 'http://47.98.185.172:8080/', label: 'RuoYi 预览', primary: false }
] as const;

const PREVIEW_BASE_CLASS_NAME =
  'h-[34px] gap-[7px] rounded-[10px] px-3 text-[13px] font-medium tracking-[0.005em] shadow-none max-[760px]:hidden';

const PREVIEW_PRIMARY_CLASS_NAME = 'border border-primary/28 bg-primary/10 text-primary hover:bg-primary/18';

const PREVIEW_MUTED_CLASS_NAME =
  'border border-border/80 bg-transparent text-foreground/70 hover:bg-foreground/5 hover:text-foreground max-[1020px]:hidden';

interface HeaderActionsProps {
  /** 主文档入口地址 */
  docsUrl: string;
  /** GitHub 仓库地址 */
  githubUrl: string;
}

export const HeaderActions = (props: HeaderActionsProps) => {
  const { githubUrl } = props;

  return (
    <div className="flex flex-none items-center gap-[7px] max-[760px]:ml-auto">
      {HOME_PREVIEWS.map(item => (
        <Button
          key={item.href}
          asChild
          className={`${PREVIEW_BASE_CLASS_NAME} ${item.primary ? PREVIEW_PRIMARY_CLASS_NAME : PREVIEW_MUTED_CLASS_NAME}`}
          color="carbon"
          shape="rounded"
          size="sm"
          variant="ghost"
        >
          <a
            href={item.href}
            rel="noreferrer"
            target="_blank"
          >
            <MonitorPlay
              aria-hidden="true"
              size={16}
            />
            <span>{item.label}</span>
          </a>
        </Button>
      ))}

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
    </div>
  );
};
