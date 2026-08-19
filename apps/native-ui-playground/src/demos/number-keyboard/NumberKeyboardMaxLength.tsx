import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardMaxLength = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');

  function openKeyboard() {
    setValue('');
    setVisible(true);
  }

  function closeKeyboard() {
    setVisible(false);
  }

  return (
    <View className="items-start gap-3 bg-background p-4">
      <Text color="muted">当前输入：{value || '—'}</Text>
      <Button
        variant="outline"
        onPress={openKeyboard}
      >
        打开
      </Button>

      <NumberKeyboard
        maxLength={6}
        title="最多 6 位"
        value={value}
        visible={visible}
        onBlur={closeKeyboard}
        onChange={setValue}
        onClose={closeKeyboard}
      />
    </View>
  );
};

export { NumberKeyboardMaxLength };
