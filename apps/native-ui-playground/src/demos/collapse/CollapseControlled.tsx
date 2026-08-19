import { Collapse, CollapseItem, Text } from '@skyroc/native-ui';
import type { CollapseValue } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CONTENT = '代码是写给人看的，只是顺便能被机器执行。折叠面板用来收纳这类长文本，展开时高度会做过渡动画。';

const CollapseControlled = () => {
  const [controlled, setControlled] = useState<CollapseValue>(['a']);

  return (
    <View className="bg-muted p-4">
      <Text className="mb-2 text-sm text-muted-foreground">
        当前展开：{Array.isArray(controlled) && controlled.length > 0 ? controlled.join('、') : '无'}
      </Text>
      <Collapse
        value={controlled}
        onChange={setControlled}
      >
        <CollapseItem
          name="a"
          title="面板 A"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          name="b"
          title="面板 B"
        >
          {CONTENT}
        </CollapseItem>
      </Collapse>
    </View>
  );
};

export { CollapseControlled };
