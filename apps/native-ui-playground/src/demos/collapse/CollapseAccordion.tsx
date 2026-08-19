import { Collapse, CollapseItem, Text } from '@skyroc/native-ui';
import type { CollapseValue } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CONTENT = '代码是写给人看的，只是顺便能被机器执行。折叠面板用来收纳这类长文本，展开时高度会做过渡动画。';

const CollapseAccordion = () => {
  const [accordion, setAccordion] = useState<CollapseValue>(null);

  return (
    <View className="bg-muted p-4">
      <Text className="mb-2 text-sm text-muted-foreground">当前展开：{accordion ?? '无'}</Text>
      <Collapse
        accordion
        value={accordion}
        onChange={setAccordion}
      >
        <CollapseItem
          name="one"
          title="只能展开一个"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          name="two"
          title="展开我会收起别人"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          name="three"
          title="再点一次全部收起"
        >
          {CONTENT}
        </CollapseItem>
      </Collapse>
    </View>
  );
};

export { CollapseAccordion };
