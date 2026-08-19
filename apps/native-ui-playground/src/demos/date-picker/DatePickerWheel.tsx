import { DatePickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const DatePickerWheel = () => {
  return (
    <View className="bg-background p-4">
      <DatePickerView
        haptic
        classNames={{
          itemText: 'text-primary',
          selectedIndicator: 'border-primary/30 bg-primary/5'
        }}
        defaultValue={['2026', '08', '19']}
        itemHeight={40}
        showToolbar={false}
        visibleCount={3}
      />
    </View>
  );
};

export { DatePickerWheel };
