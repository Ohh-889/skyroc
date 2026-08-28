'use client';

import { Button, Card, Icon, Input, ScrollArea, Tag } from '@skyroc/web-ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '../../i18n/navigation';

// 组件键名列表
const componentKeys = [
  { href: '/accordion', icon: 'lucide:chevrons-down-up', key: 'accordion' },
  { href: '/alert', icon: 'lucide:alert-circle', key: 'alert' },
  { href: '/alert-dialog', icon: 'lucide:message-square-warning', key: 'alertDialog' },
  { href: '/avatar', icon: 'lucide:user-circle', key: 'avatar' },
  { href: '/badge', icon: 'lucide:badge', key: 'badge' },
  { href: '/breadcrumb', icon: 'lucide:chevrons-right', key: 'breadcrumb' },
  { href: '/button', icon: 'lucide:mouse-pointer-click', key: 'button' },
  { href: '/card', icon: 'lucide:square', key: 'card' },
  { href: '/carousel', icon: 'lucide:gallery-horizontal', key: 'carousel' },
  { href: '/checkbox', icon: 'lucide:check-square', key: 'checkbox' },
  { href: '/chip', icon: 'lucide:circle-dot', key: 'chip' },
  { href: '/collapsible', icon: 'lucide:chevrons-up-down', key: 'collapsible' },
  { href: '/command', icon: 'lucide:command', key: 'command' },
  { href: '/context-menu', icon: 'lucide:menu', key: 'contextMenu' },
  { href: '/dialog', icon: 'lucide:panel-top', key: 'dialog' },
  { href: '/divider', icon: 'lucide:minus', key: 'divider' },
  { href: '/drawer', icon: 'lucide:panel-left', key: 'drawer' },
  { href: '/dropdown-menu', icon: 'lucide:chevron-down', key: 'dropdownMenu' },
  { href: '/form', icon: 'lucide:file-input', key: 'form' },
  { href: '/hover-card', icon: 'lucide:mouse-pointer-2', key: 'hoverCard' },
  { href: '/icon', icon: 'lucide:shapes', key: 'icon' },
  { href: '/input', icon: 'lucide:text-cursor-input', key: 'input' },
  { href: '/input-otp', icon: 'lucide:lock-keyhole', key: 'inputOtp' },
  { href: '/keyboard-key', icon: 'lucide:keyboard', key: 'keyboardKey' },
  { href: '/label', icon: 'lucide:tag', key: 'label' },
  { href: '/popover', icon: 'lucide:message-circle', key: 'popover' },
  { href: '/progress', icon: 'lucide:loader', key: 'progress' },
  { href: '/radio', icon: 'lucide:circle-check', key: 'radio' },
  { href: '/scroll-area', icon: 'lucide:scroll', key: 'scrollArea' },
  { href: '/select', icon: 'lucide:list', key: 'select' },
  { href: '/skeleton', icon: 'lucide:loader-2', key: 'skeleton' },
  { href: '/slider', icon: 'lucide:sliders-horizontal', key: 'slider' },
  { href: '/tabs', icon: 'lucide:folder-kanban', key: 'tabs' },
  { href: '/textarea', icon: 'lucide:align-left', key: 'textarea' },
  { href: '/toggle', icon: 'lucide:toggle-right', key: 'toggle' },
  { href: '/toggle-group', icon: 'lucide:layout-grid', key: 'toggleGroup' },
  { href: '/tooltip', icon: 'lucide:message-square', key: 'tooltip' },
  { href: '/sonner', icon: 'lucide:bell', key: 'sonner' }
] as const;

// 亮点特性键名
const highlightKeys = [
  { icon: 'lucide:terminal', key: 'cli' },
  { icon: 'lucide:package', key: 'npm' },
  { icon: 'lucide:puzzle', key: 'composable' },
  { icon: 'lucide:file-code', key: 'typescript' }
] as const;

