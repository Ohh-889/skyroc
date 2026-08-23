// oxlint-disable import/no-unassigned-import
import { JotaiProvider } from '@skyroc/core-state';
import { BottomSheetModalProvider, PortalHost } from '@skyroc/native-ui';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaListener, SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useSession } from '@/feature/auth';
import { DevFloatingButton } from '@/feature/dev';
import { QueryProvider } from '@/feature/query/query-provider';
import '../global.css';

SplashScreen.preventAutoHideAsync();

// uniwind 免费版的 *-safe-* 工具类不会自己读安全区，得由 react-native-safe-area-context 喂进去，
// 否则 insets 恒为 0，pt-safe-offset-10 会退化成普通的 pt-10。
// 这里先用原生启动时量好的 initialWindowMetrics 打底，避免首帧按 0 排版再跳一下
if (initialWindowMetrics) {
  Uniwind.updateInsets(initialWindowMetrics.insets);
}

function RootNavigator() {
  // 凭据是从 SecureStore 同步读出来的（见 store/secure-storage），第一帧就是准的，
  // 不需要再等一个 loading 态
  const { isLoggedIn } = useSession();

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1 },
          animationMatchesGesture: true,
          animation: 'slide_from_right',
          orientation: 'portrait'
        }}
      >
        {/* 已登录：(app) 下的一切，含 demo 演示分组。新增业务页面只往 (app) 里加，这里永远不用再动 */}
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            options={{ headerShown: false }}
            name="(app)"
          />
        </Stack.Protected>

        {/* 未登录：只能停在 (auth)/login */}
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            options={{ headerShown: false }}
            name="(auth)"
          />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        {/* 转屏、分屏、键盘导航栏变化时把最新 insets 同步给 uniwind */}
        <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
          <JotaiProvider>
            <QueryProvider>
              {/* 键盘底座：statusBar/navigationBar 都标成 translucent，
                  否则 Android 端会被额外顶出一段系统栏高度，破坏 edge-to-edge 布局 */}
              <KeyboardProvider
                navigationBarTranslucent
                statusBarTranslucent
              >
                <BottomSheetModalProvider>
                  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <RootNavigator />

                    <StatusBar
                      animated
                      // oxlint-disable-next-line react/style-prop-object
                      style="auto"
                    />

                    {/* 开发期的 sitemap 悬浮入口，生产包里自身返回 null */}
                    <DevFloatingButton />

                    {/* 所有 portal 节点（Toast 等）的宿主，必须放在 Stack 之后才能盖在页面之上 */}
                    <PortalHost />
                  </ThemeProvider>
                </BottomSheetModalProvider>
              </KeyboardProvider>
            </QueryProvider>
          </JotaiProvider>
        </SafeAreaListener>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
