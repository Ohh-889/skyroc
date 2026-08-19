'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface DemoPreviewProps {
  /** demos 目录下的模块路径（不含扩展名），如 "ButtonDemo"、"button/ButtonVariant" */
  name: string;
}

export const DemoPreview = (props: DemoPreviewProps) => {
  const { name } = props;

  // 每个 demo 对应一个懒加载组件；只有 name 变化时才需要重新创建。
  //
  // 直接复用 apps/native-ui-playground/src/demos 下的真实 demo。路径前缀必须原样写在模板串里
  // （不能抽成常量），Turbopack 才会把整个 demos 目录编成 context module、按变量挑其中一个 chunk。
  // demo 一律具名导出（export { ButtonDemo }），按模块名取，同时兼容写成 default 的情况。
  //
  // ssr: false 是必须的，不是图省事：uniwind 的 withUniwind 把 `accent-*` 类解析成具体颜色靠的是
  // 往真实 DOM 里插一个探针元素读 getComputedStyle（core/web/getWebStyles.ts），服务端没有 DOM，
  // 取到 undefined。于是同一个图标 SSR 输出 stroke="currentColor"、客户端算出 stroke="#ffffff"，
  // 而 React 对属性不匹配只警告、不修补，颜色会一直是错的（Radio 方形选中态的勾会变成深色）。
  const Demo = useMemo(
    () =>
      dynamic(
        async () => {
          const mod = await import(`../../../../apps/native-ui-playground/src/demos/${name}`);
          // 具名导出用文件名，嵌套路径（button/ButtonVariant）要取最后一段
          const exportName = name.slice(name.lastIndexOf('/') + 1);

          return mod[exportName] ?? mod.default;
        },
        { loading: () => <DemoFallback text="Loading…" />, ssr: false }
      ),
    [name]
  );

  // 只负责屏幕内容：机身由 PhoneFrame 提供，分栏时整页共用右侧那一台
  return <Demo />;
};

interface DemoFallbackProps {
  /** 占位文案 */
  text: string;
}

const DemoFallback = (props: DemoFallbackProps) => {
  const { text } = props;

  return (
    <div className="flex h-full w-full items-center justify-center text-xs text-fd-muted-foreground">{text}</div>
  );
};
