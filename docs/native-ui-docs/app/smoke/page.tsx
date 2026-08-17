'use client';

import { Radio, RadioGroup } from '@skyroc/native-ui';
import { useState } from 'react';
import { Text, View } from 'react-native';

/** 冒烟页：验证 RN → uniwind → react-native-web 这条链在 Turbopack 下确实通了。 */
const SmokePage = () => {
  const [value, setValue] = useState('c');

  return (
    <View className="gap-4 bg-background p-8">
      <Text className="text-2xl text-foreground">uniwind smoke test</Text>

      <View className="gap-2 rounded-lg border border-border bg-card p-4">
        <Text className="text-primary">className 生效则此行为主题色</Text>
      </View>

      <RadioGroup
        value={value}
        onChange={setValue}
      >
        <Radio name="a">选项 A</Radio>
        <Radio name="b">选项 B</Radio>
        {/* square 形态走 Feather 勾选图标，用来验证 @expo/vector-icons 的 web 替身 */}
        <Radio
          name="c"
          shape="square"
        >
          选项 C（方形，验证图标）
        </Radio>
      </RadioGroup>

      <Text className="text-muted">当前选中：{value}</Text>
    </View>
  );
};

export default SmokePage;
