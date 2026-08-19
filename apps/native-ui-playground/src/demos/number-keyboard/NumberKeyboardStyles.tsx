import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardStyles = () => {
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
        classNames={{
          confirmKey: 'bg-success',
          keyText: 'text-3xl font-semibold',
          root: 'bg-primary/10'
        }}
        closeButtonText="完成"
        theme="custom"
        value={value}
        visible={visible}
        onBlur={closeKeyboard}
        onChange={setValue}
        onClose={closeKeyboard}
      />
    </View>
  );
};

export { NumberKeyboardStyles };
