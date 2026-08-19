import { PasswordInput } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 认为正确的密码，用来演示 errorInfo 由输入派生而不是另存一份 state */
const CORRECT_PASSWORD = '123456';

/** 有 errorInfo 时 info 不显示，边框同时转红 */
const PasswordInputError = () => {
  const [verify, setVerify] = useState('');

  const verifyError = verify.length === CORRECT_PASSWORD.length && verify !== CORRECT_PASSWORD ? '密码错误' : '';

  return (
    <View className="gap-3 bg-background p-4">
      <PasswordInput
        errorInfo={verifyError}
        info={`输入 ${CORRECT_PASSWORD} 之外的 6 位数字会报错`}
        value={verify}
        onChangeText={setVerify}
      />
      <PasswordInput
        errorInfo="separated 下每个格子都转红"
        defaultValue="123"
        variant="separated"
      />
    </View>
  );
};

export { PasswordInputError };
