// oxlint-disable import/no-unassigned-import
import { JotaiProvider } from '@skyroc/core-state';
import { BottomSheetModalProvider, PortalHost } from '@skyroc/native-ui';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaListener, SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { Uniwind, useCSSVariable } from 'uniwind';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useSession } from '@/feature/auth';
import { DevFloatingButton } from '@/feature/dev';
import { LocaleEffect, setupI18n } from '@/feature/i18n';
import { usePendingLinkReplay } from '@/feature/linking';
import { OfflineNotice, startNetworkWatch } from '@/feature/network';
import { QueryProvider } from '@/feature/query/query-provider';
import { applyStoredThemeMode } from '@/feature/theme';
import '../global.css';

SplashScreen.preventAutoHideAsync();

// uniwind 免费版的 *-safe-* 工具类不会自己读安全区，得由 react-native-safe-area-context 喂进去，
// 否则 insets 恒为 0，pt-safe-offset-10 会退化成普通的 pt-10。
// 这里先用原生启动时量好的 initialWindowMetrics 打底，避免首帧按 0 排版再跳一下
if (initialWindowMetrics) {
  Uniwind.updateInsets(initialWindowMetrics.insets);
}

// 把落盘的主题偏好喂给 Uniwind。放在模块顶层是因为它必须早于首帧：Uniwind 自己只认系统色，
// 不告诉它用户选过 dark，第一帧会按系统的浅色画出来，挂载后再跳一下。
// SecureStore 是同步读的，这一句不会拖慢启动（见 feature/theme/theme-store）
applyStoredThemeMode();

// 同理，语言也必须在首帧之前就位。setupI18n 是**同步**的：词条打包在 JS 里，偏好从 MMKV 同步读，
// i18next 又被要求 initImmediate: false —— 三样凑齐，第一帧就是用户选的语言，不会先用兜底语言
// 画一遍再跳（见 feature/i18n/i18n）
setupI18n();

// 开始监听网络状态。同样放模块顶层：断网时 onlineManager 要在首屏查询发出去之前就知道现在没网
// （接线在 feature/query/query-provider），等到 effect 里再开就晚了一帧
startNetworkWatch();

function RootNavigator() {
  // 凭据是从 SecureStore 同步读出来的（见 store/secure-storage），第一帧就是准的，
  // 不需要再等一个 loading 态
  const { isLoggedIn } = useSession();

  // 登录后重放被深链带进来、却因未登录被拦下的目标。
  // 必须放在 <Stack> 所在的组件里——它靠 useRootNavigationState 判断导航器是否已挂载
  usePendingLinkReplay();

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

        {/* 认不出来的路径（深链白名单外、后端下发的旧地址）落到这里，不声明也能用，
            写出来只是为了让它换个转场：404 不是「更深一层」，滑进来不合适 */}
        <Stack.Screen
          options={{ animation: 'fade' }}
          name="+not-found"
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  // 手动覆盖也走这里：setThemeMode 最终会调到 Appearance.setColorScheme，
  // 所以读 useColorScheme() 的东西（导航主题、下面的 StatusBar）不用再各自订阅一遍主题
  const colorScheme = useColorScheme();

  const backgroundColor = useCSSVariable('--background');

  // 根视图背景。Stack 转场的间隙、Android 手势条后面露出来的都是它，默认是白的——
  // 暗色主题下每次 push 都会闪一下白边
  useEffect(() => {
    if (typeof backgroundColor === 'string') {
      SystemUI.setBackgroundColorAsync(backgroundColor);
    }
  }, [backgroundColor]);

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

                    {/* 全局断网横幅。放在 Stack 之后才能盖住页面，且不随路由切换重挂 */}
                    <OfflineNotice />

                    {/* 「跟随系统」在安卓上要靠它跟上系统语言的变化，无渲染产出 */}
                    <LocaleEffect />

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
