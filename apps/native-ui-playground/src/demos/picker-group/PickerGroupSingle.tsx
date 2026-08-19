import type { PickerGroupItem, PickerOption } from '@skyroc/native-ui';
import { Button, PickerGroup } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const HOURS: PickerOption[] = Array.from({ length: 24 }, (_, i) => ({
  label: `${i} 时`,
  value: `${i}`
}));

const MINUTES: PickerOption[] = Array.from({ length: 60 }, (_, i) => ({
  label: `${i} 分`,
  value: `${i}`
}));

/** 只有一个 picker 时 tab 栏会自动隐藏 */
const SINGLE_PICKERS: PickerGroupItem[] = [{ columns: [HOURS, MINUTES], key: 'time', title: '时间' }];

const PickerGroupSingle = () => {
  const [singleShow, setSingleShow] = useState(false);

  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setSingleShow(true)}
        >
          选择时间
        </Button>

        <PickerGroup
          pickers={SINGLE_PICKERS}
          show={singleShow}
          onUpdateShow={setSingleShow}
        />
      </View>
    </View>
  );
};

export { PickerGroupSingle };
