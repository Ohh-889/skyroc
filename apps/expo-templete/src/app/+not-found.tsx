import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Text } from '@skyroc/native-ui';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

import { useSession } from '@/feature/auth';

const Icon = withUniwind(MaterialCommunityIcons);

/** 图标上下浮一个来回的时长，慢到不抢注意力 */
const FLOAT_DURATION = 2400;

/**
 * 404 页。
 *
 * 移动端没有地址栏，走到这里的从来不是「用户打错了」，只有两类： - 外部链接落空：深链 / 推送里的地址不在 `feature/linking` 的白名单里，或指向已经下线的页面 - 版本落后：后端下发了新版本才有的路由，旧包认不出来
 *
 * 所以文案不写「请检查网址」，而是直接给能走的路；原始路径只在开发期摆出来—— 排查深链问题时最想知道的就是「到底进来的是什么」，给用户看则毫无意义。
 *
 * 这个文件按约定就地写完，不拆去 `src/pages`：`+not-found` 是 expo-router 的特殊文件， `scripts/check-routes.ts` 把它排除在「路由 ↔ 页面一一对应」之外。
 */
const NotFoundScreen = () => {
  const router = useRouter();

  const pathname = usePathname();

  const { isLoggedIn } = useSession();

  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(withTiming(1, { duration: FLOAT_DURATION, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float.value, [0, 1], [-8, 8]) }]
  }));

  /** 未登录时 (app) 整组被 `Stack.Protected` 摘掉了，「首页」只能是登录页 */
  function handleGoHome() {
    router.replace(isLoggedIn ? '/' : '/login');
  }

  return (
    <View className="flex-1 justify-center bg-background px-8">
      {/* 同心圆 + 悬浮图标。用描边圆而不是渐变光晕：渐变得写死颜色，深浅色主题下总有一边脏 */}
      <Animated.View entering={FadeInDown.duration(420)}>
        <View className="items-center">
          <View className="size-56 items-center justify-center rounded-full border border-border/40">
            <View className="size-40 items-center justify-center rounded-full border border-border/70">
              <Animated.View style={floatStyle}>
                <View className="size-24 items-center justify-center rounded-full bg-primary/10">
                  <Icon
                    colorClassName="accent-primary"
                    name="compass-off-outline"
                    size={44}
                  />
                </View>
              </Animated.View>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(420).delay(90)}>
        <View className="mt-10 items-center">
          <Text className="text-5xl font-black tracking-[8px] text-foreground/20">404</Text>

          <Text className="mt-3 text-xl font-semibold text-foreground">这个页面走丢了</Text>

          <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
            没找到这个地址对应的页面，{'\n'}可能它已经被移走，或者当前版本还没有它。
          </Text>

          {__DEV__ ? (
            <View className="mt-5 max-w-full rounded-full bg-muted px-4 py-2">
              <Text
                className="text-xs text-muted-foreground"
                ellipsizeMode="middle"
                numberOfLines={1}
              >
                {pathname}
              </Text>
            </View>
          ) : null}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(420).delay(180)}>
        <View className="mt-10 w-full max-w-xs self-center">
          <Button
            block
            shape="pill"
            size="lg"
            leading={
              <Icon
                colorClassName="accent-primary-foreground"
                name="home-outline"
                size={20}
              />
            }
            onPress={handleGoHome}
          >
            回到首页
          </Button>

          {/* 深链直接落到这一屏时栈里没有上一页，留一个点了不动的按钮是误导 */}
          {router.canGoBack() ? (
            <Button
              block
              className="mt-3"
              color="muted"
              shape="pill"
              size="lg"
              variant="ghost"
              onPress={router.back}
            >
              返回上一页
            </Button>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
};

export default NotFoundScreen;
