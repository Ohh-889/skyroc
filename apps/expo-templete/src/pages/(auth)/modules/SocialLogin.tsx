import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';
import { useSession } from '@/feature/auth/auth-context';
import { useWechatLogin } from '@/feature/auth/use-wechat-login';

const Icon = withUniwind(MaterialCommunityIcons);

/** 第三方登录入口，只有账号密码 / 手机号这类「起点页」才需要展示 */
const SocialLogin = () => {
  const { signIn } = useSession();

  const { isPending: isWechatPending, login: loginWithWechat } = useWechatLogin(signIn);

  return (
    <View className="items-center pt-16">
      <Divider
        className="w-full"
        classNames={{ text: 'px-4 text-sm text-muted-foreground' }}
      >
        其他方式登录
      </Divider>

      <View className="mt-7 flex-row items-start justify-center gap-8">
        <View className="w-20 items-center">
          <Button
            accessibilityLabel="Apple 登录"
            color="primary"
            shape="circle"
            size="icon"
            variant="tonal"
            leading={
              <Icon
                colorClassName="accent-primary"
                name="apple"
                size={24}
              />
            }
          />
          <Text className="mt-3 text-sm text-muted-foreground">Apple 登录</Text>
        </View>

        <View className="w-20 items-center">
          <Button
            accessibilityLabel="微信登录"
            color="success"
            loading={isWechatPending}
            shape="circle"
            size="icon"
            variant="tonal"
            leading={
              <Icon
                colorClassName="accent-success"
                name="wechat"
                size={24}
              />
            }
            onPress={loginWithWechat}
          />
          <Text className="mt-3 text-sm text-muted-foreground">{isWechatPending ? '正在跳转…' : '微信登录'}</Text>
        </View>

        <View className="w-20 items-center">
          <Button
            accessibilityLabel="QQ 登录"
            color="info"
            shape="circle"
            size="icon"
            variant="tonal"
            leading={
              <Icon
                colorClassName="accent-info"
                name="qqchat"
                size={24}
              />
            }
          />
          <Text className="mt-3 text-sm text-muted-foreground">QQ 登录</Text>
        </View>
      </View>
    </View>
  );
};

export { SocialLogin };
