import { Button, CountDown, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SMS_SECONDS = 60;

const CountDownSms = () => {
  const [smsSending, setSmsSending] = useState(false);

  return (
    <View className="flex-row items-center gap-3 bg-background px-6 py-4">
      <Button
        disabled={smsSending}
        variant="solid"
        onPress={() => setSmsSending(true)}
      >
        {smsSending ? '重新发送' : '发送验证码'}
      </Button>
      {smsSending ? (
        <CountDown
          time={SMS_SECONDS * 1000}
          onFinish={() => setSmsSending(false)}
        >
          {current => <Text color="muted">{current.seconds} 秒后可重发</Text>}
        </CountDown>
      ) : null}
    </View>
  );
};

export { CountDownSms };
