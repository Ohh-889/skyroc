import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SessionProvider, useSession } from '@/contexts/auth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
      </ThemeProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { isLoading, session } = useSession();

  // 凭证还没读出来，先让原生启动屏留在上面，避免闪一下登录页
  if (isLoading) return null;

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        {/* 已登录：可进入 (tabs)，未登录时被踢回下面第一个可用路由 */}
        <Stack.Protected guard={Boolean(session)}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        {/* 未登录：只能停在 (auth)/login */}
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        {/* 微信能力测试页：故意不放进任何 guard，登录前后都要能进去测 */}
        <Stack.Screen
          name="wechat-demo"
          options={{ headerShown: true, title: '微信能力测试' }}
        />
      </Stack>
    </>
  );
}
