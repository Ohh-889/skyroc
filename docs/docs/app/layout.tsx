import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';

export const metadata: Metadata = {
  icons: {
    icon: [{ type: 'image/svg+xml', url: '/favicon.svg' }]
  }
};

const DOCS_TRANSLATIONS = {
  'Close Search(search dialog)(aria-label)': '关闭搜索',
  'Close Sidebar(aria-label)': '关闭侧栏',
  'Copy Markdown(page actions)': '复制 Markdown',
  'Dark(theme switcher)(aria-label)': '深色',
  'Hide Sidebar(sidebar)': '收起侧栏',
  'Light(theme switcher)(aria-label)': '浅色',
  'No Headings(table of contents)': '暂无目录',
  'No results found(search dialog)': '没有找到结果',
  'On this page(table of contents)': '本页内容',
  'Open Search(search trigger)(aria-label)': '打开搜索',
  'Open Sidebar(aria-label)': '打开侧栏',
  'Open Sidebar(sidebar)(aria-label)': '打开侧栏',
  'Open(page actions)': '打开',
  'Search(search dialog)': '搜索',
  'Search(search trigger)': '搜索文档',
  'Show Sidebar(sidebar)': '展开侧栏',
  'System(theme switcher)(aria-label)': '跟随系统',
  'Toggle Theme(theme switcher)(aria-label)': '切换主题',
  'View as Markdown(page actions)': '查看 Markdown'
};

interface RootLayoutProps {
  /** 应用内容 */
  children: React.ReactNode;
}

const RootLayout = (props: RootLayoutProps) => {
  const { children } = props;

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <RootProvider i18n={{ locale: 'zh-CN', translations: DOCS_TRANSLATIONS }}>{children}</RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
