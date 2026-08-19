import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import type { Metadata } from 'next';
import { ReactNativeWebStyleSheet } from './ReactNativeWebStyleSheet';

const isDev = process.env.NODE_ENV !== 'production';

// Metro 会注入 __DEV__，Turbopack 没有 DefinePlugin 之类的等价物，
// 而 @skyroc/native-ui 里有裸 __DEV__ 引用。这里补服务端的那一份，客户端见下方内联 script。
// react-native 的类型只把 __DEV__ 声明成裸全局常量、没挂到 typeof globalThis 上，故用 Object.assign 赋值。
Object.assign(globalThis, { __DEV__: isDev });

export const metadata: Metadata = {
  // 缺省时 Next 会退化到 localhost，导致线上 OG / Twitter 卡片图指向本机
  icons: {
    icon: [{ type: 'image/svg+xml', url: '/favicon.svg' }]
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001')
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: `globalThis.__DEV__=${isDev};` }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <ReactNativeWebStyleSheet />

        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
