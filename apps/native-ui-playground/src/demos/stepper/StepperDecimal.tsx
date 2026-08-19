import { Stepper, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const StepperDecimal = () => {
  const [decimal, setDecimal] = useState(0.1);

  return (
    <View className="bg-background px-6">
      <Text
        className="mb-2"
        color="muted"
      >
        step 0.1 不设 decimalLength，连加也不会出现 0.30000000000000004 这类浮点尾数
      </Text>
      <View className="mb-4 gap-2">
        <Stepper
          max={3}
          min={0}
          step={0.1}
          value={decimal}
          onChange={setDecimal}
        />
        <Text color="muted">当前值：{String(decimal)}</Text>
      </View>
      <Text
        className="mb-2"
        color="muted"
      >
        decimalLength 固定小数位，0 表示归整到个位（输入 3.7 失焦后变 4）
      </Text>
      <View className="mb-4 flex-row items-center gap-3">
        <Stepper
          decimalLength={2}
          defaultValue={1.5}
          max={10}
          min={0}
          step={0.25}
        />
        <Stepper
          decimalLength={0}
          defaultValue={3}
          max={100}
          min={0}
        />
      </View>
      <Text
        className="mb-2"
        color="muted"
      >
        integer 只允许整数，输入 4.6 失焦后取整为 5，键盘也切成纯数字
      </Text>
      <View className="mb-8">
        <Stepper
          integer
          defaultValue={3}
          max={10}
          min={0}
        />
      </View>
    </View>
  );
};

export { StepperDecimal };
