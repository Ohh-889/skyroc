import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Input, Text, showDialog } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { DEMO_AUTH_TOKENS, useSession } from '@/feature/auth';
import { useLoginMutation } from '@/service/api';
import { HAS_API_BASE_URL } from '@/service/config';
import { AuthAgreement } from './modules/AuthAgreement';
import { AuthShell } from './modules/AuthShell';

const Icon = withUniwind(MaterialCommunityIcons);

const PasswordLoginScreen = () => {
  const router = useRouter();

  const [account, setAccount] = useState('');

  const [password, setPassword] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);

  const { signIn } = useSession();

  const { isPending: isLoggingIn, mutate: login } = useLoginMutation();

  function handleLogin() {
    if (!termsAccepted) {
      showDialog({ message: '请先同意用户协议和隐私政策', title: '请先阅读并同意' });
      return;
    }

    // 模板不自带后端：没配 EXPO_PUBLIC_API_BASE_URL 就用一份本地假凭据放行。
    // 接上真实接口后把这个分支和 DEMO_AUTH_TOKENS 一起删掉
    if (!HAS_API_BASE_URL) {
      signIn(DEMO_AUTH_TOKENS);
      return;
    }

    // 失败的提示由请求层统一弹（见 service/adapter），这里只管成功之后的事
    login({ password, userName: account.trim() }, { onSuccess: tokens => signIn(tokens) });
  }

  function handleRegister() {
    showDialog({ message: '演示应用暂未接入注册流程', title: '注册账号' });
  }

  function handleForgotPassword() {
    showDialog({ message: '演示应用暂未接入密码找回流程', title: '找回密码' });
  }

  function handlePhoneLogin() {
    router.replace('/phone-login');
  }

  return (
    <AuthShell>
      <Text className="text-2xl font-bold tracking-tight text-foreground">账号密码登录</Text>
      <Text className="mt-2 text-sm text-muted-foreground">使用已有账号进入 Skyroc App</Text>

      <View className="mt-8">
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          clearable
          leading={
            <Icon
              colorClassName="accent-muted-foreground"
              name="account-outline"
              size={22}
            />
          }
          returnKeyType="next"
          size="lg"
          value={account}
          variant="filled"
          placeholder="请输入手机号或账号"
          onChangeText={setAccount}
        />

        <Input
          className="mt-4"
          leading={
            <Icon
              colorClassName="accent-muted-foreground"
              name="lock-outline"
              size={22}
            />
          }
          returnKeyType="done"
          size="lg"
          type="password"
          value={password}
          variant="filled"
          placeholder="请输入密码"
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
        />

        <Button
          variant="ghost"
          className="self-start px-0"
          onPress={handlePhoneLogin}
        >
          <Icon
            colorClassName="accent-primary"
            name="swap-horizontal"
            size={20}
          />
          <Text className="ml-1.5 text-sm font-semibold text-primary">使用验证码登录</Text>
        </Button>

        <Button
          block
          className="mt-6"
          loading={isLoggingIn}
          shape="pill"
          size="lg"
          onPress={handleLogin}
        >
          登录
        </Button>

        <AuthAgreement
          checked={termsAccepted}
          onCheckedChange={setTermsAccepted}
        />

        <View className="mt-3 flex-row items-center justify-between">
          <Pressable
            className="py-2 active:opacity-60"
            onPress={handleRegister}
          >
            <Text className="text-sm font-medium text-primary">注册账号</Text>
          </Pressable>
          <Pressable
            className="py-2 active:opacity-60"
            onPress={handleForgotPassword}
          >
            <Text className="text-sm text-muted-foreground">忘记密码？</Text>
          </Pressable>
        </View>
      </View>
    </AuthShell>
  );
};

export default PasswordLoginScreen;
