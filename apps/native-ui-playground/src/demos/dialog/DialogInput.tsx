import { Button, Dialog, Portal, Text, showDialog } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DialogInput = () => {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('受控内容');
  const [result, setResult] = useState('尚未确认');

  function handleDefaultInput() {
    showDialog({
      callback: (action, value) => setResult(`${action}：${value || '空值'}`),
      defaultInputValue: '默认内容',
      inputPlaceholder: '请输入昵称',
      inputProps: { maxLength: 12 },
      message: '输入框预置 defaultInputValue，并限制最多 12 个字符。',
      showCancelButton: true,
      showInput: true,
      title: '非受控输入'
    });
  }

  function handleConfirm(value?: string) {
    setResult(`confirm：${value || '空值'}`);
  }

  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={handleDefaultInput}
        >
          defaultInputValue
        </Button>
        <Button
          variant="outline"
          onPress={() => setShow(true)}
        >
          受控 inputValue
        </Button>
      </View>
      <Text className="text-sm text-muted-foreground">结果：{result}</Text>

      <Portal>
        <Dialog
          inputPlaceholder="请输入内容"
          inputProps={{ maxLength: 12 }}
          inputValue={inputValue}
          message="onInputChange 实时同步外部 inputValue。"
          show={show}
          showCancelButton
          showInput
          title="受控输入"
          onConfirm={handleConfirm}
          onInputChange={setInputValue}
          onUpdateShow={setShow}
        />
      </Portal>
    </View>
  );
};

export { DialogInput };
