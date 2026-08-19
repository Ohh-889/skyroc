import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardNonModal = () => {
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

      {/* hideOnClickOutside={false} 时键盘不做模态遮挡，只能靠标题栏的收起按钮关闭 */}
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
