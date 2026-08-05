import { App, ConfigProvider, Watermark } from 'antd';
import type { Locale } from 'antd/lib/locale';
import { useSetAtom } from 'jotai';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { themeUserNameAtom, useTheme } from '../hooks';
import { getAntdTheme } from './shared';
import { initAntdUI } from './ui';

interface AntdProviderProps {
  /** 传送门内容 */
  children: ReactNode;

  /** Antd 国际化 locale 对象 */
  locale?: Locale;

  /** 用户名（用于水印显示，自动写入全局 atom） */
  userName?: string;
}

/** ContextHolder — 利用 App.useApp() 获取 message/modal/notification 实例， 自动完成 UI 实例初始化，无需消费者手动调用 init 函数。 */
function ContextHolder() {
  const { message, modal, notification } = App.useApp();

  initAntdUI(message, modal, notification);
  return null;
}

/**
 * Antd 统一 Provider
 *
 * 整合 ConfigProvider + App + Watermark + ContextHolder， 内部自动通过 useTheme 获取主题状态。
 *
 * UserName 通过 themeUserNameAtom 全局共享， 所有 useTheme 调用者都能获取到完整的 watermarkContent。
 */
const AntdProvider = (props: AntdProviderProps) => {
  const { children, locale, userName } = props;

  // 将 userName 写入全局 atom，供所有 useTheme 调用者读取
  const setUserName = useSetAtom(themeUserNameAtom);

  useEffect(() => {
    setUserName(userName);
  }, [userName, setUserName]);

  const { darkMode, settings, themeColors, watermark, watermarkContent } = useTheme();

  const antdTheme = getAntdTheme(themeColors, darkMode, settings);

  return (
    <ConfigProvider
      button={{ classNames: { icon: 'align-1px  text-icon' } }}
      card={{ styles: { body: { flex: 1, overflow: 'hidden', padding: '12px 16px ' } } }}
      locale={locale}
      segmented={{ classNames: { item: 'flex-1', root: 'w-full [&_.ant-segmented-item-selected]:font-600' } }}
      modal={{ centered: true }}
      theme={antdTheme}
    >
      <App style={{ height: '100%' }}>
        <ContextHolder />
        <Watermark
          className="shadow-initial h-full bg-opacity-100 text-opacity-100"
          content={watermarkContent}
          {...watermark.settings}
        >
          {children}
        </Watermark>
      </App>
    </ConfigProvider>
  );
};

export default AntdProvider;
