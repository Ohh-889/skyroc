import Feather from '@expo/vector-icons/Feather';
import { Collapse, CollapseItem } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const CONTENT = '代码是写给人看的，只是顺便能被机器执行。折叠面板用来收纳这类长文本，展开时高度会做过渡动画。';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，避免写死 hex */
const Icon = withUniwind(Feather);

const CollapseCustomized = () => {
  return (
    <View className="bg-muted p-4">
      <Collapse border={false}>
        <CollapseItem
          icon={
            <Icon
              colorClassName="accent-primary"
              name="wifi"
              size={18}
            />
          }
          label="连接到 skyroc-5G"
          title="无线局域网"
          value="已连接"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          classNames={{ contentText: 'text-primary' }}
          icon={
            <Icon
              colorClassName="accent-primary"
              name="bluetooth"
              size={18}
            />
          }
          title="自定义内容颜色"
        >
          {CONTENT}
        </CollapseItem>
        <CollapseItem
          readonly
          title="只读（无箭头，不可展开）"
        >
          {CONTENT}
        </CollapseItem>
      </Collapse>
    </View>
  );
};

export { CollapseCustomized };
