import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardEvents = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [lastEvent, setLastEvent] = useState('尚未触发');

  function openKeyboard() {
    setVisible(true);
    setLastEvent('打开键盘');
  }

  function handleBlur() {
    setVisible(false);
    setLastEvent(current => (current === 'onClose' ? 'onClose → onBlur' : 'onBlur'));
  }

  function handleClose() {
    setVisible(false);
    setLastEvent('onClose');
  }

  function handleDelete() {
    setLastEvent('onDelete');
  }

  function handleInput(key: string) {
    setLastEvent(`onInput：${key}`);
  }

  return (
    <View className="items-start gap-3 bg-background p-4">
      <Text color="muted">当前输入：{value || '—'}</Text>
      <Text color="muted">最近事件：{lastEvent}</Text>
      <Button
        variant="outline"
        onPress={openKeyboard}
      >
        打开并观察事件
      </Button>

      <NumberKeyboard
        closeButtonText="完成"
        title="事件回调"
        value={value}
        visible={visible}
        onBlur={handleBlur}
        onChange={setValue}
        onClose={handleClose}
        onDelete={handleDelete}
        onInput={handleInput}
      />
    </View>
  );
};

export { NumberKeyboardEvents };
