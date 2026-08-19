import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardBasic = () => {
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

      {/* 键盘常驻，只切 visible：它自己会 Portal 到应用根节点，放在这里不影响定位 */}
      <NumberKeyboard
        value={value}
        visible={visible}
        onBlur={closeKeyboard}
        onChange={setValue}
        onClose={closeKeyboard}
      />
    </View>
  );
};

export { NumberKeyboardBasic };
