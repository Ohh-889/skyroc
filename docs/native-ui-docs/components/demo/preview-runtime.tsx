'use client';

import { BottomSheetModalProvider, PortalHost } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Metrics } from 'react-native-safe-area-context';

/**
 * Playground 的 app/_layout.tsx 在手机框里的等价物。
 *
 * 文档站直接渲染 demo 与 app/components/*.tsx，唯独不会渲染 playground 的根布局， 于是那一层 provider 全部缺席：Sheet / ActionSheet / Dialog 会抛
 * 「'BottomSheetModalInternalContext' cannot be null!」，SwipeCell / Slider / FloatingButton 的手势收不到事件，Toast / Notify
 * 与命令式面板挂上 portalStore 后没有宿主、静默不显示。
 *
 * 三个 provider 都从「组件真正用的那一份」拿：BottomSheetModalProvider 走
 *
 * @skyroc/native-ui 的再导出，gesture-handler / safe-area-context 由本包按 catalog:native
 * 直接依赖——版本与 playground、native-ui 对齐，pnpm 解析到同一个 .pnpm 目录，
 * 不会出现「provider 是 A 实例、消费者是 B 实例」的 context 落空。
 */

/**
 * 手机框没有刘海，安全区一律为 0。
 *
 * 显式给初值而不是让 SafeAreaProvider 自己量：它在拿到 insets 之前不渲染 children， 不给初值预览会先闪一帧空白。frame 宽度对齐 phone-frame.tsx 的 w-[375px]。
 */
const PREVIEW_METRICS: Metrics = {
  frame: { height: 812, width: 375, x: 0, y: 0 },
  insets: { bottom: 0, left: 0, right: 0, top: 0 }
};

interface PreviewRuntimeProps {
  /** 预览内容 */
  children: ReactNode;
  /**
   * 是否撑满手机屏幕。
   *
   * 对齐 PhoneFrame 的同名属性：整页预览是固定高度的一屏（撑满）， 单点 demo 的手机框按内容高度自适应，此时这几层容器绝不能带 flex-1， 否则 flex-basis: 0 会让整框塌到 min-h。
   */
  fill?: boolean;
}

export const PreviewRuntime = (props: PreviewRuntimeProps) => {
  const { children, fill = false } = props;

  return (
    <GestureHandlerRootView style={fill ? { flex: 1 } : undefined}>
      {/* SafeAreaProvider 自带 flex: 1，非撑满时必须在 style 里覆盖掉 */}
      <SafeAreaProvider
        initialMetrics={PREVIEW_METRICS}
        style={fill ? undefined : { flexBasis: 'auto', flexGrow: 0, flexShrink: 1 }}
      >
        <BottomSheetModalProvider>
          {/* PortalHost 是 absolute inset-0，需要一个把内容包住的定位父级才铺得对 */}
          <View className={fill ? 'flex-1' : undefined}>
            {children}

            <PortalHost />
          </View>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
