import type { ReactNode } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView as RNKeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { withUniwind } from 'uniwind';
import { AnimatedIcon } from '@/components/animated-icon';
import { SocialLogin } from './SocialLogin';

// KeyboardAwareScrollView 自带 ScrollView 的属性，包成 Uniwind 版本才能使用 className
const KeyboardAwareScrollView = withUniwind(RNKeyboardAwareScrollView);

interface AuthShellProps {
  /** 页面主体内容 */
  children: ReactNode;
  /**
   * 是否展示底部的第三方登录入口，默认展示
   *
   * 这一块只对「选择怎么登录」的起点页有意义；验证码这类流程中间页已经选定了方式，再摆一排入口反而是干扰，所以做成页面自己决定，而不是塞进路由 layout 里一刀切。
   */
  showSocialLogin?: boolean;
}

/** 登录相关页面共用的外壳：滚动容器、安全区内边距、顶部品牌图标 */
const AuthShell = (props: AuthShellProps) => {
  const { children, showSocialLogin = true } = props;

  return (
    <KeyboardAwareScrollView
      bounces={false}
      keyboardShouldPersistTaps="handled"
      className="flex-1 bg-background"
      contentContainerClassName="grow bg-background px-7 pb-safe-offset pt-safe-offset-10"
    >
      <View className="mx-auto w-full max-w-md">
        <View className="mb-10 items-center">
          <View className="size-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/20">
            <AnimatedIcon />
          </View>
        </View>

        {children}

        {showSocialLogin ? <SocialLogin /> : null}
      </View>
    </KeyboardAwareScrollView>
  );
};

export { AuthShell };
