import { TreeSelect } from '@skyroc/native-ui';
import type { TreeSelectItem } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 把「分组名 + 子项名」的简写转成 items，子项 id 用「组序号-项序号」保证全局唯一 */
function toItems(groups: [string, string[]][]): TreeSelectItem[] {
  return groups.map(([text, children], groupIndex) => ({
    children: children.map((childText, childIndex) => ({
      id: `${groupIndex}-${childIndex}`,
      text: childText
    })),
    id: text,
    text
  }));
}

const CITY_ITEMS = toItems([
  ['浙江', ['杭州', '宁波', '温州', '嘉兴', '湖州']],
  ['江苏', ['南京', '苏州', '无锡', '常州']],
  ['福建', ['福州', '厦门', '泉州']]
]);

const TreeSelectCustomSlots = () => {
  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          classNames={{
            content: 'bg-primary-50',
            contentItem: 'px-5 py-4',
            selectedIcon: 'accent-success',
            sidebar: 'w-28 self-stretch bg-primary-100'
          }}
          defaultActiveId="0-1"
          height={220}
          items={CITY_ITEMS}
          sidebarClassNames={{ indicator: 'h-6 bg-success' }}
        />
      </View>
    </View>
  );
};

export { TreeSelectCustomSlots };
