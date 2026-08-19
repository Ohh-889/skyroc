import { TreeSelect } from '@skyroc/native-ui';
import type { TreeSelectItem } from '@skyroc/native-ui';
import { View } from 'react-native';

const DISABLED_ITEMS: TreeSelectItem[] = [
  {
    children: [
      { id: 'draft-1', text: '草稿一' },
      { disabled: true, id: 'draft-2', text: '草稿二（禁用）' },
      { id: 'draft-3', text: '草稿三' }
    ],
    id: 'draft',
    text: '草稿'
  },
  { children: [{ id: 'review-1', text: '审核中的内容' }], disabled: true, id: 'review', text: '审核中' },
  { children: [{ id: 'published-1', text: '已发布的内容' }], id: 'published', text: '已发布' }
];

const TreeSelectDisabled = () => {
  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          height={220}
          items={DISABLED_ITEMS}
        />
      </View>
    </View>
  );
};

export { TreeSelectDisabled };