const Home = () => {
  const t = useTranslations('home');
  const tComponents = useTranslations('componentList');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const filteredComponents = componentKeys.filter(item => {
    const name = tComponents(`${item.key}.name`);
    const description = tComponents(`${item.key}.description`);
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || description.includes(searchQuery);
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <ScrollArea
      className="h-full"
      orientation="vertical"
      size="sm"
    >
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-primary text-3xl font-bold">{t('title')}</h1>

                <Tag variant="pure">{t('badge')}</Tag>
              </div>

              <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                color="carbon"
                size="sm"
                variant="outline"
              >
                <a
                  href="https://docs.skyroc-ui.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon
                    className="mr-1.5 h-4 w-4"
                    icon="lucide:book-open"
                  />

                  {t('docs')}
                </a>
              </Button>

              <Button
                asChild
                color="carbon"
                size="sm"
                variant="outline"
              >
                <a
                  href="https://github.com/Ohh-889/skyroc-ui"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon
                    className="mr-1.5 h-4 w-4"
                    icon="lucide:github"
                  />

                  {t('github')}
                </a>
              </Button>
            </div>
          </header>

          {/* 亮点介绍 */}
          <section className="mb-8">
            <Card className="bg-muted/30">
              <div className="flex flex-col gap-6 p-5 lg:flex-row lg:items-center lg:justify-between">
                {/* 左侧：亮点标签 */}
                <div className="flex flex-wrap items-center gap-3">
                  {highlightKeys.map(item => (
                    <div
                      className="bg-background flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
                      key={item.key}
                    >
                      <Icon
                        className="text-primary h-4 w-4"
                        icon={item.icon}
                      />

                      <span>{t(`highlights.${item.key}`)}</span>
                    </div>
                  ))}
                </div>

                {/* 右侧：安装命令 */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {/* CLI 命令 */}
                  <div className="bg-background flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm">
                    <span className="text-muted-foreground">$</span>
                    <code>npx skyroc add button</code>

                    <Button
                      aria-label={copiedCmd === 'cli' ? t('commands.copied') : t('commands.copyCli')}
                      className="ml-1 h-6 w-6 p-0"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy('npx skyroc add button', 'cli')}
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        icon={copiedCmd === 'cli' ? 'lucide:check' : 'lucide:copy'}
                      />
                    </Button>
                  </div>

                  <span className="text-muted-foreground hidden text-xs sm:block">{t('commands.or')}</span>

                  {/* NPM 命令 */}
                  <div className="bg-background flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm">
                    <span className="text-muted-foreground">$</span>
                    <code>npm i skyroc-ui</code>

                    <Button
                      aria-label={copiedCmd === 'npm' ? t('commands.copied') : t('commands.copyNpm')}
                      className="ml-1 h-6 w-6 p-0"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy('npm i skyroc-ui', 'npm')}
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        icon={copiedCmd === 'npm' ? 'lucide:check' : 'lucide:copy'}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* 组件列表 */}
          <section>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{t('components.title')}</h2>
                <Tag variant="pure">{componentKeys.length}</Tag>
              </div>

              <Input
                aria-label={t('components.search')}
                className="w-full sm:w-60"
                placeholder={t('components.search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredComponents.map(component => (
                <Link
                  className="group"
                  href={component.href}
                  key={component.key}
                >
                  <Card className="hover:border-primary/50 hover:bg-muted/30 h-full transition-all duration-200">
                    <div className="flex items-center gap-3 p-3">
                      <div className="text-muted-foreground group-hover:text-primary bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors">
                        <Icon
                          className="h-4 w-4"
                          icon={component.icon}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="group-hover:text-primary truncate text-sm font-medium transition-colors">
                          {tComponents(`${component.key}.name`)}
                        </h3>

                        <p className="text-muted-foreground truncate text-xs">
                          {tComponents(`${component.key}.description`)}
                        </p>
                      </div>

                      <Icon
                        className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 opacity-0 transition-all group-hover:opacity-100"
                        icon="lucide:chevron-right"
                      />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredComponents.length === 0 && (
              <div className="py-16 text-center">
                <Icon
                  className="text-muted-foreground mx-auto mb-3 h-10 w-10"
                  icon="lucide:search-x"
                />

                <p className="text-muted-foreground text-sm">{t('components.noResult')}</p>
              </div>
            )}
          </section>

          {/* 底部链接 */}
          <footer className="mt-12 border-t pt-6">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Button
                asChild
                color="carbon"
                variant="ghost"
              >
                <a
                  href="https://docs.skyroc-ui.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon
                    className="h-4 w-4"
                    icon="lucide:book-open"
                  />

                  {t('footer.fullDocs')}
                </a>
              </Button>

              <Button
                asChild
                color="carbon"
                variant="ghost"
              >
                <a
                  href="https://docs.skyroc-ui.com/docs/installation"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon
                    className="h-4 w-4"
                    icon="lucide:download"
                  />

                  {t('footer.installGuide')}
                </a>
              </Button>

              <Button
                asChild
                color="carbon"
                variant="ghost"
              >
                <a
                  href="https://github.com/Ohh-889/skyroc-ui"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon
                    className="h-4 w-4"
                    icon="lucide:github"
                  />

                  {t('github')}
                </a>
              </Button>

              <Button
                asChild
                color="carbon"
                variant="ghost"
              >
                <a
                  href="https://github.com/Ohh-889/skyroc-ui/issues"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon
                    className="h-4 w-4"
                    icon="lucide:bug"
                  />

                  {t('footer.feedback')}
                </a>
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
