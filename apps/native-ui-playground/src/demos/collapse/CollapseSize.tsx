import { Collapse, CollapseItem } from '@skyroc/native-ui';
import { View } from 'react-native';

const CONTENT = '代码是写给人看的，只是顺便能被机器执行。折叠面板用来收纳这类长文本，展开时高度会做过渡动画。';

const CollapseSize = () => {
  return (
    <View className="bg-muted p-4">
      <Collapse>
        <CollapseItem
          size="sm"
          title="Small"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          size="md"
          title="Medium"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          size="lg"
          title="Large"
        >
          {CONTENT}
        </CollapseItem>
      </Collapse>
    </View>
  );
};

export { CollapseSize };
