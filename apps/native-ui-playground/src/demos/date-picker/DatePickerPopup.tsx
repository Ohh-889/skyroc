import { Button, DatePicker, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DatePickerPopup = () => {
  const [show, setShow] = useState(false);
  const [checkIn, setCheckIn] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('尚未提交');

  const checkInLabel = checkIn.length > 0 ? checkIn.join('-') : '请选择';

  function handleCancel(values: string[]) {
    setFeedback(`已取消临时值 ${values.join('-')}`);
  }

  function handleConfirm(values: string[]) {
    setCheckIn(values);
    setFeedback(`已确认 ${values.join('-')}`);
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        选择入住日期
      </Button>
      <Text color="muted">当前：{checkInLabel}</Text>
      <Text className="w-full text-sm text-muted-foreground">{feedback}</Text>

      <DatePicker
        enablePanDownToClose
        showHandle
        show={show}
        title="入住日期"
        value={checkIn}
        minDate={new Date()}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { DatePickerPopup };
