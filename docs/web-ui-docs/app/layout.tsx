import { Sonner, TooltipProvider } from '@skyroc/web-ui';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
// oxlint-disable-next-line import/no-unassigned-import
import './global.css';

const inter = Inter({
  subsets: ['latin']
});

export const metadata: Metadata = {
  icons: {
    apple: '/favicon.svg',
    icon: [{ type: 'image/svg+xml', url: '/favicon.svg' }],
    shortcut: '/favicon.svg'
  }
};

interface RootLayoutProps {
  /** 文档应用主体内容，由 Next.js 注入 */
  children: ReactNode;
}

const Layout = (props: RootLayoutProps) => {
  const { children } = props;

  return (
    <html
      lang="zh-CN"
      className={inter.className}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <TooltipProvider>
            {children}
            <Sonner />
          </TooltipProvider>
        </RootProvider>
      </body>
    </html>
  );
};

export default Layout;
