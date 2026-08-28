'use client';

import { Button, Icon } from '@skyroc/web-ui';
import { useTranslations } from 'next-intl';
import { Link } from '../i18n/navigation';

const NotFoundClient = () => {
  const t = useTranslations('notFound');

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* 背景装饰 - 简约的渐变圆 */}
      <div className="bg-primary/5 pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
      <div className="bg-primary/5 pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        {/* 404 数字 - 更大更有冲击力 */}
        <div className="relative mb-4 select-none">
          <span className="text-primary/8 text-[12rem] leading-none font-black tracking-tighter sm:text-[14rem]">
            404
          </span>
        </div>

        {/* 主卡片 - 浮在404上方 */}

        <div className="p-8">
          {/* 图标 */}
          <div className="bg-primary/10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl">
            <Icon
              className="text-primary h-7 w-7"
              icon="lucide:compass"
            />
          </div>

          {/* 标题和描述 */}
          <h1 className="text-foreground mb-2 text-xl font-semibold tracking-tight">{t('title')}</h1>

          <p className="text-muted-foreground mx-auto mb-6 max-w-xs text-sm leading-relaxed">{t('description')}</p>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="shadow-sm"
            >
              <Link href="/">
                <Icon
                  className="mr-2 h-4 w-4"
                  icon="lucide:home"
                />

                {t('backHome')}
              </Link>
            </Button>

            <Button
              color="carbon"
              variant="outline"
              onClick={() => window.history.back()}
            >
              <Icon
                className="mr-2 h-4 w-4"
                icon="lucide:arrow-left"
              />

              {t('goBack')}
            </Button>
          </div>
        </div>

        {/* 快捷链接 */}
        <div className="mt-10">
          <p className="text-muted-foreground/70 mb-3 text-xs font-medium tracking-wider uppercase">{t('quickNav')}</p>

          <div className="flex flex-wrap justify-center gap-1.5">
            <Button
              asChild
              color="carbon"
              size="sm"
              variant="ghost"
            >
              <Link href="/button">
                <Icon
                  className="mr-1.5 h-3.5 w-3.5"
                  icon="lucide:mouse-pointer-click"
                />

                {t('buttonComponent')}
              </Link>
            </Button>

            <Button
              asChild
              color="carbon"
              size="sm"
              variant="ghost"
            >
              <Link href="/form">
                <Icon
                  className="mr-1.5 h-3.5 w-3.5"
                  icon="lucide:file-input"
                />

                {t('formComponent')}
              </Link>
            </Button>

            <Button
              asChild
              color="carbon"
              size="sm"
              variant="ghost"
            >
              <Link href="/">
                <Icon
                  className="mr-1.5 h-3.5 w-3.5"
                  icon="lucide:layout-grid"
                />

                {t('componentList')}
              </Link>
            </Button>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="text-muted-foreground/60 mt-10 text-xs">
          <span>{t('contact')}</span>

          <a
            className="text-primary hover:text-primary/80 ml-1 inline-flex items-center font-medium transition-colors"
            href="https://github.com/Ohh-889/skyroc-ui/issues"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('contactUs')}

            <Icon
              className="ml-0.5 h-3 w-3"
              icon="lucide:external-link"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundClient;
