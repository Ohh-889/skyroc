'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PagePreview } from './page-preview';
import { PhoneFrame } from './phone-frame';

/** 达到这个宽度才启用左右分栏。必须和 global.css 里 `.skyroc-split` 的断点保持一致， 否则会出现「CSS 已分栏但预览还内联」的错位。 */
const SPLIT_QUERY = '(min-width: 1280px)';

interface DemoStageContextValue {
  /** 是否启用左右分栏。 true：整页预览在右侧常驻，左侧只留代码； false：没有右栏，每个 demo 把自己的预览渲染回代码上方。 */
  splitEnabled: boolean;
}

const DemoStageContext = createContext<DemoStageContextValue>({ splitEnabled: false });

export function useDemoStage(): DemoStageContextValue {
  return useContext(DemoStageContext);
}

interface DemoStageProviderProps {
  children: React.ReactNode;
}

export const DemoStageProvider = (props: DemoStageProviderProps) => {
  const { children } = props;

  const [splitEnabled, setSplitEnabled] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(SPLIT_QUERY);
    function sync() {
      setSplitEnabled(mql.matches);
    }
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  return <DemoStageContext.Provider value={{ splitEnabled }}>{children}</DemoStageContext.Provider>;
};

interface DemoStageProps {
  /** 手机下方的说明文字 */
  label: string;
  /** Playground 里 app/components 下的路由名，如 "button" */
  slug: string;
}

/** 右侧粘性手机，渲染 playground 的整个组件页（NavBar + 整页 demo），内部自己滚动。 它不跟随左栏滚动切换 —— 左边一节节读代码，右边始终是完整的真机效果。 */
export const DemoStage = (props: DemoStageProps) => {
  const { label, slug } = props;

  const { splitEnabled } = useDemoStage();

  // 窄屏不渲染：省掉整页 demo 的动态加载，预览由各 demo 卡片自己内联
  if (!splitEnabled) return null;

  return (
    <aside
      aria-label="组件完整示例"
      className="skyroc-stage"
    >
      <div className="skyroc-stage-inner">
        <PhoneFrame fill>
          <PagePreview slug={slug} />
        </PhoneFrame>
        <p className="skyroc-stage-caption">{label}</p>
      </div>
    </aside>
  );
};
