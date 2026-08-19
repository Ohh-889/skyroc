import { Stepper, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** BeforeChange 模拟异步校验的耗时 */
const GUARD_DELAY = 600;

/** 异步校验放行的上限 */
const GUARD_MAX = 5;

const StepperBeforeChange = () => {
  const [guarded, setGuarded] = useState(3);
  const [guardPending, setGuardPending] = useState(false);

  async function handleBeforeChange(next: number) {
    setGuardPending(true);

    await new Promise(resolve => {
      setTimeout(resolve, GUARD_DELAY);
    });

    setGuardPending(false);

    return next <= GUARD_MAX;
  }

  return (
    <View className="bg-background px-6">
      <Text
        className="mb-2"
        color="muted"
      >
        beforeChange 异步校验 {GUARD_DELAY}ms，超过 {GUARD_MAX} 一律拒绝；校验期间长按不会连跳
      </Text>
      <View className="mb-8 gap-2">
        <Stepper
          beforeChange={handleBeforeChange}
          max={10}
          min={0}
          value={guarded}
          onChange={setGuarded}
        />
        <Text color="muted">{guardPending ? '校验中…' : `当前值：${guarded}`}</Text>
      </View>
    </View>
  );
};

export { StepperBeforeChange };
