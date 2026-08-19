import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardCustomDelete = () => {
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
        renderDelete={() => <Text className="text-base font-medium text-primary">退一位</Text>}
        title="自定义删除键"
        value={value}
        visible={visible}
        onBlur={closeKeyboard}
        onChange={setValue}
        onClose={closeKeyboard}
      />
    </View>
  );
};

export { NumberKeyboardCustomDelete };
