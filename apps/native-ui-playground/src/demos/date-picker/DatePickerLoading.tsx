import { Button, DatePickerView } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DatePickerLoading = () => {
  const [loading, setLoading] = useState(true);

  function toggleLoading() {
    setLoading(current => !current);
  }

  return (
    <View className="bg-background p-4">
      <Button
        className="self-start"
        size="sm"
        variant="tonal"
        onPress={toggleLoading}
      >
        {loading ? '结束加载' : '重新加载'}
      </Button>
      <DatePickerView
        loading={loading}
        showToolbar={false}
      />
    </View>
  );
};

export { DatePickerLoading };
