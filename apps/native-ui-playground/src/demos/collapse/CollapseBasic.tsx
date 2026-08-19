import { Collapse, CollapseItem } from '@skyroc/native-ui';
import { View } from 'react-native';

const CONTENT = '代码是写给人看的，只是顺便能被机器执行。折叠面板用来收纳这类长文本，展开时高度会做过渡动画。';

const CollapseBasic = () => {
  return (
    <View className="bg-muted p-4">
      <Collapse defaultValue={0}>
        <CollapseItem title="面板一">{CONTENT}</CollapseItem>
        <CollapseItem title="面板二">{CONTENT}</CollapseItem>
        <CollapseItem
          disabled
          title="面板三（禁用）"
        >
          {CONTENT}
        </CollapseItem>
      </Collapse>
    </View>
  );
};

export { CollapseBasic };
