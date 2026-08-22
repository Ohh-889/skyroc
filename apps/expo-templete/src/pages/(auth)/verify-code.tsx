import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { PasswordInputProps } from '@skyroc/native-ui';
import { Button, CountDown, PasswordInput, Text, showDialog } from '@skyroc/native-ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';
import { useSession } from '@/feature/auth/auth-context';
import { AuthShell } from './modules/AuthShell';

const Icon = withUniwind(MaterialCommunityIcons);

/**
 * 从组件的 ref prop 反推实例类型。
 *
 * 直接写 useRef<TextInput> 会报错：app 与 native-ui 各自解析到一份 react-native， 两份 TextInput 在 TS 眼里是不同的类。从组件 props 上取就永远跟着 native-ui
 * 那一份走。
 */
type RefInstance<T> = T extends { current: infer I } ? NonNullable<I> : never;

/** 验证码位数 */
const CODE_LENGTH = 6;

/** 重新获取的冷却时长（毫秒） */
const RESEND_INTERVAL = 60 * 1000;

/** 演示应用没有接短信服务，用固定验证码把「输错」这条分支也走通 */
const DEMO_CODE = '123456';

/** 手机号中间四位打码，仅用于展示 */
function maskPhoneNumber(phone: string) {
  if (phone.length !== 11) return phone;

  return `${phone.slice(0, 3)}****${phone.slice(7)}`;
}

const VerifyCodeScreen = () => {
  const router = useRouter();

  const { phone = '' } = useLocalSearchParams<{ phone?: string }>();

  const { signIn } = useSession();

  const [code, setCode] = useState('');

  const [errorInfo, setErrorInfo] = useState('');

  const [isResendable, setIsResendable] = useState(false);

  // 输满 6 位后 PasswordInput 会自动失焦，输错时得把焦点收回格子里，否则用户还要再点一次才能重输
  const codeInputRef = useRef<RefInstance<PasswordInputProps['ref']>>(null);

  function handleChangeText(next: string) {
    setCode(next);

    // 一开始重新输入就撤掉错误态，别让红框跟着用户的新输入一起停在屏幕上
    if (errorInfo) {
      setErrorInfo('');
    }
  }

  function handleVerify(value: string) {
    if (value !== DEMO_CODE) {
      setErrorInfo('验证码不正确，请重新输入');
      setCode('');
      codeInputRef.current?.focus();
      return;
    }

    signIn(`phone:${phone}`);
  }

  function handleResend() {
    // isResendable 翻回 false 会重新挂载 CountDown，autoStart 让它从头跑一轮，不必再命令式 reset
    setIsResendable(false);
    setCode('');
    setErrorInfo('');
    codeInputRef.current?.focus();

    showDialog({ message: '演示应用暂未接入短信服务，这里只展示交互效果', title: '验证码已重新发送' });
  }

  function handleChangePhone() {
    router.back();
  }

  return (
    <AuthShell showSocialLogin={false}>
      <Text className="text-2xl font-bold tracking-tight text-foreground">输入验证码</Text>
      <Text className="mt-2 text-sm text-muted-foreground">
        验证码已发送至 +86 <Text className="text-sm font-medium text-foreground">{maskPhoneNumber(phone)}</Text>
      </Text>

      <View className="mt-8">
        <PasswordInput
          autoFocus
          errorInfo={errorInfo}
          length={CODE_LENGTH}
          mask={false}
          ref={codeInputRef}
          size="lg"
          value={code}
          variant="separated"
          info={`演示应用固定验证码：${DEMO_CODE}`}
          onChangeText={handleChangeText}
          onComplete={handleVerify}
        />

        <View className="mt-6 h-9 items-center justify-center">
          {isResendable ? (
            <Button
              size="sm"
              variant="ghost"
              className="px-0"
              onPress={handleResend}
            >
              <Text className="text-sm font-semibold text-primary">重新获取验证码</Text>
            </Button>
          ) : (
            <CountDown
              autoStart
              time={RESEND_INTERVAL}
              onFinish={() => setIsResendable(true)}
            >
              {({ total }) => (
                <Text className="text-sm text-muted-foreground">{Math.ceil(total / 1000)} 秒后可重新获取</Text>
              )}
            </CountDown>
          )}
        </View>

        <Button
          block
          className="mt-2"
          shape="pill"
          size="lg"
          disabled={code.length < CODE_LENGTH}
          onPress={() => handleVerify(code)}
        >
          验证并登录
        </Button>

        <Button
          variant="ghost"
          className="mt-4 self-center"
          onPress={handleChangePhone}
        >
          <Icon
            colorClassName="accent-muted-foreground"
            name="arrow-left"
            size={18}
          />
          <Text className="ml-1.5 text-sm text-muted-foreground">返回修改手机号</Text>
        </Button>
      </View>
    </AuthShell>
  );
};

export default VerifyCodeScreen;
