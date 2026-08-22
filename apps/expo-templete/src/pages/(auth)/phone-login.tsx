import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Input, Text, showDialog } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AuthAgreement } from './modules/AuthAgreement';
import { AuthShell } from './modules/AuthShell';

const Icon = withUniwind(MaterialCommunityIcons);

/** 大陆手机号：1 开头共 11 位，前端只做这一层粗校验，真实性交给短信服务 */
const PHONE_PATTERN = /^1\d{10}$/;

const PhoneLoginScreen = () => {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);

  const isPhoneValid = PHONE_PATTERN.test(phoneNumber);

  function handleSendCode() {
    if (!termsAccepted) {
      showDialog({ message: '请先同意用户协议和隐私政策', title: '请先阅读并同意' });
      return;
    }

    if (!isPhoneValid) {
      showDialog({ message: '请输入 11 位大陆手机号', title: '手机号有误' });
      return;
    }

    router.push({ params: { phone: phoneNumber }, pathname: '/verify-code' });
  }

  function handlePasswordLogin() {
    router.replace('/login');
  }

  return (
    <AuthShell>
      <Text className="text-2xl font-bold tracking-tight text-foreground">手机号快捷登录</Text>
      <Text className="mt-2 text-sm text-muted-foreground">未注册手机号验证后将自动创建账号</Text>

      <View className="mt-8">
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          clearable
          keyboardType="phone-pad"
          leading={
            <View className="mr-3 flex-row items-center border-r border-border pr-3">
              <Text className="text-base font-medium text-foreground">+86</Text>
            </View>
          }
          maxLength={11}
          returnKeyType="done"
          size="lg"
          value={phoneNumber}
          variant="filled"
          placeholder="请输入手机号"
          onChangeText={setPhoneNumber}
          onSubmitEditing={handleSendCode}
        />

        <Pressable
          className="mt-4 flex-row items-center self-start py-2 active:opacity-60"
          onPress={handlePasswordLogin}
        >
          <Icon
            colorClassName="accent-primary"
            name="swap-horizontal"
            size={20}
          />
          <Text className="ml-1.5 text-sm font-semibold text-primary">使用密码登录</Text>
        </Pressable>

        <Button
          block
          className="mt-6"
          disabled={!isPhoneValid}
          shape="pill"
          size="lg"
          onPress={handleSendCode}
        >
          获取验证码
        </Button>

        <AuthAgreement
          checked={termsAccepted}
          onCheckedChange={setTermsAccepted}
        />
      </View>
    </AuthShell>
  );
};

export default PhoneLoginScreen;
