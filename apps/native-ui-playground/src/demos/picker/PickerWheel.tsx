import type { PickerOption } from '@skyroc/native-ui';
import { PickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES: PickerOption[] = [
  { label: 'XS', value: 'xs' },
  { label: 'S', value: 'sm' },
  { label: 'M', value: 'md' },
  { label: 'L', value: 'lg' },
  { label: 'XL', value: 'xl' }
];

const PickerWheel = () => {
  return (
    <View className="bg-background p-4">
      <PickerView
        haptic
        classNames={{ selectedIndicator: 'border-primary/30 bg-primary/5' }}
        columns={SIZES}
        defaultValue={['md']}
        itemHeight={40}
        showToolbar={false}
        visibleCount={3}
      />
    </View>
  );
};

export { PickerWheel };
