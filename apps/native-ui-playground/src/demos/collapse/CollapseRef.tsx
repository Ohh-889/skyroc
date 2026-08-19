import { Button, Collapse, CollapseItem } from '@skyroc/native-ui';
import type { CollapseItemRef, CollapseRef } from '@skyroc/native-ui';
import { useRef } from 'react';
import { View } from 'react-native';

const CONTENT = '代码是写给人看的，只是顺便能被机器执行。折叠面板用来收纳这类长文本，展开时高度会做过渡动画。';

const CollapseRef = () => {
  const groupRef = useRef<CollapseRef>(null);
  const firstItemRef = useRef<CollapseItemRef>(null);

  function handleToggleAll() {
    groupRef.current?.toggleAll();
  }

  function handleExpandAll() {
    groupRef.current?.toggleAll({ expanded: true, skipDisabled: true });
  }

  function handleToggleFirst() {
    firstItemRef.current?.toggle();
  }

  return (
    <View className="bg-muted p-4">
      <View className="mb-4 flex-row gap-2">
        <Button
          color="primary"
          size="sm"
          variant="solid"
          onPress={handleToggleAll}
        >
          反转全部
        </Button>
        <Button
          color="primary"
          size="sm"
          variant="outline"
          onPress={handleExpandAll}
        >
          展开全部
        </Button>
        <Button
          color="primary"
          size="sm"
          variant="outline"
          onPress={handleToggleFirst}
        >
          切换首项
        </Button>
      </View>
      <Collapse ref={groupRef}>
        <CollapseItem
          ref={firstItemRef}
          name="r1"
          title="面板一"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          name="r2"
          title="面板二"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          disabled
          name="r3"
          title="面板三（禁用，展开全部时跳过）"
        >
          {CONTENT}
        </CollapseItem>
      </Collapse>
    </View>
  );
};

export { CollapseRef };
