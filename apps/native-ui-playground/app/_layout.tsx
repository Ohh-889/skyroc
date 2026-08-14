import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// Uniwind's CSS entry. Must be imported from the root component, not from index.js — importing it there downgrades
// hot reload to a full refresh.
// eslint-disable-next-line import/no-unassigned-import
import '../global.css';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

/**
 * 把安全区尺寸同步给 uniwind 运行时。
 *
 * uniwind 把 env(safe-area-inset-*) 编译成 rt.insets.*，但它自己不采集安全区，初始值恒为 0；
 * 不接这一步，pt-safe / pb-safe / inset-safe 等所有 *-safe 工具类都会静默失效。
 */
const UniwindInsetsBridge = () => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Uniwind.updateInsets(insets);
  }, [insets]);

  return null;
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UniwindInsetsBridge />

      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { flex: 1 },
            animationMatchesGesture: true,
            animation: 'slide_from_right',
            orientation: 'portrait'
          }}
        />

        <StatusBar
          animated
          // oxlint-disable-next-line react/style-prop-object
          style="auto"
        />
      </View>
    </GestureHandlerRootView>
  );
}
