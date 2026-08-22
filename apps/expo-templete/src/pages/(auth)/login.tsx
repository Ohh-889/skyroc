import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useSession } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';
import { useWechatLogin } from '@/hooks/use-wechat-login';

export default function LoginScreen() {
  const { signIn } = useSession();
  const theme = useTheme();
  const [account, setAccount] = useState('');
  const { isPending: isWechatPending, login: loginWithWechat } = useWechatLogin(signIn);

  // 登录成功后只需要写入凭证，跳转交给根布局的 Stack.Protected
  const handleLogin = () => signIn(account.trim() || 'demo-token');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <AnimatedIcon />

        <ThemedText type="subtitle">欢迎回来</ThemedText>
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.caption}
        >
          登录后即可进入应用
        </ThemedText>

        <TextInput
          value={account}
          onChangeText={setAccount}
          placeholder="账号"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.backgroundSelected },
            pressed && styles.pressed
          ]}
        >
          <ThemedText type="smallBold">登录</ThemedText>
        </Pressable>

        <Pressable
          onPress={loginWithWechat}
          disabled={isWechatPending}
          style={({ pressed }) => [styles.button, styles.wechatButton, (pressed || isWechatPending) && styles.pressed]}
        >
          <ThemedText
            type="smallBold"
            style={styles.wechatLabel}
          >
            {isWechatPending ? '正在跳转微信…' : '微信登录'}
          </ThemedText>
        </Pressable>

        <Link
          href="/wechat-demo"
          asChild
        >
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="link">微信能力测试</ThemedText>
          </Pressable>
        </Link>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.two
  },
  caption: {
    marginBottom: Spacing.three
  },
  input: {
    width: '100%',
    maxWidth: 360,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    fontSize: 16
  },
  button: {
    width: '100%',
    maxWidth: 360,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center'
  },
  wechatButton: {
    backgroundColor: '#07C160'
  },
  wechatLabel: {
    color: '#FFFFFF'
  },
  pressed: {
    opacity: 0.7
  }
});
