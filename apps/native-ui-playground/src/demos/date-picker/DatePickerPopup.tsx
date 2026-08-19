import { Button, DatePicker, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DatePickerPopup = () => {
  const [show, setShow] = useState(false);
  const [checkIn, setCheckIn] = useState<string[]>([]);

  const checkInLabel = checkIn.length > 0 ? checkIn.join('-') : '请选择';

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        选择入住日期
      </Button>
      <Text color="muted">当前：{checkInLabel}</Text>

      <DatePicker
        show={show}
        title="入住日期"
        value={checkIn}
        minDate={new Date()}
        onConfirm={setCheckIn}
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { DatePickerPopup };
