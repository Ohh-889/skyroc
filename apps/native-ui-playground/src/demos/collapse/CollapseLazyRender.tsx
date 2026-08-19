import { Collapse, CollapseItem, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CONTENT = '代码是写给人看的，只是顺便能被机器执行。折叠面板用来收纳这类长文本，展开时高度会做过渡动画。';

const CollapseLazyRender = () => {
  return (
    <View className="bg-muted p-4">
      <Collapse>
        <CollapseItem
          lazyRender={false}
          title="关闭懒渲染"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem title="默认懒渲染">
          <View className="gap-2">
            <Text className="text-sm text-foreground">自定义节点内容</Text>
            <Text className="text-xs text-muted-foreground">{CONTENT}</Text>
          </View>
        </CollapseItem>
      </Collapse>
    </View>
  );
};

export { CollapseLazyRender };
