import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardNonModal = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [count, setCount] = useState(0);

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
      <Text color="muted">下层按钮点击次数：{count}</Text>
      <View className="flex-row flex-wrap gap-2">
        <Button
          variant="outline"
          onPress={openKeyboard}
        >
          打开键盘
        </Button>
        <Button
          variant="outline"
          onPress={() => setCount(current => current + 1)}
        >
          测试下层点击
        </Button>
      </View>

      {/* hideOnClickOutside={false} 时键盘不做模态遮挡，页面上的按钮仍可点击 */}
      <NumberKeyboard
        hideOnClickOutside={false}
        closeButtonText="收起"
        title="非模态"
        value={value}
        visible={visible}
        onBlur={closeKeyboard}
        onChange={setValue}
        onClose={closeKeyboard}
      />
    </View>
  );
};

export { NumberKeyboardNonModal };
